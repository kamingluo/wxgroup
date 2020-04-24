
const app = getApp()
const {
  request
} = require('./../../utils/request.js');
const {
  share
} = require('./../../utils/share.js');
var Page = require('../../utils/sdk/xmad/xmadx_sdk.min.js').xmad(Page).xmPage; //小盟广告

Page({
  data: {
    userdata:'',
    birthday:null,
    gdtaddisplay: false,
    xmad: { //小盟广告
      adData: {},
      ad: {
        banner1: "xmf4d0492bbe9627bd723b64d44bacef",
        banner2: "xmde2f6e240c459769d0f1d791087cbb",
        banner3: "xma6e58bd54538ae4ae507dd2e2e1e7e",
      },
    },
  },

  onLoad: function (e) {
    if (e.exchangelist){
      console.log("直接跳转到兑换记录页面")
      this.exchangelist()
    }
    this.addisplay()
  },

  onShow: function () {
    this.userdata()

  },

  ceshikaming:function(){
    var str = "这里是习近平啊啊啊的内容测试啊";
    var newstr="这里是正常啊";

    console.log(newstr.indexOf("习近平") != -1);  // true

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
            //console.log('我的页面获取用户信息', res.userdata.birthday);
            this.birthday(res.userdata.birthday)
            this.setData({
              userdata: res.userdata,
            })
            wx.setStorageSync('userdata', res.userdata)
          },
          fail: res => {
            //console.log('错误捕捉', res);
          },
        })
      }
    })

  },


  birthday:function(e){
    if(e){
      var shijian  = e.replace(/\.|\-/g, '/')
      var temp = new Date(shijian);
      var t = temp.getFullYear() + "/" + (temp.getMonth() + 1) + "/" + temp.getDate(); //去除时分秒
      this.setData({
        birthday: t,
      })
    }
   
  },
  // exchange:function(){
  //   wx.navigateTo({
  //     url: '/pages/exchange/exchange'
  //   })

  // },
 
  myaddress:function(){
    wx.navigateTo({
      url: '/pages/my/my_address/my_address'
    })

  },

  userscorerecord:function(){
    wx.navigateTo({
      url: '/pages/my/score_detailed/score_detailed'
    })
  },

  usertasklist:function(){
    wx.navigateTo({
      url: '/pages/my/score_detailed/score_detailed'
    })

  },

  exchangelist:function(){
    wx.navigateTo({
      url: '/pages/my/exchangelist/exchangelist'
    })

  },

  testpages: function () {
    console.log("long tap")
    wx.navigateTo({
      url: '/pages/test/test'
    })

  },

  gdtbanneradclick: function (e) {
    //console.log("点击广点通banner广告", e.currentTarget)
    let userdata = wx.getStorageSync('userdata')
    let data = Object.assign(userdata, e.currentTarget.dataset); //将addata合并
    app.aldstat.sendEvent('我的页面点击广点通banner广告', data);
  },
  
  gdtvideoadclick: function (e) {
    let userdata = wx.getStorageSync('userdata')
    let data = Object.assign(userdata, e.currentTarget.dataset); //将addata合并
    app.aldstat.sendEvent('我的页gdt视频ad', data);
  },

  bindDateChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    wx.login({
      success: res => {
        request({
          service: 'user/userbirthday',
          data: {
            code: res.code,
            birthday: e.detail.value
          },
          success: res => {
            wx.showToast({
              title: '设置成功',
              icon: 'none',
              duration: 2000,
            })
             this.birthday(e.detail.value)
            // this.setData({
            //   birthday: e.detail.value
            // })
          },
        })
      }
    })

  },


  addisplay: function () {
    let userchannel = wx.getStorageSync('userdata').channel
    let scene = wx.getStorageSync('userdata').scene
    if (userchannel == null || userchannel == 0 && scene == 1047) {
      this.setData({
        gdtaddisplay: false
      })
    } else {
      this.setData({
        gdtaddisplay: true
      })
    }
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    return {
      title:"群记分小程序，一款好用的群管理工具。",
      desc:"群记分小程序，一款好用的群管理工具。",
      imageUrl: 'https://material.gzywudao.top/image/group/groupicon.png',
      path: '/pages/index/index?channel=1001&ald_media_id=33542&ald_link_key=c99244f0802f9f06', // 路径，传递参数到指定页面。
    }
   
  }
})