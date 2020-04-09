<?php
namespace app\miniapp\controller\group;
use think\Db;
use think\Request;
use think\Config;

class Openlottery
{

    //对浮点数进行四舍五入取整
    //$newnumber=round(2.24);

    //手动开奖
    public function manual(Request $request)
    {
        $num1=30;//中奖概率
        $num2=20;//总人数
        $num3=round($num1/100*$num2);
        if($num3 <= 0){
            $num3=1;
        }
        return $num3;

        $lottery_id=$request->param("lottery_id");//抽奖id
        //先保证有用户参与才能开奖
        $partakecount=db('lottery_partake_list')->where('lottery_id',$lottery_id)->count();
        if($partakecount < 1){
            $state=['state'   => '400','message'  => "无用户参与不能开奖" ];
            return $state;
        }
        $lottery_data=db('lottery_crowd_list')->where('id',$lottery_id)->find(); //拿到抽奖活动信息
        $lottery_mode=$lottery_data['lottery_mode'];//拿到中奖方式
        if($lottery_mode ==0){
            //中奖方式为概率
            $lottery_probability=$lottery_data['lottery_probability'];//拿到中奖概率值
            $number=round($lottery_probability/100 * $partakecount);//计算出中奖人数值
            if($number <= 0){
                $number=1;
            }
        }
        else{
            //中奖方式为人数
            $number=$lottery_data['lottery_number'];//中奖人数等于设置的中奖人数值
        }

        return "手动开奖";
        
    }


}

