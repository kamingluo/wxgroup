
const app = getApp()
const {
  request
} = require('./../../../utils/request.js');
const {
  share
} = require('./../../../utils/share.js');
const common = require('./../../../utils/common.js');
var preventShake = 0; //防止快速点击
var videoAd = null;//全局，提前加载视频广告

Page({
  data: {
    clickdata:{},//用户今日广告数据
    coins:{},//配置的金币奖励数
    coinmodal:false,//获得金币弹框
    coinmodalnumber:null,//弹框显示金币数
    banneradshow:false,//banner广告模块是否展示
    gridadshow:false,//格子广告是否展示
    setInter: '',//计时器
    num: 0,//计时秒数
    display: false, //是否展示内容
    gdtaddisplay: false, //广告是否展示

  },

  onLoad: function (options) {
    this.usertodayads()
    this.addisplay()
  },

  onShow: function () {
    this.createvideoad()//提前加载视频广告
    this.playtask()//查看是否完成任务
  },



//判断是否能显示广告
  addisplay: function() {
    this.setData({
      display: app.globalData.display || false
    })

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


  gdtvideoadclick: function (e) {
    console.log("点击了我的页面的视频广告")
    let data={
      'adtype':4,
      'position':"广点通任务页面"
    };
    common.clickgdtadstatistics(data)
  },


//点击banner广告
  gdtbannerclick:function(){

    let data={
      'adtype':1,
      'position':"广点通任务页面"
    };
    common.clickgdtadstatistics(data)

    this.startSetInter()//启动计时器
    this.setData({
      taskid: 1,
    })
  },


  gdtcustomclick:function(){
    console.log("点击模板广告")
    let data={
      'adtype':5,
      'position':"广点通任务页面"
    };
    common.clickgdtadstatistics(data)

  },



//点击格子广告
gdtgridclick:function(){
  let data={
    'adtype':3,
    'position':"广点通任务页面"
  };
  common.clickgdtadstatistics(data)
  this.startSetInter()//启动计时器
  this.setData({
    taskid: 3,
  })
},

//计时器
  startSetInter: function() {
    var that = this;
    //将计时器赋值给setInter
    that.data.setInter = setInterval(
      function() {
        if (that.data.num > 40) {
          //console.log('大于40啦');
          clearInterval(that.data.setInter)
        }
        var numVal = that.data.num + 1;
        that.setData({
          num: numVal
        });
        //console.log('当前计时时间==' + that.data.num);
      }, 1000);
  },

//页面显示查看是否完成任务
 playtask: function() {
    var that = this
    clearInterval(that.data.setInter)
    if (that.data.taskid == null || that.data.num == 0 || that.data.taskid == "") {
      //console.log("时间等于0或者任务id等于空")
      return;
    }
    let tasktime = 12;//任务时长，写死12秒
    if (that.data.num < tasktime) {
      that.wxshowToast("体验满12秒才能获得奖励哦！")
      this.setData({
        num: 0,
        taskid: "",
      });
      return;
    }

    if (that.data.taskid == 1) { 
      //banner广告任务成功
      that.clickbanneradsuccess()
    } else { 
      //格子广告任务成功
      that.clickgridadsuccess()
    }
    //console.log("将时间恢复0")
    this.setData({
      num: 0,
      taskid: "",
    });
  },

//banner广告成功完成奖励
  clickbanneradsuccess:function(){
    var that = this;
    var user_id = wx.getStorageSync('userdata').id;
    wx.login({
      success: res => {
        request({
          service: 'business/gdtad/clickbannerad',
          data: {
            code: res.code,
            user_id: user_id,
            adid: 'adunit-53f29d2c52baa487',
          },
          success: res => {
            let number=that.data.coins.banner;
            that.setData({
              coinmodal: true,
              coinmodalnumber: number
            })
            that.usertodayads()
          },
        })
      }
    })
  },


//格子广告成功完成奖励
clickgridadsuccess:function(){
  var that = this;
  var user_id = wx.getStorageSync('userdata').id;
  wx.login({
    success: res => {
      request({
        service: 'business/gdtad/clickgridad',
        data: {
          code: res.code,
          user_id: user_id,
          adid: 'adunit-1d1320feca860080',
        },
        success: res => {
          let number=that.data.coins.grid;
          that.setData({
            coinmodal: true,
            coinmodalnumber: number
          })
          that.usertodayads()
        },
      })
    }
  })
},





//广告加载成功或者失败展示交互
  banneradsuccess:function(){
    this.setData({
      banneradshow: true
    })
  },
  banneraderr:function(){
    console.log("banner广告加载失败")
    this.setData({
      banneradshow: false
    })
  },
  gridadsuccess:function(){
    this.setData({
      gridadshow: true
    })
  },
  gridaderr: function () {
    console.log("格子广告加载失败")
    this.setData({
      gridadshow: false
    })
  },

//跳转创建群按钮
  creategroup: function () {
    wx.navigateTo({
      url: '/pages/creategroup/creategroup',
    })
  },

//用户今天的广告数据
  usertodayads:function(){
    var that =this
    let user_id = wx.getStorageSync('userdata').id;
    request({
      service: 'business/gdtad/usertodayads',
      data: {
        user_id: user_id
      },
      success: res => {
        console.log("用户今日广告数据",res)
        that.setData({
          clickdata: res.clickdata,
          coins: res.coins
        })
        
      },
    })

  },

//统一toast
  wxshowToast: function (title) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 2500
    })

  },
//关闭弹框
  closemodal:function(){
    this.setData({
      coinmodal:false,
    })
  },

//预先创建视频广告
  createvideoad:function(){
    var that = this;
    // 在页面中定义激励视频广告
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-75b1d3f72dd6956b'
      })
      videoAd.onLoad(() => {
        console.log("onLoad")
      })
      videoAd.onError((err) => {
        console.log("onError")
      })
      videoAd.onClose((res) => {
        var nowTime = Date.now();
        //console.log("点击关闭视频广告", res)
        if (res && res.isEnded || res === undefined) {
          if (nowTime - preventShake < 5000) {
            //console.log("防止短时间内多次调用")
            return
          }
          preventShake = nowTime;

          console.log("正常播放结束，可以下发游戏奖励")
          that.lookvideoad('adunit-75b1d3f72dd6956b')
          let data={
            'adtype':2,
            'position':"广点通任务页面"
          };
          common.clickgdtadstatistics(data)
        } else {
          that.wxshowToast("观看完成才能获得奖励哦！")
          //console.log("播放中途退出，不下发游戏奖励")
        }
      })
    }
  },

//点击播放视频广告
  showvideoad:function(){
    var that = this;
    console.log("观看视频广告")
    if (videoAd) {
      videoAd.show().catch(() => {
        //console.log("失败重试")
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            //console.log('激励视频 广告显示失败')
            that.wxshowToast("暂无广告,等会再试试！")
          })
      })
    }
  },
 
//看视频完成加奖励
  lookvideoad: function (adid) {
    var that = this;
    var user_id = wx.getStorageSync('userdata').id;
    // var nowTime = Date.now();
    // if (nowTime - preventShake < 5000) {
    //   //console.log("防止短时间内多次调用")
    //   return
    // }
    // preventShake = nowTime;
    wx.login({
      success: res => {
        request({
          service: 'business/gdtad/lookvideoad',
          data: {
            code: res.code,
            user_id: user_id,
            adid: adid,
          },
          success: res => {
            let number=that.data.coins.video;
            that.setData({
              coinmodal: true,
              coinmodalnumber: number
            })
            that.usertodayads()
            // that.wxshowToast("任务完成")
          },
        })
      }
    })

  },
//用户分享
 onShareAppMessage: function () {
  return share();
  // return {
  //   title: "群记分小程序，一款好用的群管理工具。",
  //   desc: "群记分小程序，一款好用的群管理工具。",
  //   imageUrl: 'https://material.gzywudao.top/image/group/groupicon.png',
  //   path: '/pages/index/index?channel=1001&ald_media_id=33542&ald_link_key=c99244f0802f9f06', // 路径，传递参数到指定页面。
  // }

 }
})