const app = getApp();

Page({
  data: {
    list: [{
      title: '签到数据',
      img: 'https://image.weilanwl.com/color2.0/plugin/sylb2244.jpg',
      url: '/indexes/indexes'
    },
    {
      title: '微动画',
      img: 'https://image.weilanwl.com/color2.0/plugin/wdh2236.jpg',
      url: '/animation/animation'
    },
    {
      title: '全屏抽屉',
      img: 'https://image.weilanwl.com/color2.0/plugin/qpct2148.jpg',
      url: '/drawer/drawer'
    },
    {
      title: '垂直导航',
      img: 'https://image.weilanwl.com/color2.0/plugin/qpczdh2307.jpg',
      url: '/verticalnav/verticalnav'
    }
    ]
  },
  toChild(e) {
    wx.navigateTo({
      url: '/pages/plugin' + e.currentTarget.dataset.url
    })
  },

})