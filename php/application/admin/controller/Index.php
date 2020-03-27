<?php
namespace app\admin\controller;
use think\Db;
use think\Config;

class Index
{


    public function channeldata()
    {
        
        $sql = "select count(1) as count,a.channel,b.name from user a,channel b where a.channel=b.channel group by a.channel ORDER BY count DESC;";
        $data = Db::query($sql); //拿到数据
        $allusersnumber=db('user')->count();//总注册用户数
        $state=['state'   => '200','message'  => "渠道注册用户数" ];
        $resdata=array_merge($state,array('allusersnumber'=>$allusersnumber),array('data'=>$data));
        return $resdata;
        
    }

    // public function usersdata()
    // {
    //     $allusersnumber=db('user')->count();//总注册用户数
    //     $todayregisterusersnumber=db('user')->whereTime('create_time', 'today')->count();//今天注册用户数
    //     $todayactiveusersnumber=db('user')->whereTime('updata_time', 'today')->count();//今天活跃用户数
    //     $todaypupilnumber=db('tribute_table')->whereTime('create_time', 'today')->count();//今天收徒数
    //     $yesterdayregisterusersnumber=db('user')->whereTime('create_time', 'yesterday')->count();//昨天注册用户数
    //     $yesterdayactiveusersnumber=db('user')->whereTime('updata_time', 'yesterday')->count();//昨天活跃用户数
    //     $yesterdaypupilnumber=db('tribute_table')->whereTime('create_time', 'yesterday')->count();//昨天收徒数
    //     $data = ['allusersnumber' =>$allusersnumber,'todayregisterusersnumber'=>$todayregisterusersnumber,'todayactiveusersnumber'=>$todayactiveusersnumber,'todaypupilnumber'=>$todaypupilnumber,'yesterdayregisterusersnumber'=>$yesterdayregisterusersnumber,'yesterdayactiveusersnumber'=>$yesterdayactiveusersnumber,'yesterdaypupilnumber'=>$yesterdaypupilnumber];
    //     $state=['state'   => '200','message'  => "用户数据" ];
    //     $resdata=array_merge($state,array('data'=>$data));
    //     return $resdata;
    // }


   
   
}
