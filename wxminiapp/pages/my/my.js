
const app = getApp()
const {
  request
} = require('./../../utils/request.js');
const {
  share
} = require('./../../utils/share.js');
const common = require('./../../utils/common.js') //公共函数
var Page = require('../../utils/sdk/xmad/xmadx_sdk.min.js').xmad(Page).xmPage; //小盟广告

Page({
  data: {
    userdata:'',
    birthday:null,
    gdtaddisplay: false,
    ifauthorized:false,
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
      this.exchangelist()
    }
    this.addisplay()
    
  },

  onShow: function () {
    this.userdata()
    this.getUserInfoif() //判断用户有没有授权

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

  coinrecord:function(){
    wx.navigateTo({
      url: '/pages/business/coin_record/coin_record'
    })
  },

  business:function(e){
    let jumpid = e.currentTarget.dataset.jumpid;
    if (jumpid ==1){
      var url = '/pages/business/gdtad/gdtad';
    }
    else if (jumpid == 2){
      var url = '/pages/business/exchange/exchange';
    }
    else{
      var url = '/pages/business/exchange_detailed/exchange_detailed';
    }
    wx.navigateTo({
      url: url
    })

  },
 
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

  //判断用户有没有授权
  getUserInfoif:function(){
    var that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          that.setData({
            ifauthorized: true ,
          })
        }
      }
    })

  },



  getUserInfo: function (e) {
    let that = this;
    var data = {
      channel: wx.getStorageSync('userdata').channel,
      crowd_id: 0,
      scene: wx.getStorageSync('userdata').scene,
    }
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success(res) {
              //console.log("更新信息啦")
              let userdata = Object.assign(data, res.userInfo);
              common.authorized(userdata) //用户注册已经授权
              setTimeout(function() {
                that.userdata()//等注册完成，隔2秒拿一下新的信息
              }, 2000)
              // wx.showToast({
              //   title: '授权成功',
              //   icon: 'success',
              //   duration: 2000,
              // })
              that.setData({
                ifauthorized: true,
              })
            }
          })
        }
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