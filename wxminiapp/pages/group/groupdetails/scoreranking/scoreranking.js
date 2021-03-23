const {
  request
} = require('./../../../../utils/request.js');
const common = require('./../../../../utils/common.js') //公共函数
const app = getApp();
let preventShake = 0;
let interstitialAd = null; //插屏广告


Page({
  data: {

    signinrankinglist: [],//签到排行榜
    pages: 1,//默认第一页
    count: 0,
  },
  onLoad: function (e) {
    this.setData({
      crowd_id: e.crowd_id,
    })
    this.signinrankinglist(1)//签到排行榜

  },




  //签到排行
  signinrankinglist: function (pages) {
    var that = this
    let crowd_id = this.data.crowd_id
    request({
      service: 'group/score/scoreranking',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
        pages: pages
      },
      success: res => {
        console.log("签到排行榜", res)
        let signinrankinglist = that.data.signinrankinglist;
        var newsigninrankinglist = [...signinrankinglist, ...res.groupuserlist];
        that.setData({
          signinrankinglist: newsigninrankinglist,
          count: res.count,
        })
      },
    })
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
      that.signinrankinglist(newpages)
    }

  },


})