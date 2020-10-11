const {
  request
} = require('./../../../utils/request.js');
const baseConfig = require('./../../../utils/config.js')//配置文件
const app = getApp();
Page({
  data: {
    imageurl: 'https://group.gzywudao.top/php/public/', //默认图片链接
    choosedata:{
      id: 1,
      body: "体验卡",
      detail:"会员体验卡",
      total_fee: '1',
      originalprice: '10',
      vip_time: "1天",
      image:"https://material.gzywudao.top/image/group/groupicon.png",
    },
    swiperList: [],//会员购买商品列表
    condition:1,//会员开通情况，0是已经开通且有效，1是未开通过，2是已经过期
    end_time:"",//会员结束时间
  },
  onLoad() {
    this.membergoods()//获取VIP商品数据

    let imageurl = baseConfig.imageurl;
    this.setData({
      imageurl: imageurl,
    })
  },

  onShow(){
    this.queryuservipdata()
  },

  queryuservipdata:function(){
    let user_id = wx.getStorageSync('userdata').id;
    request({
      service: '/vip/uservipdata',
      data: {
        user_id:user_id
      },
      success: res => {
        console.log("查询用户会员情况",res.data)
        this.setData({
          condition: res.condition,
          end_time:res.end_time
        })
      },
    })
  },


  membergoods:function(){
    request({
      service: 'vip/membergoods',
      data: {},
      success: res => {
        console.log("vip商品数据",res.data)
        this.setData({
          swiperList: res.data
        })
        // 初始化towerSwiper 传已有的数组名即可
        this.towerSwiper('swiperList');
      },
    })

  },

  pay:function(){
    var that=this
    let goods_id=this.data.choosedata.id;
    wx.login({
      success: res => {
        request({
          service: 'pay/order/createorder',
          data: {
            code: res.code,
            goods_id: goods_id,
            type:1
          },
          success: res => {
            let out_trade_no = res.out_trade_no;
            request({
              service:'pay/vippay/pay',
              data: {
                out_trade_no: out_trade_no
              },
              success: function (res) {  //后端返回的数据
                console.log("统一下单返回数据", res)
                var data = res;
                console.log(data);
                console.log(data["timeStamp"]);
                wx.requestPayment({
                  timeStamp: data['timeStamp'],
                  nonceStr: data['nonceStr'],
                  package: data['package'],
                  signType: data['signType'],
                  paySign: data['paySign'],
                  success: function (res) {
                    console.log("支付成功返回数据", res)
                    // that.queryuservipdata()//重新刷新
                    wx.navigateTo({
                      url: '/pages/communal/paysuccess/paysuccess'
                    })
                    // wx.showModal({
                    //   title: '支付成功',
                    //   content: '',
                    // })
                  },
                  fail: function (res) {
                    wx.showModal({
                      title: '支付失败',
                      content: '',
                    })
                  }
                })
              }
            });
          },
        })
      }
    })


    

  },









  qidai:function(){
    wx.showToast({
      title: '功能未开放，敬请期待！',
      icon: 'none',
      duration: 2500,
    })

  },

  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    //console.log("初始化towerSwiper")
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    console.log("初始化towerSwiper",list)
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    //console.log("towerSwiper触摸开始")
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    //console.log("towerSwiper计算方向")
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    //console.log("owerSwiper计算滚动")
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      console.log("计算出来的新的数据right", list)
      this.setData({
        swiperList: list
      })

      for (let k = 0; k < list.length; k++) {
        if (list[k].mLeft == 0){
          console.log("拿到最前面的值", list[k])
          this.setData({
            choosedata: list[k]
          })
        }
      }

    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      console.log("计算出来的新的数据zIndex", list)
      this.setData({
        swiperList: list
      })
      for (let k = 0; k < list.length; k++) {
        if (list[k].mLeft == 0) {
          console.log("拿到最前面的值", list[k])
          this.setData({
            choosedata: list[k]
          })
        }
      }
    }
  }
})