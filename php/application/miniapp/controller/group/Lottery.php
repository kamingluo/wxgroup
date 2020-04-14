<?php
namespace app\miniapp\controller\group;
use think\Db;
use think\Request;
use think\Config;

class Lottery
{

    //发布抽奖活动
    public function pushlottery(Request $request)
    {
        // return "发布抽奖活动";
        $crowd_id=$request->param("crowd_id");//群id
        $goods_name=$request->param("goods_name");//商品名称
        $goods_img=$request->param("goods_img");//商品图片
        $score=$request->param("score");//积分
        $luck_mode=$request->param("luck_mode");//开奖方式，0是满人开奖，1是到时间开奖
        $packed_lottery=$request->param("packed_lottery");//满多少人开奖
        $time_lottery=$request->param("time_lottery");//到时间开奖
        $lottery_mode=$request->param("lottery_mode");//中奖方式；0是概率。1是人数
        $lottery_probability=$request->param("lottery_probability");//中奖概率
        $lottery_number=$request->param("lottery_number");//中奖人数
        $wxnumber=$request->param("wxnumber");//群主微信号码
        $remarks=$request->param("remarks");//抽奖备注
        $state=0;//状态：0是未开奖，1是已开奖
        $time =date('Y-m-d H:i:s',time());//创建时间

        $data = ['id'=>'','crowd_id' =>$crowd_id,'goods_name' => $goods_name,'goods_img' => $goods_img,'score' => $score,
        'luck_mode' =>$luck_mode,'packed_lottery' => $packed_lottery,'time_lottery' => $time_lottery,'lottery_mode' => $lottery_mode ,
        'lottery_probability' =>$lottery_probability,'lottery_number' => $lottery_number,'wxnumber' => $wxnumber,'remarks' => $remarks ,
        'state' => 0,'create_time' => $time];

        $lottery_id= db('lottery_crowd_list')->insertGetId($data);//返回自增ID
        $state=['state'   => '200','message'  => "发布抽奖活动成功",'lottery_id'  => $lottery_id ];
        return $state ;
    }


    //用户进入活动详情，查询是否能参与活动

    public function userifpartake(Request $request)
    {
        $lottery_id=$request->param("lottery_id");//抽奖id
        $user_id=$request->param("user_id");//用户id
        //先查询用户有没有参与过活动
        $lottery_data=db('lottery_crowd_list')->where('id',$lottery_id)->find(); //拿到抽奖活动信息
        $crowd_id=$lottery_data['crowd_id'];//群id
        $state=$lottery_data['state'];//开奖状态
        
        //拿到参与该活动的最近10个的用户头像
        $topsql="select b.avatarUrl from lottery_partake_list a,user b where a.user_id=b.id and a.lottery_id=".$lottery_id." ORDER BY a.id DESC LIMIT 10;";
        $topdata = Db::query($topsql); //拿到数据

        //参与活动的用户总数
        $allcount=db('lottery_partake_list')->where('lottery_id',$lottery_id)->count();

        $count=db('lottery_partake_list')->where('lottery_id',$lottery_id)->where('crowd_id',$crowd_id)->where('user_id',$user_id)->count(); //用户是否参与该活动
        if($count >= 1 || $state == 1 ){
            $state=['state'   => '200','message'  => "用户已经参与活动或者活动已经开奖",'partakeif'  => false,'lottery_data'=>$lottery_data,'topuser'=>$topdata,'allcount'=>$allcount ];
            return $state ;
        }
        else{
            $state=['state'   => '200','message'  => "用户未参与活动且活动未开奖",'partakeif'  => true,'lottery_data'=>$lottery_data,'topuser'=>$topdata,'allcount'=>$allcount ];
            return $state ;
        }
    }


     //参与抽奖活动
    public function partakelottery(Request $request){
        $lottery_id=$request->param("lottery_id");//抽奖id
        $user_id=$request->param("user_id");//用户id
        $user_openid=$request->param("openid");//用户openid
        $state=1;//是否开奖，0是已经开奖，1是未开奖
        $prize=1;//0是中奖，1是未中奖
        $send=1;//0是已发奖，1是未发奖
        $time =date('Y-m-d H:i:s',time());//创建时间
        $lottery_data=db('lottery_crowd_list')->where('id',$lottery_id)->find(); //拿到抽奖活动信息
        $crowd_id=$lottery_data['crowd_id'];//群id
        $score=$lottery_data['score'];//配置的分数
        $count=db('lottery_partake_list')->where('lottery_id',$lottery_id)->where('crowd_id',$crowd_id)->where('user_id',$user_id)->count(); //用户是否参与该活动
        if($count >= 1){
            $state=['state'   => '400','message'  => "你已经参与活动了",'partake_id'  => 0 ];
            return $state ;
        }
        //本来是要查一下活动有没有结束的，但是应该不能参加结束的活动了
        if($score > 0){
          $user_crowd_data=db('user_crowd')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->find(); //拿到抽奖活动信息
          $user_crowd_score=$user_crowd_data['score'];//拿到用户的群积分
          if($user_crowd_score <  $score){
            $state=['state'   => '400','message'  => "积分不足",'partake_id'  => 0 ];
            return $state ;
          }
         //如果需要的积分大于0，那就扣除用户积分
         //减少用户积分
         $reduce_score= db('user_crowd')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->setDec('score', $score);
         //增加用户积分消耗记录
         $score_record_data = ['id'=>'','openid' =>$user_openid,'user_id' =>$user_id,'crowd_id' =>$crowd_id,'score' =>$score,'explain' => "参与抽奖",'state' =>1,'create_time' =>$time];
         $score_record_id=db('score_record')->insert($score_record_data);
        }
        $data = ['id'=>'','crowd_id' =>$crowd_id,'lottery_id' => $lottery_id,'user_id' => $user_id,'user_openid' => $user_openid,
        'state' =>$state,'prize' => $prize,'send' => $send,'create_time' => $time];
        $partake_id= db('lottery_partake_list')->insertGetId($data);//返回自增ID
        $state=['state'   => '200','message'  => "参与抽奖活动成功",'partake_id'  => $partake_id ];
        return $state ;
    }

    //查询一个活动的详细全部信息
    public function lotterydetails(Request $request){
        $lottery_id=$request->param("lottery_id");//抽奖id
        $data=db('lottery_crowd_list')-> where('id',$lottery_id)->find();
        $state=['state'   => '200','message'  => "查询一个活动的详细全部信息" ,'data' => $data];
        return $state;
    }


    //参与该抽奖活动的用户列表
    public function partakeuserlist(Request $request){
        $lottery_id=$request->param("lottery_id");//抽奖id
        $sql="select a.*,b.nickName,b.avatarUrl from lottery_partake_list a,user b where a.user_id=b.id and a.lottery_id=".$lottery_id." ORDER BY a.id DESC;";
        $data = Db::query($sql); //拿到数据
        $state=['state'   => '200','message'  => "参与该抽奖活动的用户列表" ,'data' => $data];
        return $state;
    }



    //该群发布的所有抽奖活动
    public function crowdlotterylist(Request $request){
        $crowd_id=$request->param("crowd_id");//抽奖id
        $data=db('lottery_crowd_list')-> where('crowd_id',$crowd_id)->order('id desc')->select();
        $state=['state'   => '200','message'  => "该群发布的所有抽奖活动" ,'data' => $data];
        return $state;
    }

    //该群发布的所有未开奖的抽奖活动
    public function crowdlotteryopenlist(Request $request){
        $crowd_id=$request->param("crowd_id");//抽奖id
        $data=db('lottery_crowd_list')-> where('crowd_id',$crowd_id)->where('state',0)->order('id desc')->select();

        // $sql = "SELECT u.*,count(p.lottery_id) FROM `lottery_crowd_list` u LEFT JOIN lottery_partake_list p ON u.id = p.lottery_id GROUP BY u.id;";
        // SELECT u.*,count(p.lottery_id) as count FROM `lottery_crowd_list` u  LEFT JOIN lottery_partake_list p ON u.id = p.lottery_id and u.crowd_id=14 GROUP BY u.id;
        $data = Db::query($sql); //拿到数据
        $state=['state'   => '200','message'  => "该群发布的所有未开奖的抽奖活动" ,'data' => $data];
        return $state;
    }


      //用户参与的所有抽奖活动
      public function userlotterylist(Request $request){
        $user_id=$request->param("user_id");//抽奖id
        $sql="select a.*,b.goods_name,b.goods_img from lottery_partake_list a,lottery_crowd_list b where a.lottery_id=b.id and a.user_id=".$user_id." ORDER BY a.id DESC;";
        $data = Db::query($sql); //拿到数据
        $state=['state'   => '200','message'  => "用户参与的所有抽奖活动" ,'data' => $data];
        return $state;
    }

    //查询该活动所有中奖的用户列表
    public function prizeuserlist(Request $request){
        $lottery_id=$request->param("lottery_id");//抽奖id
        $sql="select a.*,b.nickName,b.avatarUrl from lottery_partake_list a,user b where a.user_id=b.id and a.prize=0  and a.lottery_id=".$lottery_id." ORDER BY a.id DESC;";
        $data = Db::query($sql); //拿到数据
        $state=['state'   => '200','message'  => "查询该活动所有中奖的用户列表" ,'data' => $data];
        return $state;
    }

    //群主把已经中奖的用户的记录改成已经处理
    public function handlelotteryuser(Request $request){
        $partake_id=$request->param("partake_id");//抽奖记录id
        $dbreturn= db('lottery_partake_list')->where('id',$partake_id)->update(['send' =>0]);
        if($dbreturn==1){
           $state=['state'   => '200','message'  => "发奖成功" ];
           return $state;
       }
       else{
            $state=['state'   => '400','message'  => "发奖失败" ];
            return $state;
       }
    }














}

