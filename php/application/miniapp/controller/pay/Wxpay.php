<?php
namespace app\miniapp\controller\pay;
use think\Db;
use think\Request;
use think\Config;
use think\Log;

class Wxpay
{
    public function xiaouad(Request $request)
    {
        $data=array(
            ['id'=>'1','title'=>'火把小程序','type'=>1,'imageurl'=>'http://qiniu.luojiaming.vip/myhuoba.png','url'=>'/pages/webview/webview?url=https://mp.weixin.qq.com/s/pGMr4pEV-d-tm0ZcT0gO-Q'],
            ['id'=>'2','title'=>'一起学堂','type'=>1,'imageurl'=>'http://qiniu.luojiaming.vip/myxuetang.png','url'=>'/pages/webview/webview?url=https://mp.weixin.qq.com/s/vyyu_5qibCYs4ym8ZV9uWw']);
        $state=['state'   => '200','message'  => '我的页面小U广告','xiaouadtitle'  => '社群工具推荐' ];
        $resdata=array_merge($state,array('data'=>$data));
    	return  $resdata ;
    }
    


    //微信支付回调
    public function paycallback(Request $request)
    {
      $data=$request->param();//商品id
      Log::record('微信支付回调方法');
      Log::record($data);
      return "微信支付回调方法";
    }
}
