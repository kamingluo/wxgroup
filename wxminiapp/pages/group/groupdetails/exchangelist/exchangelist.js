


// pages/group/goods/exchangelist/exchangelist.js

const app = getApp()
const {
  request
} = require('./../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exchangelist: null,
    crowd_id: null,
    crowd_name: null,
    user_type: 0,
  },
  onLoad: function (options) {
    this.setData({
      crowd_id: options.crowd_id,
      crowd_name: options.crowd_name,
      user_type: options.user_type
    })
   
  },

  onShow:function(){
    this.userexchangelist()

  },

  //查询该群兑换列表
  userexchangelist: function () {
    var crowd_id = this.data.crowd_id
    request({
      service: 'group/Exchangegoods/groupexchangelist',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
      },
      success: res => {
        console.log('群兑换列表', res);
        this.setData({
          exchangelist: res.data,
        })
      },
    })
  },


  clicklist: function (e) {
    //console.log(e.currentTarget.dataset.data.id)
    let changeid = e.currentTarget.dataset.data.id
    wx.navigateTo({
      url: '/pages/group/groupdetails/exchangelist/exchangedetails/exchangedetails?changeid=' + changeid,
    })
   

  },


})
  