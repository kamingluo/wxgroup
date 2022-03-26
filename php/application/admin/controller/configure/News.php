<?php
namespace app\admin\controller\configure;
use think\Db;
use think\Request;
use qiniu\Deletefile;


class News
{
   
    //任务列表页面
   public function newslist(Request $request){
     $id=$request->param("id");
     $pages=$request->param("pages");
     $crowd_name=$request->param("crowd_name");
     if($pages == 1 || $pages==null  ){
      $number=0;
    }
    else{
      $number=($pages - 1)*10;
    }
     if($id){
        $data=db('crowd_news')->where('crowd_id',$id)->order('id desc')->limit($number,10)->select();
        $countnumber=db('crowd_news')->where('crowd_id',$id)->count();
        $state=['state'   => '200','message'  => "消息查询成功" ];
        $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
        return $resdata ;
     }
    
     if($crowd_name){
        //名称不为空
        $countnumber=db('crowd_news')->where('crowd_name','like',"%$crowd_name%")->count();
        $data=db('crowd_news')->where('crowd_name','like',"%$crowd_name%")->order('id desc')->limit($number,10)->select();
     }
     else{
      $countnumber=db('crowd_news')->count();
      $data=db('crowd_news')->order('id desc')->limit($number,10)->select();
     }
     $state=['state'   => '200','message'  => "消息列表查询成功" ];
     $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
     return $resdata ;
    }

   //删除一条任务
   public function deletenew(Request $request){
        $id=$request->param("id");
        
        //七牛删除文件资源
        $data=db('crowd_news')->where('id',$id)->find();
        $deletefile = new Deletefile();
        $deleteresult=$deletefile -> more($data['images']);


        $data=db('crowd_news')-> where('id', $id)->delete();
        $state=['state'   => '200','message'  => "消息删除成功" ];
        $resdata=array_merge($state,array('data'=>$data));
        return $resdata ;
   }



}