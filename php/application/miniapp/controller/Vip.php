<?php
namespace app\miniapp\controller;
use think\Db;
use think\Request;
use think\Config;
use temmsg\Lotterymsg;
use think\Log;

class Vip
{
    public function membergoods(Request $request)
    {
        $data =db('member_goods')->order('sort ASC')->select(); //取出数据
        $state=['state'   => '200','message'  => "vip商品列表" ];
        $resdata=array_merge($state,array('data'=>$data));
        return $resdata ;
    }


    public function uservipdata(Request $request)
    {
        $user_id =$request->param("user_id");
        $data=queryuservipdata($user_id);
        return $data;

        // $data =db('user_vip_data')->where('user_id',$user_id)->find();//查询用户vip信息
        // $condition=1;
        // $message="";
        // $end_time='';
        // if($data){
        //     $end_time=$data["end_time"];//会员结束时间
        //     $nowtime=date('Y-m-d H:i:s',time());//当前时间
        //     if($end_time>$nowtime){
        //         $message="有会员，且没结束";
        //         $condition=0;
        //     }
        //     else{
        //         $message="有会员，已经结束了";
        //         $condition=2;
        //     }
        // }
        // else{
        //     $message="用户没有开通记录";
        // }
        // $returndata=['state'   => '200','message'  => $message,'condition'=> $condition,'end_time'  => $end_time ];
        // return $returndata ;
    }




    //给用户增加vip
    public function openvip(Request $request)
    {
        $openid =$request->param("openid");
        $time =$request->param("time");

        $data=addvipday($openid,$time);
        return $data ;
        // $nowtime=date('Y-m-d H:i:s',time());//当前时间
        // $data =db('user_vip_data')->where('openid',$openid)->find();//查询用户vip信息
        // if($data){
        //     //已经有vip数据了，在原来的基础上增加
        //     $end_time=$data["end_time"];
        //     if($end_time>$nowtime){
        //         $new_end_time=date('Y-m-d H:i:s',strtotime("{$end_time} + $time day"));
        //         $dbreturn= db('user_vip_data')->where('openid',$openid)->update(['update_time' => $nowtime,'end_time' => $new_end_time]);
        //     }
        //     else{
        //         $end_time=date("Y-m-d G:H:s",strtotime("+".$time." days"));//当前时间加上多少天
        //         $dbreturn= db('user_vip_data')->where('openid',$openid)->update(['update_time' => $nowtime,'end_time' => $end_time]);
        //     }
        // }
        // else{
        //     //还没有vip数据，给用加上
        //     $userdata =db('user')->where('openid',$openid)->find();//查询用户信息
        //     $user_id=$userdata["id"];
        //     $channel=$userdata["channel"];
        //     $end_time=date("Y-m-d G:H:s",strtotime("+".$time." days"));//当前时间加上多少天
        //     $dbdata = ['id'=>'','openid' =>$openid,'channel' => $channel,'user_id' => $user_id,'create_time' =>$nowtime ,'update_time' =>$nowtime,'end_time' =>$end_time];
        //     $Id= db('user_vip_data')->insertGetId($dbdata);//返回自增ID
        // }
        // $returndata=['state'   => '200','message'  => "给用户增加vip天数成功" ];
        // return $returndata ;
    }




   
    
}
