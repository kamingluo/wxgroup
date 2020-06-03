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

  /**
   * 页面的初始数据
   */
  data: {
    display:false,
    swiperdata:[],//首页轮播图数据
    usergrouplist:[],//用户加入群列表
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.indexData() //拿到首页轮播图数据
    this.getUserInfoif() //判断用户有没有授权

    this.setData({
      display: app.globalData.display || false
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    this.usergroup()
    
  },

  //查询轮播图首页数据
  indexData: function () {
    request({
      service: 'appdata/home/swiperdata',
      method: 'GET',
      success: res => {
        this.setData({
          swiperdata: res.swiperdata,
        })
      }
    })
  },

  //点击轮播图
  clickSwiper: function (e) {
    common.insidejump(e.currentTarget.dataset.data)
  },


  //用户加入群列表
  usergroup:function(){
    var that =this
    wx.login({
      success: res => {
        request({
          service: 'group/usergroup/usergroup',
          data: {
            code: res.code,
          },
          success: res => {
            that.setData({
              usergrouplist: res.usergrouplist,
            })
            if (res.usergrouplist.length < 3){
              setTimeout(function () {
                that.usergroup2()
              }, 2000)   
            }
          },
        })
      }
    })
  },


  //用户加入群列表2,http://material.gzywudao.top/moren.jpg
  usergroup2: function () {
    var that = this
    wx.login({
      success: res => {
        request({
          service: 'group/usergroup/usergroup',
          data: {
            code: res.code,
          },
          success: res => {
            that.setData({
              usergrouplist: res.usergrouplist,
            })
            if (res.usergrouplist.length < 2) {
              setTimeout(function () {
                that.usergroup3()
              }, 2000)
            }
          },
        })
      }
    })
  },

  //用户加入群列表3,再拿一次
  usergroup3: function () {
    var that = this
    wx.login({
      success: res => {
        request({
          service: 'group/usergroup/usergroup',
          data: {
            code: res.code,
          },
          success: res => {
            that.setData({
              usergrouplist: res.usergrouplist,
            })
          },
        })
      }
    })
  },





  clickusergrouplist:function(e){
    wx.navigateTo({
      url: '/pages/group/groupdetails/groupdetails?id=' + e.currentTarget.dataset.data.id + '&user_type=' + e.currentTarget.dataset.data.user_type + '&score=' + e.currentTarget.dataset.data.score,
    })
  },

  clickgroup:function(){
    wx.navigateTo({
      url: '/pages/creategroup/creategroup',
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
              wx.showToast({
                title: '授权成功',
                icon: 'success',
                duration: 2000,
              })
              that.setData({
                ifauthorized: true,
              })
            }
          })
        }
      }
    })
  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },


  aaaaaaa() {
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.address']) {
          wx.chooseAddress({
            success(res) {
              console.log(res)
            }
          })
          // 用户已经同意小程序使用功能，后续调用接口不会弹窗询问

        } else {
          if (res.authSetting['scope.address'] == false) {
            wx.openSetting({
              success(res) {
                console.log(res.authSetting)
              }
            })
          } else {
            wx.chooseAddress({
              success(res) {
                console.log(res)
              }
            })
          }
        }
      }
    })
  },
  

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title:"群记分小程序，一款好用的群管理工具。",
      desc:"群记分小程序，一款好用的群管理工具。",
      imageUrl: 'https://material.gzywudao.top/image/group/groupicon.png',
      path: '/pages/index/index?channel=1001&ald_media_id=33542&ald_link_key=c99244f0802f9f06', // 路径，传递参数到指定页面。
    }
    
  }
})