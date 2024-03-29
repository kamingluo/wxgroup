// pages/exchange/exchange.js

const app = getApp()
const {
  request
} = require('./../../../../utils/request.js');
const common = require('./../../../../utils/common.js') //公共函数
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
    now_time:"",//当前时间戳
    notexchangeModal:false,
    notexchangedata:{}
  },

  onLoad: function (options) {

    let  now_time = Date.parse(new Date()) // 第三种，不推荐，精度差一些
    console.log("当前时间戳",now_time)
    console.log(typeof(now_time));


    this.setData({
      crowd_id: options.crowd_id,
      crowd_name: options.crowd_name,
      user_type: options.user_type,
      now_time:now_time
    })
  },
  onShow: function () {
    this.userdata()
    this.goodsdata()
  },

  gdtvideoadclick: function (e) {
    let data = {
      'adtype': 4,
      'position': "群兑换商品"
    };
    common.clickgdtadstatistics(data)
  },


  //跳转兑换记录页面
  exchangelist:function(){
    wx.navigateTo({
      url: '/pages/group/goods/exchangelist/exchangelist' + '?crowd_id=' + this.data.crowd_id
    })

  },

  notexchange:function(e){
    let data = e.currentTarget.dataset.goodsdata

    let goodname=data.goodsname;
    let start_time=common.timestampToTime(data.start_time)
    let notexchangedata={
      goodname:goodname,
      start_time:start_time
    }

    this.setData({
      notexchangeModal:true,
      notexchangedata:notexchangedata
    })

  },


//跳转发布商品页面
  pushgoods:function(){
    wx.navigateTo({
      url: '/pages/group/goods/pushgoods/pushgoods' + '?crowd_id=' + this.data.crowd_id
    })

  },


  //跳转修改页面
  updategoods:function(e){
    console.log(e.currentTarget.dataset.id)
    let id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/group/goods/editgoods/editgoods?id=' + id
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
      service: 'group/groupgoods/newgoodslist',
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
      notexchangeModal:false
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

   let stock = e.currentTarget.dataset.goodsdata.stock
   if(stock != null || stock != "" || stock != 999999999 ){
     console.log("要检查库存")
     if(stock==0){
       console.log("库存不足")
       wx.showToast({
        title: '商品库存不足',
        icon: 'none',
        duration: 2000,
      })
      return ;
     }
   }


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

  sortgoods:function(){
    wx.navigateTo({
      url: '/pages/group/goods/sortgoods/sortgoods?crowd_id='+ this.data.crowd_id
    })

  },
})