const app = getApp()
const {
  request
} = require('./../../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,//抽奖id
    crowd_id:null,
    user_type: null,
    user_id:null,
    lottery_data:null,//抽奖活动信息
    topuser:[],//参与抽奖的用户头像
    allcount:0,//总参与用户数

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user_id =wx.getStorageSync('userdata').id;
    this.setData({
      user_id:user_id,
      id: options.id,
      crowd_id: options.crowd_id,
      user_type: options.user_type
    })

    this.userifpartake()
  },

  //查询用户是否能参与活动
  userifpartake:function(){
    let user_id=this.data.user_id;
    let lottery_id=this.data.id;
    request({
      service: 'group/lottery/userifpartake',
      method: 'GET',
      data: {
        user_id: user_id,
        lottery_id:lottery_id
      },
      success: res => {
        this.setData({
          lottery_data: res.lottery_data,
          topuser:res.topuser,
          allcount:res.allcount
        })
      }
    })

  },

  //点击查询全部参与用户
  seeall:function(){
    let lottery_id=this.data.id;
    wx.navigateTo({
      url: '/pages/group/partakedata/partakedata?lottery_id='+ lottery_id,
    })
  },

  onShow: function () {

  }
})