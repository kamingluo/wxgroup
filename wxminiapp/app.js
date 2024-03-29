//app.js
const common = require('./utils/common.js') //公共函数
const {
  request
} = require('./utils/request.js') //公共请求方法

App({
  globalData: {
    ifUserRegister:false
    //一定要，删除报错
  },
  onLaunch: function(e) {
    console.log("onLaunch打印信息", e)
    this.getUserInfo(e)
    common.shareconfig() //分享配置
    this.scene(e) //传入入口值判断
    this.todayclickadtype()
    this.ifautoUpdate()//检查更新
    //common.xmaddata() //小盟ad配置
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        this.globalData.platform = e.platform;
      }
    })
  },

  getUserInfo: function(e) {
    var that=this;
    var data = {
      channel: e.query.channel || 0,
      crowd_id: e.query.crowd_id || 0,
      scene: e.scene,
    }
    //common.register(data); //用户注册未授权
    
    wx.login({
      success: res => {
        data.code = res.code
        request({
          service: 'user/register',
          data: data,
          success: res => {
            console.log('用户注册成功', res);
            wx.setStorageSync('userdata', res.userdata)
            // setTimeout(function() {
            //   that.globalData.ifUserRegister = true;
            // }, 10000);
            that.globalData.ifUserRegister = true;
          },
        })
      }
    })


  },


  //旧版本的用户授权
  // getUserInfo: function(e) {
  //   let that = this;
  //   var data = {
  //     channel: e.query.channel || 0,
  //     crowd_id: e.query.crowd_id || 0,
  //     scene: e.scene,
  //   }
  //   wx.getSetting({
  //     success(res) {
  //       if (res.authSetting['scope.userInfo']) {
  //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称
  //         wx.getUserInfo({
  //           success(res) {
  //             let userdata = Object.assign(data, res.userInfo);
  //             common.authorized(userdata) //用户注册已经授权
  //             var timestamp = Date.parse(new Date());
  //             wx.setStorageSync('updateAuthorization', timestamp)
  //           },
  //           fail(res) {
  //             common.register(data) //用户注册已经授权但是未获取到信息
  //           }
  //         })
  //       } else {
  //         common.register(data) //用户注册未授权
  //       }
  //     }
  //   })
  // },





  //入口值判断
  scene: function(e) {
    let scene = e.scene;
    if (scene==1173){
      let supportedMaterials={
        'adtype': 666,
        'position':"从聊天素材打开"
      }
      common.clickgdtadstatistics(supportedMaterials)
    }
    let channel = e.query.channel || 0;
    let user_channel = wx.getStorageSync('userdata').channel || 0;
    // if (  user_channel== 0 &&  channel == 0 && scene == 1001 || scene == 1129 || scene == 1047 ) {
    if (channel == 1000 || channel == 0 && scene == 1001 || scene == 1129 || scene == 1047 || scene == 1106) {
      console.log("开关false")
      this.globalData.display = false;
    } else {
      this.globalData.display = true;
    }
    if (channel == 0 && scene == 1089 || scene == 1001) {
      this.globalData.addapptips = false;
    } else {
      this.globalData.addapptips = true;
    }
  },

  //用户今日点击广告状态
  todayclickadtype: function() {
    let nowDate = new Date();
    var year = nowDate.getFullYear();
    var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) :nowDate.getMonth() + 1;
    var day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
    var dateStr = year + "-" + month + "-" + day;
    let oldday = wx.getStorageSync('todayclickad').time;
    if (oldday != dateStr){
      console.log("不是今天，更新点击广告的type")
      let data = {
        time: dateStr,
        adtype: 5
      }
      wx.setStorageSync('todayclickad', data)
    }
  },

   //检查更新
  ifautoUpdate:function(){
        request({
          service: 'appdata/home/autoupdate',
          success: res => {
            console.log("获取是否更新版本",res)
            let autoUpdate=res.autoUpdate;
            if(autoUpdate){
              console.log("等于true，开启版本更新")
              this.autoUpdate()
            }
          },
        })


  },

  //检查更新版本
  autoUpdate: function() {
    console.log("调用了版本更新")
    var self = this
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      //1. 检查小程序是否有新版本发布
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //检测到新版本，需要更新，给出提示
          wx.showModal({
            title: '更新提示',
            content: '检测到新版本，是否启用新版本？',
            success: function(res) {
              if (res.confirm) {
                //2. 用户确定下载更新小程序，小程序下载及更新静默进行
                self.downLoadAndUpdate(updateManager)
              } else if (res.cancel) {
                //用户点击取消按钮的处理，如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                wx.showModal({
                  title: '温馨提示~',
                  content: '本次版本更新涉及到新的功能添加，旧版本访问可能存在问题哦~',
                  showCancel: false, //隐藏取消按钮
                  confirmText: "确定更新", //只保留确定更新按钮
                  success: function(res) {
                    if (res.confirm) {
                      //下载新版本，并重新应用
                      self.downLoadAndUpdate(updateManager)
                    }
                  }
                })
              }
            }
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  /**
   * 下载小程序新版本并重启应用
   */
  downLoadAndUpdate: function(updateManager) {
    var self = this
    wx.showLoading();
    //静默下载更新小程序新版本
    updateManager.onUpdateReady(function() {
      wx.hideLoading()
      //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate()
    })
    updateManager.onUpdateFailed(function() {
      // 新的版本下载失败
      wx.showModal({
        title: '已经有新版本了哟~',
        content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
      })
    })
  }








})