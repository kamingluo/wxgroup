<?php
namespace app\miniapp\controller\group;
use think\Db;
use think\Request;
use think\Config;

class Groupinformation
{

    //查询群详情
    public function groupdetails(Request $request)
    {
         $crowd_id=$request->param("crowd_id");
         $groupdata=db('crowd')->where('id',$crowd_id)->find(); //群信息
         $groupnumber=db('user_crowd')->where('crowd_id',$crowd_id)->count();//群人数
         $groupowner=db('user')->where('id',$groupdata["crowd_ownerid"])->find(); //群主信息
         $rule=json_decode($groupdata["rule"]);//先取出值，反转义一下
         unset($groupdata['rule']);//去除原来数据里面的值
         $newgroupdata=array_merge($groupdata,array('rule'=>$rule));//再把转义后的值增加进去
         $state=['state'   => '200','message'  => "查询群详情成功" ];
         $resdata=array_merge($state,array('groupdata'=>$newgroupdata),array('groupowner'=>$groupowner),array('groupnumber'=>$groupnumber));
         return $resdata ;
    }

     //统计群积分消耗详情
     public function statisticsscore(Request $request)
     {
         
          $crowd_id=$request->param("crowd_id");
          $allscore=db('user_crowd')->where('crowd_id',$crowd_id)->sum('score');//群当前用户总积分数
          $todayincrease=db('score_record')->where('crowd_id',$crowd_id)->where('state',0)->whereTime('create_time', 'today')->sum('score');//今日用户获得积分数
          $todayconsume=db('score_record')->where('crowd_id',$crowd_id)->where('state',1)->whereTime('create_time', 'today')->sum('score');//今日用户消耗积分数
          $yesterdayincrease=db('score_record')->where('crowd_id',$crowd_id)->where('state',0)->whereTime('create_time', 'yesterday')->sum('score');//昨日用户获得积分数
          $yesterdayconsume=db('score_record')->where('crowd_id',$crowd_id)->where('state',1)->whereTime('create_time', 'yesterday')->sum('score');//昨日用户消耗积分数
          $data = ['allscore' =>$allscore,'todayincrease'=>$todayincrease,'todayconsume'=>$todayconsume,'yesterdayincrease'=>$yesterdayincrease,'yesterdayconsume'=>$yesterdayconsume];
          $state=['state'   => '200','message'  => "群用户积分数据" ];
          $resdata=array_merge($state,array('data'=>$data));
          return $resdata;

         
     }


    //修改群信息
    public function updategroupinformation(Request $request)
    {
        $crowd_id=$request->param("id");
        $crowd_name=$request->param("crowd_name");
        $introduce=$request->param("introduce");
        $logo=$request->param("logo");

        $updateres= db('crowd')->where('id',$crowd_id)->update(['crowd_name' =>$crowd_name,'introduce' =>$introduce,'logo' =>$logo]);
        $state=['state'   => '200','message'  => "修改群信息成功" ];
        $resdata=array_merge($state,array('updateres'=>$updateres));
        return $resdata ;
    }
    

}

