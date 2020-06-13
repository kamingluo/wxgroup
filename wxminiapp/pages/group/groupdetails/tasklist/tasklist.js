// pages/my/exchange_detailed/exchange_detailed.js
const app = getApp()
const {
  request
} = require('./../../../../utils/request.js');
const common = require('./../../../../utils/common.js') //公共函数

Page({

  /**
   * 页面的初始数据
   */
  data: {
    usertasklist: null,
    loadModal: true,
    crowd_id: null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      crowd_id: options.crowd_id,
    })


    var user_id = wx.getStorageSync('userdata').id

        request({
          service: 'group/userdata/usergrouptasklist',
          data: {
            user_id: user_id,
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

  gdtvideoadclick: function (e) {
    let data = {
      'adtype': 4,
      'position': "群任务记录页面"
    };
    common.clickgdtadstatistics(data)
  },

  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})