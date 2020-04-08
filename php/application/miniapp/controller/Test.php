<?php
namespace app\miniapp\controller;
use think\Db;
use think\Request;
use think\Config;
use temmsg\Lotterymsg;

class Test
{
    public function ceshi(Request $request)
    {
        $lottery = new Lotterymsg();
        $lottery_id=1;
        $goods_name="这是商品名称啊";
        $text = $lottery -> lotterymssage($lottery_id,$goods_name);
        return $text;

    }
    
}
