const app = getApp()
const {
  request
} = require('./../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userorderlist:[]

  },

  onShow: function (options) {
    this.userorder()
  },

  pay:function(e){
    console.log(e.currentTarget.dataset.data)
    let out_trade_no = e.currentTarget.dataset.data.out_trade_no;
    request({
      service: 'pay/vippay/pay',
      data: {
        out_trade_no: out_trade_no
      },
      success: function (res) {  //后端返回的数据
        console.log("统一下单返回数据", res)
        var data = res;
        console.log(data);
        console.log(data["timeStamp"]);
        wx.requestPayment({
          timeStamp: data['timeStamp'],
          nonceStr: data['nonceStr'],
          package: data['package'],
          signType: data['signType'],
          paySign: data['paySign'],
          success: function (res) {
            console.log("支付成功返回数据", res)
            wx.navigateTo({
              url: '/pages/communal/paysuccess/paysuccess'
            })
          },
          fail: function (res) {
            wx.showModal({
              title: '支付失败',
              content: '',
            })
          }
        })
      }
    });
  },

  userorder:function(){
    var that = this;
    let user_id = wx.getStorageSync('userdata').id;
    request({
      service: 'pay/order/userorder',
      method: 'GET',
      data: {
        user_id: user_id,
      },
      success: res => {
        that.setData({
          userorderlist: res.data,
        })
      }
    })
  }


})