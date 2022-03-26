<?php
namespace app\admin\controller\configure;
use think\Db;
use think\Request;

class Chat
{
   
    //聊天列表页面
   public function chatlist(Request $request){
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
        $data=db('chat_data')->where('crowd_id',$id)->order('id desc')->limit($number,10)->select();
        $countnumber=db('chat_data')->where('crowd_id',$id)->count();
        $state=['state'   => '200','message'  => "聊天记录查询成功" ];
        $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
        return $resdata ;
     }
     else{
      $countnumber=db('chat_data')->count();
      $data=db('chat_data')->order('id desc')->limit($number,10)->select();
     }
     $state=['state'   => '200','message'  => "聊天记录表查询成功" ];
     $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
     return $resdata ;
    }

   //删除一条
   public function deletechat(Request $request){
        $id=$request->param("id");
        $data=db('chat_data')-> where('id', $id)->delete();
        $state=['state'   => '200','message'  => "消息聊天记录成功" ];
        $resdata=array_merge($state,array('data'=>$data));
        return $resdata ;
   }



}