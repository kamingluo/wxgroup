<?php
namespace app\saas\controller\configure;
use think\Db;
use think\Request;
use qiniu\Deletefile;
use think\Controller;
use think\Loader;
class Scorelist
{
   
   //查询所有特殊兑换的信息
   public function userscorerecord(Request $request){

    $token=$request->param("token");
    $pages=$request->param("pages");
    $name=$request->param("nickName");
    $newname='%'.$name.'%';
    $id=havecrowdid($token);
    if($pages == 1 || $pages==null  ){
      $number=0;
    }
    else{
      $number=($pages - 1)*10;
    }

    $data = db()->table(array('score_record'=>'t1','user'=>'t2'))->field('t1.id,t1.user_id,t2.nickName,t2.avatarUrl,t1.create_time,t1.score,t1.explain,t1.state')->where('t2.id=t1.user_id')->where('t1.crowd_id',$id)->where('t2.nickName','like',$newname)->order('id DESC')->limit($number,10)->select();
    $countnumber = db()->table(array('score_record'=>'t1','user'=>'t2'))->field('t1.id')->where('t2.id=t1.user_id')->where('t1.crowd_id',$id)->where('t2.nickName','like',$newname)->count();
    $state=['state'   => '200','message'  => "用户积分流水查询" ];
    $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
    return $resdata ;
    }



  //下载粉丝的积分增长数据

  public function socerranking(Request $request)
  {
    $token=$request->param("token");
    $start_time="'" .$request->param("start_time")."'";
    $end_time="'" .$request->param("end_time")."'";
    $crowd_id=havecrowdid($token);//群id
    $sendmode=1;//发送方式，0是直接下载列表。1是发送到邮箱


    //from score_record WHERE crowd_id=3514 and state=0 and create_time >" + $start_time + " create_time < "+  $end_time + " GROUP BY user_id) as e

    $sql = "SELECT `user`.id,`user`.nickName,e.score FROM `user`,(select user_id,SUM(score) as score from score_record WHERE crowd_id= " .$crowd_id." and state=0 and create_time between " .$start_time. " and " .$end_time. " GROUP BY user_id) as e WHERE e.user_id =`user`.id ORDER BY e.score  DESC ;";

    // return $oldlist;



     $list = Db::query($sql); //拿到数据

	  //  $file_name = date('Y-m-d_His').'.xls';
    $file_name = "用户积分获取排名表.xlsx";
     $path = dirname(__FILE__); //找到当前脚本所在路径
     Loader::import('PHPExcel.php'); //加载所需的类文件，必须引入 use think\Loader;命名空间，否则loader无法加载
     Loader::import('PHPExcel.Reader.Excel2007'); 


     $start_time_new=$request->param("start_time");
    $end_time_new=$request->param("end_time");
    $title="开始计算时间:" .$start_time_new. "至结束计算时间" .$end_time_new;
     $PHPExcel = new \PHPExcel();
        $PHPSheet = $PHPExcel->getActiveSheet();
        $PHPSheet->setTitle("用户积分获取排名");
        $PHPSheet->setCellValue("A1","排名");
        $PHPSheet->setCellValue("B1","用户id");
        $PHPSheet->setCellValue("C1","微信昵称");
        $PHPSheet->setCellValue("D1","获得积分总数");
        $PHPSheet->setCellValue("E1",$title);
        $i = 2;
        $num = 1;
		foreach($list as $key => $value){
          $PHPSheet->setCellValue('A'.$i,''.$num);
        	$PHPSheet->setCellValue('B'.$i,''.$value['id']);
        	$PHPSheet->setCellValue('C'.$i,''.$value['nickName']);
        	$PHPSheet->setCellValue('D'.$i,''.$value['score']);
        	$i++;
          $num++;
    	}
        $PHPWriter = \PHPExcel_IOFactory::createWriter($PHPExcel,"Excel2007");
        header('Content-Disposition: attachment;filename='.$file_name);
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        if($sendmode == 0){
            $PHPWriter->save("php://output");  
            return "直接输出报告";

        }
        else{
              $excelpath='./excel/'.$file_name;
              $PHPWriter->save($excelpath);//保存到服务器指定路径
              $downloadurl='https://group.gzywudao.top/php/public/excel/'.$file_name;

              $state=['state'   => '200','message'  => "用户积分获取排名列表下载 url",'downloadurl'  => $downloadurl];
              return  $state;  


            // $user_email=$request->param("user_email");//接受邮箱
            // $excelpath='./excel/'.$file_name;
            // $PHPWriter->save($excelpath);//保存到服务器指定路径
            // $emaildata=sendEmail([['user_email'=>$user_email,'content'=>'群记分群员积分获取排名','excel'=>$excelpath]]);
            // $state=['state'   => '200','message'  => "邮件发送成功，请注意查收",'emaildata'  => $emaildata];
            // return  $state;    
        }
        
        
    }








}