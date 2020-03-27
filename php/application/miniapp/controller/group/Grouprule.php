<?php
namespace app\miniapp\controller\group;
use think\Db;
use think\Request;
use think\Config;

class Grouprule
{

    //查询群规则
    public function crowdrule(Request $request)
    {
        $crowd_id=$request->param("crowd_id");
        $data =db('crowd')->where('id',$crowd_id)->find();

        $state=['state'   => '200','message'  => "该群的群规则" ];
        $resdata=array_merge($state,array('rulelist'=>json_decode($data["rule"])));
        return $resdata ;
    }
    

     //修改群规则
    public function updatecrowdrule(Request $request)
    {
        $crowd_id=$request->param("crowd_id");
        $rulelist=$request->param("rulelist");

       // return  htmlspecialchars_decode($rulelist); //把预定义的 HTML 实体转换为字符。
        $updateres= db('crowd')->where('id',$crowd_id)->update(['rule' =>  htmlspecialchars_decode($rulelist)]);
        $state=['state'   => '200','message'  => "修改群规则成功" ];
        $resdata=array_merge($state,array('updateres'=>$updateres));
        return $resdata ;
    }
    

}

