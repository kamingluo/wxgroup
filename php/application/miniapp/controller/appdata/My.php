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
            ['id'=>'1','title'=>'这是标题1','text'=>'这是内容1','bgcolor'=>'bg-gradual-green','icon'=>'http://qiniu.luojiaming.vip/xiaou.jpg','jumpurl'=>'/pages/webview/webview?url=https://mp.weixin.qq.com/s/IUmUFZmwdyFnPYTMX4n7cw'],
            ['id'=>'2','title'=>'这是标题2','text'=>'这是内容2','bgcolor'=>'bg-gradual-blue','icon'=>'http://qiniu.luojiaming.vip/tuiguang03.jpg','jumpurl'=>'/pages/business/gdtad/gdtad']);
        $state=['state'   => '200','message'  => '我的页面小U广告' ];
        $resdata=array_merge($state,array('data'=>$data));
    	return  $resdata ;
    }
}