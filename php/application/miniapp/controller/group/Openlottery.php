<?php
namespace app\miniapp\controller\group;
use think\Db;
use think\Request;
use think\Config;
use processing\Lotterynum;

class Openlottery
{

    //对浮点数进行四舍五入取整
    //$newnumber=round(2.24);

    //手动开奖
    public function manual(Request $request)
    {
        $lottery_id=$request->param("lottery_id");//抽奖id
        //先保证有用户参与才能开奖
        $partakecount=db('lottery_partake_list')->where('lottery_id',$lottery_id)->count();
        if($partakecount < 1){
            $state=['state'   => '400','message'  => "无用户参与不能开奖" ];
            return $state;
        }
        $lottery_data=db('lottery_crowd_list')->where('id',$lottery_id)->find(); //拿到抽奖活动信息


       

        return "手动开奖";
        
    }


}

