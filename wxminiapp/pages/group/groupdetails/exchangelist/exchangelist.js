


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
    exchangelist: [],
    changestatistics:{},
    crowd_id: null,
    crowd_name: null,
    user_type: 0,
    pages:1,
    count:0
  },
  onLoad: function (options) {

    this.setData({
      crowd_id: options.crowd_id,
      crowd_name: options.crowd_name,
      user_type: options.user_type
    })
    this.userexchangelist(1)
    this.changestatistics()
   
  },


  //查询该群兑换统计
  changestatistics: function (pages) {
    var that = this
    var crowd_id = that.data.crowd_id
    request({
      service: 'group/exchangegoods/changestatistics',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
      },
      success: res => {
        console.log("群兑换统计",res.data)
        that.setData({
          changestatistics: res.data,
        })
      },
    })
  },


  //查询该群兑换列表
  userexchangelist: function (pages) {
    var that =this
    var crowd_id = that.data.crowd_id
    request({
      service: 'group/exchangegoods/groupexchangelist',
      method: 'GET',
      data: {
        pages:pages,
        crowd_id: crowd_id,
      },
      success: res => {
        let exchangelist=that.data.exchangelist;
        var newexchangelist=[...exchangelist,...res.data];
        that.setData({
          exchangelist: newexchangelist,
          count: res.count,
          loadModal: false,
        })
      },
    })
  },

  downloaddata:function(){
    let crowd_id = this.data.crowd_id;
    wx.navigateTo({
      url: '/pages/group/groupdetails/exchangelist/downloaddata/downloaddata?crowd_id=' + crowd_id,
    })

  },

  clicklist: function (e) {
    //console.log(e.currentTarget.dataset.data.id)
    let changeid = e.currentTarget.dataset.data.id
    wx.navigateTo({
      url: '/pages/group/groupdetails/exchangelist/exchangedetails/exchangedetails?changeid=' + changeid,
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
      that.userexchangelist(newpages)
    }
  }


})
  