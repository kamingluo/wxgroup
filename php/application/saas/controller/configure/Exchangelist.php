<?php
namespace app\saas\controller\configure;
use think\Db;
use think\Request;
use qiniu\Deletefile;
use think\Log;
class Exchangelist
{
   
     //群主查看群兑换列表
     public function groupexchangelist(Request $request)
     {
         $pages=$request->param("pages");//页数
         $token=$request->param("token");
         $crowd_id=havecrowdid($token);
         $nickName=$request->param("nickName");
         $newkeyword="%".$nickName."%";
         if($pages){
             //有传pages
             $newpages= ($pages-1) * 20;//一页20条
             $data =db('exchange_record')->where('crowd_id',$crowd_id) ->where('nickName','like',$newkeyword)->order('id desc')->limit($newpages,20)->select();
         }
         else{
             //兼容没有传页数，返回全部信息
             $data=db('exchange_record')->where('crowd_id',$crowd_id) ->where('nickName','like',$newkeyword)->order('id desc')->select();
         }
 
         $count =db('exchange_record')->where('crowd_id',$crowd_id)->where('nickName','like',$newkeyword)->count();
         
       $state=['state'   => '200','message'  => "群兑换列表" ,'countnumber'=>$count];
         $resdata=array_merge($state,array('data'=>$data));
         return $resdata ;
     }


         //设置未发货兑换变成已经发货
   public function delivergoods(Request $request){

    $token=$request->param("token");
    $id=havecrowdid($token);
    $dbdata= db('exchange_record')->where('crowd_id',$id)->where('state',0)->update(['state' => 1]);
    $state=['state'   => '200','message'  => "设置未发货兑换变成已经发货" ];
    return $state ;
    }


      //群主发货
    public function sendoutgoods(Request $request)
    {

    	$id=$request->param("exchange_id");//兑换记录id
    	$expressnumber=$request->param("expressnumber");//快递单号或者其他备注
      $state=$request->param("state");//状态
      $exchange_type=$request->param("exchange_type");//兑换类型，0是快递，1是其他
      $time =date('Y-m-d H:i:s',time());
      if(!$exchange_type){
            //不填写的默认是0，快递发货
            $exchange_type=0;
      }
    	if($state == 1){
    		//审核通过发货
    		$dbdata= db('exchange_record')->where('id',$id)->update(['expressnumber' => $expressnumber,'exchange_type' => $exchange_type,'state' => 1]);
    		$state=['state'   => '200','message'  => "发货成功" ];
            $resdata=array_merge($state,array('dbdata'=>$dbdata));
           
            $temdata=delivergoods($id,$expressnumber);//推送消息给兑换的用户
            return $resdata ;
    	}
    	else{
        //修改审核不通过状态
        $dbdata= db('exchange_record')->where('id',$id)->update(['state' => 2,'expressnumber' => $expressnumber]);
        //返还积分给用户
        $exdata=db('exchange_record')->where('id',$id)->find();
        $crowd_id=$exdata["crowd_id"];
        $user_id=$exdata["user_id"];
        $openid=$exdata["openid"];
        $price=$exdata["price"];
        $goodsname=$exdata["goodsname"];


        $gooddata=db('crowd_goods')->where('crowd_id',$crowd_id)->where('goodsname',$goodsname)->find();
        $stock=$gooddata["goodsname"];
        Log::record("修改商品库存前");
        //修改商品库存
        if($stock != 999999999 || $stock != '999999999' ){
            Log::record("修改商品库存中");
            $addstock= db('crowd_goods')->where('crowd_id',$crowd_id)->where('goodsname',$goodsname)->setInc('stock',1);//找到该商品加库存
        }
        Log::record("修改商品库存后");

        if($price > 0){
          $addscore= db('user_crowd')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->setInc('score',$price);//找到该用户的群账户加积分
          //加积分记录
          $score_record_data = ['id'=>'','openid' =>$openid,'user_id' =>$user_id,'crowd_id' =>$crowd_id,'score' =>$price,'explain' => "商品兑换审核不通过退回",'state' =>0,'create_time' =>$time];
          $score_record_id=db('score_record')->insert($score_record_data);
        }

    		$state=['state'   => '200','message'  => "发货审核失败" ];
            $resdata=array_merge($state,array('dbdata'=>$dbdata));
            return $resdata ;
    	}

    }

}