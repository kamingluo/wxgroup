<?php
namespace app\admin\controller\configure;
use think\Db;
use think\Request;

class Handlegroup
{
   
    //用户列表页面
   public function usergrouplist(Request $request){
     $user_id=$request->param("user_id");
     if($user_id){
        //根据id查询的
        $sql="select a.*,b.crowd_name,b.crowd_ownerid,b.logo from user_crowd a,crowd b where a.crowd_id=b.id and a.user_id=".$user_id." ORDER BY a.id DESC;";
        $data = Db::query($sql); //拿到数据
        $state=['state'   => '200','message'  => "用户群列表查询成功" ];
        $resdata=array_merge($state,array('data'=>$data));
        return $resdata ;
     }
     else{
      $state=['state'   => '400','message'  => "用户id不能为空" ];
      return $state ;
     }

    }


    public function updateusergroup(Request $request){
      $user_id=$request->param("user_id");//用户id
      $crowd_id=$request->param("crowd_id");//群id
      $user_type=$request->param("user_type");//修改的角色
      $dbreturn= db('user_crowd')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->update(['user_type' => $user_type]);
      if($dbreturn==1){
        $state=['state'   => '200','message'  => "用户群角色更新成功" ];
        return $state;
      }
      else{
        $state=['state'   => '400','message'  => "用户群角色更新失败" ];
        return $state;
      }
    }





   //删除用户在该群的记录
   public function deleteuser(Request $request){
        $data=db('user_crowd')-> where('id', $request->param("id"))->delete();
        $state=['state'   => '200','message'  => "用户退出群成功" ];
        $resdata=array_merge($state,array('data'=>$data));
        return $resdata ;
   }



}