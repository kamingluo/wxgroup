const app = getApp()
const {
  request
} = require('./../../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,//抽奖id
    crowd_id:null,
    user_type: null,
    user_id:null,
    partakeif:false,//是否能参与活动
    lottery_data:null,//抽奖活动信息
    topuser:[],//参与抽奖的用户头像
    allcount:0,//总参与用户数


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user_id =wx.getStorageSync('userdata').id;
    this.setData({
      user_id:user_id,
      id: options.id,//抽奖id
      crowd_id: options.crowd_id,
      user_type: options.user_type
    })

    this.userifpartake()
  },

  //查询用户是否能参与活动
  userifpartake:function(){
    let user_id=this.data.user_id;
    let lottery_id=this.data.id;
    request({
      service: 'group/lottery/userifpartake',
      method: 'GET',
      data: {
        user_id: user_id,
        lottery_id:lottery_id
      },
      success: res => {
        this.setData({
          lottery_data: res.lottery_data,
          topuser:res.topuser,
          allcount:res.allcount,
          partakeif:res.partakeif
        })
      }
    })

  },

  //点击查询全部参与用户
  seeall:function(){
    console.log("seeall")
    let lottery_id=this.data.id;
    wx.navigateTo({
      url: '/pages/group/lottery/partakedata/partakedata?lottery_id='+ lottery_id,
    })
  },


 //参与抽奖活动订阅消息
  partakelottery: function () {
    var that = this
    wx.requestSubscribeMessage({
      tmplIds: ['c7gmx5T9dSXBvWcE9Vvki_6OMTV048XfG47EX_bJ-7E'],
      success(res) {
        console.log("同意了请求,这里不做记录")
      },
      complete() {
        that.querypartakelottery() //成功不成功都执行下一步
      }
    })


  },





 //确认参与抽奖活动
  querypartakelottery:function(){
    var that =this
    let lottery_id= this.data.id;
    let  user_id =this.data.user_id;
    let openid = wx.getStorageSync('userdata').openid;

    request({
      service: 'group/lottery/partakelottery',
      method: 'POST',
      data: {
        user_id: user_id,
        lottery_id: lottery_id,
        openid: openid
      },
      success: res => {
        console.log("参与抽奖活动返回")
        this.setData({
          partakeif: false,
        })
        wx.showToast({
          title: '参与成功',
          icon: 'none',
          duration: 2500,
        })
        that.userifpartake();
        that.fullnumber()
      }
    })

  },

  //如果是满人开奖，参与成功之后调一下接口查看是否开奖
  fullnumber:function(){
    let lottery_id = this.data.id;
    let luck_mode = this.data.lottery_data.luck_mode;
    if (luck_mode == 0){
      request({
        service: 'group/openlottery/fullnumber',
        method: 'GET',
        data: {
          lottery_id: lottery_id,
        },
        success: res => {
          console.log("满人开奖")
        }
      })
    }
    else{
      console.log("不是满人开奖")
    }
  },


copywxnumber:function(){
  let wxnumber = this.data.lottery_data.wxnumber;
  wx.setClipboardData({
    data: wxnumber,
    success: function (res) {
      wx.showToast({
        title: '复制成功',
        icon: 'success',
        duration: 2000,
      })
    }
  })

},




  onShow: function () {

  }
})