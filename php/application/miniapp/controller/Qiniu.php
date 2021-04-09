<?php
namespace app\miniapp\controller;
vendor('Qiniu.autoload');
use think\Db;
use think\Request;
use think\Config;
use Qiniu\Auth;
use Qiniu\Storage\UploadManager;

class Qiniu
{


   public function grouplongtime()
    {
        $accessKey = Config('newqiniuaccessKey');
        $secretKey = Config('newqiniusecretKey');
        $auth = new Auth($accessKey, $secretKey);
        $bucket = 'grouplongtime';//七牛云空间名称
        // 生成上传Token
        $upToken  = $auth->uploadToken($bucket);
        $ret = array('message' => "生成grouplongtime空间七牛上传Token成功",'uptoken' => $upToken);
        return $ret;
     }

    public function groupmaterial()
     {
         $accessKey = Config('newqiniuaccessKey');
         $secretKey = Config('newqiniusecretKey');
         $auth = new Auth($accessKey, $secretKey);
         $bucket = 'groupmaterial';//七牛云空间名称
         // 生成上传Token
         $upToken  = $auth->uploadToken($bucket);
         $ret = array('message' => "生成groupmaterial空间七牛上传Token成功",'uptoken' => $upToken);
         return $ret;
    }


  public function groupsixty()
    {
      $accessKey = Config('newqiniuaccessKey');
      $secretKey = Config('newqiniusecretKey');
      $auth = new Auth($accessKey, $secretKey);
      $bucket = 'groupsixty';//七牛云空间名称
      // 生成上传Token
      $upToken  = $auth->uploadToken($bucket);
      $ret = array('message' => "生成groupsixty空间七牛上传Token成功",'uptoken' => $upToken);
      return $ret;
    }

  public function grouppermanent()
    {
      $accessKey = Config('newqiniuaccessKey');
      $secretKey = Config('newqiniusecretKey');
      $auth = new Auth($accessKey, $secretKey);
      $bucket = 'grouppermanent';//七牛云空间名称
      // 生成上传Token
      $upToken  = $auth->uploadToken($bucket);
      $ret = array('message' => "生成grouppermanent空间七牛上传Token成功",'uptoken' => $upToken);
      return $ret;
    }




}
