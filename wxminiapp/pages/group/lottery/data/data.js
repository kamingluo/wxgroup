const app = getApp()
const {
  request
} = require('./../../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userlotterylist:[],
    crowd_id: null,
    user_type: null,
    user_id: null,
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let user_id = wx.getStorageSync('userdata').id;
    this.setData({
      user_id: user_id,
      crowd_id: options.crowd_id,
      user_type: options.user_type
    })
    this.userlotterylist()
    
  },

  userlotterylist:function(){
    let user_id = wx.getStorageSync('userdata').id;
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

  seedetails:function(e){
    let id = e.currentTarget.dataset.lotteryid;//抽奖id
    let crowd_id = this.data.crowd_id;
    let user_type = this.data.user_type;
    wx.navigateTo({
      url: '/pages/group/lottery/partake/partake?id=' + id + '&crowd_id=' + crowd_id + '&user_type=' + user_type,
    })
      
  },




})