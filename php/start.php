<?php
/**
 * run with command
 * php start.php start
 */

ini_set('display_errors', 'on');
use Workerman\Worker;

if(strpos(strtolower(PHP_OS), 'win') === 0)
{
    exit("start.php not support windows, please use start_for_win.bat\n");
}

// 检查扩展
if(!extension_loaded('pcntl'))
{
    exit("Please install pcntl extension. See http://doc3.workerman.net/appendices/install-extension.html\n");
}

if(!extension_loaded('posix'))
{
    exit("Please install posix extension. See http://doc3.workerman.net/appendices/install-extension.html\n");
}

// 标记是全局启动
define('GLOBAL_START', 1);

require_once __DIR__ . '/vendor/autoload.php';

// 加载所有Applications/*/start.php，以便启动所有服务
// foreach(glob(__DIR__.'/Applications/*/start*.php') as $start_file)
// {
//     require_once $start_file;
// }

// 加载所有Applications/push/start.php，以便启动所有服务
// foreach(glob(__DIR__.'/Applications/push/start_*.php') as $start_file)
// {
//     require_once $start_file;
// }

//加载所有的项目，启动（kaming）
require_once __DIR__ . '/applications/push/start_register.php';
require_once __DIR__ . '/applications/push/start_gateway.php';
require_once __DIR__ . '/applications/push/start_businessworker.php';



// 运行所有服务
Worker::runAll();