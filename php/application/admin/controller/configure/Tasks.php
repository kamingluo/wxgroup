<?php
namespace app\admin\controller\configure;
use think\Db;
use think\Request;
use qiniu\Deletefile;
class Tasks
{
   
    //任务列表页面
   public function taskslist(Request $request){
    $pages=$request->param("pages");
    $crowd_name=$request->param("crowd_name");
    $id=$request->param("id");

    if($pages == 1 || $pages==null  ){
      $number=0;
    }
    else{
      $number=(($pages - 1)*10)-1 ;
    }
     
    if($id){
        //根据群id查询的
        // $data=db('task_record')->where('crowd_id',$id)->select();
        $data=db('task_record')->where('crowd_id',$id)->order('id desc')->limit($number,10)->select();
        $countnumber=db('task_record')->where('crowd_id',$id)->count();
        $state=['state'   => '200','message'  => "任务查询成功" ];
        $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
        return $resdata ;
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
        $id=$request->param("id");

        //七牛删除文件资源
        $data=db('task_record')->where('id',$id)->find();
        $deletefile = new Deletefile();
        $deleteresult=$deletefile -> more($data['images']);



        $data=db('task_record')-> where('id', $id)->delete();
        $state=['state'   => '200','message'  => "任务删除成功" ];
        $resdata=array_merge($state,array('data'=>$data));
        return $resdata ;
   }



}