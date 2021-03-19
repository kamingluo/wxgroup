<?php
// +----------------------------------------------------------------------
// | 后台管理公共方法
// +----------------------------------------------------------------------

use think\Log;
use think\Db;
use think\Request;
use think\Controller;
use think\Config;


//测试方法
function test(){
    return "test";
}

#用token获取群id
function havecrowdid($token){
    $crowd_data =db('crowd_admin_user')->where('token',$token)->find();
    if($crowd_data == null ){
        echo  json_encode(['state'   => '400','message'  => "登录已经过期" ] ) ;
        die ();
    }
    else{

        $crowd_id=$crowd_data["crowd_id"];
        return $crowd_id;
    }


}



