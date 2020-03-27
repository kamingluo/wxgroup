<?php
namespace app\admin\controller\configure;
use think\Db;
use think\Request;
use think\Config;

class Desgroup
{
   
    //群列表
    public function groupslist(Request $request){
        $id=$request->param("id");
        if($id){
           //根据id查询的
           $data=db('crowd')->where('id',$id)->select();
           $countnumber=db('crowd')->where('id',$id)->count();
           $state=['state'   => '200','message'  => "群查询成功" ];
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
           $countnumber=db('crowd')->where('crowd_name','like',"%$crowd_name%")->count();
           $data=db('crowd')->where('crowd_name','like',"%$crowd_name%")->order('id desc')->limit($number,10)->select();
        }
        else{
         $countnumber=db('crowd')->count();
         $data=db('crowd')->order('id desc')->limit($number,10)->select();
        }
        $state=['state'   => '200','message'  => "群列表查询成功" ];
        $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
        return $resdata ;
    }

   //删除一个群
   public function deletegroup(Request $request){
    $crowd_id =$request->param("id");
    $crowd_data =db('crowd')->where('id',$crowd_id)->find();
    if($crowd_data == null ){
       $state=['state'   => '200','message'  => "不存在的群" ];
       return $state;
    }
    else{
       $crowd=db('crowd')-> where('id',$crowd_id)->delete();
       $crowd_goods=db('crowd_goods')-> where('crowd_id',$crowd_id)->delete();
       $crowd_news=db('crowd_news')-> where('crowd_id',$crowd_id)->delete();
       $exchange_record=db('exchange_record')-> where('crowd_id',$crowd_id)->delete();
       $score_record=db('score_record')-> where('crowd_id',$crowd_id)->delete();
       $task_record=db('task_record')-> where('crowd_id',$crowd_id)->delete();
       $user_crowd=db('user_crowd')-> where('crowd_id',$crowd_id)->delete();
       $state=['state'   => '200','message'  => "删除群成功" ];
       return $state;
        
    }
   }


}