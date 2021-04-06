<?php
namespace app\saas\controller\configure;
use think\Db;
use think\Request;
use qiniu\Deletefile;
class Special
{
   
   //查询所有特殊兑换的信息
   public function querylist(Request $request){

    $token=$request->param("token");
    $pages=$request->param("pages");
    $id=havecrowdid($token);
    if($pages == 1 || $pages==null  ){
      $number=0;
    }
    else{
      $number=($pages - 1)*10 ;
    }

    $data = db()->table(array('crowd_coupon_code_exchange'=>'t1','user'=>'t2','crowd_coupon_code'=>'t3'))->field('t1.id,t1.user_id,t2.nickName,t2.avatarUrl,t3.code,t1.create_time')->where('t2.id=t1.user_id')->where('t3.id=t1.coupon_id')->where('t1.crowd_id',$id)->order('id DESC')->limit($number,10)->select();
    $countnumber=db('crowd_coupon_code_exchange')->where('crowd_id',$id)->count();
    $state=['state'   => '200','message'  => "特殊兑换查询成功" ];
    $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
    return $resdata ;
    }

    //查询兑换码剩余数量和已经兑换数量
    public function couponnum(Request $request){
      $token=$request->param("token");
      $id=havecrowdid($token);

      //已经兑换数量
      $alreadyexchangenum=db('crowd_coupon_code')->where('crowd_id',$id)->where('state',1)->count();
      //未兑换数量
      $noexchangenum=db('crowd_coupon_code')->where('crowd_id',$id)->where('state',0)->count();
      $state=['state'   => '200','message'  => "特殊兑换查询成功",'alreadyexchangenum'=>$alreadyexchangenum,'noexchangenum'=>$noexchangenum ];
      return $state ;



    }





}