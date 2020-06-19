<?php


namespace app\admin\controller;
use think\Db;
use think\Request;
class Clear
{
    //定时清理
    public function timingclear()
    {

        // return  "定时清理" ;
        $time =date('Y-m-d H:i:s',time());//获取当前时间
        $weekend=date("Y-m-d H:i:s", strtotime('-3 days'));//获取三天时间
        $seven=date("Y-m-d H:i:s", strtotime('-7 days'));//获取7天时间
        $onemonth=date("Y-m-d H:i:s", strtotime('-30 days'));//获取30天时间



        //清理30天前的聊天记录
        $chat=db('chat_data')-> where('create_time','< time', $onemonth)->delete();

        //广点通广告30天数据清理
        $gdt=db('coin_record')-> where('create_time','< time', $onemonth)->delete();

        //推送记录30天
        $temmsg=db('temmsg')-> where('create_time','< time', $onemonth)->delete();


        //30天签到记录
        $sigin=db('signin_user_data')-> where('create_time','< time', $onemonth)->delete();

         //广点通点击30天数据清理
        $clickgdt=db('gdt_ad_record')-> where('create_time','< time', $onemonth)->delete();

        if($chat >= 0&&$gdt >= 0 && $temmsg >=0 && $sigin >= 0){
             return " 共清理聊天记录-->".$chat. "    广点通数据-->" .$gdt ."    推送数据-->" .$temmsg ."    签到数据-->". $sigin.   "     广点通点击数据-->" .$clickgdt;
        }
        else{
             return "清理失败";
        }

    }


}
