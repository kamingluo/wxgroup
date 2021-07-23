<?php
namespace app\saas\controller\configure;
use think\Db;
use think\Request;
use qiniu\Deletefile;
class Signin
{
   
   //查询连续签到X天的用户信息
   public function continuityday(Request $request){
    $twoday=date("Y-m-d H:i:s", strtotime('-2 days'));//获取两天时间
    $token=$request->param("token");
    $pages=$request->param("pages");
    $day=$request->param("day");
    $id=havecrowdid($token);
    if($pages == 1 || $pages==null  ){
      $number=0;
    }
    else{
      $number=($pages - 1)*50 ;
    }
    $data = db()->table(array('sigin_user_crowd_data'=>'t1','user'=>'t2'))->field('t1.id,t1.user_id,t1.continuity_number,t1.all_signin_number,t1.update_time,t2.nickName,t2.avatarUrl')->where('t2.id=t1.user_id')->where('t1.crowd_id',$id)->where('t1.continuity_number','EGT',$day)-> where('t1.update_time','> time', $twoday)->order('t1.continuity_number DESC')->limit($number,50)->select();
    $countnumber = db()->table(array('sigin_user_crowd_data'=>'t1','user'=>'t2'))->field('t1.id')->where('t2.id=t1.user_id')->where('t1.crowd_id',$id)->where('t1.continuity_number','EGT',$day)-> where('t1.update_time','> time', $twoday)->count();
    $state=['state'   => '200','message'  => "查询连续签到X天的用户信息" ];
    $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
    return $resdata ;
    }


}