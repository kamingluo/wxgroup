<?php
namespace app\miniapp\controller\pdd;
use think\Db;
use think\Request;
use think\Config;

class Recommend
{
    //多多客获取爆款排行商品接口
    public function goodspopular(Request $request){
      $pages=$request->param("pages");//商品id
      if(!$pages){
        $pages=0;
      }
      $offset=$pages*20;
      $type="pdd.ddk.top.goods.list.query";//查询的接口
      $p_id=Config('pdd_p_id');
      $data=array(
          "limit"=>20,
          "p_id"=>$p_id,
          "offset"=>$offset,
          "type"=>$type
      );
      $goodspopulardata=computeSignature($data);
      $resdata = ['state' => '200','message' => "多多客获取爆款排行商品查询成功",'goodspopulardata'=>$goodspopulardata];
      return  $resdata ;

  }

  //运营频道商品查询API：pdd.ddk.goods.recommend.get
  //参数channel_type:0-1.9包邮, 1-今日爆款, 2-品牌好货,3-相似商品推荐,4-猜你喜欢,5-实时热销,6-实时收益,7-今日畅销,8-高佣榜单，默认1
public function recommend(Request $request){
      $pages=$request->param("pages");//商品id
      $channel_type=$request->param("channel_type");//商品id
      if(!$pages){
        $pages=0;
      }
      $offset=$pages*20;
      $type="pdd.ddk.goods.recommend.get";//查询的接口
      $p_id=Config('pdd_p_id');
      $data=array(
          "limit"=>20,
          "channel_type"=>$channel_type,
          "p_id"=>$p_id,
          "offset"=>$offset,
          "type"=>$type
      );
      $recommenddata=computeSignature($data);
      $resdata = ['state' => '200','message' => "运营频道商品查询成功",'recommenddata'=>$recommenddata];
      return  $resdata ;

  }
   
}
