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
    user_type: null,
    rankinglist: [],
    pages:1,//默认第一页
    state:0,//默认全部任务
    count: 0,
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
    this.rankinglist(1)

  },

  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    var that = this

    var count = that.data.count;//拿到总数
    var pages = that.data.pages;
    if (pages * 10 >= count) {
      return;
    }
    else {
      let newpages = pages + 1;
      that.setData({
        pages: newpages
      })
      that.rankinglist(newpages)
    }

  },


  rankinglist: function (pages) {
    var that =this;
    let crowd_id = this.data.crowd_id;
    let state=this.data.state;
    request({
      service: 'task/handletask/rankinglist',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
        state: state,
        pages: pages
      },
      success: res => {
        console.log("任务排行榜返回", res.rankinglist)
        let rankinglist = that.data.rankinglist;
        var newrankinglist = [...rankinglist, ...res.rankinglist];
        that.setData({
          rankinglist: newrankinglist,
          count: res.count,
          loadModal: false,
        })
      },
    })
  },


  //点击用户列表
  clickuserlist: function (e) {
    if (this.data.user_type == 1 || this.data.user_type == 2) {
      let data = e.currentTarget.dataset.data
      wx.navigateTo({
        url: '/pages/group/user/userdetailed/userdetailed' + '?crowd_id=' + this.data.crowd_id + '&user_id=' + data.user_id + '&role=' + this.data.user_type,
      })
    }

  },




})