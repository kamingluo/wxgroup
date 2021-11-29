const app = getApp()
const {
  request
} = require('./../../../../utils/request.js');
Page({

  data: {
    phone: null,
    data: {},
    state: 0


  },

  onLoad: function (options) {

  },

  inputphone: function (e) {
    this.setData({
      phone: e.detail.value,
    })
  },
  //点击查询
  search: function () {
    var that =this
    let phone = this.data.phone;
    console.log(phone)

    request({
      service: 'group/userdata/exlinks',
      method: 'GET',
      data: {
        phone: phone,
      },
      success: res => {
        console.log('查询返回数据', res);
        let data = res.data;
        if (data) {
          //返回数据
          console.log("返回数据")
          that.setData({
            data:data,
            state:1
          })
        } else {
          console.log("数据为空")
          that.setData({
            data:data,
            state:2
          })
        }
        wx.showToast({
          title: '查询完成',
          icon: 'none',
          duration: 2000,
        })

      },
    })

  },

  fuzhi:function(){
    let link=this.data.data.link;
    console.log("复制链接",link)
    wx.setClipboardData({
      data: link,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
})