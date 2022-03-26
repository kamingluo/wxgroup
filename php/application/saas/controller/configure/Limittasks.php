<?php
namespace app\saas\controller\configure;
use think\Db;
use think\Request;
use qiniu\Deletefile;
class Limittasks
{
   
  //群发布的限时任务列表
   public function taskslist(Request $request){

    $token=$request->param("token");
    $pages=$request->param("pages");
    $id=havecrowdid($token);
    if($pages == 1 || $pages==null  ){
      $number=0;
    }
    else{
      $number=(($pages - 1)*10)-1 ;
    }
    $data=db('crowd_limit_tasks')->where('crowd_id',$id)->order('open ASC')->order('id DESC')->limit($number,10)->select();
    $countnumber=db('crowd_limit_tasks')->where('crowd_id',$id)->count();
    $state=['state'   => '200','message'  => "限时任务列表" ];
    $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
    return $resdata ;
    }

    //删除限时任务
    public function delete(Request $request){
      $token=$request->param("token");
      $id=$request->param("id");
      $crowd_id=havecrowdid($token);
      $data=db('crowd_limit_tasks')-> where('id', $id)-> where('crowd_id', $crowd_id)->delete();
      $state=['state'   => '200','message'  => "限时任务删除成功" ];
      $resdata=array_merge($state,array('data'=>$data));
      return $resdata ;

    }


    //修改限时任务
    public function updatestate(Request $request)
    {
        $token=$request->param("token");
        $crowd_id=havecrowdid($token);
        $id =$request->param("id");
        $open =$request->param("open");
        $dbreturn= db('crowd_limit_tasks')->where('id',$id)->where('crowd_id',$crowd_id)->update(['open' => $open]);//修改禁言状态
        $state=['state'   => '200','message'  => "修改限时任务的状态成功" ];
        return $state ;  
    }


        //修改限时任务，标题，时间
        public function updatetasks(Request $request)
        {
            $token=$request->param("token");
            $crowd_id=havecrowdid($token);
            $id =$request->param("id");
            $title =$request->param("title");
            $describe =$request->param("describe");
            $end_time =$request->param("end_time");
            $dbreturn= db('crowd_limit_tasks')->where('id',$id)->where('crowd_id',$crowd_id)->update(['title' => $title,'describe' => $describe,'end_time' => $end_time]);
            $state=['state'   => '200','message'  => "修改限时任务成功" ];
            return $state ;  
        }

    
    //限时任务群员提交任务列表
    public function usertaskslist(Request $request){
      $token=$request->param("token");
      $pages=$request->param("pages");
      $state=$request->param("state");
      $limit_id=$request->param("limit_id");
      $nickName=$request->param("nickName");
      $newkeyword="%".$nickName."%";
      $id=havecrowdid($token);
      if($pages == 1 || $pages==null  ){
        $number=0;
      }
      else{
        $number=(($pages - 1)*10)-1 ;
      }

      $data = db()->table(array('corwd_limit_task_record'=>'t1','user'=>'t2'))->field('t1.*,t2.nickName,t2.avatarUrl')->where('t2.nickName','like',$newkeyword)->where('t2.id=t1.user_id')->where('t1.limit_id',$limit_id)->where('t1.crowd_id',$id)->order('state ASC')->order('id ASC')->limit($number,10)->select();
      $countnumber = db()->table(array('corwd_limit_task_record'=>'t1','user'=>'t2'))->field('t1.*,t2.nickName,t2.avatarUrl')->where('t2.nickName','like',$newkeyword)->where('t2.id=t1.user_id')->where('t1.limit_id',$limit_id)->where('t1.crowd_id',$id)->count();
      $state=['state'   => '200','message'  => "限时任务群员提交任务列表" ];
      $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
      return $resdata ;
    }
    

    //审核任务
    public function audittask(Request $request){
      $token=$request->param("token");
      $result=$request->param("result");
      $state=$request->param("state");
      $limit_id=$request->param("limit_id");
      $id=$request->param("id");
      $time =date('Y-m-d H:i:s',time());//获取当前时间
      $crowd_id=havecrowdid($token);
      $data=db('corwd_limit_task_record')->where('limit_id',$limit_id)->where('crowd_id',$crowd_id)->where('id',$id)->where('state',0)->find();
      if($data==null){
        $state=['state'   => '400','message'  => "未找到任务或者已经审核" ];
        return $state;
      }
      if($state == 1){
        $score=$data["score"];
        $user_id=$data["user_id"];
        //修改任务状态
        $dbreturn= db('corwd_limit_task_record')->where('id',$id)->update(['state' => 1,'result' => $result]);

        //给用户相应的群积分账户加积分
        $addscore= db('user_crowd')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->setInc('score',$score);

        //给用户增加积分记录
        $user_data=db('user')->where('id',$user_id)->find(); //拿到用户信息
        $score_record_data = ['id'=>'','openid' =>$user_data["openid"],'user_id' =>$user_id,'crowd_id' =>$crowd_id,'score' =>$score,'explain' => "群限时任务奖励",'state' => 0,'create_time' =>$time];
        $score_record_id=db('score_record')->insert($score_record_data);

        $state=['state'   => '200','message'  => "审核完成，结果为通过" ];
        $resdata=array_merge($state,array('taskstate'=>'success'));
        return $resdata ;
        

      }
      else{
        //审核不通过
        $dbreturn= db('corwd_limit_task_record')->where('id',$id)->update(['state' => 2,'result' => $result]);
        $state=['state'   => '200','message'  => "审核完成，结果为不通过" ];
        $resdata=array_merge($state,array('taskstate'=>'err'));
        return $resdata;
      }

    }
    











}