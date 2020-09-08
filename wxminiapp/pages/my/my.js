
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
    moredata:[],//更多工具数据

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




  onShareAppMessage: function (options) {
    return share();
  }
})