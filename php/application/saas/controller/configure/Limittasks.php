<?php
namespace app\saas\controller\configure;
use think\Db;
use think\Request;
use qiniu\Deletefile;
class Limittasks
{
   
  //群发布的限时任务列表
   public function taskslist(Request $request){

    $token=$request->param("token");
    $pages=$request->param("pages");
    $id=havecrowdid($token);
    if($pages == 1 || $pages==null  ){
      $number=0;
    }
    else{
      $number=($pages - 1)*10 ;
    }
    $data=db('crowd_limit_tasks')->where('crowd_id',$id)->order('id ASC')->limit($number,10)->select();
    $countnumber=db('task_record')->where('crowd_id',$id)->count();
    $state=['state'   => '200','message'  => "限时任务列表" ];
    $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
    return $resdata ;
    }

    
    //限时任务群员提交任务列表
    public function usertaskslist(Request $request){
      $token=$request->param("token");
      $pages=$request->param("pages");
      $state=$request->param("state");
      $id=havecrowdid($token);
      if($pages == 1 || $pages==null  ){
        $number=0;
      }
      else{
        $number=($pages - 1)*10 ;
      }

      $data=db('corwd_limit_task_record')->where('crowd_id',$id)->where('state',$state)->order('id ASC')->limit($number,10)->select();
      $countnumber=db('task_record')->where('crowd_id',$id)->where('state',$state)->count();
      $state=['state'   => '200','message'  => "限时任务群员提交任务列表" ];
      $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
      return $resdata ;



    }




}