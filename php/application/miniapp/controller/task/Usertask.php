<?php
namespace app\miniapp\controller\task;
use think\Db;
use think\Request;
use think\Config;

class Usertask
{

    //查询用户的任务列表
    public function usertasklist(Request $request)
    {
    	$wxcode =$request->param("code");
        $openid=openid($wxcode);
        $pages=$request->param("pages");//页数
        if($pages){
            //有传pages
            $newpages= ($pages-1) * 20;//一页20条
            $usertasklist =db('task_record')->where('openid',$openid)->order('id desc')->limit($newpages,20)->select();
        }
        else{
            //兼容没有传页数，返回全部信息
            $usertasklist =db('task_record')->where('openid',$openid)->order('id desc')->select();
        }

        $count =db('task_record')->where('openid',$openid)->count();

        $state=['state'   => '200','message'  => "查询用户的任务列表数据成功" ,'count'=>$count];
        $resdata=array_merge($state,array('usertasklist'=>$usertasklist));
        return $resdata ;
      
    }



    //删除群任务
    public function deletetask(Request $request)
    {
      $crowd_id =$request->param("crowd_id");
      $user_id =$request->param("user_id");
      $task_id=$request->param("task_id");
      $cleardata=db('task_record')-> where('id',$task_id)-> where('user_id',$user_id)-> where('crowd_id',$crowd_id)->delete();
      $state=['state'   => '200','message'  => "删除任务成功",'cleardata' => $cleardata];
      return  $state;
    
    }


    

     //用户提交任务
    public function usersubmittask(Request $request)
    {

      // $imagesdata =$request->param("images/a");
      // $explain =$request->param("explain");
      // return  json_encode($imagesdata);
       
        $wxcode =$request->param("code");
        $openid=openid($wxcode);
        //$score =$request->param("score");
        $explain =$request->param("explain");
        $crowd_id =$request->param("crowd_id");
        $crowd_name =$request->param("crowd_name");
        $imagesdata =$request->param("images/a");
        // $images= htmlspecialchars_decode($imagesdata);
        $images =  json_encode($imagesdata);
        $time =date('Y-m-d H:i:s',time());//获取当前时间
        $userdata=db('user')->where('openid',$openid)->find();//查询用户信息
  
        $dbdata = ['id'=>'','openid' =>$openid,'user_id' =>$userdata["id"],'channel' =>$userdata["channel"],'score' =>0,'explain' =>$explain,'crowd_id' =>$crowd_id,'crowd_name' =>$crowd_name,'nickName' =>$userdata["nickName"],'avatarUrl' =>$userdata["avatarUrl"],'images' =>$images,'result' =>null,'state' =>0,'create_time' =>$time];
        	 $dbreturn=db('task_record')->insert($dbdata);

        $state=['state'   => '200','message'  => "提交任务成功" ];
        $resdata=array_merge($state,array('dbreturn'=>$dbreturn));
        return $resdata ;
    }
    

}

