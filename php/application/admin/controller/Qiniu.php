<?php
namespace app\admin\controller;
vendor('Qiniu.autoload');
//use think\log;
use think\Db;
use think\Config;
use Qiniu\Auth;
use Qiniu\Storage\UploadManager;

class Qiniu
{
     //获取七牛token
    public function token()
    {
    	     $accessKey = 'cOtKv4WjF_QrS7Cb98oOo0zQrmzbJNmJGeoCsQB3';
          $secretKey = 'tk2gLlSppyxjOWP6LGOsK4SNboyjIh44BAicYBXB';
          $auth = new Auth($accessKey, $secretKey);
          $bucket = 'group';
          // 生成上传Token
         $upToken  = $auth->uploadToken($bucket);

        // return  $upToken;
         $ret = array('message' => "生成七牛上传Token成功",'uptoken' => $upToken);
         return $ret;
     }


     //删除图片
     public function deleteimg(){
          // return "删除图片";

          $accessKey = 'cOtKv4WjF_QrS7Cb98oOo0zQrmzbJNmJGeoCsQB3';
          $secretKey = 'tk2gLlSppyxjOWP6LGOsK4SNboyjIh44BAicYBXB';
          $bucket =  'group';
          //key就是存储在七牛的文件名称，要去除前缀
          $key = "tmp_08612e91732ad572b578c16e3a9e0ca09505399917ee29bc.jpg";
          $auth = new Auth($accessKey, $secretKey);
          $config = new \Qiniu\Config();
          $bucketManager = new \Qiniu\Storage\BucketManager($auth, $config);
          $err = $bucketManager->delete($bucket, $key);
          if ($err) {
               // print_r($err);
               // return $err;
               return "删除失败";
          }

          return "删除成功";


     }


     //批量群任务删除文件
     public function bulkdelete(){
          // $str='https://groupqiniu.luojiaming.vip/tmp_5aea01fafa1d8a47d0145f32f45eec76.jpg';
          // // 截取最后一个斜杠后面的内容可以这样来：
          //  $url= trim(strrchr($str, '/'),'/');
          //  return $url;

          $data=db('task_record')->where('id', 270)->find();//拿到数据
          $images=json_decode( $data['images']);//先取出值，反转义一下
          $arrlength=count($images);
          $array_push = array();//定义数组
          for($x=0;$x<$arrlength;$x++)
          {
          // $url= substr($images[$x], 34);//截取字符串，把前面的域名去除掉
          $url= trim(strrchr($images[$x], '/'),'/');//截取最后一个斜杠后面的内容可以这样来：
          array_push($array_push,$url);//添加到数组里面
          }
          $ret = array('message' => "批量删除文件处理文件链接",'oid' => $images,'new' => $array_push);//输出新旧，好产生对比
          return $ret;



          //截取字符串，把前面的域名去除掉
          // $rest = substr('https:\/\/groupqiniu.luojiaming.vip\/tmp_2396d8418f988a878d64f0e68b43d2044efed98f92301efe.jpg', 37);  
          // $keys = array(
          //      'qiniu.mp4',
          //      'qiniu.png',
          //      'qiniu.jpg'
          // );
          // return  $keys ;
          // $accessKey = getenv('QINIU_ACCESS_KEY');
          // $secretKey = getenv('QINIU_SECRET_KEY');
          // $bucket = getenv('QINIU_TEST_BUCKET');
          // $auth = new Auth($accessKey, $secretKey);
          // $config = new \Qiniu\Config();
          // $bucketManager = new \Qiniu\Storage\BucketManager($auth, $config);
          // //每次最多不能超过1000个
          // $keys = array(
          // 'qiniu.mp4',
          // 'qiniu.png',
          // 'qiniu.jpg'
          // );
          // $ops = $bucketManager->buildBatchDelete($bucket, $keys);
          // list($ret, $err) = $bucketManager->batch($ops);
          // if ($err) {
          // print_r($err);
          // } else {
          // print_r($ret);
          // }
     }

     

}
