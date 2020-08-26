// pages/my/my_address/my_address.js

const app = getApp()
const {
  request
} = require('./../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressdata:null

  },





  add:function(){
    var that=this
    wx.chooseAddress({
      success(res) {
       console.log(res)
       var data=res
       var user_id = wx.getStorageSync('userdata').id 
        wx.login({
          success: res => {
            data.code = res.code
            data.user_id = user_id
            request({
              service: 'user/usersetaddress',
              data: data,
              success: res => {
                wx.showToast({
                  title: '操作成功',
                  icon: 'none',
                  duration: 2000,
                })
                that.useraddress()
              },
            })
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.useraddress()
   
  },


  useraddress:function(){
    var user_id = wx.getStorageSync('userdata').id
    request({
      service: 'user/useraddress',
      data: {
        user_id: user_id,
      },
      success: res => {
        console.log('用户地址', res);
        this.setData({
          addressdata: res.addressdata,
        })
      },
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})