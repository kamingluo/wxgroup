
const app = getApp()
const {
  request
} = require('./../../../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    changedata:null,
    change_id:null,
    expressnumber:null,
    adoptmodel:false,
    notpassmodel:false,
    loadModal:false,
    sendkuaidi:true,
    sendother:false,
    exchange_type:0


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("进来的", options.changeid)
    this.setData({
      change_id: options.changeid,
      expressnumber: null,
    })

    this.changedata()
  },

  changedata: function (changeid) {
    var change_id = this.data.change_id
    console.log("请求的", change_id)
    request({
      service: 'group/Exchangegoods/exchangedetails',
      method: 'GET',
      data: {
        exchange_id: change_id,
      },
      success: res => {
        console.log('兑换详情', res);
        this.setData({
          changedata: res.data,
          loadModal: false,
        })
      },
    })
  },



  expressnumber: function (e) {
    this.setData({
      expressnumber: e.detail.value
    })
  },

  sendkuaidi:function(){
    this.setData({
      sendkuaidi: true,
      sendother: false,
      exchange_type: 0
    })

  },
  sendother: function () {
    this.setData({
      sendkuaidi: false,
      sendother: true,
      exchange_type: 1
    })

  },


  expressScancode: function () {
    var that=this
    wx.scanCode({
      success(res) {
        console.log("扫码返回", res)
        if (res.result < 10 || (res.result * 10) % 10 != 0) {
          wx.showToast({
            title: '快递码不对,或者换个姿势再试',
            icon: 'none',
            duration: 2500
          })
          return;
        } 
        that.setData({
          expressnumber: res.result
        })
      }
    })
  },

  //通过按钮
  adopt:function(){
    this.setData({
      adoptmodel: true,
    })

  },

  //不通过按钮
  notpass: function () {
    this.setData({
     notpassmodel: true,
    })

  },


  hidemodel:function(){
    this.setData({
      adoptmodel: false,
      notpassmodel: false,
    })
  },


 //确认通过发货
  confirmadopt:function(){
    this.setData({
      loadModal: true,
      adoptmodel: false,
      notpassmodel: false,
    })
    var expressnumber = this.data.expressnumber
    var exchange_id = this.data.change_id
    var exchange_type = this.data.exchange_type
    var that = this
    request({
      service: 'group/Exchangegoods/sendoutgoods',
      data: {
        exchange_id: exchange_id,
        expressnumber: expressnumber,
        state: 1,
        exchange_type: exchange_type
      },
      success: res => {
        console.log('确认通过发货', res);
        that.changedata()
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 2500
        })
      },
    })


  },


  //确认审核不通过
  confirmnotpass:function(){
    this.setData({
      loadModal: true,
      adoptmodel: false,
      notpassmodel: false,
    })
    var exchange_id = this.data.change_id
    var expressnumber = this.data.expressnumber || "无任何信息，请咨询群主"
    var that = this
    request({
      service: 'group/Exchangegoods/sendoutgoods',
      data: {
        exchange_id: exchange_id,
        expressnumber: expressnumber,
        state: 2,
      },
      success: res => {
        console.log('确认不通过', res);
        that.changedata()

        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 2500
        })

       
      },
    })



  },

  
})