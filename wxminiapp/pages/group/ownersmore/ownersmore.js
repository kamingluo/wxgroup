const app = getApp();

Page({
  data: {
    crowd_id: null,
    user_type: null,
    crowd_name: null,
    list: [{
        title: '群用户管理',
        img: 'http://groupmaterial.gzywudao.top/moreuser.png',
        introduce: "管理群用户，查询信息，积分操作",
        url: '/pages/group/user/user?crowd_id='
      },
      {
        title: '群员全部任务',
        img: 'http://groupmaterial.gzywudao.top/morealltask.png',
        introduce: "查询所有用户提交的任务记录",
        url: '/pages/group/alltasklists/alltasklists?crowd_id='
      },
      {
        title: '群签到设置',
        img: 'http://groupmaterial.gzywudao.top/moreste.png',
        introduce: "设置群签到配置信息",
        url: '/pages/group/signseting/signseting?crowd_id='
      },
      {
        title: '群抽奖处理',
        img: 'http://groupmaterial.gzywudao.top/moreluckdraw.png',
        introduce: "处理抽奖结果，发奖记录",
        url: '/pages/group/lottery/lotterylist/lotterylist?crowd_id='
      },
      {
        title: '审核限时任务',
        img: 'http://groupmaterial.gzywudao.top/limittaskrukou.jpg',
        introduce: "处理和审核群员提交的限时任务",
        url: '/pages/group/groupdetails/limittasks/limitlists/limitlists?crowd_id='
      },
      {
        title: '任务提交排行榜',
        img: 'http://groupmaterial.gzywudao.top/moreranking.png',
        introduce: "查看群员的任务提交情况",
        url: '/pages/group/tasksranking/tasksranking?crowd_id='
      },
      {
        title: '清空群员积分',
        img: 'https://material.gzywudao.top/moreback.jpg',
        introduce: "一键清空群员的积分",
        url: '/pages/group/user/emptyscore/emptyscore?crowd_id='
      }
    ]
  },

  onLoad: function (e) {
    this.setData({
      crowd_id: e.crowd_id,
      user_type: e.user_type,
      crowd_name: e.crowd_name
    })
  },

  toChild(e) {
    let crowd_id = this.data.crowd_id;
    let user_type = this.data.user_type;
    let crowd_name = this.data.crowd_name;
    // url: '/pages/index/index?crowd_id='
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url + crowd_id + '&user_type=' + user_type + '&crowd_name=' + crowd_name
    })
  },

})