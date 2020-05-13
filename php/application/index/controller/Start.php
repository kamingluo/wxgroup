<?php
/**
 * Created by BoBo.
 * Date: 2018/11/15 14:37
 * Function:
 */
namespace app\index\controller;
use \Workerman\Worker;
use \GatewayWorker\Register;
use \Workerman\WebServer;
use \GatewayWorker\Gateway;
use \GatewayWorker\BusinessWorker;
use \Workerman\Autoloader;
class Start extends Worker{
    public function __construct(){
        //初始化register
        new Register('websocket://127.0.0.1:1238');
        //初始化 bussinessWorker 进程
        $worker = new BusinessWorker();
        $worker->name = 'mygate';
        $worker->count = 4;
        $worker->registerAddress = '127.0.0.1:1238';
        //设置处理业务的类,此处制定Events的命名空间
        $worker->eventHandler = '\app\index\controller\Events';
        // 初始化 gateway 进程
        $gateway = new Gateway("websocket://0.0.0.0:8383");
        $gateway->name = 'index';
        $gateway->count = 4;
        $gateway->lanIp = '127.0.0.1';
        $gateway->startPort = 2900;
        $gateway->pingInterval = 10;
        $gateway->pingData = '{"type":"ping"}';
        $gateway->registerAddress = '127.0.0.1:1238';
        //运行所有Worker;
        Worker::runAll();
    }

}