
const {
  request
} = require('./../../../utils/request.js');
const common = require('./../../../utils/common.js') //公共函数
const app = getApp();


Page({
  data: {
    tabSelect: 0,
    model: false,

  },
  onLoad: function(e) {
    let user_id = wx.getStorageSync('userdata').id;
    let avatarUrl = wx.getStorageSync('userdata').avatarUrl;
    let nickName = wx.getStorageSync('userdata').nickName;
    this.setData({
      crowd_id: e.crowd_id,
      crowd_name: e.crowd_name,
      user_id: user_id,
      avatarUrl: avatarUrl,
      nickName: nickName
    })
    this.havetime()//当前时间获取
    this.todaywhethersignin()//签到配置

  },

  //检查今天是否还能签到
  todaywhethersignin: function () {
    let crowd_id = this.data.crowd_id
    let user_id = wx.getStorageSync('userdata').id
    request({
      service: 'group/signin/todaywhethersignin',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
        user_id: user_id,
      },
      success: res => {
        //console.log("今天是否能签到查询")
        console.log(res)
        this.setData({
          signindata: res.signindata,//签到配置数据
          todaywhethersignin: res.ifsignin,//是否能签到
          viewdata: res.viewdata,//群员是否能看数据
          adconfig: res.adconfig//签到弹框广告配置
        })
      }
    })
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

//点击广告统计
  gdtbanneradclick: function (e) {
    console.log("点击banner广告'")
    let data = {
      'adtype': 1,
      'position': "签到页面"
    };
    common.clickgdtadstatistics(data)
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

  //点击弹框广告
  clickmodelad:function(){
    common.insidejump(this.data.adconfig)
  }


})