<?php
namespace app\miniapp\controller\group;
use think\Log;
use think\Db;
use think\Request;
use think\Config;
use qiniu\Deletefile;

class Groupgoods
{

    //查询群商品列表
    public function goodslist(Request $request)
    {
         $crowd_id=$request->param("crowd_id");
         $data=db('crowd_goods')->where('crowd_id',$crowd_id)->order('id desc')->select();
         $state=['state'   => '200','message'  => "群商品列表查询成功" ];
         $resdata=array_merge($state,array('data'=>$data));
         return $resdata ;
        
    }


    //查询群商品列表
    public function newgoodslist(Request $request)
    {

         
         $crowd_id=$request->param("crowd_id");
         $data=db('crowd_goods')->where('crowd_id',$crowd_id)->order('sort asc')->select();
         $state=['state'   => '200','message'  => "群商品列表查询成功" ];
         $resdata=array_merge($state,array('data'=>$data));
         return $resdata ;
        
    }

      //查询商品详情
    public function goodsdetails(Request $request)
    {
         $goods_id=$request->param("goods_id");
         $data=db('crowd_goods')->where('id',$goods_id)->find();
         $state=['state'   => '200','message'  => "商品详情查询成功" ];
         $resdata=array_merge($state,array('data'=>$data));
         return $resdata ;
        
    }




       //发布群商品
    public function pushgoods(Request $request)
    {
         $crowd_id=$request->param("crowd_id");
         $goodsname=$request->param("goodsname");
         $images=$request->param("images");
         $price=$request->param("price");
         Log::record("处理之前的stock数据11");
         Log::record($request->param("stock"));

         $stock=$request->param("stock");

         Log::record("处理之后的stock数据");
         Log::record($stock);

         $time =date('Y-m-d H:i:s',time());//获取当前时间
         $data = ['id'=>'','goodsname' =>$goodsname,'images' => $images,'price' => $price,'crowd_id' => $crowd_id,'sort' => null,'stock' => $stock,'create_time' =>$time,'update_time' =>$time];
         $goods_id= db('crowd_goods')->insertGetId($data);//返回自增ID
         $state=['state'   => '200','message'  => "发布群商品成功" ];
         $resdata=array_merge($state,array('goods_id'=>$goods_id));
         return $resdata ;
    }



    //新发布群商品
    public function newpushgoods(Request $request)
    {
        $crowd_id=$request->param("crowd_id");
        $goodsname=$request->param("goodsname");
        $images=$request->param("images");
        $price=$request->param("price");
        $start_time=$request->param("start_time");
        Log::record("处理之前的stock数据11");
        Log::record($request->param("stock"));

        $stock=$request->param("stock");

        Log::record("处理之后的stock数据");
        Log::record($stock);

        $time =date('Y-m-d H:i:s',time());//获取当前时间
        $data = ['id'=>'','goodsname' =>$goodsname,'images' => $images,'price' => $price,'crowd_id' => $crowd_id,'sort' => null,'stock' => $stock,'create_time' =>$time,'update_time' =>$time,'start_time' =>$start_time];
        $goods_id= db('crowd_goods')->insertGetId($data);//返回自增ID
        $state=['state'   => '200','message'  => "发布群商品成功" ];
        $resdata=array_merge($state,array('goods_id'=>$goods_id));
        return $resdata ;
    }








    //修改群商品
    public function newupdategoods(Request $request){
      $id=$request->param("id");
      $goodsname=$request->param("goodsname");
      $price=$request->param("price");
      $stock=$request->param("stock");
      $start_time=$request->param("start_time");
      $time =date('Y-m-d H:i:s',time());//获取当前时间

      $updateres= db('crowd_goods')->where('id',$id)->update(['goodsname' => $goodsname,'price' => $price,'stock' => $stock,'update_time' => $time,'start_time' =>$start_time]);
      if($updateres==1){
        $state=['state'   => '200','message'  => "修改商品成功" ];
      }
      else{
        $state=['state'   => '200','message'  => "修改商品失败" ];
      }
      return $state;
    }


    //修改群商品
    public function updategoods(Request $request){
      $id=$request->param("id");
      $goodsname=$request->param("goodsname");
      $price=$request->param("price");
      $stock=$request->param("stock");
      $time =date('Y-m-d H:i:s',time());//获取当前时间

      $updateres= db('crowd_goods')->where('id',$id)->update(['goodsname' => $goodsname,'price' => $price,'stock' => $stock,'update_time' => $time]);
      if($updateres==1){
        $state=['state'   => '200','message'  => "修改商品成功" ];
      }
      else{
        $state=['state'   => '200','message'  => "修改商品失败" ];
      }
      return $state;
    }



       //删除群商品
    public function deletegoods(Request $request)
    {
         $goods_id=$request->param("goods_id");

         //从七牛删除资源，暂时不能删除，后面 兑换的商品有用到这个商品链接
     //    $data=db('crowd_goods')->where('id',$id)->find();
     //    $deletefile = new Deletefile();
     //    $deleteresult=$deletefile -> one($data['images']);



         $cleardata=db('crowd_goods')-> where('id',$goods_id)->delete();

        if($cleardata ==1){
             $state=['state'   => '200','message'  => "删除商品成功" ];
        }
        else{
             $state=['state'   => '400','message'  => "删除商品失败" ];
        }
        return  $state;
        
    }



    //用户兑换商品
    public function exchangegoods(Request $request)
    {
        set_time_limit(0);//设置超时时间
        $wxcode =$request->param("code");
        $openid=openid($wxcode);
        $goods_id=$request->param("goods_id");//商品id
        // $address_id=$request->param("address_id");//地址id
        $remarks=$request->param("remarks");//兑换备注
        $crowd_id=$request->param("crowd_id");//群id
        $crowd_name=$request->param("crowd_name");//群名称
        $time =date('Y-m-d H:i:s',time());//获取当前时间


        $address_data=db('user_address')->where('openid',$openid)->find(); //拿到地址信息

        if(!$address_data){
          $state=['state'   => '400','message'  => "兑换失败，地址不能为空" ];
          return $state;
        }

        $user_crowd_data=db('user_crowd')->where('user_openid',$openid)->where('crowd_id',$crowd_id)->find(); //用户的群信息
        $user_data=db('user')->where('openid',$openid)->find(); //拿到用户信息
        $goods_data=db('crowd_goods')->where('id',$goods_id)->find(); //拿到商品信息

        //判断用户是否兑换过这个商品。用用户名称去查询
        if($crowd_id == 3514 ){
          Log::record('是3514的群啊-->'.$crowd_id,'error');
          $exnumber=db('exchange_record')->where('crowd_id',$crowd_id)->where('user_id',$user_data["id"])->where('goodsname',$goods_data["goodsname"])->count();
          if($exnumber > 0){
            $state=['state'   => '400','message'  => "兑换失败，只能兑换一次！" ];
            return $state;
          }  

        }


        if($user_crowd_data["score"] >= $goods_data["price"] ){

          //判断库存够
          $stock=$goods_data['stock'];
          if($stock == 999999999  ){
            //不限量兑换，下面的可以不要的
            $state=['state'   => '200','message'  => "不限量兑换！" ];
          }
          else{
            $number=db('crowd_goods')->where('id',$goods_id)->where('stock','>',0)->setDec('stock');
            if($number != 1){
              $state=['state'   => '400','message'  => "兑换失败，商品库存不足！" ];
              return $state;
            }
          }

          //增加兑换记录
          $exchangedata = ['id'=>'','user_id' =>$user_data["id"],'openid' => $openid,'nickName' => $user_data["nickName"],'crowd_id' => $crowd_id,'crowd_name' => $crowd_name,'userName' =>  $address_data["userName"],'postalCode' => $address_data["postalCode"],'provinceName'=>$address_data["provinceName"],'cityName' =>$address_data["cityName"],'countyName' =>$address_data["countyName"],'detailInfo' => $address_data["detailInfo"],'nationalCode' =>$address_data["nationalCode"],'telNumber' => $address_data["telNumber"],'goodsname' => $goods_data["goodsname"],'images'=> $goods_data["images"],'price' => $goods_data["price"],'expressnumber' =>null,'remarks' => $remarks,'state' => 0,'exchange_type' =>null,'create_time' =>$time];
          $exchange_id= db('exchange_record')->insertGetId($exchangedata);//返回自增ID
          //减少用户积分
          $reduce_score= db('user_crowd')->where('user_openid',$openid)->where('crowd_id',$crowd_id)->setDec('score', $goods_data["price"]);
          //增加用户积分消耗记录
          $score_record_data = ['id'=>'','openid' =>$openid,'user_id' =>$user_data["id"],'crowd_id' =>$crowd_id,'score' =>$goods_data["price"],'explain' => "兑换商品",'state' =>1,'create_time' =>$time];
          $score_record_id=db('score_record')->insert($score_record_data);
          //兑换成功给群主发消息新的
          $temmsg=userexchange($user_data["nickName"],$goods_data["goodsname"],$goods_data["price"],$crowd_id);
          //兑换成功给群主发消息旧的
          //$temmsg=userexchange($user_data["nickName"],$goods_data["goodsname"],$goods_data["price"],$crowd_id);
          $state=['state'   => '200','message'  => "兑换成功" ];
          return $state;

        }
        else{
         $state=['state'   => '400','message'  => "兑换失败，积分不足！" ];
         return $state;
        }
    }



    //用户特殊兑换商品
    public function specialexchangegoods(Request $request)
    {
        set_time_limit(0);//设置超时时间
        $wxcode =$request->param("code");
        $openid=openid($wxcode);
        $goods_id=$request->param("goods_id");//商品id
        $remarks=$request->param("remarks");//兑换备注
        $crowd_id=$request->param("crowd_id");//群id
        $crowd_name=$request->param("crowd_name");//群名称
        $time =date('Y-m-d H:i:s',time());//获取当前时间

        $address_data=db('user_address')->where('openid',$openid)->find(); //拿到地址信息

        if(!$address_data){
          $state=['state'   => '400','message'  => "兑换失败，地址不能为空" ];
          return $state;
        }

        $user_crowd_data=db('user_crowd')->where('user_openid',$openid)->where('crowd_id',$crowd_id)->find(); //用户的群信息
        $user_data=db('user')->where('openid',$openid)->find(); //拿到用户信息
        $goods_data=db('crowd_goods')->where('id',$goods_id)->find(); //拿到商品信息


        //判断用户是否兑换过这个商品。用用户名称去查询
        $exnumber=db('exchange_record')->where('crowd_id',$crowd_id)->where('user_id',$user_data["id"])->where('goodsname',$goods_data["goodsname"])->count();
        if($exnumber > 0){
          $state=['state'   => '400','message'  => "兑换失败，只能兑换一次！" ];
          return $state;
        }


        if($user_crowd_data["score"] >= $goods_data["price"] ){//判断用户记分大于商品价格
          //判断库存够
          $stock=$goods_data['stock'];
          if($stock == 999999999){
            //不限量兑换，下面的可以不要的
            $state=['state'   => '200','message'  => "不限量兑换！" ];
          }
          else{
            $number=db('crowd_goods')->where('id',$goods_id)->where('stock','>',0)->setDec('stock');
            if($number != 1){
              $state=['state'   => '400','message'  => "兑换失败，商品库存不足！" ];
              return $state;
            }
          }
          //拿到优惠券信息判断是否有优惠券
          $coupondata=db('crowd_coupon_code')->where('state',0)->where('crowd_id',$crowd_id)->find(); //拿到优惠券信息
          if($coupondata == null){
            //优惠券没了，商品库存得加回去
            $number=db('crowd_goods')->where('id',$goods_id)->setInc('stock');
            $state=['state'   => '400','message'  => "兑换失败，优惠券数量不足！" ];
            return $state;
          }

          //修改优惠券已经使用
          $updategroup= db('crowd_coupon_code')->where('id',$coupondata["id"])->update(['state' => 1 ,'update_time' =>$time]);
          //增加优惠券使用记录
          $couponexchangedata = ['id'=>'','crowd_id' =>$crowd_id,'user_id' =>$user_data["id"],'coupon_id' =>$coupondata["id"],'create_time' =>$time];
          $coupon_exchange_id= db('crowd_coupon_code_exchange')->insertGetId($couponexchangedata);
          //增加兑换记录
          $exchangedata = ['id'=>'','user_id' =>$user_data["id"],'openid' => $openid,'nickName' => $user_data["nickName"],'crowd_id' => $crowd_id,'crowd_name' => $crowd_name,'userName' =>  $address_data["userName"],'postalCode' => $address_data["postalCode"],'provinceName'=>$address_data["provinceName"],'cityName' =>$address_data["cityName"],'countyName' =>$address_data["countyName"],'detailInfo' => $address_data["detailInfo"],'nationalCode' =>$address_data["nationalCode"],'telNumber' => $address_data["telNumber"],'goodsname' => $goods_data["goodsname"],'images'=> $goods_data["images"],'price' => $goods_data["price"],'expressnumber' =>$coupondata["code"],'remarks' => $remarks,'state' => 1,'exchange_type' =>1,'create_time' =>$time];
          $exchange_id= db('exchange_record')->insertGetId($exchangedata);//返回自增ID
          //减少用户积分
          $reduce_score= db('user_crowd')->where('user_openid',$openid)->where('crowd_id',$crowd_id)->setDec('score', $goods_data["price"]);
          //增加用户积分消耗记录
          $score_record_data = ['id'=>'','openid' =>$openid,'user_id' =>$user_data["id"],'crowd_id' =>$crowd_id,'score' =>$goods_data["price"],'explain' => "兑换商品",'state' =>1,'create_time' =>$time];
          $score_record_id=db('score_record')->insert($score_record_data);


          //下发消息packages/goods/detail/index?alias=2xfj9oqstg0wv&shopAutoEnter=1
          $jumpurl="packages/goods/detail/index?alias=2xfj9oqstg0wv&shopAutoEnter=1";
          //packages/goods/detail/index?alias=3evq5dnq8iq73&shopAutoEnter=1
          // $imagedata = [
          //   "https://material.gzywudao.top/couponexchange1.jpg",
          //   "https://material.gzywudao.top/couponexchange2.jpg"
          // ];
          $imagedata = [
          ];
          $miniappname="大嘴博士购物车";
          $state=['state'   => '200','message'  => "兑换成功",'coupon_code' => $coupondata["code"],'jumpurl' => $jumpurl,'imagedata' => $imagedata,'miniappname' => $miniappname  ];
          return $state;
        }
        else{
          $state=['state'   => '400','message'  => "兑换失败，积分不足！" ];
          return $state;
        }


    }










    //商品排序
     public function sortgoods(Request $request)
    {

        $goodsdata=$request->post()["data"];//接受post提交的数组应该用$request->post();
        $number =0;
        foreach($goodsdata as $count  => $data){
          $id=$data["id"];//id
          $updateres= db('crowd_goods')->where('id',$id)->update(['sort' => $number]);
          $number=$number+1;
        }
       
        $state=['state'   => '200','message'  => "修改成功1"];
        return $state;
    }









}

