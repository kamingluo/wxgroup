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
    public function tasklist(Request $request)
    {
        $crowd_id =$request->param("crowd_id");
        $open =$request->param("open");
        if($open != 1 || $open != 0){
            //查询全部
            $data =db('crowd_limit_tasks')->field('id,title,describe,score,number,limit,end_time,create_time,open')->where('crowd_id',$crowd_id)->order('id desc')->select(); 
        } 
        else{
            $data =db('crowd_limit_tasks')->field('id,title,describe,score,number,limit,end_time,create_time,open')->where('crowd_id',$crowd_id)->where('open',0)->order('id desc')->select();
        }

        $state=['state'   => '200','message'  => "查询群的限时任务列表" ];
        $resdata=array_merge($state,array('data'=>$data));
        return $resdata ;  
    }


    //查询限时任务详情
    public function details(Request $request)
    {
        $id =$request->param("id");
        $time =date('Y-m-d H:i:s',time());//当前时间
        $data =db('crowd_limit_tasks')->where('id',$id)->find();
        $end_time=$data['end_time'];
        $number=floor((strtotime($end_time) - strtotime($time))/86400) + 1; //拿到剩余天数
        $recordnum=db('corwd_limit_task_record')->where('limit_id',$id)->where('state',"<>",2)->count();//拿到已经完成或者提交任务人数
        $taskdata=array();//临时数组用于签名
        $taskdata["surplusday"]=$number;
        $taskdata["recordnum"]=$recordnum;
        $step=json_decode($data["step"]);//先取出值，反转义一下
        unset($data['step']);//去除原来数据里面的值
        $newsdetails=array_merge($data,array('step'=>$step));//再把转义后的值增加进去
        $state=['state'   => '200','message'  => "查询限时任务详情成功" ];
        $resdata=array_merge($state,array('newsdetails'=>$newsdetails),array('taskdata'=>$taskdata));
        return $resdata ;
    }

    //修改限时任务的状态
    public function updatestate(Request $request)
    {
        $id =$request->param("id");
        $state =$request->param("state");
        $dbreturn= db('crowd_limit_tasks')->where('id',$id)->update(['open' => $state]);//修改禁言状态
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


    //用户提交限时任务
    public function userpushlimittask(Request $request)
    {
        $user_id =$request->param("user_id");
        $limit_id=$request->param("limit_id");
        $explain=$request->param("explain");
        $imagesdata =$request->param("images/a");
        $images =  json_encode($imagesdata);
        $state=0;
        $data=db('crowd_limit_tasks')->where('id',$limit_id)->find();
        $crowd_id=$data["crowd_id"];
        $score=$data["score"];
        $time =date('Y-m-d H:i:s',time());//当前时间

        $dbdata = ['id'=>'','limit_id' =>$limit_id,'user_id' => $user_id,'crowd_id' => $crowd_id,'score' => $score,'explain' => $explain,'images' => $images,'state' => 0,'create_time' =>$time];
        $limit_tasks_record_id= db('corwd_limit_task_record')->insertGetId($dbdata);//返回自增ID
        $state=['state'   => '200','message'  => "用户提交限时任务成功" ];
        $resdata=array_merge($state,array('limit_tasks_record_id'=>$limit_tasks_record_id));
        return $resdata ;
    }

    //用户查询自己是否能参与
    public function ifpartake(Request $request)
    {
        $user_id =$request->param("user_id");
        $limit_id=$request->param("limit_id");
        $data=db('crowd_limit_tasks')->where('id',$limit_id)->find();
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



    //用户查询自己已经提交的限时任务列表
    public function usertasklist(Request $request)
    {
        $user_id =$request->param("user_id");
        $crowd_id =$request->param("crowd_id");
        $pages=$request->param("pages");//页数
        if($pages){
            //有传pages
            $newpages= ($pages-1) * 20;//一页20条
            $usertasklist = db()->table(array('corwd_limit_task_record'=>'t1','crowd_limit_tasks'=>'t2'))->field('t1.id,t1.limit_id,t1.score,t1.state,t1.result,t1.create_time,t2.title')->where('t2.id=t1.limit_id')->where('t1.crowd_id',$crowd_id)->where('t1.user_id',$user_id)->order('id desc')->limit($newpages,20)->select();
        }
        else{
            //兼容没有传页数，返回全部信息
            $usertasklist = db()->table(array('corwd_limit_task_record'=>'t1','crowd_limit_tasks'=>'t2'))->field('t1.id,t1.limit_id,t1.score,t1.state,t1.result,t1.create_time,t2.title')->where('t2.id=t1.limit_id')->where('t1.crowd_id',$crowd_id)->where('t1.user_id',$user_id)->order('id desc')->select();
        }

        $count =db('corwd_limit_task_record')->where('crowd_id',$crowd_id)->where('user_id',$user_id)->count();

        $state=['state'   => '200','message'  => "用户查询自己已经提交的限时任务列表成功" ,'count'=>$count];
        $resdata=array_merge($state,array('usertasklist'=>$usertasklist));
        return $resdata ;
        
    }


    //用户查询自己的限时任务的详情
    public function userlimittaskdetails(Request $request){
        $id =$request->param("id");
        $data=db('corwd_limit_task_record')->where('id',$id)->find();s
        $images=json_decode($data["images"]);//先取出值，反转义一下s
        unset($data['images']);//去除原来数据里面的值
        $newsdetails=array_merge($data,array('images'=>$images));//再把转义后的值增加进去
        $state=['state'   => '200','message'  => "用户查询自己的限时任务的详情成功" ];
        $resdata=array_merge($state,array('data'=>$newsdetails));
        return $resdata ;
    }




















}
