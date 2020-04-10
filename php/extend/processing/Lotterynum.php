<?php
namespace temmsg;
use think\Db;
use think\Request;
use think\Log;

class Lotterynum{
    /**
     * 发送HTTP请求方法
     * @param  string $data   抽奖的数据
     */
    public function opennumber($lottery_data){
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
        return $number;


    }

}