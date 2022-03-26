<?php
namespace app\saas\controller\configure;
use think\Db;
use think\Request;
use think\Log;
class Exlinks
{
      /**
   * TODO 上传文件方法
   * @param $fileid form表单file的name值
   * @param $dir 上传到uploads目录的$dir文件夹里
   * @param int $maxsize 最大上传限制，默认1024000 byte
   * @param array $exts 允许上传文件类型 默认array('gif','jpg','jpeg','bmp','png')
   * @return array 返回array,失败status=0 成功status=1,filepath=newspost/2014-9-9/a.jpg
   */
  public function uploadfile(Request $request){
    Log::record('进入上传文件方法');
    $file = $request->file('file');
    Log::record('进行文件上传， 此处上传到同级目录的upload目录下');
    $route='./upload/exlinks/';//路径
    $info = $file->move($route);
    if ($info) {
      Log::record('上传成功打印文件路径及名称,路径带日期');
      Log::record($info->getsaveName());

      $exclePath =$info->getsaveName();

      $filename = ROOT_PATH . 'public' . DS . 'upload/exlinks'.DS . $exclePath;
      Log::record("组合后的filename");
      Log::record($filename);
      $extension = strtolower( pathinfo($filename, PATHINFO_EXTENSION) );
      Log::record("引入文件");
      //引入文件
      \think\Loader::import('PHPExcel.PHPExcel');
      $objPHPExcel = new \PHPExcel();
      \think\Loader::import('PHPExcel.IOFactory.PHPExcel_IOFactory');

      if ($extension =='xlsx') {
        $objReader = new \PHPExcel_Reader_Excel2007();
        $objExcel = $objReader ->load($filename);

      } else if ($extension =='xls') {

        $objReader = new \PHPExcel_Reader_Excel5();
        $objExcel = $objReader->load($filename);
      }

      $excel_array=$objExcel->getsheet(0)->toArray();   //转换为数组格式
      array_shift($excel_array);  //删除第一个数组(标题);

      $data=[];
      $num=0;
      foreach ($excel_array as $k=>$v){
          $product=$v[0];
          $name=$v[1];
          $phone=$v[2];
          $link=$v[3];
          $usetime=$v[4];
          $time =date('Y-m-d H:i:s',time());
          Log::record("product");
          Log::record($product);
          Log::record("姓名");
          Log::record($name);
          $data = ['id'=>'','product' =>$product,'name' => $name,'phone' => $phone,'link' => $link,'usetime' => $usetime,'create_time' =>$time];
          $dbid= db('ex_links')->insertGetId($data);//返回自增ID
          $num=$num+1;
      }

      $state=['state'   => '200','message'  => "处理文件成功",'num'=>$num ];
      return  $state;


    }else {
      Log::record('上传文件报错了');
      Log::record($info->getError());
      $state=['state'   => '400','message'  => "上传文件报错了" ];
      return  $state;
    }

  }



  public function getexlinks(Request $request){
    Log::record('进入到查询方法');
    $pages=$request->param("pages");
    $phone=$request->param("phone");
    Log::record($phone);

    if($pages == 1 || $pages==null  ){
      $number=0;
    }
    else{
      $number=($pages - 1)*10;
    }
    if($phone){
      $data=db('ex_links')->where('phone',$phone)->order('id DESC')->limit($number,10)->select();
      $countnumber=db('ex_links')->where('phone',$phone)->count();
    }
    else{
      $data=db('ex_links')->order('id DESC')->limit($number,10)->select();
      $countnumber=db('ex_links')->count();
    }
    $state=['state'   => '200','message'  => "专属链接列表" ];
    $resdata=array_merge($state,array('countnumber'=>$countnumber),array('data'=>$data));
    return $resdata ;

  }


  public function deleteall(Request $request){

    $token=$request->param("token");
    $crowd_id=havecrowdid($token);

    $sql = "truncate table ex_links";
    // return $sql;
    $data = Db::query($sql); //拿到数据
    // $data=db()>query($sql = 'TRUNCATE table `ex_links`');
    $state=['state'   => '200','message'  => "清空数据表成功" ];
    return  $state;




  }



}