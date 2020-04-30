const {
  request
} = require('./../../../utils/request.js');
const common = require('./../../../utils/common.js');
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    crowd_id: null,
    user_type:null,
    todaysigninlist:[],
    signinrankinglist:[],
    TabCur: 0,
    scrollLeft: 0
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
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
    this.todaysigninlist()

  },


  onShow: function () {
    this.signinrankinglist()

  },

  todaysigninlist: function () {
    let crowd_id = this.data.crowd_id
    request({
      service: 'group/signin/todaysigninlist',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
      },
      success: res => {
        this.setData({
          todaysigninlist: res.data,
        })
      },
    })
  },


  signinrankinglist: function () {
    let crowd_id = this.data.crowd_id
    request({
      service: 'group/signin/signinrankinglist',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
      },
      success: res => {
        this.setData({
          signinrankinglist: res.data,
        })
      },
    })
  },


  //点击用户列表
  clickuserlist: function (e) {
    if(this.data.user_type == 1 || this.data.user_type == 2 ){
      let data = e.currentTarget.dataset.data
      wx.navigateTo({
        url: '/pages/group/user/userdetailed/userdetailed' + '?crowd_id=' + this.data.crowd_id + '&user_id=' + data.user_id + '&role=' + this.data.user_type,
      })
    }
   
  },




})