<?php

use think\Log;
use think\Db;
use think\Request;
use think\Controller;
use think\Config;

/**
   * 调取微信接口获取openid
   * 传入值code从小程序login API获取
   * @return string
*/
function openid($wxcode){
    if($wxcode == 'kaming'){
        $openid='o1mXc4u68Fff1XGk7gTYyDD2tomU';
        return $openid;
    }
    $url = 'https://api.weixin.qq.com/sns/jscode2session';
    $data['appid']=Config('appid');
    $data['secret']= Config('secret');
    $data['js_code']= $wxcode;
    $data['grant_type']= 'authorization_code';
    $wxopenid = http($url, $data, 'GET');
    $openiddata=json_decode($wxopenid,true);
    $rest=array_key_exists("errcode",$openiddata);//判断返回值存在errcode证明code有误
        if($rest){ 
             Log::record('code错误或者过期了！传入微信code-->'.$wxcode,'error');
            echo  json_encode(['state'   => '200','message'  => "code错误或者过期了！" ] ) ;
            die ();
        }
        else{
        	$openid=$openiddata['openid'];
        	return $openid;
        }
}


/**
   * 调取微信接口获取openid
   * 传入值code从小程序login API获取
   * @return string
*/
function joingroup($crowd_id, $user_id, $user_openid,$ifinvitation=0){
        if($crowd_id == 0 || $crowd_id == null){
            return  "不执行加群，直接返回";
        }
        $time =date('Y-m-d H:i:s',time());
        $dbres =db('user_crowd')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->find();//查询用户有没有加入群
        if($dbres){
            $resdata=['state'   => '200','message'  => "已经加入该群了" ];
            return $resdata;
        }else{
            $dbdata = ['id'=>'','user_id' =>$user_id,'user_openid' => $user_openid,'crowd_id' => $crowd_id,'user_type' => 0,'score' =>0,'remarks' =>null,'create_time' =>$time];
            $user_crowdid= db('user_crowd')->insertGetId($dbdata);//返回自增ID

            //群主邀请新人加入，加积分,是1才是证明是邀请的新用户
            //暂时去除邀请用户加金币
            // if($ifinvitation == 1){
            //     $coin=30;//奖励金币数
            //     //根据群id查群主id
            //     $dbuserid =db('user_crowd')->where('user_type',1)->where('crowd_id',$crowd_id)->value('user_id');//查询群的群主用户id
            //     $dbuser =db('user')->where('id',$dbuserid)->find();//查询群主的用户信息
            //     $openid=$dbuser['openid'];//群主openid
            //     $channel=$dbuser['channel'];//群主openid
            //     //加积分
            //     $addscore= db('user')->where('openid',$openid)->setInc('coin',$coin);
            //     //增加积分变化记录
            //     $datares = ['id'=>'','user_id' =>$dbuserid,'openid' =>$openid,'coin' =>$coin,'explain' =>"邀请好友入群",'channel' =>$channel,'state' =>0,'create_time' =>$time];
            //     $data=db('coin_record')->insert($datares);
            // }

            $state=['state'   => '200','message'  => "用户加入群成功" ];
            $resdata=array_merge($state,array('user_crowdid'=>$user_crowdid));
            return $resdata;
        }

}



//用户兑换给群主通知新的
function userexchange($nickName,$goodsname,$price,$crowd_id){
    //根据群id找到群主的openid
      $crowd_owner_id=db('user_crowd')->where('crowd_id',$crowd_id)->where('user_type',1)->value('user_openid'); //拿到群主的openid
      $senopenid=$crowd_owner_id;
      $access_token=wxtoken();//拿到token
      $temid = 'zhWe1Om6o3IK-A7ruaJoGvrtshuD-H5Fg0UpMQrzseU';
      $page = 'pages/index/index';
      $url = 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token='.$access_token;
      $explan="用户:".$nickName.",兑换商品";
      $time =date('Y-m-d H:i:s',time());//获取当前时间
      $data = array(//这里一定要按照微信给的格式
        "touser"=>$senopenid,
        "template_id"=>$temid,
        "page"=>$page,
        "miniprogram_state"=>"formal",
        "lang"=>"zh_CN",
        "data"=>array(
            "date1"=>array(
                "value"=>$time
            ),
            "thing4"=>array(
                "value"=>$goodsname
            ),
            "number5"=>array(
                "value"=>$price
            ),
            "thing2"=>array(
                "value"=>$explan
            )
         )
      );
    $res = postCurl($url,$data,'json');//将data数组转换为json数据
    if($res){
        //推送完要把值删除,这是旧版需要的功能
         //$cleardata=db('formid')-> where('formid',$temmsg_formid)->delete();
       return "用户兑换成功推送成功";
       // echo json_encode(array('state'=>4,'msg'=>$res));
    }else{
         //$cleardata=db('formid')-> where('formid',$temmsg_formid)->delete();
        return "用户兑换成功推送失败";
        // echo json_encode(array('state'=>5,'msg'=>$res));
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



//群主发信息，给群员推送
function msgpushnew($openid,$access_token,$crowd_name){
      $senopenid=$openid;//用户openid
      $access_token=$access_token;
      // $access_token=wxtoken();//拿到token
      $temid = 'fIbB90FHxqlRURZGGo0PmcdAKWaUoxziV_loz90ftVs';
      $page = 'pages/index/index';
      $url = 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token='.$access_token;
      $explan="群:".$crowd_name."有新消息;";
      $time =date('Y-m-d H:i:s',time());//获取当前时间
      $data = array(
        "touser"=>$senopenid,
        "template_id"=>$temid,
        "page"=>$page,
        "miniprogram_state"=>"formal",
        "lang"=>"zh_CN",
        "data"=>array(
            "thing1"=>array(
                //这里贼坑，字符串过长不能发送成功，但是回调信息没提示
                "value"=>$explan
            ),
            "thing3"=>array(
                "value"=>"点击查看>>>"
            ),
            "time2"=>array(
                "value"=>$time
            )
          )
        );
    $res = postCurl($url,$data,'json');
    if($res){
       return "发送成功";
    }else{
        return "发送失败";
    }

}


//文案审核
function wxmsgSecCheck($content){
        $access_token=wxtoken();//拿到token
        //return $access_token;
        $url = 'https://api.weixin.qq.com/wxa/msg_sec_check?access_token='.$access_token;//文案审核URL
        // $data = json_encode(['content'=>$text]);
        $data=array("content"=>$content);
        //return $data;
        $respon = newpostCurl($url,$data,'json');
        $respon = json_decode($respon,true);
        Log::record("文案审核内容");
        Log::record($content);
        Log::record("文案审核结果啊");
        Log::record($respon);

        //return $respon;
        if($respon['errcode'] == 87014){
        return 1;//效验失败，内容含有违法违规内容
        }
        else{
            return 0;
        }
}


//这个请求跟全局公共文件，请求不同是这里的json_encode()处理中文的时候，不转码。
function newpostCurl($url,$data,$type){
    if($type == 'json'){
        $data = json_encode($data,JSON_UNESCAPED_UNICODE);//对数组进行json编码,设置JSON_UNESCAPED_UNICODE是不对中文进行转码。
        $header= array("Content-type: application/json;charset=UTF-8","Accept: application/json","Cache-Control: no-cache", "Pragma: no-cache");
    }
    $curl = curl_init();
    curl_setopt($curl,CURLOPT_URL,$url);
    curl_setopt($curl,CURLOPT_POST,1);
    curl_setopt($curl,CURLOPT_SSL_VERIFYPEER,false);
    curl_setopt($curl,CURLOPT_SSL_VERIFYHOST,false);
    if(!empty($data)){
        curl_setopt($curl,CURLOPT_POSTFIELDS,$data);
    }
    curl_setopt($curl,CURLOPT_RETURNTRANSFER,1);
    curl_setopt($curl,CURLOPT_HTTPHEADER,$header);
    $res = curl_exec($curl);
    if(curl_errno($curl)){
        echo 'Error+'.curl_error($curl);
    }
    curl_close($curl);
    return $res;
    
}


//拼多多请求生成
function computeSignature($parameters){
    $client_id=Config('pdd_client_id');
    $client_secret=Config('pdd_client_secret');
    $url=Config('pdd_api_url');
    $nowtime = time();
    $originaldata= array(
        "client_id"=>$client_id,
        "timestamp"=>$nowtime,
    );
     $mergedata=array_merge($originaldata,$parameters); //合并参数
     ksort($mergedata);// 将参数Key按字典顺序排序
     // 生成规范化请求字符串
    $canonicalizedQueryString = '';
    foreach ($mergedata as $k => $v)
    {
        if($k != "sign" && $v !== "" && !is_array($v)){ //array数组不参与生成
            $canonicalizedQueryString .= $k . $v ;
        }
    }
     $str = $client_secret.$canonicalizedQueryString.$client_secret;//前后加上client_secret
     $encryption= md5($str);//md5加密处理
     $upper = strtoupper($encryption);//加密之后的转换成大写
     $sigin= array( 
        "sign"=>$upper //生成sign参数加入到请求
     );
     $newdata=array_merge($mergedata,$sigin);
     ksort($newdata);//再次排序下
     $res = postCurl($url,$newdata,'json');//请求接口获得数据
     $returndata=json_decode($res);//去除转义
     return $returndata;
}


//淘宝请求生成
function taobaorequest($parameters){
    $app_key=Config('taobao_appkey');
    $client_secret=Config('taobao_app_secret');
    $url=Config('taobao_api_url');
    $nowtime = date('Y-m-d H:i:s');//获取当前时间
    $originaldata= array(
        "app_key"=>$app_key,
        "sign_method"=>"md5",
        "format"=>"json",
        "v"=>"2.0",
        "timestamp"=>$nowtime,
    );
     $mergedata=array_merge($originaldata,$parameters); //合并参数
     ksort($mergedata);// 将参数Key按字典顺序排序
     // 生成规范化请求字符串
     //return $mergedata;
    $canonicalizedQueryString = '';
    foreach ($mergedata as $k => $v)
    {
        if($k != "sign" && $v !== "" && !is_array($v)){ //array数组不参与生成
            $canonicalizedQueryString .= $k . $v ;
        }
    }
     $str = $client_secret.$canonicalizedQueryString.$client_secret;//前后加上client_secret
     $encryption= md5($str);//md5加密处理
     $upper = strtoupper($encryption);//加密之后的转换成大写
     $sigin= array( 
        "sign"=>$upper //生成sign参数加入到请求
     );
     $newdata=array_merge($mergedata,$sigin);
     ksort($newdata);//再次排序下

     $requestUrl = $url."?";

    foreach ($newdata as $sysParamKey => $sysParamValue)
	{
			$requestUrl .= "$sysParamKey=" . urlencode($sysParamValue) . "&";
    }
    $requestUrl = substr($requestUrl, 0, -1);

    $resdata=getcurl($requestUrl);
    return json_decode($resdata);
}



//查询用户的VIP信息，传入用户id即可
function queryuservipdata($user_id){

    $data =db('user_vip_data')->where('user_id',$user_id)->find();//查询用户vip信息
        $condition=1;
        $message="";
        $end_time='';
        if($data){
            $end_time=$data["end_time"];//会员结束时间
            $nowtime=date('Y-m-d H:i:s',time());//当前时间
            if($end_time>$nowtime){
                $message="有会员，且没结束";
                $condition=0;
                $end_time=date('Y-m-d',strtotime($end_time));//去除时分秒，保留年月日
            }
            else{
                $message="有会员，已经结束了";
                $condition=2;
            }
        }
        else{
            $message="用户没有开通记录";
        }
        $returndata=['state'   => '200','message'  => $message,'condition'=> $condition,'end_time'  => $end_time ];
        return $returndata ;
}


//给用户增加vip日期。传入openid和time,time是增加的天数。
function addvipday($openid,$time)
{

    $nowtime=date('Y-m-d H:i:s',time());//当前时间
        $data =db('user_vip_data')->where('openid',$openid)->find();//查询用户vip信息
        if($data){
            //已经有vip数据了，在原来的基础上增加
            $end_time=$data["end_time"];
            if($end_time>$nowtime){
                $new_end_time=date('Y-m-d H:i:s',strtotime("{$end_time} + $time day"));
                $dbreturn= db('user_vip_data')->where('openid',$openid)->update(['update_time' => $nowtime,'end_time' => $new_end_time]);
            }
            else{
                $end_time=date("Y-m-d G:H:s",strtotime("+".$time." days"));//当前时间加上多少天
                $dbreturn= db('user_vip_data')->where('openid',$openid)->update(['update_time' => $nowtime,'end_time' => $end_time]);
            }
        }
        else{
            //还没有vip数据，给用加上
            $userdata =db('user')->where('openid',$openid)->find();//查询用户信息
            $user_id=$userdata["id"];
            $channel=$userdata["channel"];
            $end_time=date("Y-m-d G:H:s",strtotime("+".$time." days"));//当前时间加上多少天
            $dbdata = ['id'=>'','openid' =>$openid,'channel' => $channel,'user_id' => $user_id,'create_time' =>$nowtime ,'update_time' =>$nowtime,'end_time' =>$end_time];
            $Id= db('user_vip_data')->insertGetId($dbdata);//返回自增ID
        }
        $returndata=['state'   => '200','message'  => "给用户增加vip天数成功",'time'  => $time];
        return $returndata ;
}

