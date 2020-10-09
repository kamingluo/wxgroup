<?php
namespace app\miniapp\controller\pay;
use think\Db;
use think\Request;
use think\Config;
use think\Log;
use think\Loader;

Loader::import('Wxpay.lib.WxPay', EXTEND_PATH, '.Api.php');//将附件放入根目录下
class Wxpay
{
    public function wxpay(Request $request)
    {
       //订单号
       $order='100189576113';
       $money=0.01*100;
       $opnenid='o1mXc4u68Fff1XGk7gTYyDD2tomU';
      //     初始化值对象
      $input = new \WxPayUnifiedOrder();
      //     文档提及的参数规范：商家名称-销售商品类目
      $input->SetBody("kaming测试");
      //     订单号应该是由小程序端传给服务端的，在用户下单时即生成，demo中取值是一个生成的时间戳
      $input->SetOut_trade_no("$order");
      //     费用应该是由小程序端传给服务端的，在用户下单时告知服务端应付金额，demo中取值是1，即1分钱
      $input->SetTotal_fee("$money");
      $input->SetNotify_url("http://paysdk.weixin.qq.com/example/notify.php");
      $input->SetTrade_type("JSAPI");
      //     由小程序端传给服务端
      $input->SetOpenid("$opnenid");
      return $input;
      //     向微信统一下单，并返回order，它是一个array数组
      $order = \WxPayApi::unifiedOrder($input);
      //     json化返回给小程序端
      header("Content-Type: application/json");
      echo json_encode($order);
    }
    


    //微信支付回调
    public function paycallback(Request $request)
    {

        $testxml  = file_get_contents("php://input");
        $jsonxml = json_encode(simplexml_load_string($testxml, 'SimpleXMLElement', LIBXML_NOCDATA));
        $result = json_decode($jsonxml, true);//转成数组，

        // Log::record('微信支付回调方法');
        $time =date('Y-m-d H:i:s',time());
        Log::record($time);
        // Log::record($result);
        // return $result;
        if($result){
          Log::record('微信支付回调方法，且result有值');
            //如果成功返回了
          $out_trade_no = $result['out_trade_no'];//拿到订单号
          $transaction_id=$result['transaction_id'];//拿到微信交易单号
          $attach=$result['attach'] || "没有附加数据";//拿到附加数据，也就是订单类型了
          $total_fee=$result['total_fee'];//订单金额，单位分
          $openid=$result['cash_fee'];//订单openid
          Log::record('订单号：'.$out_trade_no);
          Log::record('拿到微信交易单号：'.$transaction_id);
          Log::record('拿到附加数据：'.$attach);
          Log::record('订单金额：'.$total_fee);
          Log::record('订单openid：'.$openid);
                    if($result['return_code'] == 'SUCCESS' && $result['result_code'] == 'SUCCESS'){
                        //微信支付成功执行业务逻辑
                        $orderdata =db('order')->where('out_trade_no',$out_trade_no)->find();//查询订单信息
                        $state=$orderdata["state"];//拿到订单的状态
                        Log::record('拿到订单状态'.$state);
                        if($state==1){
                          Log::record('订单状态为待付款，处理订单');
                          $dbreturn= db('order')->where('openid',$openid)->where('out_trade_no',$out_trade_no)->update(['update_time' => $time,'transaction_id' => $transaction_id,'state'=>2]);
                          if($dbreturn==1){
                            Log::record('更新订单状态完成，为用户加上VIP');
                            $goods_id=$orderdata["goods_id"];//拿到商品id
                            $goodsdata =db('member_goods')->where('id',$goods_id)->find();//查询商品信息
                            Log::record('给用户加上vip的商品信息');
                            Log::record($goodsdata);
                          }

                        }
                        else{
                          Log::record('订单状态为未付款，不理会');
                        }
                    }
                    else{
                      Log::record("微信支付回调结果有，但是支付不成功");
                    }
        }
        else{
          Log::record("回调结果没有，不执行");
        }
    }
}
