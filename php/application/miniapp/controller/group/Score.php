<?php
namespace app\miniapp\controller\group;
use think\Db;
use think\Request;
use think\Config;

class Score
{

    //查询群积分排名
    public function scoreranking(Request $request)
    {
      $crowd_id=$request->param("crowd_id");//群id
      $pages=$request->param("pages");
      if(!$pages){
          $pages=1;
      }
      $endnumber=$pages*20 ; //结束查询条数
      $startnumber=$endnumber -20;//开始查询条数
      $sql = "select user.nickName,user.avatarUrl,user_crowd.score from user,user_crowd where user.id=user_crowd.user_id and user_crowd.crowd_id = ".$crowd_id." order BY user_crowd.score desc,user_crowd.id asc LIMIT ".$startnumber.",20;";
      $groupuserlist = Db::query($sql); //拿到数据
      $count =db('user_crowd')->where('crowd_id',$crowd_id)->count();
      $state=['state'   => '200','message'  => "查询群用户积分排名成功",'count'=>$count ];
      $resdata=array_merge($state,array('groupuserlist'=>$groupuserlist));
      return $resdata ;
      
    }

    //查询用户的积分所在名次跟积分数
    public function usercrowdscore(Request $request){
      $crowd_id=$request->param("crowd_id");//群id
      $user_id=$request->param("user_id");//用户id

      //查询用户的群积分数
      $score=db('user_crowd')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->value("score");

      $sql="select count(1) as userrank from user_crowd  where  crowd_id = ".$crowd_id." and score >= (select score from user_crowd where user_id = ".$user_id." and crowd_id=".$crowd_id." order BY id asc )";
      $userrank = Db::query($sql); //拿到数据
      $newrank=$userrank[0]["userrank"];
      $state=['state'   => '200','message'  => "查询用户的积分所在名次跟积分数",'score'=>$score,'rank'=>$newrank ];

      return $state;

      //查询用户的群排名数
      //select count(1) as top from user_crowd  where  crowd_id = 14 and score >= (select score from user_crowd where user_id = 10048 and crowd_id=14)

    }


}
