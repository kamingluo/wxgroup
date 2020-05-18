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

use \GatewayWorker\Lib\Gateway;
// require_once '/Connection.php'; //引入数据库连接文件
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
        // self::$db = new \Workerman\MySQL\Connection('47.106.253.110', '3306', 'crowd', 'crowd', 'crowd');
    }

    /**
     * 当客户端连接时触发
     * 如果业务不需此回调可以删除onConnect
     * 
     * @param int $client_id 连接id
     */
    public static function onConnect($client_id)
    {


        // 向当前client_id发送数据 
        Gateway::sendToClient($client_id, "Hello $client_id\r\n");
        // 向所有人发送
        Gateway::sendToAll("$client_id lo3333gin\r\n");
    }
    
   /**
    * 当客户端发来消息时触发
    * @param int $client_id 连接id
    * @param mixed $message 具体消息
    */
   public static function onMessage($client_id, $message)
   {

        
        // $ret= self::$db->select('*')->from('user')->where('id=10048')->query();
        // $state=['state'   => '200','message'  => "返回的数据" ];
        // $resdata=array_merge($state,array('data'=>$ret));
        // 打印结果

        $kaming=json_decode($message);
        return Gateway::sendToAll(json_encode($kaming, JSON_UNESCAPED_UNICODE));//JSON_UNESCAPED_UNICODE解决中文Json不要编码Unicode.

        return Gateway::sendToAll($message);

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
       GateWay::sendToAll("$client_id logout\r\n");
   }
}
