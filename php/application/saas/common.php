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

#用token获取群id
function havecrowdid($token){
    $crowd_data =db('crowd_admin_user')->where('token',$token)->find();
    if($crowd_data == null ){
        echo  json_encode(['state'   => '400','message'  => "登录已经过期" ] ) ;
        die ();
    }
    else{

        $crowd_id=$crowd_data["crowd_id"];
        return $crowd_id;
    }


}



//群主发货给用户通知，
function delivergoods($exchange_id,$expressnumber){
  $exchange_id=$exchange_id;//兑换记录id
  $expressnumber=$expressnumber;//快递单号
  $exchangedata=db('exchange_record')->where('id',$exchange_id)->find(); //根据id找到兑换详情
  $temmsg_openid=$exchangedata["openid"]; //推送openid
  $crowd_name=$exchangedata["crowd_name"];//群名称
  $goodsname=$exchangedata["goodsname"];//商品名称
  $price=$exchangedata["price"];//商品价格
  if(!$expressnumber){
      $expressnumber="无快递单号";//先埋起来
  }
$senopenid=$temmsg_openid;
$access_token=wxtoken();//拿到token
$temid = 'SknRZZeUTqjuuOKPqxANRoZMl2jhUBJbwvd5P8JgjN8';
$page = 'pages/my/my?exchangelist=true';
$url = 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token='.$access_token;
$explan="群:".$crowd_name.";";
$time =date('Y-m-d H:i:s',time());//获取当前时间
$data = array(//这里一定要按照微信给的格式
  "touser"=>$senopenid,
  "template_id"=>$temid,
  "page"=>$page,
  "miniprogram_state"=>"formal",
  "lang"=>"zh_CN",
  "data"=>array(
      "thing1"=>array(
          "value"=>"商品兑换结果"
      ),
      "thing2"=>array(
          "value"=>"奖励已经下发,请进入查看"
      ),
      "thing3"=>array(
          "value"=>$explan
      )
    )
  );
$res = postCurl($url,$data,'json');//将data数组转换为json数据
if($res){
 return "群主发货推送成功";
}else{
  return "群主发货推送失败";
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
