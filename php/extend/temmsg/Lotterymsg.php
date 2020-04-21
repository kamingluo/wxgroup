<?php
namespace temmsg;
use think\Db;
use think\Request;
use think\Log;

class Lotterymsg{
    /**
     * 发送HTTP请求方法
     * @param  string $lottery_id   抽奖活动id
     * @param  array  $goods_name 抽奖商品名称
     */
    public function lotterymssage($lottery_id,$goods_name){
       $goods_name=$goods_name;
       $msgdata =db('lottery_partake_list')->where('lottery_id',$lottery_id)->select();//根据抽奖id拿到要推送的用户
       $count = count($msgdata);//拿到数值条数
       $access_token=wxtoken();//拿到token
       $time =date('Y-m-d H:i:s',time());//获取当前时间
       foreach($msgdata as $count  => $data){
            $senopenid=$data["user_openid"];//用户openid
            $access_token=$access_token;
            // $access_token=wxtoken();//拿到token
            $temid = 'c7gmx5T9dSXBvWcE9Vvki_6OMTV048XfG47EX_bJ-7E';//抽奖结果推送id
            $page = 'pages/index/index';
            $url = 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token='.$access_token;
            // $$goods_name="这里要处理奖品名称，太长要截取";
            $time =date('Y-m-d H:i:s',time());//获取当前时间
            $data = array(
            "touser"=>$senopenid,
            "template_id"=>$temid,
            "page"=>$page,
            "miniprogram_state"=>"formal",
            "lang"=>"zh_CN",
            "data"=>array(
                "thing12"=>array(
                    //奖品名称，这里贼坑，字符串过长不能发送成功，但是回调信息没提示
                    "value"=>$goods_name
                ),
                //温馨提示
                "thing7"=>array(
                    "value"=>"开奖啦！赶紧戳进来看看你中奖了吗。>>>"
                ),
                //开奖时间
                "time11"=>array(
                    "value"=>$time
                ),
                //服务单位
                "thing3"=>array(
                    "value"=>"群记分小程序"
                )
                )
            );
           $res = postCurl($url,$data,'json');
           Log::record($res);
        }

        return "开奖提醒发送成功";

    }

}