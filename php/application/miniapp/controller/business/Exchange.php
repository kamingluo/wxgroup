<?php
namespace app\miniapp\controller\business;
use think\Db;
use think\Request;
use think\Config;

class Exchange
{
    public function index(Request $request)
    {

    	return  "商品兑换模块" ;
    }
    
    //商品兑换列表
    public function goodslist()
    {
        $dbdata1=db('coin_exchange_goods')->order('id asc')->where('goodsType','0')->select();
        $dbdata2=db('coin_exchange_goods')->order('id asc')->where('goodsType','1')->select();
        $state=['state'   => '200','message'  => "商品兑换列表查询成功"];
        $resdata=array_merge($state,array('goodslist1'=>$dbdata1),array('goodslist2'=>$dbdata2));
        return $resdata ;
    }

    //用户兑换记录
     public function exchangelist(Request $request)
    {
        // $wxcode =$request->param("code");//接收所有传过来的值
        // $openid=openid($wxcode);

        $user_id =$request->param("user_id");//接收所有传过来的值
        $dbdata=db('coin_exchange_record')->where('user_id',$user_id)->order('id desc')->select();
        $state=['state'   => '200','message'  => "用户兑换列表查询成功" ];
        $resdata=array_merge($state,array('exchangelist'=>$dbdata));
        return $resdata ;
    }

    //用户兑换
    public function userexchange(Request $request){
        $wxcode =$request->param("code");
        $channel =$request->param("channel");
        $alipayName =$request->param("alipayName");
        $alipayNumber =$request->param("alipayNumber");
        $goodsid =$request->param("goodsid");
        $openid=openid($wxcode);
        $time =date('Y-m-d H:i:s',time());//获取当前时间
        //用传过来的商品ID拿到商品信息
        $goodsdata=db('coin_exchange_goods')->where('id',$goodsid)->find();

        //拿到用户的积分信息
        $userdata=db('user')->where('openid',$openid)->find();

        
        if($userdata['coin'] < $goodsdata['goodsPrice']){
        	 $state=['state'   => '400','message'  => "兑换失败，用户积分不足" ];
        	 $resdata=array_merge($state,array('exchange'=>'fail'));
             return $resdata ;
        }
        else{

        	//扣除用户金币
        	$reducescore= db('user')->where('openid',$openid)->setDec('coin',$goodsdata['goodsPrice']);

        	//积分记录记录
        	 $recorddata= ['id'=>'','user_id' =>$userdata['id'],'openid' =>$openid,'coin' =>$goodsdata['goodsPrice'],'explain' =>"金币兑换礼品",'channel' =>$channel,'state' =>1,'create_time' =>$time];
        	 $scorerecord=db('coin_record')->insert($recorddata);

        	//增加兑换记录
        	 $changedata= ['id'=>'','user_id' =>$userdata['id'],'openid' =>$openid,'channel' =>$channel, 'goodsName' =>$goodsdata['goodsName'],'goodsPrice' =>$goodsdata['goodsPrice'],'goodsType' =>$goodsdata['goodsType'],'alipayName' =>$alipayName,'alipayNumber' =>$alipayNumber,'state' =>0,  'create_time' =>$time];
        	 $change=db('coin_exchange_record')->insert($changedata);


        	 if($reducescore==1&&$scorerecord==1&&$change==1){
        	 	$state=['state'   => '200','message'  => "兑换成功" ];
        	    $resdata=array_merge($state,array('exchange'=>'success'));
                return $resdata ;
        	 }
        	 else{
        	 	$state=['state'   => '400','message'  => "兑换失败" ];
        	    $resdata=array_merge($state,array('exchange'=>'fail'));
                return $resdata ;
        	 }
        }


    }



}
