<?php
namespace app\miniapp\controller\business;
use think\Db;
use think\Request;
use think\Config;

class Coins
{
    public function index(Request $request)
    {

    	return  "金币模块" ;
    }


    //查询用户的金币记录
    public function usercoinrecord(Request $request)
    {

        $user_id =$request->param("user_id");
        $pages=$request->param("pages");//页数
        if($pages){
            //有传pages
            $newpages= ($pages-1) * 20;//一页20条
            $userscorelist =db('coin_record')->where('user_id',$user_id)->order('id desc')->limit($newpages,20)->select(); 
        }
        else{
            //兼容没有传页数，返回全部信息
            $userscorelist =db('coin_record')->where('user_id',$user_id)->order('id desc')->select();
        }
        $count =db('coin_record')->where('user_id',$user_id)->count();

        $state=['state'   => '200','message'  => "查询用户金币记录列表" ,'count'=>$count ];
        $resdata=array_merge($state,array('userscorelist'=>$userscorelist));
        return $resdata ;

    }

    

}
