<?php
namespace app\miniapp\controller\group;
use think\Db;
use think\Request;
use think\Config;

class Handlelimittask
{

    //发布限时任务
    public function pushlimittask(Request $request)
    {
      $pages=$request->param("pages");//页数
      $crowd_id =$request->param("crowd_id");//群id
      $keyword=$request->param("keyword");//关键词
      $newkeyword="%".$keyword."%";
      if($pages){
          //有传pages
          $newpages= ($pages-1) * 20;//一页20条
          //$dballtasklists =db('corwd_limit_task_record')->where('crowd_id',$crowd_id)->where('nickName','like',$newkeyword)->order('id desc')->limit($newpages,20)->select();
          $dballtasklists = db()->table(array('corwd_limit_task_record'=>'t1','user'=>'t2'))->field('t1.*,t2.nickName')->where('t1.user_id=t2.id')->where('t1.crowd_id',$crowd_id)->where('t2.nickName','like',$newkeyword)->order('id desc')->limit($newpages,20)->select();
      }
      else{
          //兼容没有传页数，返回全部信息
          $dballtasklists = db()->table(array('corwd_limit_task_record'=>'t1','user'=>'t2'))->field('t1.*,t2.nickName')->where('t1.user_id=t2.id')->where('t1.crowd_id',$crowd_id)->where('t2.nickName','like',$newkeyword)->order('id desc')->select();
      }

      $count =db()->table(array('corwd_limit_task_record'=>'t1','user'=>'t2'))->field('t1.*,t2.nickName')->where('t1.user_id=t2.id')->where('t1.crowd_id',$crowd_id)->where('t2.nickName','like',$newkeyword)->count();

      $state=['state'   => '200','message'  => "查询该群的全部限时任务",'count'=>$count ];
      $resdata=array_merge($state,array('alltasklists'=>$dballtasklists));
      return $resdata ;

    }



}
