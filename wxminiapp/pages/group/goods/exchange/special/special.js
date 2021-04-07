// pages/group/goods/exchange/special/special.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jumpurl:null,
    code:null,
    imagedata:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("特殊页面进来的参数")
    let jumpurl=options.jumpurl;
    let code =options.code;
    let imagedata=wx.getStorageSync('specialexchangeimagedata') || [] ;
    this.setData({
      jumpurl: jumpurl,
      code: code,
      imagedata:imagedata
    })
  },

  copycode:function(){
    console.log("复制优惠券码")
    let code = this.data.code
    wx.setClipboardData({
      data: code,
      success: function(res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2000,
        })
        
      }
    })

  },

  jumpyouzan:function(){
    console.log("跳转到有赞")
    let jumpurl=this.data.jumpurl;
    // let appid="wx14ca14fe25be6173";
    let appid='wx06f06a73009388ff';
     //跳转有赞小程序
    wx.navigateToMiniProgram({
      appId: appid,
      path: jumpurl,
    })
  },


})