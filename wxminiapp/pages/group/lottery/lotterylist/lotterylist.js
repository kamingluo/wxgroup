const app = getApp()
const {
  request
} = require('./../../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    crowdlotterylist:[]

  },

  onLoad: function (options) {
    //查询该群发布的所有抽奖活动
    let crowd_id=options.crowd_id;
    request({
      service: 'group/lottery/crowdlotterylist',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
      },
      success: res => {
        this.setData({
          crowdlotterylist: res.data,
        })
      }
    })
  },
})