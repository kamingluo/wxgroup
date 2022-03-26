<?php
namespace app\saas\controller\configure;
use think\Db;
use think\Request;
use qiniu\Deletefile;
class Tasks
{
   
    //任务列表,所有未审核的
   public function taskslist(Request $request){

    $token=$request->param("token");
    $pages=$request->param("pages");
    $id=havecrowdid($token);
    if($pages == 1 || $pages==null  ){
      $number=0;
    }
    else{
      $number=($pages - 1)*10);
    }
    $data=db('task_record')->where('crowd_id',$id)->where('state',0)->order('id ASC')->limit($number,10)->select();
    $countnumber=db('task_record')->where('crowd_id',$id)->where('state',0)->count();
    $state=['state'   => '200','message'  => "任务查询成功" ];
    $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
    return $resdata ;
    }


   //删除一条任务
   public function deletetask(Request $request){
        $token=$request->param("token");
        $crowd_id=havecrowdid($token);
        $id=$request->param("id");
        $data=db('task_record')-> where('id', $id)-> where('crowd_id', $crowd_id)->delete();
        $state=['state'   => '200','message'  => "任务删除成功" ];
        $resdata=array_merge($state,array('data'=>$data));
        return $resdata ;
   }



    //处理任务，分通过还是不通过
  public function handletask(Request $request)
  {

      $token =$request->param("token");//任务id
      $crowd_id=havecrowdid($token);

      $id =$request->param("id");//任务id
      $score=$request->param("score");//任务奖励金币数
      $result=$request->param("result");//说明
      $taskstate=$request->param("taskstate");//任务状态
      $user_id=$request->param("user_id");//用户id

      $state=['state'   => '200','message'  => "审核任务完成" ];
      $datareturn =db('task_record')->where('id',$id)->find();
      if($datareturn["state"] != 0 || $datareturn ==null)
      {
        $state=['state'   => '400','message'  => "这个任务已经审核过了或任务不存在" ];
        return  $state;
        die ();
      }
      if($taskstate == 1){
            //修改任务状态
            $dbreturn= db('task_record')->where('id',$id)->update(['state' => $taskstate,'result' => $result,'score' => $score]);

            //给用户相应的群积分账户加积分
            $addscore= db('user_crowd')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->setInc('score',$score);

            //给用户增加积分记录
            $time =date('Y-m-d H:i:s',time());//获取当前时间
            $user_data=db('user')->where('id',$user_id)->find(); //拿到用户信息

            $score_record_data = ['id'=>'','openid' =>$user_data["openid"],'user_id' =>$user_id,'crowd_id' =>$crowd_id,'score' =>$score,'explain' => "群任务奖励",'state' =>0,'create_time' =>$time];
            $score_record_id=db('score_record')->insert($score_record_data);
            $resdata=array_merge($state,array('taskstate'=>'success'));
            return $resdata ;
      }
      else{
            $dbreturn= db('task_record')->where('id',$id)->update(['state' => $taskstate,'result' => $result]);
            $resdata=array_merge($state,array('taskstate'=>'fail'));
            return $resdata ;
      }
        
  }
   








}