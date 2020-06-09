const {
  request
} = require('./../../../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    crowd_id:null,
    modal:false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      crowd_id: options.crowd_id,
    })

  },
  clickempty:function(){
    this.setData({
      modal: true,
    })
  },

  hideModal:function(){
    this.setData({
      modal: false,
    })

  },

  //确定清空用户积分
  emptyscore:function(){
    console.log("确定清空用户积分")
    var that = this
    that.setData({
      modal: false,
    })
    var crowd_id = this.data.crowd_id;
    var user_id = wx.getStorageSync('userdata').id;
    request({
      service: 'group/handlegroup/emptyscore',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
        user_id: user_id,
      },
      success: res => {
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 2500,
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1500) 
      },
    })

  },

  

})