<?php
/**
 * This file is part of workerman.
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the MIT-LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @author walkor<walkor@workerman.net>
 * @copyright walkor<walkor@workerman.net>
 * @link http://www.workerman.net/
 * @license http://www.opensource.org/licenses/mit-license.php MIT License
 */

/**
 * 用于检测业务代码死循环或者长时间阻塞等问题
 * 如果发现业务卡死，可以将下面declare打开（去掉//注释），并执行php start.php reload
 * 然后观察一段时间workerman.log看是否有process_timeout异常
 */
//declare(ticks=1);



//worker启动之后不能关闭,参考文档http://doc.workerman.net/315234

use \GatewayWorker\Lib\Gateway;
require_once '/Connection.php'; //引入数据库连接文件
header("Content-Type:text/html;charset=utf-8");
// use think\Log;

/**
 * 主逻辑
 * 主要是处理 onConnect onMessage onClose 三个方法
 * onConnect 和 onClose 如果不需要可以不用实现并删除
 */
class Events
{

    public static $db = null;



    /**
     * 进程启动后初始化数据库连接
     */
    public static function onWorkerStart($worker)
    {
        self::$db = new \Workerman\MySQL\Connection('47.106.253.110', '3306', 'crowd', 'crowd', 'crowd');
    }

    /**
     * 当客户端连接时触发
     * 如果业务不需此回调可以删除onConnect
     * 
     * @param int $client_id 连接id
     */
    public static function onConnect($client_id)
    {
        $new_message = array(
            'type'=>'connect', 
            "message"=>"连接成功，返回消息",
            'from_client_id'=>$client_id,
            'time'=>date('Y-m-d H:i:s'),
        );
        return Gateway::sendToCurrentClient(json_encode($new_message,JSON_UNESCAPED_UNICODE));
        // 向当前client_id发送数据 
        // Gateway::sendToClient($client_id, "Hello $client_id\r\n");
        // 向所有人发送
        // Gateway::sendToAll("$client_id login\r\n");
    }
    
   /**
    * 当客户端发来消息时触发
    * @param int $client_id 连接id
    * @param mixed $message 具体消息
    */
   public static function onMessage($client_id, $message)
   {

        // 客户端传递的是json数据
        $message_data = json_decode($message, true);
        if(!$message_data)
        {
            return ;
        }

        switch($message_data['type'])
        {
            // 客户端回应服务端的心跳
            case 'ping':
                return;
                
            // 客户端登录 message格式: {type:login, name:xx, room_id:1} ，添加到客户端，广播给所有客户端xx进入聊天室
            case 'login':
                // 判断是否有房间号
                if(!isset($message_data['room_id']))
                {
                    throw new \Exception("\$message_data['room_id'] not set. client_ip:{$_SERVER['REMOTE_ADDR']} \$message:$message");
                }
                
                // 把房间号昵称放到session中
                $room_id = $message_data['room_id'];
                $user_id=$message_data['user_id'];
                $imgurl=$message_data['imgurl'];
                $client_name = htmlspecialchars($message_data['client_name']);
                $_SESSION['room_id'] = $room_id;
                $_SESSION['client_name'] = $client_name;
                $_SESSION['user_id'] =$user_id;
                $_SESSION['imgurl'] =$imgurl;
              
                // // 获取房间内所有用户列表 
                // $clients_list = Gateway::getClientSessionsByGroup($room_id);
                // foreach($clients_list as $tmp_client_id=>$item)
                // {
                //     $clients_list[$tmp_client_id] = $item['client_name'];
                // }
                // $clients_list[$client_id] = $client_name;
                
                // // 转播给当前房间的所有客户端，xx进入聊天室 message {type:login, client_id:xx, name:xx} 
                // $new_message = array('type'=>$message_data['type'], 'client_id'=>$client_id, 'client_name'=>htmlspecialchars($client_name), 'time'=>date('Y-m-d H:i:s'));
                // Gateway::sendToGroup($room_id, json_encode($new_message));

                //将用户加入到群组里面
                Gateway::joinGroup($client_id, $room_id);

                 //将client_id与uid绑定，以便通过Gateway::sendToUid($uid)发送数据，通过Gateway::isUidOnline($uid)用户是否在线
                Gateway::bindUid($client_id, $user_id);

                 //获取当前在线用户数
                $groupnum=Gateway::getUidCountByGroup($room_id);
               
               

                $new_message = array(
                    'type'=>'login', 
                    'user_id'=>$user_id,
                    "message"=>"登录成功,并返回群人数，告诉全部人，包括用户自己",
                    'from_client_id'=>$client_id,
                    'from_client_name' =>$client_name,
                    'groupnum'=>$groupnum,
                    'time'=>date('Y-m-d H:i:s'),
                );

                return Gateway::sendToGroup($room_id ,json_encode($new_message,JSON_UNESCAPED_UNICODE));

                // return Gateway::sendToCurrentClient(json_encode($new_message,JSON_UNESCAPED_UNICODE));


                // // 给当前用户发送用户列表 
                // $new_message['client_list'] = $clients_list;
                // Gateway::sendToCurrentClient(json_encode($new_message));
                // return;
                
            // 客户端发言 message: {type:say, to_client_id:xx, content:xx}
            case 'say':
                // 非法请求
                if(!isset($_SESSION['room_id']))
                {
                    throw new \Exception("\$_SESSION['room_id'] not set. client_ip:{$_SERVER['REMOTE_ADDR']}");
                }
                $room_id = $_SESSION['room_id'];
                $client_name = $_SESSION['client_name'];
                $user_id = $_SESSION['user_id'];
                $imgurl = $_SESSION['imgurl'];
                $send_roomid=$message_data['room_id'];//发送到哪个群

                
                // 私聊,暂时不做私聊
                // if($message_data['to_client_id'] != 'all')
                // {
                //     $new_message = array(
                //         'type'=>'say',
                //         'user_id'=>$user_id,
                //         'from_client_id'=>$client_id, 
                //         'from_client_name' =>$client_name,
                //         'to_client_id'=>$message_data['to_client_id'],
                //         // 'content'=>"<b>对你说: </b>".nl2br(htmlspecialchars($message_data['content'])),
                //         'content'=>$message_data['content'],
                //         'time'=>date('Y-m-d H:i:s'),
                //     );
                //     Gateway::sendToClient($message_data['to_client_id'], json_encode($new_message,JSON_UNESCAPED_UNICODE));
                //     // $new_message['content'] = "<b>你对".htmlspecialchars($message_data['to_client_name'])."说: </b>".nl2br(htmlspecialchars($message_data['content']));
                //     $new_message['content'] = $message_data['content'];
                //     return Gateway::sendToCurrentClient(json_encode($new_message,JSON_UNESCAPED_UNICODE));
                // }
                
                $new_message = array(
                    'type'=>'say', 
                    "message"=>"群员发送消息",
                    'user_id'=>$user_id,
                    'imgurl'=>$imgurl,
                    'from_client_id'=>$client_id,
                    'from_client_name' =>$client_name,
                    'to_client_id'=>'all',
                    // 'content'=>nl2br(htmlspecialchars($message_data['content'])),
                    'content'=>$message_data['content'],
                    'time'=>date('Y-m-d H:i:s'),
                );
                return Gateway::sendToGroup($send_roomid ,json_encode($new_message,JSON_UNESCAPED_UNICODE));
        }



        
        // $ret= self::$db->select('*')->from('user')->where('id=10048')->query();
        // $state=['state'   => '200','message'  => "返回的数据" ];
        // $resdata=array_merge($state,array('data'=>$ret));
        // 打印结果

        // $kaming=json_decode($message);
        // return Gateway::sendToAll(json_encode($kaming, JSON_UNESCAPED_UNICODE));//JSON_UNESCAPED_UNICODE解决中文Json不要编码Unicode.

        // return Gateway::sendToAll($message);

        // print_r(json_encode($dbdata));
        // //  Log::record("发送消息");
        // // 向所有人发送 
        // Gateway::sendToAll("$client_id said $message\r\n");
        // Gateway::sendToAll("openid $dbdata\r\n");
   }
   
   /**
    * 当用户断开连接时触发
    * @param int $client_id 连接id
    */
   public static function onClose($client_id)
   {
    // Log::record("断开连接");
       // 向所有人发送 
    //    GateWay::sendToAll("$client_id logout\r\n");
   }
}
