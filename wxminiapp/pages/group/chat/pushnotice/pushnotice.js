var app = getApp();
const {
  request
} = require('./../../../../utils/request.js');
Page({

  data: {
    crowd_id:null,
    notice:null,
  },

  onLoad: function (e) {
    this.setData({
      crowd_id: e.crowd_id,
    })
  },

  inputtext: function(e) {
    // console.log(e.detail.value)
    this.setData({
      notice: e.detail.value,
    })
  },

  pushnotice: function () {
      let crowd_id = this.data.crowd_id;
      let notice = this.data.notice;
      request({
        service: 'group//chat/notice',
        method: 'GET',
        data: {
          crowd_id: crowd_id,
          notice: notice
        },
        success: res => {
          console.log("发布公告成功", res)
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 2500,
          })
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
      })
    },
})