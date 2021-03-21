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
      $sql = "select user.nickName,user.avatarUrl,user_crowd.score from user,user_crowd where user.id=user_crowd.user_id and user_crowd.crowd_id = ".$crowd_id." order BY user_crowd.score desc LIMIT ".$startnumber.",20;";
      $groupuserlist = Db::query($sql); //拿到数据
      $count =db('user_crowd')->where('crowd_id',$crowd_id)->count();
      $state=['state'   => '200','message'  => "查询群用户积分排名成功",'count'=>$count ];
      $resdata=array_merge($state,array('groupuserlist'=>$groupuserlist));
      return $resdata ;
      
    }


}
