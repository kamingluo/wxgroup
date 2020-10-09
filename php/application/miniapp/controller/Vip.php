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

   
    
}
