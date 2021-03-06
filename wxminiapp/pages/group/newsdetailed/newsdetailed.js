const qiniuUploader = require("../../../utils/sdk/qiniu/qiniuUploader");
const {
  request
} = require('./../../../utils/request.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsdetails: null,
    tankuang: false,
    taskimageurl: null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.newsdata(options.id)

  },




  newsdata: function(e) {
    request({
      service: 'group/groupnews/newsdetails',
      data: {
        id: e
      },
      method: 'GET',
      success: res => {
        this.setData({
          newsdetails: res.newsdetails,
        })
      },
    })
  },



  // clickimage: function(e) {
  //   this.setData({
  //     tankuang: true,
  //     taskimageurl: e.currentTarget.dataset.data
  //   })
  // },

  //图片点击事件
  clickimage: function (event) {
    var src = event.currentTarget.dataset.data; //获取data-src
    var imgList = this.data.newsdetails.images; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },





  closetankuang: function() {
    this.setData({
      tankuang: false
    })
  },






  clickdownload: function() {
    var that = this
    var imgSrc = this.data.imgurl
    wx.getSetting({
      success(res) {
        var writePhotosAlbum = wx.getStorageSync('writePhotosAlbum')
        if (!res.authSetting['scope.writePhotosAlbum'] && writePhotosAlbum) {
          wx.showToast({
            title: "请打开权限",
            icon: 'none'
          })
          that.openSetting()
        } else {
          //console.log("开始下载图片")
          that.downloadimages()
          
        }
      }
    })
  },


  downloadimages:function(){
  var that =this
    new Promise(function (resolve, reject) {
      for (var i = 0; i < that.data.newsdetails.images.length; i++) {
        wx.downloadFile({
          url: that.data.newsdetails.images[i],
          success: function (res) {
            //console.log("下载图片成功", res);
            //图片保存到本地
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function (data) {
                //console.log("下载成功", data);
                resolve("kaming");
              },
              fail: function (res) {
                wx.setStorageSync('writePhotosAlbum', true)
                reject('error');
              }
            })
          }
        }) 
      }
    }).then(function (imgList) {
      wx.showToast({
        title: '下载成功',
        icon: 'success',
        duration: 2500,
      })
    })
 
  },





  openSetting: function() {
    //console.log("打开设置")
    wx.openSetting()
  },

  copydata: function (e) {
    let data = this.data.newsdetails.content;
    wx.setClipboardData({
      data: data,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2000,
        })
      }
    })
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

})