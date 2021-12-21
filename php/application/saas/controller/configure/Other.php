<?php
namespace app\saas\controller\configure;
use think\Db;
use think\Request;
use qiniu\Deletefile;
class Other
{
   
    //设置未发货兑换变成已经发货
   public function taskslist(Request $request){

    $token=$request->param("token");
    $id=havecrowdid($token);
    $dbdata= db('exchange_record')->where('crowd_id',$id)->where('state',0)->update(['state' => 1]);
    $state=['state'   => '200','message'  => "设置未发货兑换变成已经发货" ];
    return $state ;
    }


}