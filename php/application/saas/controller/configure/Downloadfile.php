<?php
namespace app\saas\controller\configure;
use think\Db;
use think\Request;
use think\Config;
use qiniu\Deletefile;
use think\Controller;
use think\Loader;

class Downloadfile
{


    //下载用户积分增加排名
    public function socerranking(Request $request)
    {
    //  $crowd_id=$request->param("crowd_id");//群id
    //  $sendmode=$request->param("sendmode");//发送方式，0是直接下载列表。1是发送到邮箱
    $crowd_id=14;//群id
    $sendmode=0;//发送方式，0是直接下载列表。1是发送到邮箱

     $oldlist=$sql = "SELECT `user`.id,`user`.nickName,e.score 
     FROM `user`,(select user_id,SUM(score) as score
     from score_record WHERE crowd_id=3514 and state=0 and create_time > '2022-01-01 00:00:00' GROUP BY user_id) as e
     WHERE e.user_id=`user`.id ORDER BY e.score  DESC ;";
     $list = Db::query($sql); //拿到数据

	 $file_name = date('Y-m-d_His').'.xls';
     $path = dirname(__FILE__); //找到当前脚本所在路径
     Loader::import('PHPExcel.php'); //加载所需的类文件，必须引入 use think\Loader;命名空间，否则loader无法加载
     Loader::import('PHPExcel.Reader.Excel2007'); 

     $PHPExcel = new \PHPExcel();
        $PHPSheet = $PHPExcel->getActiveSheet();
        $PHPSheet->setTitle("用户积分获取排名");
        $PHPSheet->setCellValue("A1","排名");
        $PHPSheet->setCellValue("B1","用户id");
        $PHPSheet->setCellValue("C1","微信昵称");
        $PHPSheet->setCellValue("D1","获得积分总数");
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
            $user_email=$request->param("user_email");//接受邮箱
            $excelpath='./excel/'.$file_name;
            $PHPWriter->save($excelpath);//保存到服务器指定路径
            $emaildata=sendEmail([['user_email'=>$user_email,'content'=>'群记分群员积分获取排名','excel'=>$excelpath]]);
            $state=['state'   => '200','message'  => "邮件发送成功，请注意查收",'emaildata'  => $emaildata];
             return  $state;    
        }
        
        
    }


}

