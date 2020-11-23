<?php
namespace app\miniapp\controller\group;
use think\Db;
use think\Request;
use think\Config;

class Usergroup
{

    //查询用户拥有的群列表
    public function Usergroup(Request $request)
    {

    	$wxcode =$request->param("code");
    	$openid=openid($wxcode);
        sleep(0.5);
    	$sql = "select crowd.*,user_crowd.user_type,user_crowd.score from crowd ,user_crowd where user_crowd.crowd_id=crowd.id and user_crowd.user_openid='". $openid."';" ;
        $data = Db::query($sql); //拿到数据
        $state=['state'   => '200','message'  => "拿到用户加入群的列表" ];
        $resdata=array_merge($state,array('usergrouplist'=>$data));
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
        $open =1;
        // $open =0;
        // $open =$request->param("open") || 0;
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
         $dbdata = ['id'=>'','crowd_name' =>$crowd_name,'crowd_ownerid' => $groupowner["id"],'introduce' => $introduce,'rule' => null,'logo' => $logo,'wxnumber' => $wxnumber,'create_time' =>$time,'open' =>$open];
         $groupid= db('crowd')->insertGetId($dbdata);//返回自增ID
      
          $joingroup = ['id'=>'','user_id' => $groupowner["id"],'user_openid' =>  $groupowner["openid"],'crowd_id' => $groupid,'user_type' => 1,'score' =>0,'create_time' =>$time];
          $userjoingroup= db('user_crowd')->insertGetId($joingroup);//返回自增ID
        
         $state=['state'   => '200','message'  => "创建群成功" ];
         $resdata=array_merge($state,array('groupid'=>$groupid));
         return $resdata;

     }


        //删除群
    public function deletegroup(Request $request)
    {
         $crowd_id =$request->param("crowd_id");
         $crowd_data =db('crowd')->where('id',$crowd_id)->find();
         if($crowd_data == null ){
            $state=['state'   => '200','message'  => "不存在的群" ];
            return $state;
         }
         else{
            $crowd=db('crowd')-> where('id',$crowd_id)->delete();
            $crowd_goods=db('crowd_goods')-> where('crowd_id',$crowd_id)->delete();
            $crowd_news=db('crowd_news')-> where('crowd_id',$crowd_id)->delete();
            $exchange_record=db('exchange_record')-> where('crowd_id',$crowd_id)->delete();
            $score_record=db('score_record')-> where('crowd_id',$crowd_id)->delete();
            $task_record=db('task_record')-> where('crowd_id',$crowd_id)->delete();
            $user_crowd=db('user_crowd')-> where('crowd_id',$crowd_id)->delete();

            $state=['state'   => '200','message'  => "删除群成功" ];
            return $state;
             
         }

     }










}
