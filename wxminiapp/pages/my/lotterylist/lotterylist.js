const app = getApp()
const {
  request
} = require('./../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userlotterylist:[],
    pages: 1,
    user_type: 0,
    user_id: null,
    count:0
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let user_id = wx.getStorageSync('userdata').id;
    this.setData({
      user_id: user_id,
    })
    this.userlotterylist()
    
  },

  userlotterylist:function(){
    var that=this;
    let user_id = wx.getStorageSync('userdata').id;
    let pages = this.data.pages;
    request({
      service: 'group/lottery/useralllotterylist',
      method: 'GET',
      data: {
        pages:pages,
        user_id: user_id,
      },
      success: res => {
        let userlotterylist=that.data.userlotterylist;
        var newuserlotterylist=[...userlotterylist,...res.userlotterylist];
        that.setData({
          userlotterylist: newuserlotterylist,
          count: res.count,
        })
      }
    })
  },

  seedetails:function(e){
    let id = e.currentTarget.dataset.lotteryid;//抽奖id
    let crowd_id = e.currentTarget.dataset.crowdid;//群id
    let user_type = 0;
    wx.navigateTo({
      url: '/pages/group/lottery/partake/partake?id=' + id + '&crowd_id=' + crowd_id + '&user_type=' + user_type,
    })
      
  },

   /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this

    var count=that.data.count;//拿到总数
    var pages =that.data.pages;
    if(pages * 20 >= count){
      return;
    }
    else{
     let  newpages=pages + 1 ;
      that.setData({
        pages: newpages
      })
      that.userlotterylist()
    }

  }




})