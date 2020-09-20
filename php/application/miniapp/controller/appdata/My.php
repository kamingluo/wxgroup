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
            ['id'=>'1','title'=>'火把小程序','type'=>1,'imageurl'=>'http://qiniu.luojiaming.vip/myhuoba.png','url'=>'/pages/webview/webview?url=https://mp.weixin.qq.com/s/pGMr4pEV-d-tm0ZcT0gO-Q'],
            ['id'=>'2','title'=>'一起学堂','type'=>1,'imageurl'=>'http://qiniu.luojiaming.vip/myxuetang.png','url'=>'/pages/webview/webview?url=https://mp.weixin.qq.com/s/vyyu_5qibCYs4ym8ZV9uWw']);
        $state=['state'   => '200','message'  => '我的页面小U广告','xiaouadtitle'  => '社群工具推荐' ];
        $resdata=array_merge($state,array('data'=>$data));
    	return  $resdata ;
    }
    


    public function moredata(Request $request)
    {
        $data=array(
            ['id'=>'1','title'=>'去赚金币','type'=>1,'imageurl'=>'miniapp/images/my/moreicon/zhuanjinbi.png','url'=>'/pages/business/gdtad/gdtad'],
            ['id'=>'2','title'=>'金币兑换','type'=>1,'imageurl'=>'miniapp/images/my/moreicon/duihuan.png','url'=>'/pages/business/exchange/exchange'],
            ['id'=>'3','title'=>'加入我们','type'=>1,'imageurl'=>'miniapp/images/my/moreicon/jiaruwomen.png','url'=>'/pages/webview/webview?url=https%3A%2F%2Fqing.utaojs.com%2Fapp%2Findex.php%3Fi%3D3%26c%3Dentry%26id%3D1%26do%3Dindex%26m%3Djulan_qrg%26wxref%3Dmp.weixin.qq.com%23wechat_redirect'],
            ['id'=>'4','title'=>'在线客服','type'=>'kefu','imageurl'=>'miniapp/images/my/moreicon/kefu.png','url'=>'/pages/business/gdtad/gdtad'],
            ['id'=>'5','title'=>'意见建议','type'=>'jianyi','imageurl'=>'miniapp/images/my/moreicon/fankui.png','url'=>'/pages/business/gdtad/gdtad'],
        );
        $state=['state'   => '200','message'  => '我的页面更多配置','moredatatitle'  => '更多工具' ,'vipdisplay' => false ];
        $resdata=array_merge($state,array('moredata'=>$data));
    	return  $resdata ;
    }
}
