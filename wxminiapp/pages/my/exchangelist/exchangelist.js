// pages/group/goods/exchangelist/exchangelist.js

const app = getApp()
const {
  request
} = require('./../../../utils/request.js');
const common = require('./../../../utils/common.js') //公共函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exchangelist: null
  },
  onLoad: function (options) {
   
    this.userexchangelist()
  },

  //查询该群该用户的兑换列表
  userexchangelist: function () {
    var openid = wx.getStorageSync('userdata').openid
    if(openid == null){
      common.haveopenid().then(function (e) {
         openid = e;
      })
    }
    request({
      service: 'group/Exchangegoods/userallchangelist',
      method: 'GET',
      data: {
        openid: openid
      },
      success: res => {
        this.setData({
          exchangelist: res.data,
        })
      },
    })
  },

  queryexpress: function (e) {
    console.log(e.currentTarget.dataset.expressnumber)
    let expressnumber = e.currentTarget.dataset.expressnumber
    //直接跳转快递查询页面
    wx.navigateTo({
      url: '/pages/expressresult/expressresult?number=' + expressnumber
    })

    //跳转快递查询小程序
    // wx.navigateToMiniProgram({
    //   appId: 'wxf1f0d92f69dd80db',
    //   path: '/pages/index/index?channel=1006' + '&expressNumber=' + expressnumber,
    // })

  },

  copydata: function (e) {
    let expressnumber = e.currentTarget.dataset.expressnumber
    console.log("点击复制", expressnumber)
    wx.setClipboardData({
      data: expressnumber,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2000,
        })

      }
    })
  }



})