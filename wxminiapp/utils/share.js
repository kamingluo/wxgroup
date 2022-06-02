var app = getApp();
let baseConfig = require('./config.js')
function share() {
  let title = wx.getStorageSync('shareconfig').title;
  let imageUrl = wx.getStorageSync('shareconfig').imageUrl;
   return {
      // title: "群记分小程序，一款好用的群管理工具。",
      // desc: "群记分小程序，一款好用的群管理工具。",
      // imageUrl: baseConfig.imageurl+'miniapp/images/appicon.png',
      title: title,
      desc:title,
      imageUrl: imageUrl,
     path: '/pages/index/index?channel=1005', // 路径，传递参数到指定页面。
    }
}

module.exports = {
  share: share,
}