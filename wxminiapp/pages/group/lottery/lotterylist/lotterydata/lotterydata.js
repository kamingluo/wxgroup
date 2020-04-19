const app = getApp()
const {
  request
} = require('./../../../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lottery_id:null,
    crowd_id:null,

    crowdlotterylist: []
  },

  onLoad: function (options) {
    //查询该群发布的所有抽奖活动
    // let crowd_id = options.crowd_id;
    // let lottery_id = options.lottery_id;
    this.setData({
      lottery_id: options.lottery_id,//抽奖id
      crowd_id: options.crowd_id,
    })
    this.lotterydetails()

  },

//查询一个活动的详细信息
  lotterydetails:function(){
    let lottery_id = this.data.lottery_id;
    request({
      service: 'group/lottery/lotterydetails',
      method: 'GET',
      data: {
        lottery_id: lottery_id,
      },
      success: res => {
        // this.setData({
        //   crowdlotterylist: res.data,
        // })
      }
    })
  },




})