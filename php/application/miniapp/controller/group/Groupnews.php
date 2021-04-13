<?php
namespace app\miniapp\controller\group;
use think\Db;
use think\Request;
use think\Config;
use qiniu\Deletefile;

class Groupnews
{

    //查询群消息列表
    public function Groupnewslist(Request $request)
    {
    	$crowd_id=$request->param("crowd_id");//群id
    	$pages=$request->param("pages");
    	$number=($pages - 1)*10 ;
        $data=db('crowd_news')->where('crowd_id',$crowd_id)->order('id desc')->limit($number,10)->select();
        $state=['state'   => '200','message'  => "群消息列表查询成功" ];
        $resdata=array_merge($state,array('data'=>$data));
        return $resdata ;
      
    }



    //发布群消息
     public function pushgroupnews(Request $request)
     {

        $wxcode =$request->param("code");
        $openid=openid($wxcode);
        $userdata=db('user')->where('openid',$openid)->find();
     	 $crowd_id=$request->param("crowd_id");
     	 $content=$request->param("content");
         $imagesdata =$request->param("images/a");
     	  $images =  json_encode($imagesdata);
     	 $titleimage=$request->param("titleimage");
     	 $time =date('Y-m-d H:i:s',time());

     	 $dbdata = ['id'=>'','crowd_id' =>$crowd_id,'publisher' => $userdata["nickName"],'headportrait' => $userdata["avatarUrl"],'content' => $content,'images' => $images,'titleimage' => $titleimage,'watchnum' => 0,'create_time' =>$time];
         $crowd_news_id= db('crowd_news')->insertGetId($dbdata);//返回自增ID
         $state=['state'   => '200','message'  => "发布群信息成功" ];
         $resdata=array_merge($state,array('crowdnewsid'=>$crowd_news_id));
         return $resdata ;

     }


    //查询消息详情
    public function newsdetails(Request $request)
    {
    	$id=$request->param("id");
        $data=db('crowd_news')->where('id',$id)->find();


      //观看次数加1
        $dbreturn= db('crowd_news')->where('id',$id)->setInc('watchnum',1);

        $images=json_decode($data["images"]);//先取出值，反转义一下
        unset($data['images']);//去除原来数据里面的值
        $newsdetails=array_merge($data,array('images'=>$images));//再把转义后的值增加进去
        $state=['state'   => '200','message'  => "查询消息详情成功" ];
        $resdata=array_merge($state,array('newsdetails'=>$newsdetails));
        return $resdata ;
      
    }



    //删除群消息
    public function clearnews(Request $request)
    {

        $id=$request->param("id");
        $data=db('crowd_news')->where('id',$id)->find();

        // $deletefile = new Deletefile();
        // $deleteresult=$deletefile -> more($data['images']);
        $deleteresult=false;


        $cleardata=db('crowd_news')-> where('id',$id)->delete();

        if($cleardata ==1){
             $state=['state'   => '200','message'  => "删除成功",'deleteresult' => $deleteresult];
        }
        else{
             $state=['state'   => '400','message'  => "删除失败",'deleteresult' => $deleteresult ];
        }
        return  $state;
      
    }






}

