<?php
namespace app\saas\controller\configure;
use think\Db;
use think\Request;
use qiniu\Deletefile;
class Scorelist
{
   
   //查询所有特殊兑换的信息
   public function userscorerecord(Request $request){

    $token=$request->param("token");
    $pages=$request->param("pages");
    $name=$request->param("nickName");
    $newname='%'.$name.'%';
    $id=havecrowdid($token);
    if($pages == 1 || $pages==null  ){
      $number=0;
    }
    else{
      $number=($pages - 1)*10 ;
    }

    $data = db()->table(array('score_record'=>'t1','user'=>'t2'))->field('t1.id,t1.user_id,t2.nickName,t2.avatarUrl,t1.create_time,t1.score,t1.explain,t1.state')->where('t2.id=t1.user_id')->where('t1.crowd_id',$id)->where('t2.nickName','like',$newname)->order('id DESC')->limit($number,10)->select();
    $countnumber = db()->table(array('score_record'=>'t1','user'=>'t2'))->field('t1.id')->where('t2.id=t1.user_id')->where('t1.crowd_id',$id)->where('t2.nickName','like',$newname)->count();
    $state=['state'   => '200','message'  => "用户积分流水查询" ];
    $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
    return $resdata ;
    }


}