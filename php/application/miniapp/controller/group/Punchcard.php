<?php
namespace app\miniapp\controller\group;
use think\Db;
use think\Request;
use think\Config;
use think\Log;

class Punchcard
{

  

//用户签到
public function userpunchcard(Request $request)
    {
        $user_id=$request->param("user_id");//用户id;
        $openid=db('user')->where('id',$user_id)->value("openid");
        $crowd_id=$request->param("crowd_id");//群id;
        $time =date('Y-m-d H:i:s',time());
        //下面再验证一下签到能否进行
        //判断用户在这群今天有没有签到过
        $dbsigninnum =db('chat_user_punchcard_data')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->whereTime('create_time', 'today')->count();
        if($dbsigninnum>=1){
         $resdata=['state'   => '400','message'  => "你今天已经打卡了" ];
         return $resdata;
        }
        //拿到群签到配置信息，判断今天这群能否签到
        $crowdchatdata=db('chat_punchcard_crowd_config')->where('crowd_id',$crowd_id)->find(); 
        $start = strtotime($crowdchatdata['start_time']);
        $end = strtotime($crowdchatdata['end_time']);
        $now=strtotime($time);
        $punchstate=$crowdchatdata['state'];
        if($punchstate != 0 || $now < $start || $now >$end){
            $resdata=['state'   => '400','message'  => "该群暂时不能打卡" ];
            return $resdata;
        }
        //都没问题了，开始打卡
        //先给用户加上积分
        $score=$crowdchatdata['punch_card_score'];
        if($score > 0){
            //配置的积分大于0才加，小于0不加
            $addscore= db('user_crowd')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->setInc('score',$score);//找到该用户的群账户加积分
            //加积分记录
            $score_record_data = ['id'=>'','openid' =>$openid,'user_id' =>$user_id,'crowd_id' =>$crowd_id,'score' =>$score,'explain' => "群打卡奖励",'state' =>0,'create_time' =>$time];
            $score_record_id=db('score_record')->insert($score_record_data);
        }

        //加完积分，给用户签到表signin_user_data加一条今天的记录
        $currentranking =db('chat_user_punchcard_data')->where('crowd_id',$crowd_id)->whereTime('create_time', 'today')->count();//查询今日签到人数，也就这人的排名数了
        $newranking=$currentranking+1;

        $today_signin_record = ['id'=>'','crowd_id' =>$crowd_id,'user_id' =>$user_id,'user_openid' =>$openid,'punch_score' =>$score,'ranking' =>$newranking,'create_time' =>$time];
        $today_signin_record_id=db('signin_user_data')->insert($today_signin_record);


        //先看看用户在该群有没有签到过总记录数据
        $usercrowdsigindata=db('chat_user_crowd_punchcard_data')->where('crowd_id',$crowd_id)->where('user_id',$user_id)->find(); //拿到用户在该群有没有签到过数据
        if($usercrowdsigindata == null ){
            //没有在该群签到过，新建一条记录
            $dbinsert = ['id'=>'','crowd_id' =>$crowd_id,'user_id' => $user_id,'user_openid' => $openid,'all_punch_number' =>1,'continuity_number' =>1,'update_time' =>$time,'create_time' =>$time];
            $signinconfigId= db('chat_user_crowd_punchcard_data')->insertGetId($dbinsert);//返回自增ID
            //总签到跟连续签到次数都为1
            $new_all_signin_number=1;
            $new_continuity_number=1;
        }
        else{
            //有记录，开始更新记录
            $new_all_signin_number=$usercrowdsigindata['all_punch_number'] + 1;
            $user_yesterday_signin=db('signin_user_data')->where('crowd_id',$crowd_id)->where('user_id',$user_id)->whereTime('create_time', 'yesterday')->find(); //用户昨天在该群有没有签到过
            if($user_yesterday_signin ==null){
                //昨天没签到，那就连续签到为1
                $new_continuity_number=1;
            }
            else{
                //昨天有签到，那就+1
                $new_continuity_number=$usercrowdsigindata['continuity_number']+1;
            }
            //更新群签到记录
            $dbreturn= db('chat_user_crowd_punchcard_data')->where('crowd_id',$crowd_id)->where('user_id',$user_id)->update(['update_time' => $time,'all_punch_number' => $new_all_signin_number,'continuity_number' =>$new_continuity_number]);
        }

        //开始判断是否有连续签到
        $ifcontinuity_signin=false;//先把用户这次是否完成连续签到默认置为关闭的
        if($crowdsignindata['continuity_signin'] == 0){
            //该群设置有连续签到
            // $user_yesterday_signin=db('signin_user_data')->where('crowd_id',$crowd_id)->where('user_id',$user_id)->whereTime('create_time', 'yesterday')->find(); //用户昨天在该群有没有签到过
            $continuity_signin_day=$crowdsignindata['continuity_signin_day'];//连续签到几天给奖励
            $continuity_signin_score=$crowdsignindata['continuity_signin_score'];//给奖励的积分数
            //判断用户连续签到天数满足不,满足条件为：连续签到天数达到要求，奖励分数大于0，昨天有签到(这里有一种可能，就是先没开启连续签到，但是用户累计签到达到了数量，也给下发奖励，然后清O连续签到数量)
            if($new_continuity_number >=$continuity_signin_day && $continuity_signin_score > 0 ){
                //达到连续签到的要求且积分数大于0，加积分
                $addscore= db('user_crowd')->where('user_id',$user_id)->where('crowd_id',$crowd_id)->setInc('score',$continuity_signin_score);//找到该用户的群账户加积分
                //加积分记录
                $score_record_data = ['id'=>'','openid' =>$openid,'user_id' =>$user_id,'crowd_id' =>$crowd_id,'score' =>$continuity_signin_score,'explain' => "群连续签到奖励",'state' =>0,'create_time' =>$time];
                $score_record_id=db('score_record')->insert($score_record_data);
                //然后再把连续签到置为0，方便下一次计算
                $dbreturn= db('sigin_user_crowd_data')->where('crowd_id',$crowd_id)->where('user_id',$user_id)->update(['continuity_number' =>0]);
                $ifcontinuity_signin=true;//用户完成了一次连续签到
            }
        }
        $ranking =db('signin_user_data')->where('crowd_id',$crowd_id)->whereTime('create_time', 'today')->count();//查询今日签到人数，也就这人的排名数了
        $state=['state'   => '200','message'  => "用户签到成功" ];
        $resdata=array_merge($state,array('ifcontinuity_signin'=>$ifcontinuity_signin,'new_all_signin_number'=>$new_all_signin_number,'new_continuity_number'=>$new_continuity_number,'ranking'=>$ranking));
        return $resdata;
    }




    //群的打卡配置
    public function punchcardconfig(Request $request)
    {
        //拿到数据
        $crowd_id=$request->param("crowd_id");
        $score=$request->param("score");
        $tips=$request->param("tips");
        $state=$request->param("state");
        $start_time=$request->param("start_time");
        $end_time=$request->param("end_time");
        $continuity_signin=$request->param("continuity_punch");
        $continuity_signin_day=$request->param("continuity_punch_day");
        $continuity_signin_score=$request->param("continuity_punch_score");
        $time =date('Y-m-d H:i:s',time());

        $dbdata =db('chat_punchcard_crowd_config')->where('crowd_id',$crowd_id)->find();//查询群签到配置信息
        if($dbdata==null){
            //没有配置信息，新增一条
            $dbinsert = ['id'=>'','crowd_id' =>$crowd_id,'score' => $score,'tips' => $tips,'state' => $state,'start_time' =>$start_time,'end_time' =>$end_time,'continuity_punch' => $continuity_punch,'continuity_punch_day' => $continuity_punch_day,'continuity_punch_score' => $continuity_punch_score,'create_time' =>$time ,'update_time' =>$time];
            $punchconfigId= db('chat_punchcard_crowd_config')->insertGetId($dbinsert);//返回自增ID
            $state=['state'   => '200','message'  => "新增群签到配置成功" ];
            return $state;
        }
        else{
             //更新信息
             $dbreturn= db('chat_punchcard_crowd_config')->where('crowd_id',$crowd_id)->update(['update_time' => $time,'score' => $score,'tips' => $tips,'state' => $state,'start_time' =>$start_time,'end_time' =>$end_time,'continuity_punch' => $continuity_punch,'continuity_punch_day' => $continuity_punch_day,'continuity_punch_score' => $continuity_punch_score]);
             if($dbreturn==1){
                  $state=['state'   => '200','message'  => "群打卡配置更新成功" ];
                  return $state;
             }
             else{
                  $state=['state'   => '400','message'  => "群打卡配置更新失败" ];
                  return $state;
             }

        }

    }


       //查询群的打卡配置查询

     public function querypunchdata(Request $request){
        $crowd_id=$request->param("crowd_id");
        $punchdata=db('chat_punchcard_crowd_config')->where('crowd_id',$crowd_id)->find(); //拿到群签到配置信息
        $state=['state'   => '200','message'  => "群的签到配置查询",'punchdata'=> $punchdata ];
        return $state;

      }






}

