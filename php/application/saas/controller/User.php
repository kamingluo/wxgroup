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
        $crowd_admin_data =db('crowd_admin_user')->where('name',$name)->where('password',$password)->find();
        if($crowd_admin_data == null ){
            $state=['state'   => '400','message'  => "用户不存在" ];
            return $state;
        }
        else{
            $id=$crowd_admin_data['crowd_id'];//拿到群状态
            $crowd_data =db('crowd')->where('id',$id)->find();
            if($crowd_data == null ){
              $state=['state'   => '400','message'  => "群不存在" ];
              return $state;
            }
            else{
              $open=$crowd_data['open'];//拿到群状态
              if($open == 1){
                $state=['state'   => '500','message'  => "群审核中" ];
                return $state;
              }
              else if($open == 3){
                $state=['state'   => '500','message'  => "群体验已经过期" ];
                return $state;
              }
              else if($open == 4){
                $state=['state'   => '500','message'  => "群已经被删除" ];
                return $state;
              }
              else{
                $sql = "select a.token,b.crowd_name,b.logo from crowd_admin_user a,crowd b where  a.crowd_id=b.id  and a.name='".$name."' and a.password='". $password ."';";
                $data = Db::query($sql); //拿到数据
                $newdata=$data[0];
                $state=['state'   => '200','message'  => "saas平台用户登录" ];
                $resdata=array_merge($state,array('data'=>$newdata));
                return $resdata;
              }

            }
        }
 
    }



    //检查登录
    public function checklogin(Request $request){
        $token=$request->param("token");
        $id=havecrowdid($token);
        $crowd_data =db('crowd')->where('id',$id)->find();
        if($crowd_data == null ){
            $state=['state'   => '400','message'  => "用户不存在" ];
            return $state;
        }
        else{
            $open=$crowd_data['open'];//拿到群状态
            if($open == 1){
              $state=['state'   => '500','message'  => "群审核中" ];
              return $state;
            }
            else if($open == 3){
              $state=['state'   => '500','message'  => "群体验已经过期" ];
              return $state;
            }
            else if($open == 4){
              $state=['state'   => '500','message'  => "群已经被删除" ];
              return $state;
            }
            else{
              $state=['state'   => '200','message'  => "用户状态正常" ];
              return $state;
            }
        }
    }


    //检查是否体验期过期
    public function checkendtime(Request $request){
      //查询处于体验期但是结束时间小于当前时间的数据
      $time =date('Y-m-d',time());
      $dbreturn= db('crowd')->where('open',5)->where('end_time','< time',$time)->update(['open' => 3]);//修改群信息
      $dbreturn= db('crowd')->where('open',2)->where('end_time','< time',$time)->update(['open' => 3]);//修改群信息
      $state=['state'   => '200','message'  => "检查是否体验期过期并修改数值成功" ];
      return $state ;  
    }


}
