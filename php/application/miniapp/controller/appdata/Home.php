<?php
namespace app\miniapp\controller\appdata;
use think\Db;
use think\Request;
use think\Config;

class Home
{
    public function index(Request $request)
    {

    	return  "一点好玩" ;
    }
    
    //首页下面第三方小程序广告配置列表
    public function miniappad()
    {
       $dbdata=db('index_miniapp_ad')->where('open',0)->order('id asc')->select();
        $state=['state'   => '200','message'  => "miniappad列表查询成功" ];
        $resdata=array_merge($state,array('miniappdata'=>$dbdata));
        return $resdata ;
    }

    //首页顶部轮播图和豆腐块配置数据
     public function swiperdata(Request $request)
    {
        $channel=$request->param("channel");
        if($channel==0 || $channel==null){
          $swiperdata=db('index_swiper')->where('open',0)->where('display','<>',2)->order('id asc')->select();//自然渠道
          $message="自然渠道数据";
        }
        else{
          $swiperdata=db('index_swiper')->where('open',0)->where('display','<>',1)->order('id asc')->select();//非自然渠道
          $message="非自然渠道数据";
        }
        $state=['state'   => '200','message'  => $message ];
        $resdata=array_merge($state,array('swiperdata'=>$swiperdata));
        return $resdata ;
    }

   
}
