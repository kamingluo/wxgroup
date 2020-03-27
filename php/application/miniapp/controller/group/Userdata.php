<?php
namespace app\miniapp\controller\group;
use think\Db;
use think\Request;
use think\Config;

class Userdata
{



    //查询用户对应群任务列表数据
    public function usergrouptasklist(Request $request)
    {
        $crowd_id =$request->param("crowd_id");
        $user_id =$request->param("user_id");
        $usertasklist =db('task_record')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->order('id desc')->select();
        $state=['state'   => '200','message'  => "查询用户对应群任务列表" ];
        $resdata=array_merge($state,array('usertasklist'=>$usertasklist));
        return $resdata ;
      
    }


    //查询用户对应群积分列表数据
    public function usergroupscorelist(Request $request)
    {
        $crowd_id =$request->param("crowd_id");
        $user_id =$request->param("user_id");
        $userscorelist =db('score_record')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->order('id desc')->select();
        $state=['state'   => '200','message'  => "查询用户对应群积分列表" ];
        $resdata=array_merge($state,array('userscorelist'=>$userscorelist));
        return $resdata ;
      
    }




}
