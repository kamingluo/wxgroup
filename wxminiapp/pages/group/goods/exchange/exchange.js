// pages/group/goods/exchange/exchange.js

const app = getApp()
const {
  request
} = require('./../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    useraddress: null,
    goods_id: null,
    goodsdata: null,
    remarks: null,
    crowd_id: null,
    crowd_name: null


  },

  onLoad: function(options) {
    console.log(options)
    this.setData({
      goods_id: options.goods_id,
      crowd_id: options.crowd_id,
      crowd_name: options.crowd_name,
    })
    this.address()
    this.goodsdata()
  },
  address: function() {
    var user_id = wx.getStorageSync('userdata').id
    request({
      service: 'user/useraddress',
      method: 'GET',
      data: {
        user_id: user_id,
      },
      success: res => {
        this.setData({
          useraddress: res.addressdata,
        })
      },
    })

  },


  // modifyaddress:function(){
  //   wx.navigateTo({
  //     url: '/pages/my/my_address/my_address'
  //   })
  // },

  modifyaddress: function() {
    var that = this
    wx.chooseAddress({
      success(res) {
        //console.log(res)
        var data = res
        that.setData({
          useraddress: res,
        })
        var user_id = wx.getStorageSync('userdata').id
        wx.login({
          success: res => {
            data.code = res.code
            data.user_id = user_id
            request({
              service: 'user/usersetaddress',
              data: data,
              success: res => {
                // console.log("-----------",res)
                wx.showToast({
                  title: '操作成功',
                  icon: 'none',
                  duration: 2000,
                })
              },
            })
          }
        })
      }
    })

  },

  goodsdata: function() {
    let goods_id = this.data.goods_id
    request({
      service: 'group/groupgoods/goodsdetails',
      method: 'GET',
      data: {
        goods_id: goods_id,
      },
      success: res => {
        console.log(res)
        this.setData({
          goodsdata: res.data,
        })
      },
    })
  },

  specialclickexchange: function() {
    console.log("小嘴助手特殊商品兑换")
    var goods_id = this.data.goods_id
    var remarks = this.data.remarks
    var crowd_id = this.data.crowd_id
    var crowd_name = this.data.crowd_name
    wx.login({
      success: res => {
        request({
          service: 'group/groupgoods/specialexchangegoods',
          data: {
            code: res.code,
            goods_id: goods_id,
            remarks: remarks,
            crowd_id: crowd_id,
            crowd_name: crowd_name
          },
          success: res => {
            //console.log("兑换结果",res)
            wx.showToast({
              title: '兑换成功',
              icon: 'none',
              duration: 2000,
            })
            let coupon_code=res.data.coupon_code
            let jumpurl=res.data.jumpurl

            //将特殊兑换说明图片放这里
            let specialexchangeimagedata=res.data.imagedata
            wx.setStorageSync('specialexchangeimagedata',specialexchangeimagedata)

            setTimeout(function () {
              wx.navigateTo({
                url: '/pages/group/goods/exchange/special/special?code=' + coupon_code + '&jumpurl=' + jumpurl
              })
            }, 1500)
          },
        })
      }
    })

  },


  remarks: function(e) {
    //console.log(e.detail.value)
    this.setData({
      remarks: e.detail.value,
    })

  },

  clickexchange: function() {
    console.log("点击兑换")
    var that = this
    if (!that.data.useraddress) {
      wx.showToast({
        title: '请先添加地址',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    wx.requestSubscribeMessage({
      tmplIds: ['SknRZZeUTqjuuOKPqxANRoZMl2jhUBJbwvd5P8JgjN8'],
      success(res) {
        console.log("兑换成功授权", res)
      },
      complete(res) {
        console.log("兑换成功不成功都可以", res)
        that.confirmexchange()

      }
    })
  },

  confirmexchange: function() {
    var goods_id = this.data.goods_id
    var remarks = this.data.remarks
    var crowd_id = this.data.crowd_id
    var crowd_name = this.data.crowd_name
    wx.login({
      success: res => {
        request({
          service: 'group/groupgoods/exchangegoods',
          data: {
            code: res.code,
            goods_id: goods_id,
            remarks: remarks,
            crowd_id: crowd_id,
            crowd_name: crowd_name
          },
          success: res => {
            //console.log("兑换结果",res)
            wx.showToast({
              title: '兑换成功',
              icon: 'none',
              duration: 2000,
            })
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
          },
        })
      }
    })

  }






})