<?php
namespace app\index\controller;
header("Content-Type:text/html;charset=utf-8");
 
use think\worker\Server; 
use think\Log;
use think\Db;
class Worker extends Server
{
    protected $socket = 'websocket://127.0.0.1:1234';
    
	/**
	Workerman
	* 收到信息
	* @param $connection
	* @param $data
	*/
	public function onMessage($connection, $data)
	{

        // 当客户端发送消息过来时，转发给所有人
        global $text_worker;  
        // foreach ($text_worker->connections as $conn) {  
        //     $conn->send("user[{$connection->uid}] said: $data");  
        // }  
        $dbdata=db('user')->where('id',10048)->order('id asc')->value("openid");
        // $data['appid']=Config('appid');
       
        // $connection->send('特定1回复');
         $connection->send('这是我回复的消息文案！');
        $connection->send( $dbdata);
        Log::record($dbdata);


        // Log::record("socket收到消息");
        // // Log::record($data);
        // $connection->send('我收到你的信息了，你传的消息是：'.$data);
        // $connection->send('这是我回复的消息文案！');
	}
	/**
	* 当连接建立时触发的回调函数
	* @param $connection
	*/
	public function onConnect($connection)
	{
        
        global $text_worker, $global_uid;
        // 为这个连接分配一个uid
        $connection->uid = ++$global_uid;
        Log::record("text_worker".$text_worker);
        Log::record("global_uid(建立的id):".$global_uid);
        Log::record($connection->uid);
        Log::record("当连接建立时触发的回调函数");
        $connection->send('建立聊天啦！');
	}
	/**
	* 当连接断开时触发的回调函数
	* @param $connection
	*/
	public function onClose($connection)
	{
        // 当客户端断开时，广播给所有客户端  
        Log::record("当连接断开时触发的回调函数");
        // Log::record($connection);
 
	}
	/**
	* 当客户端的连接上发生错误时触发
	* @param $connection
	* @param $code
	* @param $msg
	*/
	public function onError($connection, $code, $msg)
	{
		echo "error $code $msg\n";
	}
	/**
	* 每个进程启动
	* @param $worker
	*/
	public function onWorkerStart($worker)
	{
        Log::record("每个进程启动");
        //Log::record($worker);
		
    }

       


}