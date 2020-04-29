// pages/my/exchange_detailed/exchange_detailed.js
const app = getApp()
const {
  request
} = require('./../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    alltasklists: [],
    loadModal: true,
    crowd_id:null,
    pages:1,
    count:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    this.setData({
      crowd_id: options.crowd_id,
    })

    this.havedata(1)

  },


  havedata:function(pages){
    var that=this;
    let crowd_id = that.data.crowd_id;

    request({
      service: 'task/handletask/alltasklists',
      data: {
        pages:pages,
        crowd_id: crowd_id,
      },
      success: res => {
        let alltasklists=this.data.alltasklists;
        var newalltasklists=[...alltasklists,...res.alltasklists];
        that.setData({
          alltasklists: newalltasklists,
          count: res.count,
          loadModal: false,
        })
      },
    })

  },


  clicktasklist: function(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/my/score_detailed/task_detailed/task_detailed?id=' + e.currentTarget.dataset.id
    })

  },



  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
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
      that.havedata(newpages)
    }
  }
})