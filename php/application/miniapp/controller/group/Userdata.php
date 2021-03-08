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
        $pages=$request->param("pages");//页数
        if($pages){
            //有传pages
            $newpages= ($pages-1) * 20;//一页20条
            $usertasklist =db('task_record')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->order('id desc')->limit($newpages,20)->select(); 
        }
        else{
            //兼容没有传页数，返回全部信息
            $usertasklist =db('task_record')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->order('id desc')->select();
        }
        $count =db('task_record')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->count();


        $state=['state'   => '200','message'  => "查询用户对应群任务列表" ,'count'=>$count];
        $resdata=array_merge($state,array('usertasklist'=>$usertasklist));
        return $resdata ;
      
    }

    //删除群任务
    public function deletetask(Request $request)
    {
        $crowd_id =$request->param("crowd_id");
        $user_id =$request->param("user_id");
        $task_id=$request->param("task_id");
        $cleardata=db('task_record')-> where('id',$task_id)-> where('user_id',$user_id)-> where('crowd_id',$crowd_id)->delete();
        $state=['state'   => '200','message'  => "删除任务成功",'cleardata' => $cleardata];
        return  $state;

    }



    //查询用户对应群积分列表数据
    public function usergroupscorelist(Request $request)
    {
        $crowd_id =$request->param("crowd_id");
        $user_id =$request->param("user_id");
        $pages=$request->param("pages");//页数
        if($pages){
            //有传pages
            $newpages= ($pages-1) * 20;//一页20条
            $userscorelist =db('score_record')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->order('id desc')->limit($newpages,20)->select(); 
        }
        else{
            //兼容没有传页数，返回全部信息
            $userscorelist =db('score_record')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->order('id desc')->select();
        }
        $count =db('score_record')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->count();

        $state=['state'   => '200','message'  => "查询用户对应群积分列表" ,'count'=>$count ];
        $resdata=array_merge($state,array('userscorelist'=>$userscorelist));
        return $resdata ;
      
    }




}
