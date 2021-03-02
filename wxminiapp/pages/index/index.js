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

  /**
   * 页面的初始数据
   */
  data: {
    imageurl: 'https://group.gzywudao.top/php/public/',//默认图片链接
    display:false,
    swiperdata:[],//首页轮播图数据
    modeldata: [],//首页弹框数据
    usergrouplist:[],//用户加入群列表
    ifauthorized:false,
    banneradshow:true,
    listad:{},//群列表广点通广告
    adtype: null,//展示广告类型
    crowd_vip:false//是否群vip
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.indexData() //拿到首页轮播图数据
    let imageurl = baseConfig.imageurl;
    this.setData({
      display: app.globalData.display || false,
      imageurl: imageurl,
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //this.kaming()  //提示动画

  },

  kaming:function(){
    var that=this
    setTimeout(function() {
      that.setData({
        kaming: false
      })
      console.log("11111111")
    }, 1000)
    setTimeout(function() {
      that.setData({
        kaming: true
      })
      that.kaming()
      console.log("动画啦啦啦啦啦")
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    let adtype = wx.getStorageSync('todayclickad').adtype || 5;
    this.setData({
      adtype: adtype,
    })

    this.usergroup()
    this.getUserInfoif() //判断用户有没有授权

    
  },

  //查询轮播图首页数据
  indexData: function () {
    request({
      service: 'appdata/home/swiperdata',
      method: 'GET',
      success: res => {
        this.setData({
          swiperdata: res.swiperdata,
          modeldata: res.modeldata
        })
      }
    })
  },

  //点击轮播图
  clickSwiper: function (e) {
    console.log("点击轮播图",e)
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
              listad: res.listad,
              usergrouplist: res.usergrouplist,
              crowd_vip: res.crowd_vip
            })
            wx.setStorageSync('crowd_vip', res.crowd_vip)
            
            if (res.usergrouplist.length < 2){
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
              listad:res.listad,
              crowd_vip: res.crowd_vip
            })
            wx.setStorageSync('crowd_vip', res.crowd_vip)
            if (res.usergrouplist.length < 1) {
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
              crowd_vip: res.crowd_vip
            })
            wx.setStorageSync('crowd_vip', res.crowd_vip)
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
        console.log("onshow拿到用户授权过的配置",res)
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
        console.log("查看授权设置",res)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success(res) {
              console.log("授权成功更新信息啦")
              let userdata = Object.assign(data, res.userInfo);
              common.authorized(userdata) //用户注册已经授权
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

  

  //广告加载成功或者失败展示交互
  banneradsuccess: function () {
    this.setData({
      banneradshow: true
    })
  },
  banneraderr: function () {
    console.log("banner广告加载失败")
    this.setData({
      banneradshow: false
    })
  },



  gdtvideoadclick: function (e) {
    let data = {
      'adtype': 4,
      'position': "首页"
    };
    common.clickgdtadstatistics(data)
  },

  gdtbanneradclick: function (e) {
    console.log("点击banner广告'")
    let data = {
      'adtype': 1,
      'position': "首页"
    };
    common.clickgdtadstatistics(data)
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
  

  //点击弹框广告跳转
  clickjump: function (e) {
    console.log("点击弹框", e)
    common.insidejump(e.currentTarget.dataset.data)
    this.setData({
      modeldata: [],
    })
  },


  hideModal:function(){
    this.setData({
      modeldata:[],
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return share();
    // return {
    //   title:"群记分小程序，一款好用的群管理工具。",
    //   desc:"群记分小程序，一款好用的群管理工具。",
    //   imageUrl: baseConfig.imageurl+'miniapp/images/appicon.png',
    //   // imageUrl: 'https://material.gzywudao.top/image/group/groupicon.png',
    //   path: '/pages/index/index?channel=1005&ald_media_id=33542&ald_link_key=c99244f0802f9f06', // 路径，传递参数到指定页面。
    // }
    
  },

  onShareTimeline:function(){
    console.log("分享到朋友圈")
    return {
      title: "群记分小程序，一款好用的群管理工具。",
      imageUrl: baseConfig.imageurl+'miniapp/images/appicon.png',
      query: "这里是填写要携带的参数", // 路径，传递参数到指定页面。
    }
  }


})