
const app = getApp()

const {
  request
} = require('./../../utils/request.js');
const {
  share
} = require('./../../utils/share.js');
const common = require('./../../utils/common.js') //公共函数
const baseConfig = require('./../../utils/config.js')//配置文件

Page({
  data: {
    userdata:{},//用户信息
    imageurl:'https://group.gzywudao.top/php/public/',//默认图片链接
    xiaouad:[],//小U广告数据
    xiaouadtitle:"社群工具推荐",
    moredatatitle:"更多推荐",
    moredata:[],//更多工具数据
    vipdisplay:false
    

  },
  onLoad: function (e) {
    let imageurl = baseConfig.imageurl;
    this.setData({
      imageurl: imageurl,
    })

    this.havexiaouad()
    this.havemoredata()
  },
  onShow: function () {
    this.userdata()
  },


   //用户地址
   myaddress:function(){
    wx.navigateTo({
      url: '/pages/my/my_address/my_address'
    })
  },


  //用户空间任务记录
  usertasklist:function(){
    wx.navigateTo({
      url: '/pages/my/score_detailed/score_detailed'
    })
  },

  //跳转兑换记录页面
  exchangelist:function(){
    wx.navigateTo({
      url: '/pages/my/exchangelist/exchangelist'
    })
  },

  lotterylist:function(){
    wx.navigateTo({
      url: '/pages/my/lotterylist/lotterylist'
    })
  },

  shuoming:function(){
    let jumpurl=encodeURIComponent("https://qing.utaojs.com/app/index.php?i=3&c=entry&m=zk_jqmanual&do=Home&ClassID=1&wxref=mp.weixin.qq.com&from=groupmessage")
    console.log("--------------------")
    console.log(jumpurl)
    
    wx.navigateTo({
      url: '/pages/webview/webview?url=' +jumpurl
    })
  },

    //点击小U广告和更多跳转
    clickjump: function (e) {
      let type=e.currentTarget.dataset.data.type;
      if(type=='kefu' || type=='jianyi'){
        console.log("不跳转")
        return;
      }
      console.log("点击轮播图",e)
      common.insidejump(e.currentTarget.dataset.data)
    },


  //获取小U广告
  havexiaouad:function(){
    request({
      service: 'appdata/my/xiaouad',
      data: {},
      success: res => {
        this.setData({
          xiaouad: res.data,
          xiaouadtitle: res.xiaouadtitle,
        })
      },
    })
  },

   //获取下面更多数据
   havemoredata:function(){
    request({
      service: 'appdata/my/moredata',
      data: {},
      success: res => {
        this.setData({
          moredata: res.moredata,
          moredatatitle:res.moredatatitle,
          vipdisplay:res.vipdisplay
        })
      },
    })
  },

  //获取用户信息
  userdata:function(){
    wx.login({
      success: res => {
        request({
          service: 'user/userdata',
          data: {
            code: res.code,
          },
          success: res => {
            // this.birthday(res.userdata.birthday)
            this.setData({
              userdata: res.userdata,
            })
            wx.setStorageSync('userdata', res.userdata)
          },
        })
      }
    })

  },

  mobanadclick: function (e) {
    let data={
      'adtype':5,
      'position':"我的页面"
    };
    common.clickgdtadstatistics(data)
  },




  onShareAppMessage: function (options) {
    return share();
  }
})