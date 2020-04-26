<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 流年 <liu21st@gmail.com>
// +----------------------------------------------------------------------

// 应用公共文件
use phpmailer\phpmailer;

/**
 * 发送HTTP请求方法
 * @param  string $url    请求URL
 * @param  array  $params 请求参数
 * @param  string $method 请求方法GET/POST
 * @return array  $data   响应数据
 */
function http($url, $params, $method = 'GET', $header = array(), $multi = false){
    $opts = array(
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_HTTPHEADER     => $header
    );
    /* 根据请求类型设置特定参数 */
    switch(strtoupper($method)){
        case 'GET':
            $opts[CURLOPT_URL] = $url . '?' . http_build_query($params);
            break;
        case 'POST':
            //判断是否传输文件
            $params = $multi ? $params : http_build_query($params);
            $opts[CURLOPT_URL] = $url;
            $opts[CURLOPT_POST] = 1;
            $opts[CURLOPT_POSTFIELDS] = $params;
            break;
        default:
            throw new Exception('不支持的请求方式！');
    }
    /* 初始化并执行curl请求 */
    $ch = curl_init();
    curl_setopt_array($ch, $opts);
    $data  = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);
    if($error) throw new Exception('请求发生错误：' . $error);
    return  $data;
}

/**
* 发送邮箱
* @param type $data 邮箱队列数据 包含邮箱地址 内容
* 在本地发送不成功，服务器上才行
*/
function sendEmail($data = []) {

  Vendor('phpmailer.phpmailer');
  $mail = new PHPMailer(); //实例化


  $mail->IsSMTP(); // 启用SMTP
  $mail->Host = 'smtp.qq.com'; //SMTP服务器 以126邮箱为例子 
  $mail->Port = 465;  //邮件发送端口
  $mail->SMTPAuth = true;  //启用SMTP认证
  $mail->SMTPSecure = "ssl";   // 设置安全验证方式为ssl

  $mail->CharSet = "UTF-8"; //字符集
  $mail->Encoding = "base64"; //编码方式

  // $mail->Username = '954087620@qq.com';  //你的邮箱 
  // $mail->Password = 'tpvxkvrinllobbig';  //你的密码 

  $mail->Username = '3538187083@qq.com';  //你的邮箱 
  $mail->Password = 'aaetygidfndudahj';  //你的密码 



  $mail->Subject = "群记分"; //邮件标题  

  $mail->From = '3538187083@qq.com';  //发件人地址（也就是你的邮箱）
  $mail->FromName = "群记分";  //发件人姓名

  if($data && is_array($data)){
    foreach ($data as $k=>$v){
      $mail->AddAddress($v['user_email'], "亲爱的群记分用户"); //添加收件人（地址，昵称）
      $mail->IsHTML(true); //支持html格式内容
      //附件
    //   define('APP_PATH', __DIR__ . '/../application/');
      $mail->addAttachment($v['excel']);         // Add attachments
     //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
      $mail->Body = $v['content']; //邮件主体内容

      //发送成功就删除
      if ($mail->Send()) {
        return "邮件发送成功";
      }else{
          return "Mailer Error: ".$mail->ErrorInfo;// 输出错误信息  
      }
    }
  }  

    
}



function postCurl($url,$data,$type){
    if($type == 'json'){
        $data = json_encode($data);//对数组进行json编码
        $header= array("Content-type: application/json;charset=UTF-8","Accept: application/json","Cache-Control: no-cache", "Pragma: no-cache");
    }
    $curl = curl_init();
    curl_setopt($curl,CURLOPT_URL,$url);
    curl_setopt($curl,CURLOPT_POST,1);
    curl_setopt($curl,CURLOPT_SSL_VERIFYPEER,false);
    curl_setopt($curl,CURLOPT_SSL_VERIFYHOST,false);
    if(!empty($data)){
        curl_setopt($curl,CURLOPT_POSTFIELDS,$data);
    }
    curl_setopt($curl,CURLOPT_RETURNTRANSFER,1);
    curl_setopt($curl,CURLOPT_HTTPHEADER,$header);
    $res = curl_exec($curl);
    if(curl_errno($curl)){
        echo 'Error+'.curl_error($curl);
    }
    curl_close($curl);
    return $res;
    
}




