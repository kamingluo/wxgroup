const app = getApp()
const {
  request
} = require('./../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    partakeuserlist:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let lottery_id= options.lottery_id;
    request({
      service: 'group/lottery/partakeuserlist',
      method: 'GET',
      data: {
        lottery_id:lottery_id
      },
      success: res => {
        this.setData({
          partakeuserlist:res.data
        })
      }
    })

  },

})