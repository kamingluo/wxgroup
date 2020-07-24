<?php
namespace app\admin\controller\configure;
use think\Db;
use think\Request;
use think\Config;

class Datalist
{
   
    public function lotterylist(Request $request){
        $id=$request->param("id");
        if($id){
           //根据id查询的
           $data=db('lottery_crowd_list')->where('id',$id)->select();
           $countnumber=1;
           $state=['state'   => '200','message'  => "抽奖列表查询成功" ];
           $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
           return $resdata ;
        }
        $pages=$request->param("pages");
        $crowd_name=$request->param("crowd_name");
        if($pages == 1 || $pages==null  ){
          $number=0;
        }
        else{
          $number=($pages - 1)*10 ;
        }
        if($crowd_name){
           //名称不为空
           $countnumber=db('lottery_crowd_list')->where('crowd_name','like',"%$crowd_name%")->count();
           $data=db('lottery_crowd_list')->where('crowd_name','like',"%$crowd_name%")->order('id desc')->limit($number,10)->select();
        }
        else{
         $countnumber=db('lottery_crowd_list')->count();
         $data=db('lottery_crowd_list')->order('id desc')->limit($number,10)->select();
        }
        $state=['state'   => '200','message'  => "抽奖列表查询成功" ];
        $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
        return $resdata ;
       
    }


    public function clickadlist(Request $request){
    
      $pages=$request->param("pages");
      if($pages == 1 || $pages==null  ){
        $number=0;
      }
      else{
        $number=($pages - 1)*10 ;
      }
    
       $countnumber=db('click_gdt_ad')->count();
       $data=db('click_gdt_ad')->order('id desc')->limit($number,10)->select();
      $state=['state'   => '200','message'  => "点击广告列表查询成功" ];
      $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
      return $resdata ;
     
  }
    

   


}