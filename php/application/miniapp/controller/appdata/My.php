<?php
namespace app\miniapp\controller\appdata;
use think\Db;
use think\Request;
use think\Config;

class My
{
    public function xiaouad(Request $request)
    {
        $data=array(
            ['id'=>'1','title'=>'火把小程序','type'=>1,'imageurl'=>'http://qiniu.luojiaming.vip/myhuoba.png','url'=>'/pages/webview/webview?url=https://mp.weixin.qq.com/s/IUmUFZmwdyFnPYTMX4n7cw'],
            ['id'=>'2','title'=>'一起学堂','type'=>1,'imageurl'=>'http://qiniu.luojiaming.vip/myxuetang.png','url'=>'/pages/business/gdtad/gdtad']);
        $state=['state'   => '200','message'  => '我的页面小U广告' ];
        $resdata=array_merge($state,array('data'=>$data));
    	return  $resdata ;
    }



    public function moredata(Request $request)
    {
        $data=array(
            ['id'=>'1','title'=>'去赚金币','type'=>1,'imageurl'=>'miniapp/images/groupicon/pushtasks.png','url'=>'/pages/webview/webview?url=https://mp.weixin.qq.com/s/IUmUFZmwdyFnPYTMX4n7cw'],
            ['id'=>'2','title'=>'金币兑换','type'=>1,'imageurl'=>'miniapp/images/groupicon/pushtasks.png','url'=>'/pages/business/gdtad/gdtad'],
            ['id'=>'3','title'=>'加入我们','type'=>1,'imageurl'=>'miniapp/images/groupicon/pushtasks.png','url'=>'/pages/business/gdtad/gdtad'],
            ['id'=>'4','title'=>'在线客服','type'=>'kefu','imageurl'=>'miniapp/images/groupicon/pushtasks.png','url'=>'/pages/business/gdtad/gdtad'],
            ['id'=>'5','title'=>'意见建议','type'=>'jianyi','imageurl'=>'miniapp/images/groupicon/pushtasks.png','url'=>'/pages/business/gdtad/gdtad'],
        );
        $state=['state'   => '200','message'  => '我的页面更多配置' ];
        $resdata=array_merge($state,array('moredata'=>$data));
    	return  $resdata ;
    }
}
