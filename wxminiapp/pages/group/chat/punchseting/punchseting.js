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
    continuity_punch: 0,
    continuity_punch_day: 7,
    continuity_punch_score: 20,
    password:"打卡"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      crowd_id: options.crowd_id,
    })
    this.punchdata()
  },


  punchdata: function() {
    let crowd_id = this.data.crowd_id
    request({
      service: 'group/punchcard/querypunchdata',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
      },
      success: res => {
        let punchdata = res.punchdata;
        if (punchdata) {
          let newstart_time = punchdata.start_time.substr(0, 10);
          let newend_time = punchdata.end_time.substr(0, 10);
          this.setData({
            state: punchdata.state,
            score: punchdata.score,
            tips: punchdata.tips,
            start_time: newstart_time,
            end_time: newend_time,
            continuity_punch: punchdata.continuity_punch,
            continuity_punch_day: punchdata.continuity_punch_day,
            continuity_punch_score: punchdata.continuity_punch_score,
            password: punchdata.password,
          })
        }

      },
    })
  },
  updatepunchconfig:function(){
    
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

    if (configdata.continuity_punch_day < 0 || configdata.continuity_punch_day == null || configdata.continuity_punch_day == "") {
      this.toasttitle("连续天数不能小于0")
      return;
    }

    if (configdata.continuity_punch_score < 0 || configdata.continuity_punch_score == null || configdata.continuity_punch_score == "") {
      this.toasttitle("连续奖励不能小于0")
      return;
    }
    
    //满足之后开始更新
    this.upconfig()

  },



upconfig: function() {
  let updata = this.data

  if(updata.password==null||updata.password==""){
    wx.showToast({
      title: '打卡口令不能为空',
      icon: 'none',
      duration: 2000,
    })
    return;
  }


  request({
    service: 'group/punchcard/punchcardconfig',
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
  password: function(e) {
    this.setData({
      password: e.detail.value
    })
  },
  tips: function(e) {
    this.setData({
      tips: e.detail.value
    })

  },
  continuityday: function(e) {
    this.setData({
      continuity_punch_day: e.detail.value
    })

  },
  continuityscore: function(e) {
    this.setData({
      continuity_punch_score: e.detail.value
    })

  },

  continuitychange: function(e) {
    let value = e.detail.value ? 0 : 1;
    this.setData({
      continuity_punch: value
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