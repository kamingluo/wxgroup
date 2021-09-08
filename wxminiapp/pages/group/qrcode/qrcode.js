const app = getApp()
const {
  request
} = require('./../../../utils/request.js');
const {
  share
} = require('./../../../utils/share.js');
const baseConfig = require('./../../../utils/config.js')//配置文件


Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: null,
    crowd_id: 0,
    crowd_name: null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myqrcode(options.crowd_id)
    wx.showLoading({
      title: '生成中..',
    })

    this.setData({
      crowd_id: options.crowd_id,
      crowd_name: options.crowd_name
    })
  },

  myqrcode: function (crowd_id) {
    var crowd_id = crowd_id
    if (crowd_id == null) {
      wx.showToast({
        title: "生成失败",
        icon: 'none'
      })
      return;
    }
    let master_id = wx.getStorageSync('userdata').id || 0
    request({
      service: 'currency/getqrcode',
      data: {
        crowd_id: crowd_id,
        master_id:master_id
      },
      success: res => {
        // console.log('生成二维码成功', res);
        wx.hideLoading()
        this.setData({
          imgurl: baseConfig.imageurl + 'qrcode/' + crowd_id + '.png',
        })
      },
    })

  },


  dowloadimg: function () {
    var that = this
    var imgSrc = this.data.imgurl
    wx.getSetting({
      success(res) {
        var writePhotosAlbum = wx.getStorageSync('writePhotosAlbum')
        if (!res.authSetting['scope.writePhotosAlbum'] && writePhotosAlbum) {
          that.openSetting()
          wx.showToast({
            title: "请打开权限",
            icon: 'none'
          })
        }
        else {
          wx.downloadFile({
            url: imgSrc,
            success: function (res) {
              //图片保存到本地
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function (data) {
                  wx.showToast({
                    title: "下载成功",
                    icon: 'none'
                  })
                },
                fail: function (res) {
                  wx.setStorageSync('writePhotosAlbum', true)
                }
              })
            }
          })
        }
      }
    })
  },

  openSetting: function () {
    //console.log("打开设置")
    wx.openSetting()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    //let log=baseConfig.imageurl+'miniapp/images/appicon.png' || 'http://groupmaterial.gzywudao.top/fengmian.png';
    let log = 'http://groupmaterial.gzywudao.top/fengmian.png';
    let nickName = wx.getStorageSync('userdata').nickName
    let crowd_id = this.data.crowd_id
    let crowd_name = this.data.crowd_name
    return {
      title: nickName + "邀请你加入群" + "《" + crowd_name + "》",
      desc: nickName + "邀请你加入群" + "《" + crowd_name + "》",
      imageUrl: log,
      path: '/pages/index/index?channel=1001&ald_media_id=33542&ald_link_key=c99244f0802f9f06' + '&crowd_id=' + crowd_id, // 路径，传递参数到指定页面。
    }
  }



})