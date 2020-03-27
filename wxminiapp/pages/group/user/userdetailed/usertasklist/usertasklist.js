// pages/my/exchange_detailed/exchange_detailed.js
const app = getApp()
const {
  request
} = require('./../../../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    usertasklist: null,
    loadModal: true,
    crowd_id: null,
    user_id: null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      crowd_id: options.crowd_id,
      user_id: options.user_id,
    })

    request({
      service: 'group/userdata/usergrouptasklist',
      data: {
        user_id: options.user_id,
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
  },

  clicktasklist: function (e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/my/score_detailed/task_detailed/task_detailed?id=' + e.currentTarget.dataset.id
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})