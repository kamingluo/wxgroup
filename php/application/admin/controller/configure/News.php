<?php
namespace app\admin\controller\configure;
use think\Db;
use think\Request;

class News
{
   
    //消息列表页面
   public function newslist(Request $request){
        $pages=$request->param("pages");
        $countnumber=db('crowd_news')->count();
        if($pages == 1 || $pages==null  ){
        $data=db('crowd_news')->order('id desc')->limit(0,10)->select();
        $state=['state'   => '200','message'  => "群消息列表查询成功" ];
        $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
        return $resdata ;
        }
        else{
        $number=($pages - 1)*10 ;
        $data=db('crowd_news')->order('id desc')->limit($number,10)->select();
        $state=['state'   => '200','message'  => "群消息列表查询成功" ];
        $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
        return $resdata ;
        }
    }

   //删除一条任务
   public function deletenew(Request $request){
        $data=db('crowd_news')-> where('id', $request->param("id"))->delete();
        $state=['state'   => '200','message'  => "群消息删除成功" ];
        $resdata=array_merge($state,array('data'=>$data));
        return $resdata ;
   }



}