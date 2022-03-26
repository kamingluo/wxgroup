const app = getApp()
const {
  request
} = require('./../../utils/request.js');
const common = require('./../../utils/common.js') //公共函数
const baseConfig = require('./../../utils/config.js')//配置文件
Page({

  data: {
    imageurl:null

  },
  onLoad: function (options) {
    let imageurl = baseConfig.imageurl;
    this.setData({
      imageurl: imageurl,
    })
  },

  fuzhi:function(){
    wx.setClipboardData({
      data: "qunjifen",
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

  
  dowloadimg: function () {
    var that = this
    var imgSrc = this.data.imageurl + 'miniapp/images/kefu.png'
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

})