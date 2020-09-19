<?php
namespace app\miniapp\controller\business;
use think\Db;
use think\Request;
use think\Config;

class Gdtad
{
    public function index(Request $request)
    {

    	return  "广点通广告" ;
	}
	


	//点击广点通广告统计
	public function clickad(Request $request)
    {
		$user_id =$request->param("user_id");//用户id
		if($user_id==0){
			$resdata=['state'   => '200','message'  => "官方审核人员没id不统计"];
		    return $resdata;
		}
		$channel=$request->param("channel");//渠道
		$adtype=$request->param("adtype");//广告类型，1：banner，2：激励视频，3：格子，4：视频广告 5:模板广告，6：小盟广告
		$position=$request->param("position");//位置
		$time =date('Y-m-d H:i:s',time());//获取当前时间
		$adres = ['id'=>'','user_id' =>$user_id,'channel' =>$channel,'adtype' =>$adtype,'position' =>$position,'create_time' =>$time];
		$addata=db('click_gdt_ad')->insert($adres);
		$resdata=['state'   => '200','message'  => "统计广告成功"];
		return $resdata;
    }



    public function usertodayads(Request $request)
    {
        // $wxcode =$request->param("code");
        // $openid=openid($wxcode);
        $user_id =$request->param("user_id");
        $banner =db('gdt_ad_record')->where('user_id',$user_id)->where('adtype',1)->whereTime('create_time', 'today')->count();//查询今日点击banner广告数
        $video =db('gdt_ad_record')->where('user_id',$user_id)->where('adtype',2)->whereTime('create_time', 'today')->count();//查询今日点击视频广告数
        $grid =db('gdt_ad_record')->where('user_id',$user_id)->where('adtype',3)->whereTime('create_time', 'today')->count();//查询今日点击格子广告数
        $state=['state' => '200','message' => "用户今日点击广告数" ];
        $data=['banner' => $banner,'video' => $video,'grid' => $grid];
        $coins=['invitation' => 0,'banner' => 80,'video' => 40,'grid' =>70];//配置奖励金币数，邀请的为0暂时关闭
        $resdata=array_merge($state,array('clickdata'=>$data),array('coins'=>$coins));
        return $resdata;
    }



    //点击banner广告成功记录
	public function clickbannerad(Request $request)
	{
		$wxcode =$request->param("code");
        $openid=openid($wxcode);
        $user_id =$request->param("user_id");
        $channel=$request->param("channel");
        $adid=$request->param("adid");
        $coin = 80; //写死多少金币
    	$time =date('Y-m-d H:i:s',time());//获取当前时间
    	$dbnum =db('gdt_ad_record')->where('openid',$openid)->where('adtype',1)->whereTime('create_time', 'today')->count();//查询今日点广告数
    	if($dbnum >= 2){
    		$resdata=['state'   => '400','message'  => "你今天banner广告点击已经两次了","clickbannerad"=>'fail' ];
            return $resdata;
    	}
    	else{
    		//自己加积分
    		$addscore= db('user')->where('openid',$openid)->setInc('coin',$coin);
    		//增加点击广告记录
    		$adres = ['id'=>'','user_id' =>$user_id,'openid' =>$openid,'channel' =>$channel,'adid' =>$adid,'adtype' =>1,'coin' =>$coin,'create_time' =>$time];
    	    $addata=db('gdt_ad_record')->insert($adres);
    	    //增加积分变化记录
    	    $datares = ['id'=>'','user_id' =>$user_id,'openid' =>$openid,'coin' =>$coin,'explain' =>"点击banner广告",'channel' =>$channel,'state' =>0,'create_time' =>$time];
        	$data=db('coin_record')->insert($datares);

        	if($addscore==1&&$addata==1&&$data==1){
        	     $resdata=['state'   => '200','message'  => "点击banner广告成功","clickbannerad"=>'success' ];
                 return $resdata;
        	}
        	else{
        		$resdata=['state'   => '400','message'  => "点击banner广告失败","clickbannerad"=>'fail' ];
                 return $resdata;
        	}
    	}
    }
    




     //点击grid广告成功记录
	public function clickgridad(Request $request)
	{
		$wxcode =$request->param("code");
        $openid=openid($wxcode);
        $user_id =$request->param("user_id");
        $channel=$request->param("channel");
        $adid=$request->param("adid");
        $coin = 70; //写死多少金币
    	$time =date('Y-m-d H:i:s',time());//获取当前时间
    	$dbnum =db('gdt_ad_record')->where('openid',$openid)->where('adtype',3)->whereTime('create_time', 'today')->count();//查询今日点广告数
    	if($dbnum >= 2){
    		$resdata=['state'   => '400','message'  => "你今天grid广告点击已经两次了","clickgridad"=>'fail' ];
            return $resdata;
    	}
    	else{
    		//自己加积分
    		$addscore= db('user')->where('openid',$openid)->setInc('coin',$coin);
    		//增加点击广告记录
    		$adres = ['id'=>'','user_id' =>$user_id,'openid' =>$openid,'channel' =>$channel,'adid' =>$adid,'adtype' =>3,'coin' =>$coin,'create_time' =>$time];
    	    $addata=db('gdt_ad_record')->insert($adres);
    	    //增加积分变化记录
    	    $datares = ['id'=>'','user_id' =>$user_id,'openid' =>$openid,'coin' =>$coin,'explain' =>"点击格子广告",'channel' =>$channel,'state' =>0,'create_time' =>$time];
        	$data=db('coin_record')->insert($datares);

        	if($addscore==1&&$addata==1&&$data==1){
        	     $resdata=['state'   => '200','message'  => "点击grid广告成功","clickgridad"=>'success' ];
                 return $resdata;
        	}
        	else{
        		$resdata=['state'   => '400','message'  => "点击grid广告失败","clickgridad"=>'fail' ];
                 return $resdata;
        	}
    	}
	}




    //观看视频广告成功记录
	public function lookvideoad(Request $request)
	{
		$wxcode =$request->param("code");
        $openid=openid($wxcode);
        $user_id =$request->param("user_id");
        $channel=$request->param("channel");
        $adid=$request->param("adid");
        $coin = 40; //写死多少金币
    	$time =date('Y-m-d H:i:s',time());//获取当前时间
    	$dbnum =db('gdt_ad_record')->where('openid',$openid)->where('adtype',2)->whereTime('create_time', 'today')->count();//查询今日点广告数
    	if($dbnum >= 4){
    		$resdata=['state'   => '400','message'  => "你观看视频广告已经4次了","lookvideoad"=>'fail' ];
            return $resdata;
    	}
    	else{
    		$addscore= db('user')->where('openid',$openid)->setInc('coin',$coin);
    		$adres = ['id'=>'','user_id' =>$user_id,'openid' =>$openid,'channel' =>$channel,'adid' =>$adid,'adtype' =>2,'coin' =>$coin,'create_time' =>$time];
            $addata=db('gdt_ad_record')->insert($adres);
            
    	    $datares = ['id'=>'','user_id' =>$user_id,'openid' =>$openid,'coin' =>$coin,'explain' =>"观看视频广告",'channel' =>$channel,'state' =>0,'create_time' =>$time];
        	$data=db('coin_record')->insert($datares);
        	if($addscore==1&&$addata==1&&$data==1){
        	     $resdata=['state'   => '200','message'  => "观看视频广告成功","lookvideoad"=>'success' ];
                 return $resdata;
        	}
        	else{
        		$resdata=['state'   => '400','message'  => "观看视频广告失败","lookvideoad"=>'fail' ];
                 return $resdata;
        	}
    	}
	}







    
}
