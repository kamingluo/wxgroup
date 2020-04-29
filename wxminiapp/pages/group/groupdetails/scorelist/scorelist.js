// pages/group/groupdetails/scorelist/scorelist.js
const app = getApp()
const {
  request
} = require('./../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userscorerecord: [],  //信息流数组
    loadModal: true,
    crowd_id:null,
    pages:1,
    count:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      crowd_id: options.crowd_id,
    })
    this.havedata(1)
  },

  //获取数据
  havedata:function(pages){
    var that=this
    var crowd_id=this.data.crowd_id;
    var user_id = wx.getStorageSync('userdata').id;
    request({
      service: 'group/userdata/usergroupscorelist',
      data: {
        pages:pages,
        user_id: user_id,
        crowd_id: crowd_id
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