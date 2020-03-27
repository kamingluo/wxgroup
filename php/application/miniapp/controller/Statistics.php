<?php
namespace app\miniapp\controller;
use think\Db;
use think\Request;
use think\Config;

class Statistics
{
    public function statistics(Request $request)
    {

        
        $registerusers=db('user')->whereTime('create_time', 'today')->count();//今天注册用户数
        $activeusers=db('user')->whereTime('update_time', 'today')->count();//今天活跃用户数
        $builtcrowd=db('crowd')->whereTime('create_time', 'today')->count();//今天创建群数量
        $joincrowd=db('user_crowd')->where('user_type',0)->whereTime('create_time', 'today')->count();//今天加入群人数，去除创建的
        $crowd_news=db('crowd_news')->whereTime('create_time', 'today')->count();//今天发布新闻数量
        $task_record=db('task_record')->whereTime('create_time', 'today')->count();//今天上传任务兑换商品发布新闻数量
        

        
        $data = ['registerusers' =>$registerusers,'activeusers'=>$activeusers,'builtcrowd'=>$builtcrowd,'joincrowd'=>$joincrowd,'crowd_news'=>$crowd_news,'task_record'=>$task_record];
        $state=['state'   => '200','message'  => "常规数据" ];
        $resdata=array_merge($state,array('data'=>$data));
        return $resdata;
    }
    
}
