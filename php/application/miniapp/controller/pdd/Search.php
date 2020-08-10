<?php
namespace app\miniapp\controller\pdd;
use think\Db;
use think\Request;
use think\Config;

class Search
{
    public function goodssearch(Request $request)
    {
      //echo time();//获取当前时间戳

      $nowtime = time();
      $url="https://gw-api.pinduoduo.com/api/router";
      $keyword=$request->param("keyword");
      $str = "dffb105376b725650548f326e70add2d5d01bd0aclient_id4b5d3ccbce894f4e92bf8998da0853bakeyword".$keyword."page1page_size10timestamp".$nowtime."typepdd.ddk.goods.searchdffb105376b725650548f326e70add2d5d01bd0a";
      $jiami= md5($str);//md5加密处理
      $upper = strtoupper($jiami);//加密之后的转换成大写

      $resdata = array(//这里一定要按照微信给的格式
        "client_id"=>"4b5d3ccbce894f4e92bf8998da0853ba",
        "keyword"=>$keyword,
        "page"=>1,
        "page_size"=>10,
        "type"=>"pdd.ddk.goods.search",
        "timestamp"=>$nowtime,
        "sign"=>$upper
      );
     $res = postCurl($url,$resdata,'json');//将data数组转换为json数据

      //return $res;
      return json_decode ($res);





      $data = ['str'=>$str,'upper' =>$upper,'nowtime' =>$nowtime,'resdata' =>$res];
    	return  $data ;
    }
    
   
}
