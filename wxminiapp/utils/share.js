var app = getApp();
let baseConfig = require('./config.js')
function share() {
  //let userdata = wx.getStorageSync('userdata')
  // app.aldstat.sendEvent('分享好友', userdata);
   return {
      title: "群记分小程序，一款好用的群管理工具。",
      desc: "群记分小程序，一款好用的群管理工具。",
      imageUrl: baseConfig.imageurl+'miniapp/images/appicon.png',
     path: '/pages/index/index?channel=1005&ald_media_id=33542&ald_link_key=29cf9ebedb655247', // 路径，传递参数到指定页面。
    }
}

module.exports = {
  share: share,
}