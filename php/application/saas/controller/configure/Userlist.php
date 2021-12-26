<?php
namespace app\saas\controller\configure;
use think\Db;
use think\Request;
use qiniu\Deletefile;
class userlist
{
   
    //查询群用户列表
   public function userslist(Request $request){
        $token=$request->param("token");
        $pages=$request->param("pages");
        $nickName=$request->param("nickName");
        $newkeyword="%".$nickName."%";
        $id=havecrowdid($token);
        if($pages == 1 || $pages==null  ){
            $number=0;
        }
        else{
            $number=($pages - 1)*10 ;
        }
        $data = db()->table(array('user_crowd'=>'t1','user'=>'t2'))->field('t1.*,t2.nickName,t2.avatarUrl')->where('t2.nickName','like',$newkeyword)->where('t2.id=t1.user_id')->where('t1.crowd_id',$id)->order('id ASC')->limit($number,10)->select();
        $countnumber = db()->table(array('user_crowd'=>'t1','user'=>'t2'))->field('t1.*,t2.nickName,t2.avatarUrl')->where('t2.nickName','like',$newkeyword)->where('t2.id=t1.user_id')->where('t1.crowd_id',$id)->count();
        $state=['state'   => '200','message'  => "查询群用户列表" ];
        $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
        return $resdata ;
    }


    //修改用户的群积分账户
    public function updateusergroupscore(Request $request)
    {
        $token=$request->param("token");
        $crowd_id=havecrowdid($token);

        $user_id=$request->param("user_id");//用户ID
        $score=$request->param("score");//积分数
        $state=$request->param("state");//加还是减积分
        $explain=$request->param("explain");//备注
        $time =date('Y-m-d H:i:s',time());//获取当前时间
        $user_data =db('user_crowd')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->find();
        $openid=$user_data["user_openid"];
        if($state == 0 ||$state == "0"){
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




    //查看群员的积分流水
    public function usergroupscorelist(Request $request)
    {
        // $crowd_id =$request->param("crowd_id");

        $token=$request->param("token");
        $crowd_id=havecrowdid($token);
        $user_id =$request->param("user_id");
        $pages=$request->param("pages");//页数
        if($pages){
            //有传pages
            $newpages= ($pages-1) * 20;//一页20条
            $userscorelist =db('score_record')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->order('id desc')->limit($newpages,20)->select(); 
        }
        else{
            //兼容没有传页数，返回全部信息
            $userscorelist =db('score_record')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->order('id desc')->select();
        }
        $count =db('score_record')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->count();

        $state=['state'   => '200','message'  => "查询用户对应群积分列表" ,'count'=>$count ];
        $resdata=array_merge($state,array('userscorelist'=>$userscorelist));
        return $resdata ;
      
    }


    //把用户踢出群

       //删除群成员
   public function deletegroupuser(Request $request) 
   {

        $token=$request->param("token");
        $crowd_id=havecrowdid($token);
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








}