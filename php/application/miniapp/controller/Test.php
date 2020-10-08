<?php
namespace app\miniapp\controller;
use think\Db;
use think\Request;
use think\Config;
use temmsg\Lotterymsg;
use think\Log;

class Test
{
    public function ceshi(Request $request)
    {

        return "ceshi";
       
        // $lottery = new Lotterymsg();
        // $lottery_id=1;
        // $goods_name="这是商品名称啊";
        // $text = $lottery -> lotterymssage($lottery_id,$goods_name);
        // return $text;

    }

    public function xiulian(Request $request)
    {

        $data=$request->param();
        Log::record('修炼测试存储');
        Log::record($data);



        return $data;
       
        // $lottery = new Lotterymsg();
        // $lottery_id=1;
        // $goods_name="这是商品名称啊";
        //https://group.gzywudao.top/php/public/miniapp.php/test/xiulian?title=title&appToken=appToken&mobile=mobile&userName=userName&userId=userId&coordinates=coordinates&longitude=longitude&latitude=latitude
        // $text = $lottery -> lotterymssage($lottery_id,$goods_name);
        // return $text;

    }
    
}
