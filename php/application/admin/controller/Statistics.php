<?php


namespace app\admin\controller;
use think\Db;
use think\Request;
use think\Exception;
use think\Log;

class Statistics
{
   
    //统计前一天的相关数据，一般是凌晨执行
    public function statistics()
    {

        set_time_limit(0);//设置超时时间
        $registerusers=db('user')->whereTime('create_time', 'today')->count();//今天注册用户数
        $activeusers=db('user')->whereTime('update_time', 'today')->count();//今天活跃用户数
        $builtcrowd=db('crowd')->whereTime('create_time', 'today')->count();//今天创建群数量
        $joincrowd=db('user_crowd')->where('user_type',0)->whereTime('create_time', 'today')->count();//今天加入群人数，去除创建的
        $crowd_news=db('crowd_news')->whereTime('create_time', 'today')->count();//今天发布新闻数量
        $task_record=db('task_record')->whereTime('create_time', 'today')->count();//今天上传任务
        $sigin=db('signin_user_data')->whereTime('create_time', 'today')->count();//今日签到用户次数
        $lottery=db('lottery_partake_list')->whereTime('create_time', 'today')->count();//今日抽奖用户次数


        $clickbanner=db('click_gdt_ad')->where('adtype',1)->whereTime('create_time', 'today')->count();//今日点击banner数
        $seevideo=db('click_gdt_ad')->where('adtype',2)->whereTime('create_time', 'today')->count();//今日观看完成视频数
        $clickgrid=db('click_gdt_ad')->where('adtype',3)->whereTime('create_time', 'today')->count();//今日点击格子广告数
        $clickvideo=db('click_gdt_ad')->where('adtype',4)->whereTime('create_time', 'today')->count();//今日点击视频广告数
        $clickcustom=db('click_gdt_ad')->where('adtype',5)->whereTime('create_time', 'today')->count();//今日点击模板广告数
        $clickxmad=db('click_gdt_ad')->where('adtype',6)->whereTime('create_time', 'today')->count();//今日点击小盟广告数


        
        $data = ['registerusers' =>$registerusers,'activeusers'=>$activeusers,'builtcrowd'=>$builtcrowd,'joincrowd'=>$joincrowd,'crowd_news'=>$crowd_news,
        'sigin'=>$sigin,'lottery'=>$lottery,'task_record'=>$task_record,'clickbanner'=>$clickbanner,'seevideo'=>$seevideo,'clickgrid'=>$clickgrid,'clickvideo'=>$clickvideo,'clickcustom'=>$clickcustom,'clickxmad'=>$clickxmad];
        $state=['state'   => '200','message'  => "常规数据" ];
        $resdata=array_merge($state,array('data'=>$data));
        return $resdata;


    }
   

}
