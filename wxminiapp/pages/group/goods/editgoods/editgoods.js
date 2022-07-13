//index.js
//获取应用实例
const qiniuUploader = require("../../../../utils/sdk/qiniu/qiniuUploader");
const {
  request
} = require('./../../../../utils/request.js');
let baseConfig = require('./../../../../utils/config.js')
let common = require('./../../../../utils/common.js') //公共函数
const app = getApp();

Page({
  data: {

    id: null, //商品id
    loadModal: false,
    picker: ['不限量兑换', '限制库存'],
    ifstock: "0",
    goodsdata:{},//商品详情
    timeDivision:''//开始时间

    // crowd_id: null,
    // uploaderList: [],
    // uploaderNum: 0,
    // showUpload: true,
    // grouptext: null,
    // groupname: null,
    // groupcode: null,
    // loadModal: false,
    // picker: ['不限量兑换', '限制库存'],
    // ifstock:"0",
    // stock:null,
  },


     // 时分秒的事件方法
     selectDateSecondChange(e) {
      console.log("选择的时间",e.detail.value)
     this.setData({
       timeDivision: e.detail.value
     })
   },


  // 删除图片
  clearImg: function (e) {
    var nowList = []; //新数据
    var uploaderList = this.data.uploaderList; //原数据

    for (let i = 0; i < uploaderList.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        continue;
      } else {
        nowList.push(uploaderList[i])
      }
    }
    this.setData({
      uploaderNum: this.data.uploaderNum - 1,
      uploaderList: nowList,
      showUpload: true
    })
  },



  onLoad: function (e) {
    this.setData({
      id: e.id
    })
    request({
      service: 'group/groupgoods/goodsdetails',
      method: 'GET',
      data: {
        goods_id: e.id,
      },
      success: res => {
        console.log(res)
        let stock= res.data.stock;
        let ifstock="1";
        if(stock == null || stock == 999999999){
          ifstock="0";
          console.log("bu限量")
        }
        this.havetime(res.data.start_time)
        this.setData({
          goodsdata: res.data,
          ifstock:ifstock
        })
      },
    })

  },


  havetime:function(start_time){
    let nowtime=common.getNowTime()
    if(start_time){
      console.log("时间不为空要处理",start_time)
      nowtime=common.timestampToTime(start_time)
    }
    console.log("处理的时间",nowtime)
    this.setData({
      timeDivision: nowtime,
    })

  },




  goodsname: function (e) {
    let data=this.data.goodsdata;
    data.goodsname=e.detail.value
    this.setData({
      goodsdata:data,
    })
  },

  price: function (e) {
    let data=this.data.goodsdata;
    data.price=e.detail.value
    this.setData({
      goodsdata:data,
    })
  },

  stock: function (e) {
    let data=this.data.goodsdata;
    data.stock=e.detail.value
    this.setData({
      goodsdata:data,
    })
  },

  PickerChange(e) {
    this.setData({
      ifstock: e.detail.value
    })
  },

  sumittask: function (e) {

    if (this.data.ifstock == 1) {
      console.log("设置了库存")
      if (this.data.goodsdata.stock == null || this.data.goodsdata.stock < 1) {
        wx.showToast({
          title: '请设置正确的库存',
          icon: 'none',
          duration: 2500,
        })
        return;
      }
    }
    if (this.data.goodsdata.goodsname == null || this.data.goodsdata.price == null || this.data.goodsdata.goodsname == "" || this.data.goodsdata.price == "") {
      wx.showToast({
        title: '信息不能为空',
        icon: 'none',
        duration: 2500,
      })
      return;
    } 
    this.setData({
      loadModal: true,
    })
    this.updategoods()
  },


  updategoods: function (logo) {
    let data=this.data.goodsdata;

    var start_time=this.data.timeDivision;
    var new_start_time=common.timestampGetTime(start_time);
    data.start_time=new_start_time;


    if (this.data.ifstock == 0) {
      data.stock = 999999999;
    }
    console.log("提交的信息",data)
    request({
      service: 'group/groupgoods/newupdategoods',
      data: data,
      success: res => {
        this.setData({
          loadModal: false,
        })
        wx.showToast({
          title: '修改商品成功',
          icon: 'none',
          duration: 2000,
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      },
      complete: res => {
        this.setData({
          loadModal: false,
        })
      },
    })
  },


  
  deletegoods:function(){
    this.setData({
      deletegoodsmodel: true,
    })
},



  confirmdeletegoods: function () {
    var that = this
    var deletegoodsid = that.data.goodsdata.id
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
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      }
    })
  },

  hideModal:function(){

    this.setData({
      deletegoodsmodel: false,
    })

  }



})