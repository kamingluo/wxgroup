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
        $crowd_id=14;
        $time =date('Y-m-d H:i:s',time());//获取当前时间
        $coin=30;//奖励金币数
        //根据群id查群主id
        $dbuserid =db('user_crowd')->where('user_type',1)->where('crowd_id',$crowd_id)->value('user_id');//查询群的群主用户id
        $dbuser =db('user')->where('id',$dbuserid)->find();//查询群主的用户信息
        $openid=$dbuser['openid'];//群主openid
        $channel=$dbuser['channel'];//群主openid
        //加积分
        $addscore= db('user')->where('openid',$openid)->setInc('coin',$coin);
        //增加积分变化记录
        $datares = ['id'=>'','user_id' =>$dbuserid,'openid' =>$openid,'coin' =>$coin,'explain' =>"邀请入群",'channel' =>$channel,'state' =>0,'create_time' =>$time];
        $data=db('coin_record')->insert($datares);

        return $data;







        // $lottery = new Lotterymsg();
        // $lottery_id=1;
        // $goods_name="这是商品名称啊";
        // $text = $lottery -> lotterymssage($lottery_id,$goods_name);
        // return $text;

    }
    
}
