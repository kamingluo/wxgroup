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
    alltasklists: null,
    loadModal: true,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    console.log("查看全部任务", options)
    let crowd_id = options.crowd_id
    request({
      service: 'task/handletask/alltasklists',
      data: {
        crowd_id: crowd_id,
      },
      success: res => {
        console.log('查询该群的全部任务，审核和未审核都任务', res);
        this.setData({
          alltasklists: res.alltasklists,
          loadModal: false,
        })
      },
    })

    // request({
    //   service: 'appdata/home/swiperdata',
    //   method: 'GET',
    //   success: res => {
    //     this.setData({
    //       swiperdata: res.swiperdata,
    //     })
    //   }
    // })
  },

  clicktasklist: function(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/my/score_detailed/task_detailed/task_detailed?id=' + e.currentTarget.dataset.id
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})