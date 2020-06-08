<?php
namespace app\admin\controller\configure;
use think\Db;
use think\Request;
use think\Config;
use qiniu\Deletefile;
use app\miniapp\controller\Currency;//跨模块调用
class Desgroup
{

   //群列表，显示多少群员
   public function groupslist(Request $request){
           $id=$request->param("id");
           if($id){
              //根据id查询的
              //$data=db('crowd')->where('id',$id)->select();
              $sql='select count(1) as count,a.* from crowd a,user_crowd b where a.id=b.crowd_id and a.id='.$id.' group by a.id ORDER BY a.id DESC;';
              //return $sql;
              $data = Db::query($sql); //拿到数据
              $countnumber=db('crowd')->where('id',$id)->count();
              $state=['state'   => '200','message'  => "群查询成功" ];
              $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
              return $resdata ;
           }

           $pages=$request->param("pages");
           if($pages == 1 || $pages==null  ){
             $number=0;
           }
           else{
             $number=($pages - 1)*10 ;
           }
            
           $wxnumberif=$request->param("wxnumberif");
           if($wxnumberif){
            $countnumber=db('crowd')->where('wxnumber','neq',"未填写")->count();

            $sql="select count(1) as count,a.* from crowd a,user_crowd b where a.id=b.crowd_id and a.wxnumber != '未填写'  group by a.id ORDER BY count DESC LIMIT ".$number.",10;";
            $data = Db::query($sql); //拿到数据


            //$data=db('crowd')->where('wxnumber','neq',"未填写")->order('id desc')->limit($number,10)->select();
            $state=['state'   => '200','message'  => "群列表查询成功(微信号不为空)" ];
            $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
            return $resdata ;
           }

           $crowd_name=$request->param("crowd_name");
           if($crowd_name){
              //名称不为空
              $countnumber=db('crowd')->where('crowd_name','like',"%$crowd_name%")->count();
              $sql="select count(1) as count,a.* from crowd a,user_crowd b where a.id=b.crowd_id and a.crowd_name like '%".$crowd_name."%' group by a.id ORDER BY count DESC LIMIT ".$number.",10;";
              $data = Db::query($sql); //拿到数据
           }
           else{
            $countnumber=db('crowd')->count();
            $sql="select count(1) as count,a.* from crowd a,user_crowd b where a.id=b.crowd_id group by a.id ORDER BY count DESC LIMIT ".$number.",10;";
            $data = Db::query($sql); //拿到数据
           }
           $state=['state'   => '200','message'  => "群列表查询成功" ];
           $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
           return $resdata ;
       }
   
    //群列表
   //  public function groupslist(Request $request){
   //      $id=$request->param("id");
   //      if($id){
   //         //根据id查询的
   //         $data=db('crowd')->where('id',$id)->select();
   //         $countnumber=db('crowd')->where('id',$id)->count();
   //         $state=['state'   => '200','message'  => "群查询成功" ];
   //         $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
   //         return $resdata ;
   //      }
   //      $pages=$request->param("pages");
   //      $crowd_name=$request->param("crowd_name");
   //      if($pages == 1 || $pages==null  ){
   //        $number=0;
   //      }
   //      else{
   //        $number=($pages - 1)*10 ;
   //      }
   //      if($crowd_name){
   //         //名称不为空
   //         $countnumber=db('crowd')->where('crowd_name','like',"%$crowd_name%")->count();
   //         $data=db('crowd')->where('crowd_name','like',"%$crowd_name%")->order('id desc')->limit($number,10)->select();
   //      }
   //      else{
   //       $countnumber=db('crowd')->count();
   //       $data=db('crowd')->order('id desc')->limit($number,10)->select();
   //      }
   //      $state=['state'   => '200','message'  => "群列表查询成功" ];
   //      $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
   //      return $resdata ;
   //  }

   //删除一个群
   public function deletegroup(Request $request){
    $crowd_id =$request->param("id");
    $crowd_data =db('crowd')->where('id',$crowd_id)->find();
    if($crowd_data == null ){
       $state=['state'   => '200','message'  => "不存在的群" ];
       return $state;
    }
    else{
       //删除七牛文件，暂时不能删除，因为有些是使用默认图片的
      //  $deletefile = new Deletefile();
      //  $deleteresult=$deletefile -> one($crowd_data['logo']);
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



   public function groupdetails(Request $request){

      $crowd_id =$request->param("id");

      //群今日新增人数
      $registersql="select count(*) as count from user a,user_crowd b where  a.id=b.user_id and b.crowd_id=".$crowd_id." and to_days(a.create_time) = to_days(now());";
      $oldgroupregister = Db::query($registersql); //拿到数据
      $groupregister=$oldgroupregister[0]['count'];

      //群今日活跃用户数
      $activesql="select count(*) as count from user a,user_crowd b where  a.id=b.user_id and b.crowd_id=".$crowd_id." and to_days(a.update_time) = to_days(now());";
      $oldgroupactive = Db::query($activesql); //拿到数据
      $groupactive=$oldgroupactive[0]['count'];


      //群今日提交任务数
      $grouptasks=db('task_record')-> where('crowd_id',$crowd_id)->whereTime('create_time', 'today')->count();//今天上传任务数
      //群今日签到次数
      $groupsigins=db('signin_user_data')-> where('crowd_id',$crowd_id)->whereTime('create_time', 'today')->count();//今天签到人数
      //群今日抽奖次数
      $grouplotterys=db('lottery_partake_list')-> where('crowd_id',$crowd_id)->whereTime('create_time', 'today')->count();//今天抽奖人数
      //群今日兑换次数
      $groupexchanges=db('exchange_record')-> where('crowd_id',$crowd_id)->whereTime('create_time', 'today')->count();//今天兑换次数


      $state=['state'   => '200','message'  => "查询群今日数据成功" ];

      $data=['groupregister'   => $groupregister,'groupactive'   => $groupactive,'grouptasks'   => $grouptasks,'groupsigins'   => $groupsigins,'grouplotterys'   => $grouplotterys,'groupexchanges'   => $groupexchanges];

      $resdata=array_merge($state,array('data'=>$data));
      return $resdata ;
   }



   //后台生成群二维码
    public function groupqrcode(Request $request)
   {

      $newCurrency = new Currency;
      $data = $newCurrency ->getqrcode($request);
      // echo $data;
      return $data ;

      # code...
   }









}