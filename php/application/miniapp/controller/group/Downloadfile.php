<?php
namespace app\miniapp\controller\group;
use think\Db;
use think\Request;
use think\Config;
use qiniu\Deletefile;
use think\Controller;
use think\Loader;

class Downloadfile
{
    //下载兑换表格
    public function exchangelist(Request $request)
    {
     $crowd_id=$request->param("crowd_id");//群id
     $state=$request->param("state");//兑换记录的状态，状态值：0，未发货，1，已发货，2，审核不通过
     $sendmode=$request->param("sendmode");//发送方式，0是直接下载列表。1是发送到邮箱
     if($state==0){
         //查询未发货的
         $list=db('exchange_record')->where('crowd_id',$crowd_id)->where('state',0)->order('id desc')->select();
     }
     else{
         //查询全部
        $list=db('exchange_record')->where('crowd_id',$crowd_id)->order('id desc')->select();
     }
	 $file_name = date('Y-m-d_His').'.xls';
     $path = dirname(__FILE__); //找到当前脚本所在路径
     Loader::import('PHPExcel.php'); //加载所需的类文件，必须引入 use think\Loader;命名空间，否则loader无法加载
     Loader::import('PHPExcel.Reader.Excel2007'); 

     $PHPExcel = new \PHPExcel();
        $PHPSheet = $PHPExcel->getActiveSheet();
        $PHPSheet->setTitle("用户兑换记录");
        $PHPSheet->setCellValue("A1","用户微信昵称");
        $PHPSheet->setCellValue("B1","收件人");
        $PHPSheet->setCellValue("C1","邮政编码");
        $PHPSheet->setCellValue("D1","省份");
        $PHPSheet->setCellValue("E1","城市");
        $PHPSheet->setCellValue("F1","地区");
        $PHPSheet->setCellValue("G1","详细地址");
        $PHPSheet->setCellValue("H1","电话号码");
        $PHPSheet->setCellValue("I1","兑换商品");
        $PHPSheet->setCellValue("J1","消耗积分");
        $PHPSheet->setCellValue("K1","兑换备注");
        $PHPSheet->setCellValue("L1","状态");
        $PHPSheet->setCellValue("M1","兑换时间");
        $i = 2;
		foreach($list as $key => $value){
            if($value['state']==0){
                $type="未发货";
            }
            elseif ($value['state']==0){
                $type="已发货";
            }
            else{
                $type="审核不通过";
            }
        	$PHPSheet->setCellValue('A'.$i,''.$value['nickName']);
        	$PHPSheet->setCellValue('B'.$i,''.$value['userName']);
        	$PHPSheet->setCellValue('C'.$i,''.$value['postalCode']);
        	$PHPSheet->setCellValue('D'.$i,''.$value['provinceName']);
        	$PHPSheet->setCellValue('E'.$i,''.$value['cityName']);
        	$PHPSheet->setCellValue('F'.$i,''.$value['countyName']);
        	$PHPSheet->setCellValue('G'.$i,''.$value['detailInfo']);
        	$PHPSheet->setCellValue('H'.$i,''.$value['telNumber']);
        	$PHPSheet->setCellValue('I'.$i,''.$value['goodsname']);
            $PHPSheet->setCellValue('J'.$i,''.$value['price']);
            $PHPSheet->setCellValue('K'.$i,''.$value['remarks']);
            $PHPSheet->setCellValue('L'.$i,''.$type);
            $PHPSheet->setCellValue('M'.$i,''.$value['create_time']);
        	$i++;
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
            $emaildata=sendEmail([['user_email'=>$user_email,'content'=>'群记分兑换商品统计表格','excel'=>$excelpath]]);
            $state=['state'   => '200','message'  => "邮件发送成功，请注意查收" ];
             return  $state;    
        }
        
        
    }


}

