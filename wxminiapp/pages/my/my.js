
const app = getApp()

const {
  request
} = require('./../../utils/request.js');
const {
  share
} = require('./../../utils/share.js');
const common = require('./../../utils/common.js') //公共函数
const baseConfig = require('./../../utils/config.js')//配置文件

Page({
  data: {
  },
  onLoad: function (e) {
    let imageurl = baseConfig.imageurl;
    this.setData({
      imageurl: imageurl,
    })
  },
  onShow: function () {
  },
  onShareAppMessage: function (options) {
    return share();
  }
})