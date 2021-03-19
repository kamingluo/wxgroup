<?php
namespace app\saas\controller;
use think\Db;
use think\Config;
use think\Request;

class User
{


    public function login(Request $request)
    {
        $name=$request->param("name");
        $password=$request->param("password");
        $crowd_data =db('crowd_admin_user')->where('name',$name)->where('password',$password)->find();
        if($crowd_data == null ){
            $state=['state'   => '400','message'  => "用户不存在" ];
            return $state;
        }
        else{

            $sql = "select a.token,b.crowd_name  from crowd_admin_user a,crowd b where  a.crowd_id=b.id  and a.name='".$name."' and a.password=". $password .";";
            $data = Db::query($sql); //拿到数据
            $newdata=$data[0];
            $state=['state'   => '200','message'  => "saas平台用户登录" ];
            $resdata=array_merge($state,array('data'=>$newdata));
            return $resdata;
        }
 
    }


}
