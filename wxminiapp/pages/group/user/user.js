
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
    groupuserlist:null,
    searchInput:null,
    crowd_id:null,
    user_type: null,
  },

  /**
   * 输入框输入值
   */
  search: function (e) {
    console.log(e.detail.value)
    this.setData({
      searchInput: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)

    this.setData({
      crowd_id: options.crowd_id,
      user_type: options.user_type
    })

    

  },


  userlist:function(e){

    var that = this
    var crowd_id = this.data.crowd_id
    request({
      service: 'group/handlegroup/groupuserlist',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
        pages:1
      },
      success: res => {
        console.log("群用户列表", res.groupuserlist)
        that.setData({
          groupuserlist: res.groupuserlist,
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
      console.log("输入信息不为空")
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
          console.log("查询的群用户", res.querygroupuser)
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
    console.log("点击用户列表", e.currentTarget.dataset.data)
    let data = e.currentTarget.dataset.data
    wx.navigateTo({
      url: '/pages/group/user/userdetailed/userdetailed' + '?crowd_id=' + this.data.crowd_id + '&user_id=' + data.id + '&role=' + this.data.user_type,
    })

  },

  onShow: function () {
    this.userlist()
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})