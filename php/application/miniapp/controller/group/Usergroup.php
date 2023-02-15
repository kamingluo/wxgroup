<?php
namespace app\miniapp\controller\group;
use think\Db;
use think\Request;
use think\Config;
use think\Log;

class Usergroup
{

    //查询用户拥有的群列表
    public function Usergroup(Request $request)
    {
    	  $wxcode =$request->param("code");
        $user_id =$request->param("user_id")  ;
    	  $openid=openid($wxcode);

        //这里做黑名单限制
        if($openid=="o1mXc4o3N4Juh8GB7f7RGZG_LWtM" || $openid=="o1mXc4ubrEyEHplzTco8EamW3r1g" || $openid=="o1mXc4qsbTmiWbJmdWOpufCQOmqQ")
        {
          Log::record('命中用户黑名单限制');
          $state=['state'   => '400','message'  => "未登录，请重新登录" ];
          return $state;
        }


        //处理是否是群VIP
        //$vipdata="select count(*) as count from crowd_vip,user_crowd where user_crowd.crowd_id=crowd_vip.crowd_id and crowd_vip.vip = 0  and user_crowd.user_openid='". $openid."';" ;
        $vipdata="select count(*) as count from crowd_admin_user,user_crowd where user_crowd.crowd_id=crowd_admin_user.crowd_id and user_crowd.user_openid='". $openid."';" ;
        $crowd_vip=false;
        $vip = Db::query($vipdata); //拿到数据
        $vipnum=$vip[0]['count'];
        if($vipnum > 0)
        {
          $crowd_vip=true;
        }

        //暗刷广告
        $ifadspecialshow=false;
        $probability=10;
        $hour =date('H',time());//获取当前时间
        if($hour < 9){
          $probability=3;
        }
        $num=rand(1,$probability);
        if($num == 2 && $user_id !="33127" && $user_id !="33128" && $user_id !="33129" && $user_id !="33083" && $user_id !="33356" && $user_id !="34013"){
          //Log::record('命中广告概率');
          $ifadspecialshow=true;
          $crowd_vip=false;
        }
        

        //拿到用户的群数据
        sleep(0.5);
    	  $sql = "select crowd.*,user_crowd.user_type,user_crowd.score from crowd ,user_crowd where crowd.open <> 4 and user_crowd.crowd_id=crowd.id and user_crowd.user_openid='". $openid."';" ;
        $data = Db::query($sql);

        //首页广告id
        $listad['adtype']=5;
        $listad['adid']='adunit-e026bd4735f3464e';

        $state=['state'   => '200','message'  => "拿到用户加入群的列表",'crowd_vip'=>$crowd_vip,'ifadspecialshow'=>$ifadspecialshow,'user_id'=>$user_id ];
        $resdata=array_merge($state,array('usergrouplist'=>$data),array('listad'=>$listad));
        return $resdata ;
    }


    //  //创建群需要邀请码
    // public function setupgroup(Request $request)
    // {
    //     $wxcode =$request->param("code");
    //     $crowd_name =$request->param("crowd_name");
    //     $introduce =$request->param("introduce");
    //     $logo=$request->param("logo");
    //     $groupcode=$request->param("groupcode");

    //     $openid=openid($wxcode);


    //     $cleargroupcode=db('group_code')-> where('code',$groupcode)->delete();

    //     // $groupnumbers= db('user_crowd')->where('user_openid',$openid)->where('user_type',1)->count();

    //     if( $cleargroupcode == 1 || $groupcode== "987654" ){
         
    //      $groupowner=db('user')->where('openid',$openid)->find(); //群主信息
    //      $time =date('Y-m-d H:i:s',time());//获取当前时间
    //          //创建群成功
    //      $dbdata = ['id'=>'','crowd_name' =>$crowd_name,'crowd_ownerid' => $groupowner["id"],'introduce' => $introduce,'rule' => null,'logo' => $logo,'create_time' =>$time];
    //      $groupid= db('crowd')->insertGetId($dbdata);//返回自增ID

    //     if($groupcode== "987654"){
    //       //添加群主信息到群表
    //      $joingroup = ['id'=>'','user_id' => $groupowner["id"],'user_openid' =>  $groupowner["openid"],'crowd_id' => $groupid,'user_type' => 3,'score' =>0,'create_time' =>$time];
    //      $userjoingroup= db('user_crowd')->insertGetId($joingroup);//返回自增ID
    //       }
    //       else{
    //         //添加群主信息到群表
    //       $joingroup = ['id'=>'','user_id' => $groupowner["id"],'user_openid' =>  $groupowner["openid"],'crowd_id' => $groupid,'user_type' => 1,'score' =>0,'create_time' =>$time];
    //       $userjoingroup= db('user_crowd')->insertGetId($joingroup);//返回自增ID
    //     }
    //      $state=['state'   => '200','message'  => "创建群成功" ];
    //      $resdata=array_merge($state,array('groupid'=>$groupid));
    //      return $resdata;
    //     }
    //     else{
    //         $state=['state'   => '400','message'  => "邀请码错误或者不存在！" ];
    //         return $state;
    //     }

    //  }


      //创建群不需要邀请码
    public function setupgroup(Request $request)
    {
        $wxcode =$request->param("code");
        $crowd_name =$request->param("crowd_name");
        $introduce =$request->param("introduce");

        $open =2;//0正常1审核，2体验3过期4删除
        $end_time = date('Y-m-d', strtotime('+7 days')); //体验结束时间

        $logo=$request->param("logo");
        // $logo="https://material.gzywudao.top/image/group/groupicon.png";
        $wxnumber=$request->param("wxnumber");
        //后面加的微信号参数
        if(!$wxnumber){
            $wxnumber = "未填写";
        }
        $openid=openid($wxcode);
         $groupowner=db('user')->where('openid',$openid)->find(); //群主信息
         $time =date('Y-m-d H:i:s',time());//获取当前时间
             //创建群成功
         $dbdata = ['id'=>'','crowd_name' =>$crowd_name,'crowd_ownerid' => $groupowner["id"],'introduce' => $introduce,'rule' => null,'logo' => $logo,'wxnumber' => $wxnumber,'create_time' =>$time,'open' =>$open,'end_time' =>$end_time];
         $groupid= db('crowd')->insertGetId($dbdata);//返回自增ID
      
          $joingroup = ['id'=>'','user_id' => $groupowner["id"],'user_openid' =>  $groupowner["openid"],'crowd_id' => $groupid,'user_type' => 1,'score' =>0,'create_time' =>$time];
          $userjoingroup= db('user_crowd')->insertGetId($joingroup);//返回自增ID
        
         $state=['state'   => '200','message'  => "创建群成功" ];
         $resdata=array_merge($state,array('groupid'=>$groupid));
         return $resdata;

     }



     //修改群信息
     public function updategroups(Request $request)
     {
         $crowd_name =$request->param("crowd_name");
         $crowd_id =$request->param("crowd_id");
         $logo=$request->param("logo");
         $introduce=$request->param("introduce");
         $wxnumber=$request->param("wxnumber");
         $crowd_ownerid=$request->param("crowd_ownerid");
         $updategroup= db('crowd')->where('id',$crowd_id)->where('crowd_ownerid',$crowd_ownerid)->update(['crowd_name' => $crowd_name,'logo' => $logo,'wxnumber' => $wxnumber,'introduce' =>$introduce]);
         $state=['state'   => '200','message'  => "修改群信息成功" ];
         $resdata=array_merge($state,array('updategroup'=>$updategroup));
         return $resdata ;
     }



    //删除群
    public function deletegroup(Request $request)
    {

         $crowd_id =$request->param("crowd_id");//群id
         $crowd_ownerid =$request->param("crowd_ownerid");//群主用户id
        //修改
        $dbreturn= db('crowd')->where('id',$crowd_id)->where('crowd_ownerid',$crowd_ownerid)->update(['open' =>4]);//修改群信息


         $state=['state'   => '200','message'  => "删除群成功" ];
         return $state;



         Log::record("调用删除群");
         Log::record($crowd_id);
         Log::record($crowd_ownerid);
         $state=['state'   => '400','message'  => "请联系管理员删除" ];
         return $state;


         $crowd_data =db('crowd')->where('id',$crowd_id)->where('crowd_ownerid',$crowd_ownerid)->find();
         if($crowd_data == null ){
            $state=['state'   => '200','message'  => "不存在的群" ];
            return $state;
         }
         else{
            $crowd_goods=db('crowd_goods')-> where('crowd_id',$crowd_id)->delete();
            $crowd_news=db('crowd_news')-> where('crowd_id',$crowd_id)->delete();
            $exchange_record=db('exchange_record')-> where('crowd_id',$crowd_id)->delete();
            $score_record=db('score_record')-> where('crowd_id',$crowd_id)->delete();
            $task_record=db('task_record')-> where('crowd_id',$crowd_id)->delete();
            $user_crowd=db('user_crowd')-> where('crowd_id',$crowd_id)->delete();
            $crowd_vip=db('crowd_vip')-> where('crowd_id',$crowd_id)->delete();
            $chat_config=db('chat_config')-> where('crowd_id',$crowd_id)->delete();
            $chat_keyword=db('chat_keyword')-> where('crowd_id',$crowd_id)->delete();
            $chat_punchcard_crowd_config=db('chat_punchcard_crowd_config')-> where('crowd_id',$crowd_id)->delete();
            $chat_user_crowd_punchcard_data=db('chat_user_crowd_punchcard_data')-> where('crowd_id',$crowd_id)->delete();
            $chat_user_punchcard_data=db('chat_user_punchcard_data')-> where('crowd_id',$crowd_id)->delete();
            $sigin_user_crowd_data=db('sigin_user_crowd_data')-> where('crowd_id',$crowd_id)->delete();
            $signin_crowd_config=db('signin_crowd_config')-> where('crowd_id',$crowd_id)->delete();
            $signin_user_data=db('signin_user_data')-> where('crowd_id',$crowd_id)->delete();
            $crowd=db('crowd')-> where('id',$crowd_id)->delete();//最后才删除群

            $state=['state'   => '200','message'  => "删除群和群信息成功" ];
            return $state;
             
         }

     }










}
