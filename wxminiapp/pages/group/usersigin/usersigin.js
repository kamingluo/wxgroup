Page({
  data: {
    tabSelect: 0,
    model: true,

  },


  onLoad: function(e) {
    let user_id = wx.getStorageSync('userdata').id;
    this.setData({
      crowd_id: e.crowd_id,
      crowd_name: e.crowd_name,
      user_id: user_id
    })
    this.havetime()//当前时间获取

  },



  //当前时间获取
  havetime: function() {
    let date = new Date();
    let year = date.getFullYear(); //获取完整的年份(4位)
    let day = date.getDate();//获取日期
    let month =date.toDateString().split(" ")[1];
    this.setData({
      year: year,
      day: day,
      month: month
    })
    // console.log(year, day, month)

  },


  //选择签到记录
  selectsigindata: function() {
    this.setData({
      tabSelect: 0
    })
  },

  //选择跳转商品兑换
  selectgoodslist: function() {
    let crowd_id = this.data.crowd_id
    let crowd_name = this.data.crowd_name
    wx.navigateTo({
      url: '/pages/group/goods/goodslist/goodslist?user_type=0&crowd_id=' + crowd_id + '&crowd_name=' + crowd_name,
    })
  },
  //选择规则说明
  selectrule: function() {
    this.setData({
      tabSelect: 2
    })
  },

  //关闭弹框
  hideModal: function() {
    this.setData({
      model: false
    })
  },
  //展示弹框
  showModal: function() {
    this.setData({
      model: true
    })
  },


})