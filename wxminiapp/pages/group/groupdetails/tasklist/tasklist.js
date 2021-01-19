// pages/my/exchange_detailed/exchange_detailed.js
const app = getApp()
const {
  request
} = require('./../../../../utils/request.js');
const common = require('./../../../../utils/common.js') //公共函数
let interstitialAd = null; //插屏广告

Page({

  /**
   * 页面的初始数据
   */
  data: {
    usertasklist: null,
    loadModal: true,
    crowd_id: null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      crowd_id: options.crowd_id,
    })
    var user_id = wx.getStorageSync('userdata').id
    request({
      service: 'group/userdata/usergrouptasklist',
      data: {
        user_id: user_id,
        crowd_id: options.crowd_id
      },
      success: res => {
        //console.log('用户兑换列表页面', res);
        this.setData({
          usertasklist: res.usertasklist,
          loadModal: false,
        })
      },
    })

    this.gdtinsertad()//加载插屏广告
  },

  clicktasklist: function(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/my/score_detailed/task_detailed/task_detailed?id=' + e.currentTarget.dataset.id
    })

  },

  gdtvideoadclick: function(e) {
    let data = {
      'adtype': 4,
      'position': "群任务记录页面"
    };
    common.clickgdtadstatistics(data)
  },

  //加载插屏广告
  gdtinsertad: function() {
    var that = this;
    console.log("加载插屏广告")
    var insertad = 'adunit-547d5780f1b444d9';
    console.log("插屏广告代码", insertad)
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: insertad
      })
      interstitialAd.onLoad((e) => {
        console.log('插屏广告加载onLoad event emit', e)
      })
      interstitialAd.onError((err) => {
        console.log('插屏广告错误onError event emit', err)
      })
      interstitialAd.onClose((res) => {
        console.log('插屏广告被关闭onClose event emit', res)
      })
    }

    setTimeout(function() {
      that.onshowgdtinsertad()
    }, 2000);


  },

  //显示插屏广告
  onshowgdtinsertad: function() {
    var state = 0;
    interstitialAd.show((res) => {
      console.log("插屏广告展示成功", res)
    }).catch((err) => {
      console.error("插屏广告错误啦", err)
      state = 1;
    })
    setTimeout(function() {
      if (state == 0) {
        console.log("插屏广告显示成功")
        let gdtdata = {
          'adtype': 7,
          'position': "群任务记录页面"
        };
        common.clickgdtadstatistics(gdtdata)
      } else {
        console.log("插屏广告显示失败")
      }
    }, 500);
  },


})