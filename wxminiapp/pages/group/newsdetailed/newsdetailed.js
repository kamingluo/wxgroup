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



  clickimage: function(e) {
    this.setData({
      tankuang: true,
      taskimageurl: e.currentTarget.dataset.data
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



  // moredata: function () {
  //   var that = this;
  //   var imgList = []; //多张图片地址，保存到一个数组当中
  //   var state = 0; //state记录当前已经上传到第几张图片
  //   new Promise(function (resolve, reject) {
  //     for (var i = 0; i < that.data.uploaderList.length; i++) {
  //       qiniuUploader.upload(that.data.uploaderList[i], (res) => { //that.data.uploaderList逐个取出来去上传
  //         state++;
  //         imgList.push(res.imageURL);
  //        // console.log(state) //输出上传到第几个了
  //         if (state == that.data.uploaderList.length) {
  //           resolve(imgList);
  //         }
  //       }, (error) => {
  //         reject('error');
  //         console.log('error: ' + error);
  //       }, {
  //           region: 'NCN',
  //           uploadURL: 'https://up-z1.qiniup.com',
  //           domain: 'https://groupqiniu.luojiaming.vip/',
  //           uptokenURL: 'https://littlefun.gzywudao.top/php/public/index.php/index/qiniu/qiniu',
  //         })
  //     }
  //   }).then(function (imgList) {
  //    // console.log("多张图片返回结果上传数据库的", imgList)
  //     that.uploadtask(imgList)

  //   })
  // },



  openSetting: function() {
    //console.log("打开设置")
    wx.openSetting()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})