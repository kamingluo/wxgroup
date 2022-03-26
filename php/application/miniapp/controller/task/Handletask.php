<?php
namespace app\miniapp\controller\task;
use think\Db;
use think\Request;
use think\Config;

class Handletask
{

    //管理员查询该群的任务，未处理的时间最长的
    public function taskdetails(Request $request)
    {
    	$crowd_id =$request->param("crowd_id");//群id
        $dbtaskdetails =db('task_record')->where('crowd_id',$crowd_id)->where('state',0)->order('id asc')->find();
        $state=['state'   => '200','message'  => "查询群任务成功" ];
        $ifdata=isset($dbtaskdetails);//判断检测变量是否已设置并且非 NULL
        if( $ifdata){ //不为空
             $images=json_decode($dbtaskdetails["images"]);//先取出值，反转义一下
             unset($dbtaskdetails['images']);//去除原来数据里面的值
             $taskdetails=array_merge($dbtaskdetails,array('images'=>$images));//再把转义后的值增加进去
             $resdata=array_merge($state,array('taskdetails'=>$taskdetails));
             return $resdata ;
        }
        else{ //数值为空
        	 $resdata=array_merge($state,array('taskdetails'=>$dbtaskdetails));
             return $resdata;
        }
    }


     //查询该群的全部任务，审核和未审核都任务
     public function alltasklists(Request $request)
     {
         $pages=$request->param("pages");//页数
         $crowd_id =$request->param("crowd_id");//群id
         $keyword=$request->param("keyword");//关键词
         $newkeyword="%".$keyword."%";
         if($pages){
             //有传pages
             $newpages= ($pages-1) * 20;//一页20条
             $dballtasklists =db('task_record')->where('crowd_id',$crowd_id)->where('nickName','like',$newkeyword)->order('id desc')->limit($newpages,20)->select();
         }
         else{
             //兼容没有传页数，返回全部信息
            $dballtasklists =db('task_record')->where('crowd_id',$crowd_id)->where('nickName','like',$newkeyword)->order('id desc')->select();
         }

         $count =db('task_record')->where('crowd_id',$crowd_id)->where('nickName','like',$newkeyword)->count();

         $state=['state'   => '200','message'  => "查询该群的全部任务",'count'=>$count ];
         $resdata=array_merge($state,array('alltasklists'=>$dballtasklists));
         return $resdata ;
     }


     //处理任务，分通过还是不通过
    public function handletask(Request $request)
    {
    	$id =$request->param("id");//任务id
    	$score=$request->param("score");//任务奖励金币数
    	$result=$request->param("result");//说明
    	$taskstate=$request->param("taskstate");//任务状态
    	$crowd_id=$request->param("crowd_id");//群id
    	$user_id=$request->param("user_id");//用户id
        $state=['state'   => '200','message'  => "审核任务完成" ];
        $datareturn =db('task_record')->where('id',$id)->find();
        if($datareturn["state"] != 0)
        {
        	return  "这个任务已经审核过了";
        }
        
    	if($taskstate == 1){ //任务通过
               //修改任务状态
               $dbreturn= db('task_record')->where('id',$id)->update(['state' => $taskstate,'result' => $result,'score' => $score]);

               //给用户相应的群积分账户加积分
               $addscore= db('user_crowd')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->setInc('score',$score);

               //给用户增加积分记录
               //
               //增加用户积分消耗记录
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




     //根据任务id查询任务详情
    public function querytaskdetails(Request $request)
    {
        $id =$request->param("id");//任务id
        $dbtaskdetails =db('task_record')->where('id',$id)->find();
        $state=['state'   => '200','message'  => "任务详情查询成功" ];
         $ifdata=isset($dbtaskdetails);//判断检测变量是否已设置并且非 NULL
        if( $ifdata){ //不为空
             $images=json_decode($dbtaskdetails["images"]);//先取出值，反转义一下
             unset($dbtaskdetails['images']);//去除原来数据里面的值
             $taskdetails=array_merge($dbtaskdetails,array('images'=>$images));//再把转义后的值增加进去
             $resdata=array_merge($state,array('taskdetails'=>$taskdetails));
             return $resdata ;
        }
        else{ //数值为空
             $resdata=array_merge($state,array('taskdetails'=>$dbtaskdetails));
             return $resdata;
        }
       
    }


    //任务排行榜，0是全部，1是审核通过，2是审核不通过排行
    public function rankinglist(Request $request)
    {
      $crowd_id =$request->param("crowd_id");//群id
      $state =$request->param("state");//状态
      $pages=$request->param("pages");
      if($pages == 1 || $pages==null  ){
          $number=0;
        }
      else{
        $number=(($pages - 1)*10)-1 ;
      }
      if($state == 0){
        $countnumber=db('task_record')->where('crowd_id',$crowd_id)->group('user_id')->count();//总任务数
        $sql="SELECT b.id,b.nickName,b.avatarUrl,count( a.user_id ) AS count FROM task_record a,user b  where crowd_id =".$crowd_id." and a.user_id=b.id GROUP BY a.user_id ORDER BY count DESC LIMIT ".$number.",10;";
        $data = Db::query($sql); //拿到数据
      }
      else{
        $countnumber=db('task_record')->where('crowd_id',$crowd_id)->where('state',$state)->group('user_id')->count();//通过或者不通过任务数
        $sql="SELECT b.id,b.nickName,b.avatarUrl,count( a.user_id ) AS count FROM task_record a,user b  where crowd_id =".$crowd_id." and a.user_id=b.id and state=".$state." GROUP BY a.user_id ORDER BY count DESC LIMIT ".$number.",10;";
        $data = Db::query($sql); //拿到数据
      }

      $returnstate=['state'   => '200','message'  => "群排行查询成功" ];
      $resdata=array_merge($returnstate,array('count'=>$countnumber),array('rankinglist'=>$data));
      return $resdata ;

    }







    

}

