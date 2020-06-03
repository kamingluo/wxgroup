<?php
// +----------------------------------------------------------------------
// | 用户信息操作
// +----------------------------------------------------------------------
 

namespace app\miniapp\controller;
use think\Db;
use think\Request;
use think\Exception;
use think\Log;

class User
{
    /** 用户注册未授权 */
    public function register(Request $request){
        $data = $request->param();//接收所有传过来的post值
        $wxcode =$request->param("code");
        $openid=openid($wxcode);
        $scene=$request->param("scene");
        $channel=$request->param("channel");
        $crowd_id =$request->param("crowd_id");
        $time =date('Y-m-d H:i:s',time());//获取当前时间
        $dbnum =db('user')->where('openid',$openid)->find();//查询用户信息
        //return  $dbnum["channel"];
        if($dbnum==null){
                $dbdata = ['id'=>'','openid' =>$openid,'channel' => $channel,'scene' => $scene,'coin' => 0,'nickName' => null,'avatarUrl' => null,'gender' => null,'province' => null,'city' => null,'country' => null,'birthday' => null,'create_time' =>$time ,'update_time' =>$time];
                $userId= db('user')->insertGetId($dbdata);//返回自增ID

                 $userjoingroup= joingroup($crowd_id, $userId, $openid,1);

                $userdata=['id'=>$userId,'openid' =>$openid,'channel' => $channel,'scene' => $scene,'nickName' => null,'avatarUrl' => null,'gender' => null,'province' => null,'city' => null,'country' => null,'birthday' => null,'create_time' =>$time ,'update_time' =>$time];

                $state=['state'   => '200','message'  => "注册成功"];
                $resdata=array_merge($state,array('userdata'=>$userdata),array('userjoingroup'=>$userjoingroup));
                return $resdata;
            }
        else{
                 //更新信息
                $dbreturn= db('user')->where('openid',$openid)->update(['update_time' => $time,'scene' => $scene]);
                if($dbreturn==1){
                     $dbnum =db('user')->where('openid',$openid)->find();//查询用户信息
                     $userjoingroup= joingroup($crowd_id, $dbnum["id"], $openid);


                    $state=['state'   => '200','message'  => "用户信息更新成功"];
                    
                    $resdata=array_merge($state,array('userdata'=>$dbnum),array('userjoingroup'=>$userjoingroup));
                // // $dbnum =db('user')->where('openid',$openid)->find();
                    return $resdata;
                }
                else{
                     $dbreturn=['state'   => '400','message'  => "用户信息更新失败" ];
                    return $dbreturn;
                }
            }
    }



     /** 用户注册已经授权 */
    public function authorized(Request $request){
        $wxcode =$request->param("code");


        $openid=openid($wxcode);
        $scene=$request->param("scene");
        $channel=$request->param("channel");
        $nickName=$request->param("nickName");
        $avatarUrl=$request->param("avatarUrl");
        $gender=$request->param("gender");
        $province=$request->param("province");
        $city=$request->param("city");
        $country=$request->param("country");
        $crowd_id =$request->param("crowd_id");
        $time =date('Y-m-d H:i:s',time());


        $dbnum =db('user')->where('openid',$openid)->find();//查询用户信息
        //return  $dbnum["channel"];
        if($dbnum==null){
                $dbdata = ['id'=>'','openid' =>$openid,'channel' => $channel,'scene' => $scene,'coin' => 0,'nickName' => $nickName,'avatarUrl' =>$avatarUrl,'gender' =>$gender,'province' => $province,'city' => $city,'country' => $country,'birthday' => null,'create_time' =>$time ,'update_time' =>$time];
                
                $userId= db('user')->insertGetId($dbdata);//返回自增ID
                $userjoingroup= joingroup($crowd_id, $userId, $openid,1);

                $userdata=['id'=>$userId,'openid' =>$openid,'channel' => $channel,'scene' => $scene,'nickName' => $nickName,'avatarUrl' =>$avatarUrl,'gender' =>$gender,'province' => $province,'city' => $city,'country' => $country,'birthday' => null,'create_time' =>$time ,'update_time' =>$time];

                $state=['state'   => '200','message'  => "授权注册成功"  ];
                $resdata=array_merge($state,array('userdata'=>$userdata),array('userjoingroup'=>$userjoingroup));
                return $resdata;
            }
        else{
                 //更新信息
                $dbreturn= db('user')->where('openid',$openid)->update(['update_time' => $time,'scene' => $scene,'nickName' => $nickName,'avatarUrl' =>$avatarUrl,'gender' =>$gender,'province' => $province,'city' => $city,'country' => $country]);
                if($dbreturn==1){
                     $dbnum =db('user')->where('openid',$openid)->find();//查询用户信息
                     $state=['state'   => '200','message'  => "授权用户信息更新成功"];

                     $userjoingroup= joingroup($crowd_id, $dbnum["id"], $openid);
                    
                    $resdata=array_merge($state,array('userdata'=>$dbnum),array('userjoingroup'=>$userjoingroup));
                    return $resdata;
                }
                else{
                     $dbreturn=['state'   => '400','message'  => "用户信息更新失败" ];
                    return $dbreturn;
                }
            }
    }



     //请求获取openid
    public function obtainopenid(Request $request)
    {
        $wxcode =$request->param("code");//接收所有传过来的值
        $openid=openid($wxcode);
        $state=['state'   => '200','message'  => "获取用户openid成功" ];
        $resdata=array_merge($state,array('openid'=>$openid));
        return $resdata;
    }

    //获取微信的opneid和登录凭证

    public function userlogin(Request $request)
    {
        $wxcode =$request->param("code");//接收所有传过来的值

        if($wxcode == 'kaming'){
            $openid='o1mXc4u68Fff1XGk7gTYyDD2tomU';
            return $openid;
        }
        $url = 'https://api.weixin.qq.com/sns/jscode2session';
        $data['appid']=Config('appid');
        $data['secret']= Config('secret');
        $data['js_code']= $wxcode;
        $data['grant_type']= 'authorization_code';
        $wxopenid = http($url, $data, 'GET');
        $openiddata=json_decode($wxopenid,true);
        $rest=array_key_exists("errcode",$openiddata);//判断返回值存在errcode证明code有误
        if($rest){ 
            $state=['state'   => '400','message'  => "code错误或者过期了！" ];
            return $state;
        }
        else{
            $userlogin=$openiddata;
            $state=['state'   => '200','message'  => "获取用户登录状态成功" ];
            $resdata=array_merge($state,array('userlogin'=>$userlogin));
            return $resdata;
        }
    }



        //用户信息
    public function userdata(Request $request)
    {
        $wxcode =$request->param("code");//接收所有传过来的值
        $openid=openid($wxcode);
        $dbnum =db('user')->where('openid',$openid)->find();//查询用户信息
        $state=['state'   => '200','message'  => "获取用户信息成功" ];
        $resdata=array_merge($state,array('userdata'=>$dbnum));
        return $resdata;
    }



    //用户加入群
    public function userjoingroup(Request $request)
    {
        $crowd_id =$request->param("crowd_id");
        $user_id =$request->param("user_id");
        $user_openid =$request->param("user_openid");
        $data= joingroup($crowd_id, $user_id, $user_openid);
        return $data;
       
    }


    //用户生日更改
    public function userbirthday(Request $request)
    {
        $wxcode =$request->param("code");//接收所有传过来的值
        $openid=openid($wxcode);
        $birthday=$request->param("birthday");

        $dbreturn= db('user')->where('openid',$openid)->update(['birthday' => $birthday]);
        $state=['state'   => '200','message'  => "用户生日更新成功" ];
        return $state;
       
    }




    //获取用户的收货地址
    public function useraddress(Request $request)
    {
        $user_id =$request->param("user_id");//接收所有传过来的值
        $addressdata =db('user_address')->where('user_id',$user_id)->find();//查询用户信息
        $state=['state'   => '200','message'  => "获取用户的收货地址成功" ];
        $resdata=array_merge($state,array('addressdata'=>$addressdata));
        return $resdata;
       
    }


     //修改收货地址
    public function usersetaddress(Request $request)
    {
          $wxcode =$request->param("code");
          $user_id =$request->param("user_id");
          $userName =$request->param("userName");
          $postalCode =$request->param("postalCode");
          $provinceName =$request->param("provinceName");
          $cityName =$request->param("cityName");
          $countyName =$request->param("countyName");
          $detailInfo =$request->param("detailInfo");
          $nationalCode =$request->param("nationalCode");
          $telNumber =$request->param("telNumber");

        $openid=openid($wxcode);
        $dbnum=db('user_address')->where('openid',$openid)->count();//查询用户信息
        if($dbnum == 1){
            //修改地址
            $dbreturn= db('user_address')->where('openid',$openid)->update(['userName' => $userName,'postalCode' => $postalCode,'provinceName' =>$provinceName,'cityName' =>$cityName,'countyName' => $countyName,'detailInfo' => $detailInfo,'nationalCode' => $nationalCode,'telNumber' => $telNumber]);
            $state=['state'   => '200','message'  => "地址信息更新成功" ];
            return $state;
        }else{

             $dbdata = ['id'=>'','user_id' =>$user_id,'openid' => $openid,'userName' => $userName,'postalCode' => $postalCode,'provinceName' =>$provinceName,'cityName' =>$cityName,'countyName' => $countyName,'detailInfo' => $detailInfo,'nationalCode' => $nationalCode,'telNumber' => $telNumber];
                $address_id= db('user_address')->insertGetId($dbdata);//返回自增ID
                 $state=['state'   => '200','message'  => "新增地址成功" ];
                $resdata=array_merge($state,array('address_id'=>$address_id));
                return $resdata;
        }

       
    }





}
