
const qiniuUploader = require("../../../utils/sdk/qiniu/qiniuUploader");
const {
  request
} = require('./../../../utils/request.js');
const app = getApp();

// pages/group/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupuserlist:[],
    searchInput:null,
    crowd_id:null,
    user_type: null,
    pages:1,
    count:0
  },

  /**
   * 输入框输入值
   */
  search: function (e) {
    this.setData({
      searchInput: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      crowd_id: options.crowd_id,
      user_type: options.user_type
    })
    this.userlist(1)
  },


  userlist:function(pages){
    var that = this
    var crowd_id = this.data.crowd_id
    request({
      service: 'group/handlegroup/groupuserlist',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
        pages:pages
      },
      success: res => {
        let groupuserlist=this.data.groupuserlist;
        var newagroupuserlist=[...groupuserlist,...res.groupuserlist];
        that.setData({
          groupuserlist: newagroupuserlist,
          count: res.count,
          loadModal: false,
        })
      },
    })

  },




  /**
   * 查询用户
   */
  clickquery:function(){
    var that=this
    if (that.data.searchInput){
      var nickName = that.data.searchInput
      var crowd_id = that.data.crowd_id
      request({
        service: 'group/handlegroup/querygroupuser',
        method: 'GET',
        data: {
          crowd_id: crowd_id,
          nickName: nickName
        },
        success: res => {
          that.setData({
            groupuserlist: res.querygroupuser,
          })
        },
      })
      
    }
    else{
      that.userlist()
    }

  },

   //点击用户列表
  clickuserlist:function(e){
    let data = e.currentTarget.dataset.data
    wx.navigateTo({
      url: '/pages/group/user/userdetailed/userdetailed' + '?crowd_id=' + this.data.crowd_id + '&user_id=' + data.id + '&role=' + this.data.user_type,
    })

  },

  onShow: function () {
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
      that.userlist(newpages)
    }

  }
})