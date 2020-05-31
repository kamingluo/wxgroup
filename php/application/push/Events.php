<?php
use \GatewayWorker\Lib\Gateway;
require_once 'Connection.php'; //引入数据库连接文件
header("Content-Type:text/html;charset=utf-8");
// use think\Log;
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
     * @param int $client_id 连接id
     */
    public static function onConnect($client_id)
    {
        $new_message = array(
            'type'=>'connect', 
            "message"=>"连接成功，返回消息",
            'from_client_id'=>$client_id,
            'create_time'=>date('Y-m-d H:i:s'),
        );
        return Gateway::sendToCurrentClient(json_encode($new_message,JSON_UNESCAPED_UNICODE));
    }
    
   /**
    * 当客户端发来消息时触发
    * @param int $client_id 连接id
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
              

                //将用户加入到群组里面
                Gateway::joinGroup($client_id, $room_id);

                 //将client_id与uid绑定，以便通过Gateway::sendToUid($uid)发送数据，通过Gateway::isUidOnline($uid)用户是否在线
                Gateway::bindUid($client_id, $user_id);

                 //获取当前在线用户数
                $groupnum=Gateway::getUidCountByGroup($room_id);
                $time=date('Y-m-d H:i:s');

                $new_message = array(
                    'type'=>'login', 
                    'user_id'=>$user_id,
                    "message"=>"登录成功,并返回群人数，告诉全部人，包括用户自己",
                    'from_client_id'=>$client_id,
                    'from_client_name' =>$client_name,
                    'groupnum'=>$groupnum,
                    'create_time'=>$time,
                );
                return Gateway::sendToGroup($room_id ,json_encode($new_message,JSON_UNESCAPED_UNICODE));
                
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
                $say_type=$message_data['say_type'];//发送消息的方式，图片还是文案
                $content=$message_data['content'];//发送消息的方式，图片还是文案
                $time=date('Y-m-d H:i:s');

                // 插入数据到数据表
                $insert_id = self::$db->insert('chat_data')->cols(array(
                    'crowd_id'=>$room_id,
                    'user_id'=>$user_id,
                    'name'=>$client_name,
                    'imgurl'=>$imgurl,
                    'say_type'=> $say_type,
                    'content'=>$content,
                    'create_time'=>$time))->query();

                
                $new_message = array(
                    'type'=>'say', 
                    "message"=>"群员发送消息",
                    'user_id'=>$user_id,
                    'imgurl'=>$imgurl,
                    'from_client_id'=>$client_id,
                    'from_client_name' =>$client_name,
                    'to_client_id'=>'all',
                    'say_type'=>$say_type,
                    'content'=>$content,
                    'create_time'=>$time,
                );
                return Gateway::sendToGroup($send_roomid ,json_encode($new_message,JSON_UNESCAPED_UNICODE));
            

            //群主关闭群聊天
            case 'offchat':
                $room_id = $message_data['room_id'];
                $offchat=$message_data['offchat'];
                $new_message = array(
                    'type'=>'offchat', 
                    "message"=>"群主操作禁言",
                    'offchat'=>$offchat,
                    'to_client_id'=>'all',
                    'create_time'=>date('Y-m-d H:i:s'),
                );
                return Gateway::sendToGroup($room_id ,json_encode($new_message,JSON_UNESCAPED_UNICODE));


        }
   }
   
   /**
    * 当用户断开连接时触发
    * @param int $client_id 连接id
    */
   public static function onClose($client_id)
   {
    $room_id = $_SESSION['room_id'];
     //获取当前在线用户数
    $groupnum=Gateway::getUidCountByGroup($room_id);
    $new_message = array(
        'type'=>'bye', 
        "message"=>"群员离开房间",
        'to_client_id'=>'all',
        'groupnum'=>$groupnum,
        'create_time'=>date('Y-m-d H:i:s'),
    );
    return Gateway::sendToGroup($room_id ,json_encode($new_message,JSON_UNESCAPED_UNICODE));
   
   }
}
