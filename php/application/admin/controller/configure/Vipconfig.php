<?php
namespace app\admin\controller\configure;
use think\Db;
use think\Request;

class Vipconfig
{
   
    //聊天列表页面
   public function vipdata(Request $request){
    $data =db('vip_config')->where('id',1)->select();
    $state=['state'   => '200','message'  => "vip配置信息" ];
    $resdata=array_merge($state,array('data'=>$data));
    return $resdata ;
    
    }
   
     
   //修改信息
   public function updatedata(Request $request){
        $ifopen=$request->param("ifopen");
        $dbreturn= db('vip_config')->where('id',1)->update(['ifopen' => $ifopen]);
        $resdata=['state'   => '200','message'  => "修改状态成功" ];
        return $resdata ;    
   }



}