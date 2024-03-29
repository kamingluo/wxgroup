// pages/exchange/exchange.js

const app = getApp()
const {
  request
} = require('./../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodslist1: [],
    goodslist2: [],
    coin: '',
    alipayName:"",
    alipayNumber:"",
    exchangegood:{},
    fram:false,
    fram2: false,
    display: false, //是否展示


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.goodsdata()
    this.setData({
      display: app.globalData.display || false
    })
  },

 

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.userdata()
  },


  //获取用户信息
  userdata: function () {
    wx.login({
      success: res => {
        request({
          service: 'user/userdata',
          data: {
            code: res.code,
          },
          success: res => {
            //console.log('获取用户信息', res);
            this.setData({
              coin: res.userdata.coin,
            })
            wx.setStorageSync('userdata', res.userdata)
          },
        })
      }
    })
  },


  goodsdata: function() {
    request({
      service: 'business/Exchange/goodslist',
      method: 'GET',
      success: res => {
        //console.log('兑换商品列表', res);
        this.setData({
          goodslist1: res.goodslist1,
          goodslist2: res.goodslist2,
        })
      }
    })

  },

  clickgoods: function(e) {
    var that =this
    console.log(e.currentTarget.dataset.goodsdata)
    if (that.data.coin < e.currentTarget.dataset.goodsdata.goodsPrice ){
      wx.showToast({
        title: "金币不足，快去赚金币吧！",
        icon: 'none',
        duration: 3000
      })
      return;
    }
    else if (e.currentTarget.dataset.goodsdata.goodsType != 0) {
      this.setData({
        exchangegood: e.currentTarget.dataset.goodsdata,
        fram2: true,
      })

    }
    else{
      this.setData({
        exchangegood: e.currentTarget.dataset.goodsdata,
        fram:true,
      })

    }


  },


  alipayName: function (e) {
    //console.log("姓名", e.detail.value)
    this.setData({
      alipayName: e.detail.value
    })
  },

  alipayNumber: function (e) {
    //console.log("账号", e.detail.value)
    this.setData({
      alipayNumber: e.detail.value
    })
  },
  submitexchangdata:function(e){
    var that =this
    //console.log("提交信息")
    if (that.data.alipayName.length < 2 || that.data.alipayNumber.length <6){
      wx.showToast({
        title: "信息错误，请重新填写！",
        icon: 'none',
        duration: 3000
      })
      return;
    }
    else{
      //console.log("开始兑换")
      
      wx.requestSubscribeMessage({
        tmplIds: ['yXsOU_XloUNY1ihCb_bwm8bjstgw4P3SErpqi4AwMNE'],
        success(res) {
          console.log("授权成功")
        },
        complete() {
          that.exchange() //成功不成功都执行下一步
        }
      })




    }

  },

  closefram:function(){
    this.setData({
      fram: false,
      fram2: false,
    })
  },

  exchange:function(){
    wx.login({
      success: res => {
        let goodsid = this.data.exchangegood.id
        let alipayName = this.data.alipayName
        let alipayNumber = this.data.alipayNumber
        request({
          service: 'business/Exchange/userexchange',
          data: {
            code: res.code,
            goodsid: goodsid,
            alipayName: alipayName,
            alipayNumber: alipayNumber,
          },
          success: res => {
            console.log('兑换成功', res);
            wx.showToast({
              title: res.message,
              icon: 'none',
              duration: 3000
            })
            this.setData({
              fram: false
            }) 
            setTimeout(function () {
              wx.navigateTo({
                url: '/pages/business/exchange_detailed/exchange_detailed'
              })
            }, 2000);
           
          },
        })
      }
    })

  },


  gdtbanneradclick: function (e) {
    //console.log("点击广点通banner广告", e.currentTarget)
    let userdata = wx.getStorageSync('userdata')
    let data = Object.assign(userdata, e.currentTarget.dataset); //将addata合并
  },

  exchangelist: function () {
    wx.navigateTo({
      url: '/pages/business/exchange_detailed/exchange_detailed'
    })

  },



})