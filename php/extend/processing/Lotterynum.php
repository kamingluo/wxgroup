<?php
namespace processing;
use think\Db;
use think\Request;
use think\Log;

class Lotterynum{
    /**
     * @param  string $lottery_id   抽奖的活动id
     * *
     */
    public function opennumber($lottery_id){

        $partakecount=db('lottery_partake_list')->where('lottery_id',$lottery_id)->count();//拿到抽奖活动参与人数
        $lottery_data=db('lottery_crowd_list')->where('id',$lottery_id)->find(); //拿到抽奖活动信息
        $state=$lottery_data['state'];//拿到中奖概率值
        if($partakecount <= 0 ){
            echo  json_encode(['state'   => '200','message'  => "无用户参与不能开奖" ] ) ;
            die ();
            // $state=['state'   => '400','message'  => "无用户参与不能开奖" ];
            // return $state;
        }
        if($state == 1){
            echo  json_encode(['state'   => '200','message'  => "已经开过奖了" ] ) ;
            die ();
        }
        // return $lottery_data;
        $lottery_mode=$lottery_data['lottery_mode'];//拿到中奖方式
        if($lottery_mode ==0){
            //中奖方式为概率
            $lottery_probability=$lottery_data['lottery_probability'];//拿到中奖概率值
            $number=round($lottery_probability/100 * $partakecount);//计算出中奖人数值
        }
        else{
            //中奖方式为人数
            $number=$lottery_data['lottery_number'];//中奖人数等于设置的中奖人数值
        }
        if($number <= 0){
            $number=1;
        }
        return $number;


    }

}