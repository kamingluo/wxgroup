var app = getApp();

function share() {
  //let userdata = wx.getStorageSync('userdata')
  // app.aldstat.sendEvent('分享好友', userdata);
   return {
      title: "推荐你一款好用群管理工具",
      desc: "推荐你一款好用群管理工具",
      imageUrl: 'http://material.gzywudao.top/tmp_2d810deba75dc33973ffd24232036e5e.png',
     path: '/pages/index/index?channel=1002&ald_media_id=33542&ald_link_key=29cf9ebedb655247', // 路径，传递参数到指定页面。
    }
}

module.exports = {
  share: share,
}