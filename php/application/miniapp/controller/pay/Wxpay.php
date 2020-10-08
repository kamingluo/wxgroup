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
        Log::record('微信支付回调方法');
        $time =date('Y-m-d H:i:s',time());
        Log::record($time);
        Log::record($result);
        return $result;
      //   if($result){
      //       //如果成功返回了
      //       $out_trade_no = $result['out_trade_no'];
      //               if($result['return_code'] == 'SUCCESS' && $result['result_code'] == 'SUCCESS'){
      // //执行业务逻辑
      //               }
      //   }
    }
}
