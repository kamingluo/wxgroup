<?php
namespace app\index\controller;
vendor('Qiniu.autoload');
//use think\log;
use think\Db;
use think\Config;
use Qiniu\Auth;
use Qiniu\Storage\UploadManager;

class Qiniu
{
     //微信小程序上传的时候拿的token
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

}
