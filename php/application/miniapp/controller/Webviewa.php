<?php
namespace app\miniapp\controller;
use think\Db;
use think\Request;
use think\Config;

class Webviewa extends \think\Controller
{
    public function jieshao(Request $request)
    {
        //return $this->fetch('032513293304');
        return view('032513293304');
    }

    public function agreement(Request $request)
    {
        return view('agreement');
    }
    
}
