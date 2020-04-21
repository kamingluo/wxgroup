<?php
namespace qiniu;
vendor('Qiniu.autoload');
use think\Db;
use think\Config;
use Qiniu\Auth;
use Qiniu\Storage\UploadManager;

class Deletefile{
    /**
     * 发送HTTP请求方法
     * @param  string $url  要删除的链接
     */
    public function one($url){

        //key就是存储在七牛的文件名称，要去除前缀
        $key=trim(strrchr($url, '/'),'/');//将拿到的url截取域名后面的字符串

        $accessKey = Config('qiniuaccessKey');
        $secretKey = Config('qiniusecretKey');
        //$bucket就是空间名称
        $bucket =  'material';//单个文件的一般存储在这个空间里面
        $auth = new Auth($accessKey, $secretKey);
        $config = new \Qiniu\Config();
        $bucketManager = new \Qiniu\Storage\BucketManager($auth, $config);
        $err = $bucketManager->delete($bucket, $key);
        if ($err) {
             // print_r($err);
             // return $err;
             return "删除单个七牛文件失败";
        }

        return "删除单个七牛文件成功";
       

    }



     /**
     * 发送HTTP请求方法
     * @param  arr $data  要删除的图片数组，存在数据库的，一般是字符串格式
     */
    public function more($data){

        $images=json_decode( $data);//先反转义一下
        $arrlength=count($images);//计算数量
        $array_push = array();//定义数组
        for($x=0;$x<$arrlength;$x++)
        {
           // $url= substr($images[$x], 34);//截取字符串，把前面的域名去除掉
           $url= trim(strrchr($images[$x], '/'),'/');//截取最后一个斜杠后面的内容可以这样来：
           array_push($array_push,$url);//添加到数组里面
        }

          $accessKey = Config('qiniuaccessKey');
          $secretKey = Config('qiniusecretKey');
          $bucket ='group';//多个文件的一般存储在这里文件里面
          $auth = new Auth($accessKey, $secretKey);
          $config = new \Qiniu\Config();
          $bucketManager = new \Qiniu\Storage\BucketManager($auth, $config);
          //每次最多不能超过1000个
          $keys = $array_push;
          $ops = $bucketManager->buildBatchDelete($bucket, $keys);
          list($ret, $err) = $bucketManager->batch($ops);
          if ($err) {
            //  print_r($err);
            return "多个七牛文件删除失败";
          } else {
            //print_r($ret);
            return "多个七牛文件删除成功";
          }
    }

}