<?php
/**
 * Created by BoBo.
 * Date: 2018/11/15 14:56
 * Function:事件处理类
 */
namespace app\index\controller;
use GatewayWorker\Lib\Gateway;
use think\Log;
class Events {
    /**
     * 当客户端发来消息时触发
     * @param int $client_id 连接id
     * @param mixed $data 具体消息
     */
    public static function onMessage($client_id, $data){
        $message = json_decode($data, true);
        Gateway::sendToCurrentClient(json_encode($data));
    }
    /**
     * 当客户端连接时触发
     * 如果业务不需此回调可以删除onConnect
     *
     * @param int $client_id 连接id
     */
    public static function onConnect($client_id)
    {
        Log::record("链接");
        Gateway::sendToClient($client_id,json_encode(['status'=>"success",'msg'=>"连接成功"]));
    }
    /**
     * 当连接断开时触发的回调函数
     * @param $connection
     */
    public static function onClose($client_id){
        Gateway::sendToClient($client_id,json_encode(['status'=>"error",'msg'=>"断开连接"]));
    }
    /**
     * 当客户端的连接上发生错误时触发
     * @param $connection
     * @param $code
     * @param $msg
     */
    public static function onError($client_id, $code, $msg){
        echo "error $code $msg\n";
    }
    /**
     * 每个进程启动
     * @param $worker
     */
    public static function onWorkerStart($worker){
        Log::record("启动啊");
    }
}