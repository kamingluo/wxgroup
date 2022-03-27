<?php
namespace app\admin\controller\configure;
use think\Db;
use think\Request;
use think\Config;
use qiniu\Deletefile;
use think\Log;
use app\miniapp\controller\Currency;//跨模块调用
class Adminuser
{

   //群列表，显示多少群员
   public function groupslist(Request $request){
           $id=$request->param("id");
           if($id){
              //根据id查询的
              $sql='select a.*,b.name,b.password,b.remarks from crowd a,crowd_admin_user b where a.id=b.crowd_id and a.id='.$id.' group by a.id ORDER BY a.id DESC;';
              $data = Db::query($sql); //拿到数据
              $countnumber=db('crowd_admin_user')->where('crowd_id',$id)->count();
              $state=['state'   => '200','message'  => "查询群后台账号成功" ];
              $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
              return $resdata ;
           }

           $pages=$request->param("pages");
           if($pages == 1 || $pages==null  ){
             $number=0;
           }
           else{
            $number=($pages - 1)*10;
           }
            

           $crowd_name=$request->param("crowd_name");
           if($crowd_name){
              //名称不为空
              $countnumber=db('crowd_admin_user')->where('crowd_name','like',"%$crowd_name%")->count();
              $sql="select a.* from crowd a,crowd_admin_user b where a.id=b.crowd_id and a.crowd_name like '%".$crowd_name."%' group by a.id ORDER BY b.id DESC LIMIT ".$number.",10;";
              $data = Db::query($sql); //拿到数据
           }
           else{
            $countnumber=db('crowd_admin_user')->count();
            $sql="select a.*,b.name,b.password,b.remarks from crowd a,crowd_admin_user b where a.id=b.crowd_id group by a.id ORDER BY b.id DESC  LIMIT ".$number.",10;";
            $data = Db::query($sql); //拿到数据
           }
           $state=['state'   => '200','message'  => "查询群后台账号成功" ];
           $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
           return $resdata ;
       }
   
  
   //删除一个群
   public function delete(Request $request){

      $id =$request->param("id");
      $data=db('crowd_admin_user')->where('crowd_id',$id)->delete();
      $state=['state'   => '200','message'  => "后台用户删除成功" ];
      $resdata=array_merge($state,array('data'=>$data));
      return $resdata ;
   }



   public function add(Request $request){

      $crowd_id =$request->param("crowd_id");
      $dbres =db('crowd_admin_user')->where('crowd_id',$crowd_id)->find();//查询有没有创建过
      if($dbres){
        $resdata=['state'   => '300','message'  => "这个群已经创建过账户了" ];
        return $resdata;
      }

      $name =$request->param("name");
      $dbres =db('crowd_admin_user')->where('name',$name)->find();//查询有没有创建过
      if($dbres){
        $resdata=['state'   => '300','message'  => "该名称已经注册" ];
        return $resdata;
      }


      $password =$request->param("password");
      $remarks =$request->param("remarks");
      $time =date('Y-m-d H:i:s',time());
      $token=md5($time);
      $data = ['id'=>'','crowd_id' =>$crowd_id,'name' => $name,'password' => $password,'token' => $token,'create_time' => $time,'remarks' => $remarks];
      $admin_id= db('crowd_admin_user')->insertGetId($data);//返回自增ID
      $state=['state'   => '200','message'  => "增加后台用户成功",'admin_id'  => $admin_id ];
      return $state ;
   }



   //编辑
    public function edit(Request $request)
   {


      $name =$request->param("name");
      $password =$request->param("password");
      $remarks =$request->param("remarks");
      $crowd_id =$request->param("id");
      $end_time=$request->param("end_time");
      $time =date('Y-m-d',time());
      //判断当前时间跟结束时间对比

      $open=5;//先判断为正常使用的状态
      if($end_time < $time){
        //结束时间在之前，群状态为不可使用
        $open=3;
      }

      //修改
      $dbreturn= db('crowd')->where('id',$crowd_id)->update(['end_time' => $end_time,'open' => $open]);//修改群信息

      $dbreturn= db('crowd_admin_user')->where('crowd_id',$crowd_id)->update(['name' => $name,'password' => $password,'remarks' => $remarks]);//修改管理后台信息

      $state=['state'   => '200','message'  => "修改后台管理信息成功" ];
      return $state ;  
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