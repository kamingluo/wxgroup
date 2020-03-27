// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zengjia: true,
    jianshao: false,
    state:0,
    tasktext:""
  },


  add: function (e) {
    this.setData({
      zengjia: true,
      jianshao:false,
      state:0
    })
  },
  jian:function(){
    this.setData({
      zengjia: false,
      jianshao: true,
      state: 1
    })
  },
  tasktext:function(e){
    this.setData({
      tasktext: e.detail.value,
    })
  },


  webview: function () {
    console.log("1111111")
    wx.navigateTo({
      url: '/pages/webview/webview'
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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