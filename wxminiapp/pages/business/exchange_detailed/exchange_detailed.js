// pages/my/exchange_detailed/exchange_detailed.js
const app = getApp()
const {
  request
} = require('./../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    exchangelist:null,
    loadModal: true,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user_id = wx.getStorageSync('userdata').id
    request({
      service: 'business/exchange/exchangelist',
      data: {
        user_id: user_id,
      },
      success: res => {
        //console.log('用户兑换列表页面', res);
        this.setData({
          exchangelist: res.exchangelist,
          loadModal: false,
        })
      },
    })

  },

  exchange:function(){
    wx.navigateTo({
      url: '/pages/business/exchange/exchange'
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
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
})