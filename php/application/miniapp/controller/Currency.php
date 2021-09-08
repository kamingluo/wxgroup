<?php
namespace app\miniapp\controller;
vendor('Qiniu.autoload');
use think\Db;
use think\Request;
use think\Config;
use Qiniu\Auth;
use Qiniu\Storage\UploadManager;

class Currency
{


   public function qiniu()
    {

        // Vendor('phpmailer.phpmailer'); 
        $accessKey = Config('qiniuaccessKey');
        $secretKey = Config('qiniusecretKey');
          $auth = new Auth($accessKey, $secretKey);
          $bucket = 'group';
          // 生成上传Token
         $upToken  = $auth->uploadToken($bucket);

        // return  $upToken;
         $ret = array('message' => "生成七牛上传Token成功",'uptoken' => $upToken);
         return $ret;
    
          // // 要上传文件的本地路径
          // $filePath = './logo.png';
          // // 上传到七牛后保存的文件名
          // $key = 'logo.png';
          // // 初始化 UploadManager 对象并进行文件的上传。
          // $uploadMgr = new UploadManager();
          // // 调用 UploadManager 的 putFile 方法进行文件的上传。
          // list($ret, $err) = $uploadMgr->putFile($upToken, $key, $filePath);
          // //echo "\n====> putFile result: \n";
          // if ($err !== null) {
          //    return $err;
          //  } 
          // else 
          // {
          //    return $ret;
          // }
     }

     public function qiniumaterial()
    {

        $accessKey = Config('qiniuaccessKey');
        $secretKey = Config('qiniusecretKey');
        $auth = new Auth($accessKey, $secretKey);
        $bucket = 'material';
          // 生成上传Token
        $upToken  = $auth->uploadToken($bucket);
        // return  $upToken;
         $ret = array('message' => "生成material七牛上传Token成功",'uptoken' => $upToken);
         return $ret;
     }

    public function qiniugroupchatdata()
     {
 
         $accessKey = Config('qiniuaccessKey');
         $secretKey = Config('qiniusecretKey');
         $auth = new Auth($accessKey, $secretKey);
         $bucket = 'groupchatdata';
           // 生成上传Token
         $upToken  = $auth->uploadToken($bucket);
         // return  $upToken;
          $ret = array('message' => "生成七牛groupchatdata空间上传Token成功",'uptoken' => $upToken);
          return $ret;
      }


  public function formid(Request $request)
    {

    	$time =date('Y-m-d H:i:s',time());//获取当前时间
      $openid=$request->param("openid");
      $channel=$request->param("channel");
      $formid=$request->param("formid");

      $dbnum =db('formid')->where('openid',$openid)->whereTime('create_time', 'today')->count();
      if($dbnum > 50 ){
        return ['state'   => '200','message'  => "今天大于3啦不用加了!"] ;
      }


        $dbdata = ['id'=>'','openid' =>$openid,'formid' =>$formid,'channel' =>$channel,'create_time' =>$time];
        $dbreturn=db('formid')->insert($dbdata);
        if($dbreturn==1){
        	return ['state'   => '200','message'  => "新增formid成功"] ;
        }
        else{
        	return ['state'   => '400','message'  => "新增formid失败"] ;
        }
             
    }

public function getqrcode(Request $request)
 {
  $crowd_id=$request->param("crowd_id");
  if (is_file('./qrcode/'.$crowd_id.'.png')){
    return ['state'   => '200','message'  => "二维码已经存在" ,'type' => 'success'] ;
  }else{
    
    $data['appid']=Config('appid');
    $data['secret']= Config('secret');
    $data['grant_type']= 'client_credential';
    $api = "https://api.weixin.qq.com/cgi-bin/token";//拿token接口
    $str = http($api, $data,'GET');
    $token = json_decode($str,true);
    $access_token=$token['access_token'];//拿到token
    $url = "https://api.weixin.qq.com/wxa/getwxacode?access_token=$access_token";
     //阿拉丁统计链接pages/index/index?channel=1000&ald_media_id=26447&ald_link_key=6f92ad04b6256d10
    $data = json_encode(array("path"=>"pages/index/index?crowd_id=$crowd_id&channel=1000&ald_media_id=33542&ald_link_key=c99244f0802f9f06","width"=> 150));
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HEADER, 'image/gif');
    curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_POSTFIELDS,$data);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'Content-Length: ' . strlen($data)
    ));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER,1); //如果需要将结果直接返回到变量里，那加上这句。
    $res = curl_exec($ch);
    $image = 'data:image/jpeg;base64,'.base64_encode($res);//补全base64加密字符串头
    if (strstr($image,",")){
       $image = explode(',',$image);
       $image = $image[1];
    }
    $path = "./qrcode";
    if (!is_dir($path)){ //判断目录是否存在 不存在就创建
       mkdir($path,0777,true);
    }
    $imageSrc= $path."/". $crowd_id.'.png'; //图片名字
    $r = file_put_contents($imageSrc, base64_decode($image));//返回的是字节数
    if ($r) {
      return ['state'   => '200','message'  => "二维码生成成功" ,'type' => 'success'] ;
    }else{
      return ['state'   => '400','message'  => "二维码生成失败" ,'type' => 'fail'] ;
    }
  }

}




public function newgetqrcode(Request $request)
 {
  $crowd_id=$request->param("crowd_id");
  $user_id=$request->param("user_id");
  $name=$crowd_id.$user_id;//拼接生成名称
  if (is_file('./qrcode/user'.$name.'.png')){
    return ['state'   => '200','message'  => "二维码已经存在" ,'type' => 'success'] ;
  }else{
    
    $data['appid']=Config('appid');
    $data['secret']= Config('secret');
    $data['grant_type']= 'client_credential';
    $api = "https://api.weixin.qq.com/cgi-bin/token";//拿token接口
    $str = http($api, $data,'GET');
    $token = json_decode($str,true);
    $access_token=$token['access_token'];//拿到token
    $url = "https://api.weixin.qq.com/wxa/getwxacode?access_token=$access_token";
     //阿拉丁统计链接pages/index/index?channel=1000&ald_media_id=26447&ald_link_key=6f92ad04b6256d10
    // $data = json_encode(array("path"=>"pages/index/index?crowd_id=$crowd_id&channel=1000&ald_media_id=33542&ald_link_key=c99244f0802f9f06","width"=> 150));
    $data = json_encode(array("path"=>"pages/index/index?crowd_id=$crowd_id&channel=1000&master_id=$user_id","width"=> 150));
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HEADER, 'image/gif');
    curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_POSTFIELDS,$data);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'Content-Length: ' . strlen($data)
    ));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER,1); //如果需要将结果直接返回到变量里，那加上这句。
    $res = curl_exec($ch);
    $image = 'data:image/jpeg;base64,'.base64_encode($res);//补全base64加密字符串头
    if (strstr($image,",")){
       $image = explode(',',$image);
       $image = $image[1];
    }
    $path = "./qrcode/user";
    if (!is_dir($path)){ //判断目录是否存在 不存在就创建
       mkdir($path,0777,true);
    }
    $imageSrc= $path."/". $name.'.png'; //图片名字
    $r = file_put_contents($imageSrc, base64_decode($image));//返回的是字节数
    if ($r) {
      return ['state'   => '200','message'  => "二维码生成成功" ,'type' => 'success','name'=>$name] ;
    }else{
      return ['state'   => '400','message'  => "二维码生成失败" ,'type' => 'fail','name'=>$name] ;
    }
  }

}










  public  function nonceStr() {
        $time =date('Y-m-d H:i:s',time());//获取当前时间
        for ($v=0; $v< 10; $v++) { 
             $seed = array(0,1,2,3,4,5,6,7,8,9);
            $str = '';
            for($i=0;$i<8;$i++) {
                $rand = rand(0,count($seed)-1);
                $temp = $seed[$rand];
                $str .= $temp;
                unset($seed[$rand]);
                $seed = array_values($seed);
            }
             $data = ['id'=>'','code' =>$str,'create_time' =>$time];
             $dbreturn=db('group_code')->insert($data);
         }
         return ['state'   => '200','message'  => "群邀请码生成成功"] ;
      }






  public  function havecode() {
        $dbdata=db('group_code')->order('id asc')->select();
        $state=['state'   => '200','message'  => "群邀请码列表查询成功" ];
        $resdata=array_merge($state,array('groupcode'=>$dbdata));
        return $resdata ;
       
      }


      public  function shareconfig() {
        $state=['state'   => '200','message'  => "分享配置" ];
        $shareconfig=['title'   => "群记分小程序，一款好用的群管理工具!",'imageUrl'  => 'http://groupmaterial.gzywudao.top/fengmian.png' ];
        $resdata=array_merge($state,array('shareconfig'=>$shareconfig));
        return $resdata ;
       
      }




 public  function havetoken() {
         $data['appid']=Config('appid');
        $data['secret']= Config('secret');
        $data['grant_type']= 'client_credential';
        $api = "https://api.weixin.qq.com/cgi-bin/token";//拿token接口
        $str = http($api, $data,'GET');
        $token = json_decode($str,true);
        $access_token=$token['access_token'];//拿到token
        return $access_token;
       
      }


  
  //文案审核，内容安全返回0，不安全返回1
  public function echecktext(Request $request)
      {
        $content=$request->param("content");
        $data=wxmsgSecCheck($content);
        $state=['state'   => '200','message'  => "内容审核结果",'data' =>$data];
        return $state;
      }





      //加密信息解密,获取手机号码
      public  function phonedecrypt(Request $request)
      {
        // public static $OK = 0;
        // public static $IllegalAesKey = -41001;
        // public static $IllegalIv = -41002;
        // public static $IllegalBuffer = -41003;
        // public static $DecodeBase64Error = -41004;
        // return "wxdatacrypt";
        $appid=Config('appid');
        $sessionKey=$request->param("session_key");
        $encryptedData=$request->param("encryptedData");
        $iv=$request->param("iv");
        $user_id=$request->param("user_id");
        $user_openid=$request->param("user_openid");
        $time =date('Y-m-d H:i:s',time());


        if (strlen($sessionKey) != 24) {
          return ['state'   => '200','message'  => "解密错误",'Code' => '41001'];
        }
        $aesKey=base64_decode($sessionKey);
    
            
        if (strlen($iv) != 24) {
          return ['state'   => '200','message'  => "解密错误",'Code' => '41002'];
        }
        $aesIV=base64_decode($iv);
    
        $aesCipher=base64_decode($encryptedData);
    
        $result=openssl_decrypt( $aesCipher, "AES-128-CBC", $aesKey, 1, $aesIV);
    
        $dataObj=json_decode( $result );
        if( $dataObj  == NULL )
        {
          return ['state'   => '200','message'  => "解密错误",'Code' => '41003'];
        }
        if( $dataObj->watermark->appid != $appid )
        {
          return ['state'   => '200','message'  => "解密错误",'Code' => '41003'];
        }
        $data = json_decode($result,true);

        $phone=$data['phoneNumber'];

        $dbnum =db('user_phone')->where('user_id',$user_id)->find();//查询是否有信息
        if($dbnum==null){
          $dbdata = ['id'=>'','user_id' =>$user_id,'user_openid' => $user_openid,'phone' => $phone,'update_time' =>$time];
          $phone_id= db('user_phone')->insertGetId($dbdata);//返回自增ID
        }
        else{
          $dbreturn= db('user_phone')->where('user_id',$user_id)->update(['update_time' => $time,'phone' => $phone]);

        }

        return ['state'   => '200','message'  => "获取用户手机号成功",'data'=>$data ];

      } 











}
