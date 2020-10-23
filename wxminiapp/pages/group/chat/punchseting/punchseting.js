// pages/group/signseting/signseting.js

const {
  request
} = require('./../../../../utils/request.js');
const common = require('./../../../../utils/common.js');
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    crowd_id: null,
    state: 0,
    score: 1,
    tips: null,
    start_time: '2020-04-03',
    end_time: '2021-05-05',
    continuity_signin: 0,
    continuity_signin_day: 7,
    continuity_signin_score: 20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      crowd_id: options.crowd_id,
    })
    this.signindata()
  },


  signindata: function() {
    let crowd_id = this.data.crowd_id
    request({
      service: 'group/signin/signindata',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
      },
      success: res => {
        let signindata = res.signindata;
        if (signindata) {
          let newstart_time = signindata.start_time.substr(0, 10);
          let newend_time = signindata.end_time.substr(0, 10);
          this.setData({
            state: signindata.state,
            score: signindata.score,
            tips: signindata.tips,
            start_time: newstart_time,
            end_time: newend_time,
            continuity_signin: signindata.continuity_signin,
            continuity_signin_day: signindata.continuity_signin_day,
            continuity_signin_score: signindata.continuity_signin_score,
          })
        }

      },
    })


  },
  updatesigninconfig:function(){
    
    let configdata = this.data
    if (configdata.score < 0 || configdata.score == null || configdata.score == "" ){
      this.toasttitle("积分不能小于0或空")
      return;
    }

    let startTime = new Date(Date.parse(configdata.start_time));
    let endTime = new Date(Date.parse(configdata.end_time));
    if(startTime > endTime ){
      this.toasttitle("开始时间不能大于结束时间")
      return;
    }

    if (configdata.continuity_signin_day < 0 || configdata.continuity_signin_day == null || configdata.continuity_signin_day == "") {
      this.toasttitle("连续天数不能小于0")
      return;
    }

    if (configdata.continuity_signin_score < 0 || configdata.continuity_signin_score == null || configdata.continuity_signin_score == "") {
      this.toasttitle("连续奖励不能小于0")
      return;
    }
    
    //满足之后开始更新
    this.upconfig()

  },



upconfig: function() {
  let updata = this.data
  request({
    service: 'group/signin/signinconfig',
    method: 'POST',
    data: updata,
    success: res => {
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000,
      })
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 1500)
    },
  })

  },

  toasttitle:function(title){
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 2000,
    })
  },


  statechange: function(e) {
    let value = e.detail.value ? 0 : 1;
    this.setData({
      state: value
    })

  },

  score: function(e) {
    this.setData({
      score: e.detail.value
    })

  },
  tips: function(e) {
    this.setData({
      tips: e.detail.value
    })

  },
  continuityday: function(e) {
    this.setData({
      continuity_signin_day: e.detail.value
    })

  },
  continuityscore: function(e) {
    this.setData({
      continuity_signin_score: e.detail.value
    })

  },

  continuitychange: function(e) {
    let value = e.detail.value ? 0 : 1;
    this.setData({
      continuity_signin: value
    })

  },

  startDateChange(e) {
    this.setData({
      start_time: e.detail.value
    })
  },
  endDateChange(e) {
    this.setData({
      end_time: e.detail.value
    })
  },


})