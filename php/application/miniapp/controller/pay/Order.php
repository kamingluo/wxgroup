<?php
namespace app\miniapp\controller\pay;
use think\Db;
use think\Request;
use think\Config;
use think\Log;

class Order
{
    //创建订单
    public function createorder(Request $request)
    {
        $goods_id=$wxcode =$request->param("goods_id");//商品id
        $wxcode =$request->param("code");
        $openid=openid($wxcode);
        $userdata =db('user')->where('openid',$openid)->find();//查询用户信息
        $channel=$userdata["channel"];
        $user_id=$userdata["id"];

        $type=$request->param("type");//类型，1是会员订单
        if($type==1){
            $goodsdata =db('member_goods')->where('id',$goods_id)->find();//查询商品信息
            $total_fee=$goodsdata["total_fee"];
            $image=$goodsdata["image"];
            $body=$goodsdata["body"];
            $detail=$goodsdata["detail"];
        }
        else{
            return "另外种类型的还没做呢";
        }
        $state=1;//状态，订单状态，1是待付款，2是已付款，3是待退款，4是退款成功

        $time =date('Y-m-d H:i:s',time());
        $create_time=$time;//创建时间
        $update_time=$time;//订单更新时间
        $end_time=date("Y-m-d G:H:s",strtotime("+1800 seconds"));//当前时间半个小时后订单结束
        $out_trade_no=date('YmdHisms',time());//订单id

        $dbdata = ['id'=>'','out_trade_no'=>$out_trade_no,'openid' =>$openid,'channel' => $channel,'user_id' => $user_id,'total_fee' => $total_fee,'type' => $type,'state' => $state,
        'goods_id' => $goods_id,'image' => $image,'body' => $body,'detail' => $detail,'transaction_id' => null,'create_time' =>$time ,'update_time' =>$time,'end_time' =>$end_time,'open' =>0];
        $Id= db('order')->insertGetId($dbdata);//返回自增ID

        if($Id != null){
            $state=['state'   => '200','message'  => "订单生成成功",'id'=>$Id,'out_trade_no'=>$out_trade_no];
            return $state;
        }
        else{
            $state=['state'   => '400','message'  => "订单生成失败"];
            return $state;
        }
    }



    //查询用户订单数据
    public function userorder(Request $request)
    {
        $user_id =$request->param("user_id");//用户id
        $data =db('order')->where('user_id',$user_id)->where('open',0)->order('update_time desc')->select(); //取出数据
        $state=['state'   => '200','message'  => "用户订单列表" ];
        $resdata=array_merge($state,array('data'=>$data));
        return $resdata ;
    }

    //处理过期订单

    public function ordertimeout()
    {
        // return "处理过期订单";
        $time =date('Y-m-d H:i:s',time());

        $dbreturn= db('order')->where('state',1)->whereTime('end_time', '<',  $time)->update(['update_time' => $time,'open'=>1]);
        $resdata=['state'   => '200','message'  => "处理过期订单成功" ];
        return $resdata ;
        # code...
    }









    
}
