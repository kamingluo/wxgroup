
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
    userdata:'',
    birthday:null,
    gdtaddisplay: false,
    ifauthorized:false,
  },

  onLoad: function (e) {
    if (e.exchangelist){
      this.exchangelist()
    }
    this.addisplay()

    let imageurl = baseConfig.imageurl;
    this.setData({
      imageurl: imageurl,
    })
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
            this.birthday(res.userdata.birthday)
            this.setData({
              userdata: res.userdata,
            })
            wx.setStorageSync('userdata', res.userdata)
          },
        })
      }
    })

  },

  //获取小U广告配置

  xiaouad:function(){
    request({
      service: 'appdata/my/xiaouad',
      data: {},
      success: res => {
        console.log("小U广告数据",res.data)
        this.setData({
          xiaouaddata: res.data,
        })
      },
    })
  },



  //用户生日
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

  //跳转测试页面
  testpages: function () {
    console.log("long tap")
    wx.navigateTo({
      url: '/pages/test/test'
    })
  },

  gdtbanneradclick: function (e) {
    let data={
      'adtype':1,
      'position':"我的页面"
    };
    common.clickgdtadstatistics(data)
  },

  mobanadclick: function (e) {
    let data={
      'adtype':5,
      'position':"我的页面"
    };
    common.clickgdtadstatistics(data)
  },
  
  gdtvideoadclick: function (e) {
    let data={
      'adtype':4,
      'position':"我的页面"
    };
    common.clickgdtadstatistics(data)
  },

//用户设置生日
  bindDateChange: function (e) {
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
             this.birthday(e.detail.value)//处理时间
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


  //用户注册
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
              that.setData({
                ifauthorized: true,
              })
            }
          })
        }
      }
    })
  },


  //判断是否展示广告
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
    return share();
  }
})