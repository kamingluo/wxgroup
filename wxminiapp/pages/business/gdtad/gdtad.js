
const app = getApp()
const {
  request
} = require('./../../../utils/request.js');
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

  },

  onLoad: function (options) {
    this.usertodayads()
  },

  onShow: function () {
    this.createvideoad()//提前加载视频广告
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
        //console.log("点击关闭视频广告", res)
        if (res && res.isEnded || res === undefined) {
          that.lookvideoad('adunit-75b1d3f72dd6956b')
          console.log("正常播放结束，可以下发游戏奖励")
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
    var nowTime = Date.now();
    var user_id = wx.getStorageSync('userdata').id;
    if (nowTime - preventShake < 5000) {
      //console.log("防止短时间内多次调用")
      return
    }
    preventShake = nowTime;
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
  return {
    title: "群记分小程序，一款好用的群管理工具。",
    desc: "群记分小程序，一款好用的群管理工具。",
    imageUrl: 'https://material.gzywudao.top/image/group/groupicon.png',
    path: '/pages/index/index?channel=1001&ald_media_id=33542&ald_link_key=c99244f0802f9f06', // 路径，传递参数到指定页面。
  }

 }
})