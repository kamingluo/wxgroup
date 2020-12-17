<?php
namespace app\miniapp\controller;
use think\Db;
use think\Request;
use think\Config;

class Index
{
    public function index(Request $request)
    {

    	return  "社群积分助手" ;
    }

    public function indextankuang(Request $request)
    {
        $data['imageurl']="www.baidu.com";
        $data['text']="这是提示文案啊";
        $data['open']=0;

        $state=['state'   => '200','message'  => "miniappad列表查询成功" ];
        $resdata=array_merge($state,array('data'=>$data));

    	return  $resdata ;
    }
    
}
