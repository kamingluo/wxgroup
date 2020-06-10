<?php
namespace app\miniapp\controller\group;
use think\Db;
use think\Request;
use think\Config;
use think\log;

class Handlegroup
{

    //查询群用户列表
    public function groupuserlist(Request $request)
    {
    	$crowd_id=$request->param("crowd_id");//群id
    	$pages=$request->param("pages");
        // $endnumber=$pages*10 ; //结束查询条数
        $endnumber=$pages*1000 ; //结束查询条数，暂时设置为1000，因为没做分页
        // $startnumber=$endnumber -10;//开始查询条数
        $startnumber = 0;//开始查询条数，因为没做分页
        $sql = "select user.*,user_crowd.user_type,user_crowd.score,user_crowd.remarks,user_crowd.create_time as joincrowd_time from user,user_crowd where user.id=user_crowd.user_id and user_crowd.crowd_id = ".$crowd_id." order BY user_crowd.score desc LIMIT ".$startnumber.",".$endnumber.";";
        $groupuserlist = Db::query($sql); //拿到数据
        $count =db('user_crowd')->where('crowd_id',$crowd_id)->count();
        $state=['state'   => '200','message'  => "查询群用户列表成功",'count'=>$count ];
        $resdata=array_merge($state,array('groupuserlist'=>$groupuserlist));
        return $resdata ;

    }


     //查询群用户列表
     public function newgroupuserlist(Request $request)
     {
         $crowd_id=$request->param("crowd_id");//群id
         $pages=$request->param("pages");
         $endnumber=$pages*10 ; //结束查询条数
         $startnumber=$endnumber -10;//开始查询条数
         $sql = "select user.*,user_crowd.user_type,user_crowd.score,user_crowd.remarks,user_crowd.create_time as joincrowd_time from user,user_crowd where user.id=user_crowd.user_id and user_crowd.crowd_id = ".$crowd_id." order BY user_crowd.user_type=1 desc,user_crowd.user_type desc,user_crowd.score desc LIMIT ".$startnumber.",".$endnumber.";";
         $groupuserlist = Db::query($sql); //拿到数据
         $count =db('user_crowd')->where('crowd_id',$crowd_id)->count();
         $state=['state'   => '200','message'  => "查询群用户列表成功",'count'=>$count ];
         $resdata=array_merge($state,array('groupuserlist'=>$groupuserlist));
         return $resdata ;
 
     }

    




    

     //根据用户昵称模糊查询
    public function querygroupuser(Request $request)
    {
        $crowd_id=$request->param("crowd_id");//群id
        $nickName=$request->param("nickName");
        $sql = "select user.*,user_crowd.user_type,user_crowd.score,user_crowd.create_time as joincrowd_time from user,user_crowd where user.id=user_crowd.user_id and user_crowd.crowd_id = " .$crowd_id. " and user.nickName  LIKE '%".$nickName."%' order BY user_crowd.score desc;";
        // return $sql;
        $querygroupuser = Db::query($sql); //拿到数据
        $state=['state'   => '200','message'  => "根据用户昵称模糊查询成功" ];
        $resdata=array_merge($state,array('querygroupuser'=>$querygroupuser));
        return $resdata ;

    }



     //查询该群7天之内过生日的人
    public function querybirthday(Request $request)
    {
        $crowd_id=$request->param("crowd_id");//群id

        $sql = "select  user.*,user_crowd.user_type,user_crowd.score,user_crowd.create_time as joincrowd_time from user,user_crowd where (( DATE_FORMAT(birthday,'%m-%d'))-( DATE_FORMAT(curdate(),'%m-%d'))) <= 7 and (( DATE_FORMAT(birthday,'%m-%d'))-( DATE_FORMAT(curdate(),'%m-%d'))) >= 0  and user.id=user_crowd.user_id and user_crowd.crowd_id = " .$crowd_id. " order BY ( DATE_FORMAT(birthday,'%m-%d')) asc;";
        // return $sql;
        $querybirthday = Db::query($sql); //拿到数据
        $state=['state'   => '200','message'  => "查询该群7天之内过生日的人" ];
        $resdata=array_merge($state,array('querybirthday'=>$querybirthday));
        return $resdata ;

    }



   //查询该群该用户的详细信息
    public function querygroupuserdata(Request $request)
    {
        $crowd_id=$request->param("crowd_id");//群id
        $user_id=$request->param("user_id");//用户id

        $sql = "select  user.*,user_crowd.user_type,user_crowd.score,user_crowd.remarks,user_crowd.create_time as joincrowd_time from user,user_crowd where user.id=user_crowd.user_id and user_crowd.crowd_id =" .$crowd_id. " and user_crowd.user_id =" .$user_id. ";";
        // return $sql;
        $querygroupuserdata = Db::query($sql); //拿到数据
        $state=['state'   => '200','message'  => "查询该群该用户的详细信息" ];
        $resdata=array_merge($state,array('querygroupuserdata'=>$querygroupuserdata));
        return $resdata ;

    }


     //修改用户的群积分账户
    public function updateusergroupscore(Request $request)
    {
        $crowd_id=$request->param("crowd_id");//群ID
        $user_id=$request->param("user_id");//用户ID
        $score=$request->param("score");//积分数
        if(is_numeric($score) && $score > 0){
        	 $updateres= db('user_crowd')->where('crowd_id',$crowd_id)->where('user_id',$user_id)->update(['score' =>$score]);

           $logdata="修改用户积分，用户id：" .$user_id. ",群id：" .$crowd_id. ",积分数:" .$score. "。"; //增加日志，有问题方便查找
           Log::record($logdata);

        	 $state=['state'   => '200','message'  => "修改用户积分成功" ];
        	 $resdata=array_merge($state,array('updateres'=>$updateres));
        	 return $resdata ;
        }
        else{
        	 $state=['state'   => '200','message'  => "数据错误" ];
             $resdata=array_merge($state,array('updateres'=> 0 ));
             return $resdata ;

        }
      
    }

    public function operationusergroupscore(Request $request)
    {
        $crowd_id=$request->param("crowd_id");//群ID
        $user_id=$request->param("user_id");//用户ID
        $score=$request->param("score");//积分数
        $state=$request->param("state");//加还是减积分
        $explain=$request->param("explain");//备注
        $time =date('Y-m-d H:i:s',time());//获取当前时间
        $user_data =db('user_crowd')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->find();
        $openid=$user_data["user_openid"];

        if($state == 0){
        //给用户相应的群积分账户加积分
        $addscore= db('user_crowd')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->setInc('score',$score);
        //给用户增加积分记录
        //增加用户积分消耗记录
        $score_record_data = ['id'=>'','openid' =>$openid,'user_id' =>$user_id,'crowd_id' =>$crowd_id,'score' =>$score,'explain' => $explain,'state' =>0,'create_time' =>$time];
        $score_record_id=db('score_record')->insert($score_record_data);
        }
        else{
        //减少用户积分
         $reduce_score= db('user_crowd')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->setDec('score', $score);

         //增加用户积分消耗记录
         $score_record_data = ['id'=>'','openid' =>$openid,'user_id' =>$user_id,'crowd_id' =>$crowd_id,'score' =>$score,'explain' =>$explain,'state' =>1,'create_time' =>$time];
         $score_record_id=db('score_record')->insert($score_record_data);

        }

        $state=['state'   => '200','message'  => "操作用户积分成功" ];
        return $state;
    }







   //设置群管理员
   public function setupadministrators(Request $request) 
   {

        $crowd_id=$request->param("crowd_id");//群ID
        $user_id=$request->param("user_id");//用户ID
        $updateres= db('user_crowd')->where('crowd_id',$crowd_id)->where('user_id',$user_id)->update(['user_type' => 2 ]);
        $state=['state'   => '200','message'  => "设置群管理员成功" ];
        $resdata=array_merge($state,array('updateres'=>$updateres));
        return $resdata ;

   }


   //取消群管理员
   public function canceladministrators(Request $request) 
   {

        $crowd_id=$request->param("crowd_id");//群ID
        $user_id=$request->param("user_id");//用户ID
        $updateres= db('user_crowd')->where('crowd_id',$crowd_id)->where('user_id',$user_id)->update(['user_type' => 0 ]);
        $state=['state'   => '200','message'  => "取消群管理员成功" ];
        $resdata=array_merge($state,array('updateres'=>$updateres));
        return $resdata ;

   }


   
   //删除群成员
   public function deletegroupuser(Request $request) 
   {

        $crowd_id=$request->param("crowd_id");//群ID
        $user_id=$request->param("user_id");//用户ID
        $deleteuser=db('user_crowd')-> where('crowd_id',$crowd_id)-> where('user_id',$user_id)->delete();
        if($deleteuser == 1 ){
              $state=['state'   => '200','message'  => "删除群员成功" ];
              return $state ;
        }else{
            $state=['state'   => '400','message'  => "删除群员失败" ];
            return $state ;
        }
   }


   //给群成员设置备注
   public function remarks(Request $request) 
   {

        $crowd_id=$request->param("crowd_id");//群ID
        $user_id=$request->param("user_id");//用户ID
        $remarks=$request->param("remarks");//备注
        $updateres= db('user_crowd')->where('crowd_id',$crowd_id)->where('user_id',$user_id)->update(['remarks' => $remarks ]);
        $state=['state'   => '200','message'  => "给群成员设置备注成功" ];
        $resdata=array_merge($state,array('updateres'=>$updateres));
        return $resdata ;
   }


   
   //清空群成员的积分
   public function emptyscore(Request $request) 
   {
        $crowd_id=$request->param("crowd_id");//群ID
        $user_id=$request->param("user_id");//用户ID
        $groupdata=db('user_crowd')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->find();
        $user_type=$groupdata["user_type"];//用户权限

        if($user_type == 1){
            $updateres= db('user_crowd')->where('crowd_id',$crowd_id)->update(['score' => 0]);
            $state=['state'   => '200','message'  => "清空群成员的积分成功" ];
        }
        else{
            $state=['state'   => '400','message'  => "账号权限错误" ];
        }
        return $state ;
   }


}

