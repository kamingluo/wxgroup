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
        $task_record=db('task_record')->whereTime('create_time', 'today')->count();//今天上传任务兑换商品发布新闻数量
        $sigin=db('signin_user_data')->whereTime('create_time', 'today')->count();//今日签到用户次数
        $lottery=db('lottery_partake_list')->whereTime('create_time', 'today')->count();//今日抽奖用户次数
        
        $data = ['registerusers' =>$registerusers,'activeusers'=>$activeusers,'builtcrowd'=>$builtcrowd,'joincrowd'=>$joincrowd,'crowd_news'=>$crowd_news,
        'sigin'=>$sigin,'lottery'=>$lottery,'task_record'=>$task_record];
        $state=['state'   => '200','message'  => "常规数据" ];
        $resdata=array_merge($state,array('data'=>$data));
        return $resdata;


    }
   

}
