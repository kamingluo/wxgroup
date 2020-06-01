<?php
namespace app\miniapp\controller\group;
use think\Db;
use think\Request;
use think\Config;

class Chat
{



    //查询群聊天配置信息及历史信息
    public function chatconfig(Request $request)
    {
        $crowd_id =$request->param("crowd_id");
        $configdata =db('chat_config')->where('crowd_id',$crowd_id)->find();//查询群聊天配置信息
        if($configdata == null){
          $time =date('Y-m-d H:i:s',time());
          $owner_id =db('crowd')->where('id',$crowd_id)->value("crowd_ownerid");//查询群主id
          // return $owner_id;
          $configdata = ['id'=>'','crowd_id' =>$crowd_id,'owner_id' => $owner_id,'offchat' => 0,'create_time' =>$time];
          $insertId= db('chat_config')->insertGetId($configdata);//返回自增ID
        }
        $chatdata =db('chat_data')->where('crowd_id',$crowd_id)->order('id desc')->limit(100)->select(); //取出最近100条聊天记录
        $newchatdata = array_reverse($chatdata);//将数组倒序一下

        $state=['state'   => '200','message'  => "查询群聊天配置信息及历史信息" ];
        $resdata=array_merge($state,array('configdata'=>$configdata),array('chatdata'=>$newchatdata));
        return $resdata ;  
    }


    //查询群聊天记录
    public function chatdata(Request $request)
    {
        $crowd_id =$request->param("crowd_id");
        $chatdata =db('chat_data')->where('crowd_id',$crowd_id)->order('id desc')->limit(100)->select(); //取出最近100条聊天记录
        $newchatdata = array_reverse($chatdata);//将数组倒序一下
        $state=['state'   => '200','message'  => "查询群聊天历史积分" ];
        $resdata=array_merge($state,array('chatdata'=>$newchatdata));
        return $resdata ;  
    }

    //修改禁言
    public function offchat(Request $request)
    {
        $crowd_id =$request->param("crowd_id");
        $offchat =$request->param("offchat");
        $dbreturn= db('chat_config')->where('crowd_id',$crowd_id)->update(['offchat' => $offchat]);//修改禁言状态
        $state=['state'   => '200','message'  => "修改禁言状态成功" ];
        return $state ;  
    }




}
