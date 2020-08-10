<?php
namespace app\miniapp\controller\pdd;
use think\Db;
use think\Request;
use think\Config;

class Search
{
    public function goodssearch(Request $request)
    {
      $keyword=$request->param("keyword");//查询关键字
      $page=$request->param("page");//查询页数
      if($page==null){
       $page=1;
      }
      $page_size=20;//每页查询多少条
      $client_id=Config('pdd_client_id');
      $client_secret=Config('pdd_client_secret');
      $type="pdd.ddk.goods.search";//查询的接口
      $nowtime = time();
      $url=Config('pdd_api_url');
      $str = $client_secret."client_id".$client_id."keyword".$keyword."page".$page."page_size".$page_size."timestamp".$nowtime."type".$type.$client_secret;
      $jiami= md5($str);//md5加密处理
      $upper = strtoupper($jiami);//加密之后的转换成大写
      $resdata = array(//这里一定要按照微信给的格式
        "client_id"=>$client_id,
        "keyword"=>$keyword,
        "page"=>$page,
        "page_size"=>$page_size,
        "type"=>$type,
        "timestamp"=>$nowtime,
        "sign"=>$upper
      );
      $res = postCurl($url,$resdata,'json');//请求接口获得数据
      $goodslist=json_decode ($res);
      $resdata = ['state' => '200','message' => "查询商品列表成功",'nowtime' =>$nowtime,'goodslist'=>$goodslist];
    	return  $resdata ;
    }
    
   
}
