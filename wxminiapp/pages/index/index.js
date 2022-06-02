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
    display: false,
    swiperdata: [],//首页轮播图数据
    modeldata: [],//首页弹框数据
    usergrouplist: [],//用户加入群列表
    ifauthorized: false,
    banneradshow: true,
    adtype: null,//展示广告类型
    crowd_vip: false,//是否群vip
    ifadspecialshow: false,//是否强展示广告
    ifUserRegisterSetInter: '',//是否注册循环计时器
    loadModal:true,//列表加载提示
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

    //根据全局变量，查询用户加入群列表
    // this.newusergroup()

  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    let adtype = wx.getStorageSync('todayclickad').adtype || 5;
    this.setData({
      adtype: adtype,
    })
    //this.usergroup()//旧的请求用户列表
    this.newusergroup()
    this.getUserInfoif() //判断用户有没有授权
  },


  //根据全局变量，查询用户加入群列表
  newusergroup: function() {
    var that = this;
    //将计时器赋值给setInter
    that.data.ifUserRegisterSetInter = setInterval(
      function() {
        let ifUserRegister=app.globalData.ifUserRegister;
        console.log("拿到用户是否登陆全局变量判断",ifUserRegister)
        if (ifUserRegister) {
          clearInterval(that.data.ifUserRegisterSetInter)
          console.log('用户是否注册全局变量为true:',ifUserRegister);
          that.usergroup();
        }
        else{
          console.log('用户是否注册全局变量为false:',ifUserRegister);
        }
      }, 1000);
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
    console.log("点击轮播图", e)
    common.insidejump(e.currentTarget.dataset.data)
  },


  //用户加入群列表
  usergroup: function () {
    console.log("请求用户加入的群列表")
    var that = this
    wx.login({
      success: res => {
        let user_id = wx.getStorageSync('userdata').id || 0;
        request({
          service: 'group/usergroup/usergroup',
          data: {
            code: res.code,
            user_id: user_id
          },
          success: res => {
            console.log("请求用户加入群列表成功",res)
            let crowd_vip = res.crowd_vip || false;
            let ifadspecialshow = res.ifadspecialshow || false;//为true的话就展示广告
            that.setData({
              usergrouplist: res.usergrouplist,
              crowd_vip: crowd_vip,
              ifadspecialshow: ifadspecialshow,
              loadModal:false
            })
            wx.setStorageSync('crowd_vip', crowd_vip)
            wx.setStorageSync('ifadspecialshow', ifadspecialshow)

            // if (res.usergrouplist.length < 2) {
            //   setTimeout(function () {
            //     that.usergroup2()
            //   }, 2000)
            // }
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
        let user_id = wx.getStorageSync('userdata').id || 0;
        request({
          service: 'group/usergroup/usergroup',
          data: {
            code: res.code,
            user_id: user_id
          },
          success: res => {
            that.setData({
              usergrouplist: res.usergrouplist,
            })
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
        let user_id = wx.getStorageSync('userdata').id || 0;
        request({
          service: 'group/usergroup/usergroup',
          data: {
            code: res.code,
            user_id: user_id
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


  kefu:function(){
    wx.navigateTo({
      url: '/pages/joinweChat/joinweChat',
    })
  },
  clickusergrouplist: function (e) {
    wx.navigateTo({
      url: '/pages/group/groupdetails/groupdetails?id=' + e.currentTarget.dataset.data.id + '&user_type=' + e.currentTarget.dataset.data.user_type + '&score=' + e.currentTarget.dataset.data.score,
    })
  },

  clickgroup: function () {
    wx.navigateTo({
      url: '/pages/creategroup/creategroup',
    })
  },


  //判断用户有没有授权旧的
  // getUserInfoif: function () {
  //   var that = this
  //   wx.getSetting({
  //     success(res) {
  //       console.log("onshow拿到用户授权过的配置", res)
  //       if (res.authSetting['scope.userInfo']) {
  //         that.setData({
  //           ifauthorized: true,
  //         })
  //       }
  //     }
  //   })
  // },

  //判断用户有没有授权新的
  getUserInfoif: function () {
    let ifauthorized = common.ifauthorized();
    this.setData({
      ifauthorized: ifauthorized,
    })
    console.log("判断手否需要授权")
    console.log(ifauthorized)
  },


  //旧的授权方法
  // getUserInfo: function (e) {
  //   let that = this;
  //   let channel = wx.getStorageSync('userdata').channel || 0
  //   var data = {
  //     channel: channel,
  //     crowd_id: 0,
  //     scene: wx.getStorageSync('userdata').scene,
  //   }
  //   wx.getSetting({
  //     success(res) {
  //       console.log("查看授权设置", res)
  //       if (res.authSetting['scope.userInfo']) {
  //         wx.getUserInfo({
  //           success(res) {
  //             console.log("授权成功更新信息啦")
  //             let userdata = Object.assign(data, res.userInfo);
  //             common.authorized(userdata) //用户注册已经授权
  //             that.setData({
  //               ifauthorized: true,
  //             })
  //           }
  //         })
  //       }
  //     }
  //   })
  // },


  //新的授权方法
  getUserProfile: function (e) {
    let that = this;
    let channel = wx.getStorageSync('userdata').channel || 0
    var data = {
      channel: channel,
      crowd_id: 0,
      scene: wx.getStorageSync('userdata').scene,
    }
    console.log("新的授权方法")

    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("授权成功更新信息啦",res)
        let userdata = Object.assign(data, res.userInfo);
        common.authorized(userdata) //用户注册已经授权
        that.setData({
          ifauthorized: true,
        })
        wx.showToast({
          title: '授权成功！',
          icon: 'success',
          duration: 2500,
        })
      },
      fail:(res)=> {
        wx.showToast({
          title: '授权失败！',
          icon: 'none',
          duration: 2500,
        })
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


  hideModal: function () {
    this.setData({
      modeldata: [],
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
    //   path: '/pages/index/index?channel=1005', // 路径，传递参数到指定页面。
    // }

  },

  onShareTimeline: function () {
    console.log("分享到朋友圈")
    return {
      title: "群记分小程序，一款好用的群管理工具。",
      // imageUrl: baseConfig.imageurl+'miniapp/images/appicon.png',
      imageurl: 'http://groupmaterial.gzywudao.top/fengmian.png',
      query: "这里是填写要携带的参数", // 路径，传递参数到指定页面。
    }
  }


})