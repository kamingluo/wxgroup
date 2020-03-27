<?php
namespace app\admin\controller\configure;
use think\Db;
use think\Request;

class Tasks
{
   
    //任务列表页面
   public function taskslist(Request $request){
     $id=$request->param("id");
     if($id){
        //根据id查询的
        $data=db('task_record')->where('id',$id)->select();
        $countnumber=1;
        $state=['state'   => '200','message'  => "任务查询成功" ];
        $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
        return $resdata ;
     }
     $pages=$request->param("pages");
     $crowd_name=$request->param("crowd_name");
     if($pages == 1 || $pages==null  ){
       $number=0;
     }
     else{
       $number=($pages - 1)*10 ;
     }
     if($crowd_name){
        //名称不为空
        $countnumber=db('task_record')->where('crowd_name','like',"%$crowd_name%")->count();
        $data=db('task_record')->where('crowd_name','like',"%$crowd_name%")->order('id desc')->limit($number,10)->select();
     }
     else{
      $countnumber=db('task_record')->count();
      $data=db('task_record')->order('id desc')->limit($number,10)->select();
     }
     $state=['state'   => '200','message'  => "任务列表查询成功" ];
     $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
     return $resdata ;
    }

   //删除一条任务
   public function deletetask(Request $request){
        $data=db('task_record')-> where('id', $request->param("id"))->delete();
        $state=['state'   => '200','message'  => "任务删除成功" ];
        $resdata=array_merge($state,array('data'=>$data));
        return $resdata ;
   }



}