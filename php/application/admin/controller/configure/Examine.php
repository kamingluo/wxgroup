<?php
namespace app\admin\controller\configure;
use think\Db;
use think\Request;
use think\Config;

class Examine
{
    public function exchangedata(Request $request) //兑换列表查询
    {
        $pages=$request->param("pages");
        $countnumber=db('coin_exchange_record')->count();
        if($pages == 1 || $pages==null  ){
          $data=db('coin_exchange_record')->order('id desc')->limit(0,10)->select();
          $state=['state'   => '200','message'  => "兑换列表查询成功" ];
          $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
          return $resdata ;
        }
        else{
          $number=($pages - 1)*10);
          $data=db('coin_exchange_record')->order('id desc')->limit($number,10)->select();
          $state=['state'   => '200','message'  => "兑换列表查询成功" ];
          $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
          return $resdata ;
        }
        
        
	}
    
    public function sendrewards(Request $request) //发放奖励修改状态
    {
        $id=$request->param("id");//数据id
        $state=$request->param("state");
        $dbreturn= db('coin_exchange_record')->where('id',$id)->update(['state' => $state]);
        if( $state==1){
          //通过审核,给用户发信息
          $msg=exchangemsg($id);
        }
        $resdata=['state'   => '200','message'  => "修改状态成功" ];
        return $resdata ;    
	}



    
}
