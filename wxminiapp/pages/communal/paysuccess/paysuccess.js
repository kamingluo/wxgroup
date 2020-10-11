const baseConfig = require('./../../../utils/config.js') //配置文件
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageurl: 'https://group.gzywudao.top/php/public/', //默认图片链接
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let imageurl = baseConfig.imageurl;
    this.setData({
      imageurl: imageurl,
    })
  },

  gohome: function() {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },

  seeorder: function() {
    wx.navigateTo({
      url: '/pages/my/orderlists/orderlists'
    })
  },




})