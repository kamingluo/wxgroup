<?php
namespace app\miniapp\controller\group;
use think\Db;
use think\Request;
use think\Config;
use processing\Lotterynum;
use temmsg\Lotterymsg;
use think\Log;

class Openlottery
{

    //对浮点数进行四舍五入取整
    //$newnumber=round(2.24);

    //手动开奖
    public function manual(Request $request)
    {
        $lottery_id=$request->param("lottery_id");//抽奖id
        //先保证有用户参与才能开奖

        //计算中奖人数
        $Lotterynum = new Lotterynum();
        $opennumber=$Lotterynum -> opennumber($lottery_id);
        // return $opennumber;

        //先将全部人设置为未中奖和已经开奖
        $dbreturn= db('lottery_partake_list')->where('lottery_id',$lottery_id)->update(['prize' => 1,'state' => 1]);

        //再根据中奖人数，随机挑选设置为中奖
        // $sql="UPDATE lottery_partake_list SET prize=0 WHERE  lottery_id =".$lottery_id." and id in ( SELECT F.id FROM (SELECT * FROM lottery_partake_list ORDER BY RAND() LIMIT ".$opennumber.") F);";
        $sql="update lottery_partake_list set prize = 0 WHERE lottery_id =".$lottery_id." order by rand() limit ".$opennumber.";";
        // $Model = new Model();

        $updatenum = Db::execute($sql); //执行，随机选取中奖人数
        $updatestate= db('lottery_crowd_list')->where('id',$lottery_id)->update(['state' => 1]);//更新抽奖活动为已经，开奖

        $lottery_data=db('lottery_crowd_list')->where('id',$lottery_id)->find(); //拿到抽奖活动信息
        $goods_name=$lottery_data['goods_name'];//拿到奖品名称
        //然后发送消息给参与的人
        $lotterymsg = new Lotterymsg();
        $text = $lotterymsg -> lotterymssage($lottery_id,$goods_name);
       
         return ['state'   => '200','message'  => "手动开奖成功" ];

        
    }

   
    //自动开奖
    public function automatic(){
        $time =date('Y-m-d H:i:s',time());//获取当前时间

        //查询要开奖的数据

        $lotterydata =db('lottery_crowd_list')->where('luck_mode',1)->where('state',0)->whereTime('time_lottery', '<=', $time)->select();//根据抽奖id拿到要推送的用户
        $count = count($lotterydata);//拿到数值条数
        $Lotterynum = new Lotterynum();//计算开奖人数
        $lotterymsg = new Lotterymsg();//发送开奖通知

        foreach($lotterydata as $count  => $data){
            $lottery_id=$data["id"];//抽奖活动id
            $partakecount=db('lottery_partake_list')->where('lottery_id',$lottery_id)->count();//拿到抽奖活动参与人数
            if($partakecount < 1){
                Log::record("不开奖");
                //无用户参与，不用开奖，直接把活动设置已经开奖
                $updatestate= db('lottery_crowd_list')->where('id',$lottery_id)->update(['state' => 1]);//更新抽奖活动为已经，开奖
            }
            else{
                //有用户参与，开奖
                $opennumber=$Lotterynum -> opennumber($lottery_id);
                Log::record("执行开奖,下面是开奖人数");
                Log::record($opennumber);

                //先将全部人设置为未中奖和已经开奖
                $dbreturn= db('lottery_partake_list')->where('lottery_id',$lottery_id)->update(['prize' => 1,'state' => 1]);

                //再根据中奖人数，随机挑选设置为中奖
                // $sql="UPDATE lottery_partake_list SET prize=0 WHERE  lottery_id =".$lottery_id." and id in ( SELECT F.id FROM (SELECT * FROM lottery_partake_list ORDER BY RAND() LIMIT ".$opennumber.") F);";
                $sql="update lottery_partake_list set prize = 0 WHERE lottery_id =".$lottery_id." order by rand() limit ".$opennumber.";";
                // $Model = new Model();

                $updatenum = Db::execute($sql); //执行，随机选取中奖人数
                $updatestate= db('lottery_crowd_list')->where('id',$lottery_id)->update(['state' => 1]);//更新抽奖活动为已经，开奖

                $lottery_data=db('lottery_crowd_list')->where('id',$lottery_id)->find(); //拿到抽奖活动信息
                $goods_name=$lottery_data['goods_name'];//拿到奖品名称
                //然后发送消息给参与的人
                $text = $lotterymsg -> lotterymssage($lottery_id,$goods_name);
            }


        }

        return "自动开奖完成";

    }



   public function fullnumber(Request $request)
    {

        $lottery_id=$request->param("lottery_id");//抽奖id
        $lottery_data=db('lottery_crowd_list')->where('id',$lottery_id)->find(); //拿到抽奖活动信息

        $state=$lottery_data['state'];//是否已经开奖
        $luck_mode=$lottery_data['luck_mode'];//开奖方式0是满人开奖，1是到时间开奖
        $packed_lottery=$lottery_data['packed_lottery'];//满多少人开奖数
        $partakecount=db('lottery_partake_list')->where('lottery_id',$lottery_id)->count();//拿到抽奖活动参与人数
        $Lotterynum = new Lotterynum();//计算开奖人数
        $lotterymsg = new Lotterymsg();//发送开奖通知

        if($state== 0 && $luck_mode ==0 && $partakecount >= $packed_lottery){
              //满足条件，开始计算开奖
              //计算中奖人数
              $opennumber=$Lotterynum -> opennumber($lottery_id);
              //先将全部人设置为未中奖和已经开奖
              $dbreturn= db('lottery_partake_list')->where('lottery_id',$lottery_id)->update(['prize' => 1,'state' => 1]);


              //再根据中奖人数，随机挑选设置为中奖
              // $sql="UPDATE lottery_partake_list SET prize=0 WHERE  lottery_id =".$lottery_id." and id in ( SELECT F.id FROM (SELECT * FROM lottery_partake_list ORDER BY RAND() LIMIT ".$opennumber.") F);";
              $sql="update lottery_partake_list set prize = 0 WHERE lottery_id =".$lottery_id." order by rand() limit ".$opennumber.";";
              // $Model = new Model();

              $updatenum = Db::execute($sql); //执行，随机选取中奖人数
              $updatestate= db('lottery_crowd_list')->where('id',$lottery_id)->update(['state' => 1]);//更新抽奖活动为已经，开奖

              $lottery_data=db('lottery_crowd_list')->where('id',$lottery_id)->find(); //拿到抽奖活动信息
              $goods_name=$lottery_data['goods_name'];//拿到奖品名称
              //然后发送消息给参与的人
              $text = $lotterymsg -> lotterymssage($lottery_id,$goods_name);

        }
        else{

             return ['state'   => '200','message'  => "不满足条件" ];
        }

        return ['state'   => '200','message'  => "满人开奖成功" ];

    }









}

