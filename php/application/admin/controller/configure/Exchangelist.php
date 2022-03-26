<?php
namespace app\admin\controller\configure;
use think\Db;
use think\Request;
use qiniu\Deletefile;


class Exchangelist
{
   
    //兑换页面
   public function exchangelist(Request $request){
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
        $data=db('exchange_record')->where('crowd_id',$id)->order('id desc')->limit($number,10)->select();
        $countnumber=db('exchange_record')->where('crowd_id',$id)->count();
        $state=['state'   => '200','message'  => "消息查询成功" ];
        $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
        return $resdata ;
     }
    
     if($crowd_name){
        //名称不为空
        $countnumber=db('exchange_record')->where('crowd_name','like',"%$crowd_name%")->count();
        $data=db('exchange_record')->where('crowd_name','like',"%$crowd_name%")->order('id desc')->limit($number,10)->select();
     }
     else{
      $countnumber=db('exchange_record')->count();
      $data=db('exchange_record')->order('id desc')->limit($number,10)->select();
     }
     $state=['state'   => '200','message'  => "兑换列表查询成功" ];
     $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
     return $resdata ;
    }

   //删除一条兑换信息
   public function deleteexchange(Request $request){
        $id=$request->param("id");
        
        //七牛删除文件资源
        $data=db('exchange_record')->where('id',$id)->find();


        //这里不能删除图片，一删除所有的都没了
      //   $deletefile = new Deletefile();
      //   $deleteresult=$deletefile -> more($data['images']);


        $data=db('exchange_record')-> where('id', $id)->delete();
        $state=['state'   => '200','message'  => "兑换记录删除成功" ];
        $resdata=array_merge($state,array('data'=>$data));
        return $resdata ;
   }



}