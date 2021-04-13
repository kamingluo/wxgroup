<?php
namespace app\miniapp\controller\group;
use think\Db;
use think\Request;
use think\Config;

class Limittask
{

    //发布限时任务
    public function pushlimittask(Request $request)
    {
        $wxcode =$request->param("code");
        $openid=openid($wxcode);
        $crowd_id=$request->param("crowd_id");
        $title=$request->param("title");
        $describe=$request->param("describe");
        $number=$request->param("number");
        $score=$request->param("score");
        $limit=$request->param("limit");
        $stepdata =$request->param("step/a");
        $step =  json_encode($stepdata);
        $end_time=$request->param("end_time");
        $open=$request->param("open");
        $time =date('Y-m-d H:i:s',time());
        $dbdata = ['id'=>'','crowd_id' =>$crowd_id,'title' => $title,'describe' => $describe,'number' => $number,'score' => $score,'limit' => $limit,'step' => $step,'end_time' => $end_time,'open' => $open,'create_time' =>$time];
        $limit_tasks_id= db('crowd_limit_tasks')->insertGetId($dbdata);//返回自增ID
        $state=['state'   => '200','message'  => "发布限时任务成功" ];
        $resdata=array_merge($state,array('limit_tasks_id'=>$limit_tasks_id));
        return $resdata ;

    }



    //查询群的限时任务列表
    public function list(Request $request)
    {
        $crowd_id =$request->param("crowd_id");
        $open =$request->param("open");
        if($open != 1 || $open != 0){
            //查询全部
            $data =db('crowd_limit_tasks')->field('id,title,describe,score,number,limit,end_time,create_time,open')->where('crowd_id',$crowd_id)->order('id desc')->select(); //取出最近100条聊天记录
        } 
        else{
            $data =db('crowd_limit_tasks')->field('id,title,describe,score,number,limit,end_time,create_time,open')->where('crowd_id',$crowd_id)->where('open',0)->order('id desc')->select(); //取出最近100条聊天记录
        }

        $state=['state'   => '200','message'  => "查询群的限时任务列表" ];
        $resdata=array_merge($state,array('data'=>$data));
        return $resdata ;  
    }


    //查询限时任务详情
    public function details(Request $request)
    {
        $id =$request->param("id");
        $data =db('crowd_limit_tasks')->where('id',$id)->find();
        $step=json_decode($data["step"]);//先取出值，反转义一下
        unset($data['step']);//去除原来数据里面的值
        $newsdetails=array_merge($data,array('step'=>$step));//再把转义后的值增加进去
        $state=['state'   => '200','message'  => "查询限时任务详情成功" ];
        $resdata=array_merge($state,array('newsdetails'=>$newsdetails));
        return $resdata ;
    }

    //修改限时任务的状态
    public function updatestate(Request $request)
    {
        $id =$request->param("id");
        $state =$request->param("state");
        $dbreturn= db('crowd_limit_tasks')->where('id',$id)->update(['state' => $state]);//修改禁言状态
        $state=['state'   => '200','message'  => "修改限时任务的状态成功" ];
        return $state ;  
    }


    
    //删除限时任务公告
    public function delete(Request $request)
    {
        $crowd_id =$request->param("crowd_id");
        $id =$request->param("id");
        $cleardata=db('crowd_limit_tasks')-> where('id',$id)-> where('crowd_id',$crowd_id)->delete();//删除限时任务
        $clearrecord=db('corwd_limit_task_record')-> where('limit_id',$limit_id)-> where('crowd_id',$crowd_id)->delete();//删除限时任务已经完成记录

       if($cleardata ==1){
            $state=['state'   => '200','message'  => "删除成功"];
       }
       else{
            $state=['state'   => '400','message'  => "删除失败"];
       }
       return  $state;
    }

    //用户查询自己是否能参与
    public function ifpartake(Request $request){
        $user_id =$request->param("user_id");
        $limit_id=$request->param("limit_id");
        $data=db('crowd_limit_tasks')->where('limit_id',$limit_id)->find();
        $time =date('Y-m-d H:i:s',time());//当前时间
        $partake=false;

        $open=$data["open"];
        if($open != 0 ){
            $state=['state'   => '200','message'  => "任务已经关闭",'partake'=> $partake];
            return $state;
        }

        $end_time=$data["end_time"];
        if($time > $end_time ){
            $state=['state'   => '200','message'  => "超过限时任务时间不能参加",'partake'=> $partake];
            return $state;
        }

        $number=$data["number"];
        if($number != 0){
            //查询已经完成得任务数
            $recordnum=db('corwd_limit_task_record')->where('limit_id',$limit_id)->count();//拿到已经完成任务人数
            if($recordnum >= $number){
                $state=['state'   => '200','message'  => "任务数量已经完成了，不能再做任务了",'partake'=> $partake];
                return $state;
            }
        }

        $limit=$data["limit"];//0每人一次，1每天1次

        if($limit == 0){
            //查询用户是否完成过任务
            $userrecordnum=db('corwd_limit_task_record')->where('limit_id',$limit_id)->where('user_id',$user_id)->count();
            if($userrecordnum > 0){
                $state=['state'   => '200','message'  => "只能完成一次，用户已经完成过任务了",'partake'=> $partake];
                return $state;
            }
        }
        if($limit == 1){
            $usertodayrecordnum=db('corwd_limit_task_record')->where('limit_id',$limit_id)->where('user_id',$user_id)->whereTime('create_time', 'today')->count();
            if($usertodayrecordnum > 0){
                $state=['state'   => '200','message'  => "任务每天只能完成一次，用户今天已经完成过任务了",'partake'=> $partake];
                return $state;
            }
        }

        $state=['state'   => '200','message'  => "用户可以完成任务",'partake'=> true];
        return $state;

    }




}
