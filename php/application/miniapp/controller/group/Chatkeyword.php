<?php
namespace app\miniapp\controller\group;
use think\Db;
use think\Request;
use think\Config;

class Chatkeyword
{



    //新增或者修改关键字
    public function setkeyword(Request $request)
    {
        $id=$request->param("id");
        $crowd_id=$request->param("crowd_id");//群id
        $say_type=$request->param("say_type");//方式，图片或者文案，image和text
        $keyword=$request->param("keyword");//关键字
        $content=$request->param("content");//回复内容
        $cover=$request->param("cover");//回复内容
        $open=$request->param("open");//开关0开1关
        $matching=$request->param("matching");//匹配方式，0模糊1精准
        $time =date('Y-m-d H:i:s',time());//获取当前时间
        if($id && $id > 0 ){
            //id存在,视为修改
            $dbid= db('chat_keyword')->where('crowd_id',$crowd_id)->where('id',$id)->update(['say_type' =>$say_type,'keyword' =>$keyword,'content' =>$content,'cover' => $cover,'open' =>$open,'matching' =>$matching]);
            $state=['state'   => '200','message'  => "修改关键字成功" ];
        }
        else{

            $newdata=db('chat_keyword')->where('crowd_id',$crowd_id)->where('keyword',$keyword)->find();
            if($newdata){
                $state=['state'   => '400','message'  => "已存在相同关键字" ];
                return $state;
            }
            $data = ['id'=>'','crowd_id' =>$crowd_id,'say_type' => $say_type,'keyword' => $keyword,'content' => $content,'cover' => $cover,'open' => $open,'triggernum' => 0,'matching' => $matching,'create_time' =>$time];
            $dbid= db('chat_keyword')->insertGetId($data);//返回自增ID
            $state=['state'   => '200','message'  => "增加关键字成功" ];
        }
        $resdata=array_merge($state,array('dbid'=>$dbid));
        return $resdata ;
    }


    //查询该群设置的关键字
    public function crowdkeyword(Request $request)
    {
        $type =$request->param("type");
        $crowd_id =$request->param("crowd_id");
        if( $type==0){
          //查询全部
          $data=db('chat_keyword')->where('crowd_id',$crowd_id)->order('id desc')->select();
        }
        else{
          //查询打开的
          $data=db('chat_keyword')->where('crowd_id',$crowd_id)->where('open',0)->order('id desc')->select();
        }
        $state=['state'   => '200','message'  => "群关键词列表查询成功" ];
        $resdata=array_merge($state,array('data'=>$data));
        return $resdata ;
    }

    //修改关键词状态
    public function updatekeyword(Request $request)
    {
        $crowd_id =$request->param("crowd_id");
        $id =$request->param("id");
        $open =$request->param("open");
        $dbid= db('chat_keyword')->where('crowd_id',$crowd_id)->where('id',$id)->update(['open' =>$open]);
        $resdata=['state'   => '200','message'  => "修改关键词状态成功" ];
        return $resdata ;
    }


    //查看关键词详情
    public function querykeyword(Request $request)
    {
        $id =$request->param("id");
        $data=db('chat_keyword')->where('id',$id)->find();
        $resdata=['state' => '200','message' => "查询关键词详情成功",'data' => $data ];
        return $resdata ;
    }

    //删除关键词
    public function deletekeyword(Request $request)
    {
        $id =$request->param("id");
        $cleardata=db('chat_keyword')-> where('id',$id)->delete();
        if($cleardata ==1){
            $state=['state'   => '200','message'  => "删除关键词成功" ];
       }
       else{
            $state=['state'   => '400','message'  => "删除关键词失败" ];
       }
       return  $state;
    }





}
