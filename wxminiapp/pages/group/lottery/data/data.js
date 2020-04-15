const app = getApp()
const {
  request
} = require('./../../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userlotterylist:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user_id=wx.getStorageSync('userdata').id;
    request({
      service: 'group/lottery/userlotterylist',
      method: 'GET',
      data: {
        user_id: user_id,
      },
      success: res => {
        this.setData({
          userlotterylist: res.data,
        })
      }
    })
  },
})