// pages/exchange/exchange.js

const app = getApp()
const {
  request
} = require('./../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userdata:null,
    crowd_id:null,
    crowd_name:null,
    user_type:0,
    goodslist:null,
    deletegoodsid: null,
    deletegoodsmodel: false,
  },

  onLoad: function (options) {
    this.setData({
      crowd_id: options.crowd_id,
      crowd_name: options.crowd_name,
      user_type: options.user_type
    })
  },
  onShow: function () {
    this.userdata()
    this.goodsdata()
  },


  //跳转兑换记录页面
  exchangelist:function(){
    wx.navigateTo({
      url: '/pages/group/goods/exchangelist/exchangelist' + '?crowd_id=' + this.data.crowd_id
    })

  },


//跳转发布商品页面
  pushgoods:function(){
    wx.navigateTo({
      url: '/pages/group/goods/pushgoods/pushgoods' + '?crowd_id=' + this.data.crowd_id
    })

  },





  //查询该群该用户的详细信息
  userdata: function () {
   var  user_id = wx.getStorageSync('userdata').id
    var crowd_id = this.data.crowd_id
        request({
          service: 'group/handlegroup/querygroupuserdata',
          method: 'GET',
          data: {
            crowd_id: crowd_id,
            user_id: user_id
          },
          success: res => {
            console.log('获取用户信息', res.querygroupuserdata[0]);
            this.setData({
              userdata: res.querygroupuserdata[0],
            })
          },
        })
  },


  goodsdata: function () {
    var crowd_id = this.data.crowd_id
    request({
      service: 'group/groupgoods/goodslist',
      method: 'GET',
      data: {
        crowd_id: crowd_id
      },
      success: res => {
        console.log('兑换商品列表', res);
        this.setData({
          goodslist: res.data
        })
      }
    })
  },

  hideModal: function () {
    this.setData({
      deletegoodsmodel: false,
    })
  },


  deletegoods:function(e){
      console.log(e.currentTarget.dataset.id)
      this.setData({
        deletegoodsid: e.currentTarget.dataset.id,
        deletegoodsmodel: true,
      })
  },

  confirmdeletegoods: function () {
    var that = this
    var deletegoodsid = that.data.deletegoodsid
    request({
      service: 'group/groupgoods/deletegoods',
      method: 'GET',
      data: {
        goods_id: deletegoodsid,
      },
      success: res => {
        console.log("删除商品成功", res)
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000,
        })
        that.setData({
          deletegoodsmodel: false,
        })
        that.goodsdata()
      }
    })
  },

  clickgoods:function(e){
   // console.log(this.data.userdata.score)
    let price = e.currentTarget.dataset.goodsdata.price
    let user_score = this.data.userdata.score
    let good_id = e.currentTarget.dataset.goodsdata.id
    if (user_score < price ){
      wx.showToast({
        title: '积分不够兑换',
        icon: 'none',
        duration: 2000,
      })
      return ;
    }else{
      //积分足够,跳转确认兑换页面
      wx.navigateTo({
        url: '/pages/group/goods/exchange/exchange?goods_id=' + good_id + '&crowd_id=' + this.data.crowd_id + '&crowd_name=' + this.data.crowd_name
      })
    }

  },




















  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})