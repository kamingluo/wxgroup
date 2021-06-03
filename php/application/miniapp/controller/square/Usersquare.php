<?php
namespace app\miniapp\controller\square;
use think\Db;
use think\Request;
use think\Config;

class Usersquare
{
    public function index(Request $request)
    {

    	return  "资源广场" ;
    }


    //上传资源信息
    public function pushnews(Request $request)
    {

        $user_id =$request->param("user_id");
        $imagesdata =$request->param("images/a");
        $images =  json_encode($imagesdata);
        $introduce=$request->param("introduce");
        $type=$request->param("type");
        $wechat=$request->param("wechat");
        $qq=$request->param("qq");
        $phone=$request->param("phone");
        $time =date('Y-m-d H:i:s',time());//获取当前时间
        $dbdata = ['id'=>'','user_id' =>$user_id,'introduce' =>$introduce,'images' =>$images,'state' =>0,'type' =>$type,'wechat' =>$wechat,'qq' =>$qq,'phone' =>$phone,'see_num' =>0,'priority' =>1,'create_time' =>$time];
        $dbreturn=db('square_news')->insert($dbdata);
        $state=['state'   => '200','message'  => "资源广场发布信息成功" ];
        $resdata=array_merge($state,array('dbreturn'=>$dbreturn));
        return $resdata ;

    }

    

}
