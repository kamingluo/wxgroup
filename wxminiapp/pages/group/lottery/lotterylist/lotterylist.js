const app = getApp()
const {
  request
} = require('./../../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    crowdlotterylist:[],
    crowd_id:null,
  },

  onLoad: function (options) {
    //查询该群发布的所有抽奖活动
    let crowd_id=options.crowd_id;
    this.setData({
      crowd_id: crowd_id,
    })
    
  },
  onShow:function(){
    this.crowdlotterylist()

  },

  crowdlotterylist:function(){
    let crowd_id = this.data.crowd_id;
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
 
 //跳转到处理详情
  lotterydata:function(e){
    let lottery_id = e.currentTarget.dataset.lotteryid;//抽奖id
    let crowd_id = this.data.crowd_id;
    wx.navigateTo({
      url: '/pages/group/lottery/lotterylist/lotterydata/lotterydata?lottery_id=' + lottery_id + '&crowd_id=' + crowd_id,
    })

  },
})