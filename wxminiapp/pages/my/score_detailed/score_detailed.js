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
    usertasklist: [],
    loadModal: true,
    pages:1,
    count:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.havedata(1)
    
  },

  havedata:function(pages){
    var that=this;
    wx.login({
      success: res => {
        request({
          service: 'task/usertask/usertasklist',
          data: {
            pages:pages,
            code: res.code,
          },
          success: res => {
            let usertasklist=that.data.usertasklist;
            var newusertasklist=[...usertasklist,...res.usertasklist];
            that.setData({
              usertasklist: newusertasklist,
              count: res.count,
              loadModal: false,
            })
            
          },
        })
      }
    })
  },

  clicktasklist: function (e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/my/score_detailed/task_detailed/task_detailed?id=' + e.currentTarget.dataset.id
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
      that.havedata(newpages)
    }

  }
})