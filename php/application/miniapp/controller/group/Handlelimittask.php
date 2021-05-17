<?php
namespace app\miniapp\controller\group;
use think\Db;
use think\Request;
use think\Config;

class Handlelimittask
{

    //查询该群的全部限时任务
    public function pushlimittask(Request $request)
    {
      $pages=$request->param("pages");//页数
      $crowd_id =$request->param("crowd_id");//群id
      $keyword=$request->param("keyword");//关键词
      $newkeyword="%".$keyword."%";
      if($pages){
          //有传pages
          $newpages= ($pages-1) * 20;//一页20条
          //$dballtasklists =db('corwd_limit_task_record')->where('crowd_id',$crowd_id)->where('nickName','like',$newkeyword)->order('id desc')->limit($newpages,20)->select();
          $dballtasklists = db()->table(array('corwd_limit_task_record'=>'t1','user'=>'t2'))->field('t1.*,t2.nickName,t2.avatarUrl')->where('t1.user_id=t2.id')->where('t1.crowd_id',$crowd_id)->where('t2.nickName','like',$newkeyword)->order('id desc')->limit($newpages,20)->select();
      }
      else{
          //兼容没有传页数，返回全部信息
          $dballtasklists = db()->table(array('corwd_limit_task_record'=>'t1','user'=>'t2'))->field('t1.*,t2.nickName,t2.avatarUrl')->where('t1.user_id=t2.id')->where('t1.crowd_id',$crowd_id)->where('t2.nickName','like',$newkeyword)->order('id desc')->select();
      }

      $count =db()->table(array('corwd_limit_task_record'=>'t1','user'=>'t2'))->field('t1.*,t2.nickName,t2.avatarUrl')->where('t1.user_id=t2.id')->where('t1.crowd_id',$crowd_id)->where('t2.nickName','like',$newkeyword)->count();

      $state=['state'   => '200','message'  => "查询该群的全部限时任务",'count'=>$count ];
      $resdata=array_merge($state,array('alltasklists'=>$dballtasklists));
      return $resdata ;

    }

    //根据任务id查询任务详情
    public function querytaskdetails(Request $request)
    {
        $id =$request->param("id");//任务id
        // $dbtaskdetails =db('task_record')->where('id',$id)->find();
        $dbtaskdetails =db()->table(array('corwd_limit_task_record'=>'t1','user'=>'t2'))->field('t1.*,t2.nickName,t2.avatarUrl')->where('t1.user_id=t2.id')->where('t1.id',$id)->find();
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

    //查询群的限时任务列表
    public function tasklist(Request $request)
    {
        $crowd_id =$request->param("crowd_id");
        $open =$request->param("open");
        $pages =$request->param("pages");
        $newpages= ($pages-1) * 20;//一页20条
        $data =db('crowd_limit_tasks')->field('id,title,describe,score,number,limit,end_time,create_time,open')->where('crowd_id',$crowd_id)->where('open',0)->limit($newpages,20)->order('id desc')->select();
        $count =db('crowd_limit_tasks')->where('crowd_id',$crowd_id)->where('open',0)->limit($newpages,20)->count();
        $state=['state'   => '200','message'  => "查询群的限时任务列表" ,'count'=>$count ];
        $resdata=array_merge($state,array('data'=>$data));
        return $resdata ;  
    }
    

     //管理员查询该群的某一个限时任务，未处理的时间最长的
     public function taskdetails(Request $request)
     {
         $crowd_id =$request->param("crowd_id");//群id
         $limit_id =$request->param("limit_id");//群id
         $dbtaskdetails =db()->table(array('corwd_limit_task_record'=>'t1','user'=>'t2'))->field('t1.*,t2.nickName,t2.avatarUrl')->where('t1.user_id=t2.id')->where('t1.crowd_id',$crowd_id)->where('t1.limit_id',$limit_id)->where('t1.state=0')->order('t1.id asc')->find();
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


    //处理任务，分通过还是不通过
    public function handletask(Request $request)
    {
    	$id =$request->param("id");//限时任务id
    	$result=$request->param("result");//说明
    	$taskstate=$request->param("taskstate");//任务状态
    	$crowd_id=$request->param("crowd_id");//群id
        $state=['state'   => '200','message'  => "审核任务完成" ];
        $datareturn =db('corwd_limit_task_record')->where('id',$id)->find();
        if($datareturn["state"] != 0)
        {
        	$state=['state'   => '400','message'  => "未找到任务或者已经审核" ];
            return $state;
        }
        
    	if($taskstate == 1){ //任务通过

            //修改任务状态
            $dbreturn= db('corwd_limit_task_record')->where('id',$id)->update(['state' => $taskstate,'result' => $result]);

            //给用户相应的群积分账户加积分
            $addscore= db('user_crowd')->where('user_id',$datareturn["user_id"])->where('crowd_id',$crowd_id)->setInc('score',$datareturn["score"]);

            //给用户增加积分记录
            $time =date('Y-m-d H:i:s',time());//获取当前时间
            $user_data=db('user')->where('id',$datareturn["user_id"])->find(); //拿到用户信息

            $score_record_data = ['id'=>'','openid' =>$user_data["openid"],'user_id' =>$user_data["id"],'crowd_id' =>$crowd_id,'score' =>$datareturn["score"],'explain' => "群限时任务奖励",'state' =>0,'create_time' =>$time];
            $score_record_id=db('score_record')->insert($score_record_data);
            $resdata=array_merge($state,array('taskstate'=>'success'));
            return $resdata ;
    	}
    	else{
            $dbreturn= db('corwd_limit_task_record')->where('id',$id)->update(['state' => 2,'result' => $result]);
            $state=['state'   => '200','message'  => "审核完成，结果为不通过" ];
            $resdata=array_merge($state,array('taskstate'=>'err'));
            return $resdata;
    	}
        
    }


}
