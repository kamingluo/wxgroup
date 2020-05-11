<?php
// +----------------------------------------------------------------------
// | 后台管理公共方法
// +----------------------------------------------------------------------

use think\Log;
use think\Db;
use think\Request;
use think\Controller;
use think\Config;


//测试方法
function test(){
    return "test";
}




//用户兑换给群主通知新的
function exchangemsg($exchangeid){
    //根据群id找到群主的openid
      $senuser=db('coin_exchange_record')->where('id',$exchangeid)->find(); //拿到兑换记录
      $senopenid=$senuser['openid'];//拿到openid
      $goodsname=$senuser['goodsName'];//拿到兑换商品
      $alipayName=$senuser['alipayName'];//拿到兑换支付者姓名
      $time =date('Y-m-d H:i:s',time());//获取当前时间
      $access_token=wxtoken();//拿到token
      $temid = 'yXsOU_XloUNY1ihCb_bwm8bjstgw4P3SErpqi4AwMNE';
      $page = 'pages/index/index';
      $url = 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token='.$access_token;
       //   $explan="用户:".$nickName.",兑换商品";
      $data = array(//这里一定要按照微信给的格式
        "touser"=>$senopenid,
        "template_id"=>$temid,
        "page"=>$page,
        "miniprogram_state"=>"formal",
        "lang"=>"zh_CN",
        "data"=>array(
            "thing1"=>array(
                "value"=>$alipayName
            ),
            "thing2"=>array(
                "value"=>$goodsname
            ),
            "time3"=>array(
                "value"=>$time
            )
         )
      );
    $res = postCurl($url,$data,'json');//将data数组转换为json数据
    if($res){
       return "用户兑换成功推送成功";
       // echo json_encode(array('state'=>4,'msg'=>$res));
    }else{
        return "用户兑换成功推送失败";
        // echo json_encode(array('state'=>5,'msg'=>$res));
    }
}



//微信token获取
function wxtoken(){
    $dbres =db('wxtoken')->where('id',1)->find();
    $token_time=$dbres["update_time"];
    $time =date('Y-m-d H:i:s',time());//获取当前时间
    $second=floor((strtotime($time)-strtotime($token_time)));//对比两个时间，拿到时间差
    if($second > 3600){
        //一小时更新一次,超过一小时再去调一次
        $data['appid']=Config('appid');
        $data['secret']= Config('secret');
        $data['grant_type']= 'client_credential';
        $api = "https://api.weixin.qq.com/cgi-bin/token";//拿token接口
        $str = http($api, $data,'GET');
        $token = json_decode($str,true);
        $access_token=$token['access_token'];//拿到token
        //更新一下数据库的access_token和时间
        $updatedata= db('wxtoken')->where('id',1)->update(['update_time' => $time,'access_token' => $access_token]);
    }
    else{
        $access_token=$dbres["access_token"];//直接拿到数据库存储的token
    }
    return $access_token;

}