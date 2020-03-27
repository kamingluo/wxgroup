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
    crowd_id:null
  },
  onLoad: function (options) {
    this.setData({
      crowd_id: options.crowd_id
    })
    this.userexchangelist()
  },

  //查询该群该用户的兑换列表
  userexchangelist: function () {
    var user_id = wx.getStorageSync('userdata').id
    var crowd_id = this.data.crowd_id
    request({
      service: 'group/Exchangegoods/userchangelist',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
        user_id: user_id
      },
      success: res => {
        console.log('获取用户兑换列表', res);
        this.setData({
          exchangelist: res.data,
        })
      },
    })
  },

  queryexpress:function(e){
    console.log(e.currentTarget.dataset.expressid)
    let expressid = e.currentTarget.dataset.expressid

    wx.navigateToMiniProgram({
      appId: 'wxf1f0d92f69dd80db',
      path: '/pages/index/index?channel=1006' + '&expressNumber=' + expressid,
    })

  },



})