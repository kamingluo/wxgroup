<?php
namespace app\miniapp\controller\group;
use think\Db;
use think\Request;
use think\Config;
use qiniu\Deletefile;

use think\Controller;
// use PHPExcel;
// use PHPExcel_IOFactory;
// use PHPExcel_Cell;
use think\Loader;

class Downloadfile
{

    //下载兑换表格
    public function exchangelist(Request $request)
    {
     $crowd_id=$request->param("crowd_id");//群id
    	$list=db('exchange_record')->where('crowd_id',$crowd_id)->order('id desc')->select();
	$file_name = date('Y-m-d_His').'.xls';
     $path = dirname(__FILE__);
     return $path;
     //    Loader::import('PHPExcel.Classes.PHPExcel.php');
     //    Loader::import('PHPExcel.Classes.PHPExcel.IOFactory.PHPExcel_IOFactory');
     Loader::import('PHPExcel.php'); //加载所需的类文件，必须引入 use think\Loader;命名空间，否则loader无法加载

     Loader::import('PHPExcel.Reader.Excel2007');
        
     $PHPExcel = new \PHPExcel();
     //    return "11111";   
        $PHPSheet = $PHPExcel->getActiveSheet();
        $PHPSheet->setTitle("代理商");
        $PHPSheet->setCellValue("A1","ID");
        $PHPSheet->setCellValue("B1","名字");
        $PHPSheet->setCellValue("C1","电话");
        $PHPSheet->setCellValue("D1","编号");
        $PHPSheet->setCellValue("E1","负责区域");
        $PHPSheet->setCellValue("F1","代理商编号");
        $PHPSheet->setCellValue("G1","管理员id");
        $PHPSheet->setCellValue("H1","联系人");
        $PHPSheet->setCellValue("I1","代理商级别");
        $PHPSheet->setCellValue("J1","代理商所在地址");
 
 
        $i = 2;
		foreach($list as $key => $value){
        	$PHPSheet->setCellValue('A'.$i,''.$value['id']);
        	$PHPSheet->setCellValue('B'.$i,''.$value['id']);
        	$PHPSheet->setCellValue('C'.$i,''.$value['id']);
        	$PHPSheet->setCellValue('D'.$i,''.$value['id']);
        	$PHPSheet->setCellValue('E'.$i,''.$value['id']);
        	$PHPSheet->setCellValue('F'.$i,''.$value['id']);
        	$PHPSheet->setCellValue('G'.$i,''.$value['id']);
        	$PHPSheet->setCellValue('H'.$i,''.$value['id']);
        	$PHPSheet->setCellValue('I'.$i,''.$value['id']);
        	$PHPSheet->setCellValue('J'.$i,''.$value['id']);
        	$i++;
    	}
        $PHPWriter = \PHPExcel_IOFactory::createWriter($PHPExcel,"Excel2007");
        header('Content-Disposition: attachment;filename='.$file_name);
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $PHPWriter->save("php://output");  
        return "11111";    
        
    }


}

