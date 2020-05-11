const app = getApp()
const {
  request
} = require('./../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userscorerecord: [],  //信息流数组
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

  //获取数据
  havedata:function(pages){
    var that=this
    var user_id = wx.getStorageSync('userdata').id;
    request({
      service: 'business/coins/usercoinrecord',
      data: {
        pages:pages,
        user_id: user_id,
      },
      success: res => {
        let userscorerecord=this.data.userscorerecord;
        var newuserscorerecord=[...userscorerecord,...res.userscorelist];
        that.setData({
          userscorerecord: newuserscorerecord,
          count: res.count,
          loadModal: false,
        })
      },
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
      console.log("达到数量，不加载")
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