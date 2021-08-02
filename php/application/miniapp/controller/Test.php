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

        $crowd_id=3514;
        $listdata =db('score_record')->where('crowd_id',$crowd_id)->where('id','>',369644)->where('id','<',370069)->where('explain','群限时任务奖励')->select(); //取出最近100条聊天记录
        $count = count($listdata);//拿到数值条数
        $num=1;
        foreach($listdata as $count  => $data){
            $user_id=$data["user_id"];
            $score=$data["score"];
            Log::record('---------------------------');
            Log::record($num);
            Log::record($user_id);
            Log::record($score);
            Log::record('---------------------------');
            // $addscore= db('user_crowd')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->setInc('score',$score);
            $num=$num +1;

        }

        return $listdata;
       
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
