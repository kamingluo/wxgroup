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
    crowd_id: null,
    uploaderList: [],
    uploaderNum: 0,
    showUpload: true,
    grouptext: null,
    groupname: null,
    groupcode: null,
    loadModal: false,
    picker: ['不限量兑换', '限制库存'],
    ifstock:"0",
    stock:null,

    exchangepicker: ['不限制兑换', '每人兑换数量'],
    ifexchange:"0",
    exchange_num:null,
    start_time:null,//开始时间

    timeDivision: ''//时分秒，根据需要选择


  },


  onLoad: function (e) { 
    this.setData({
      crowd_id: e.crowd_id
    })
    this.havetime()
  },


   // 时分秒的事件方法
   selectDateSecondChange(e) {
     console.log("选择的时间",e.detail.value)
    this.setData({
      timeDivision: e.detail.value
    })
  },

    //获取年月日
    havetime: function () {

      let nowtime=common.getNowTime()

      this.setData({
        timeDivision: nowtime,
      })

      // var date = new Date();
      // let year = date.getFullYear(); //获取完整的年份(4位)
      // let month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
      // let day = date.getDate(); //获取当前日(1-31)
      // let nowtime = year + "-" + month + "-" + + day;
      // console.log("当前时间", nowtime)
      // this.setData({
      //   start_time: nowtime,
      // })
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
  //展示图片
  showImg: function (e) {
    var that = this;
    wx.previewImage({
      urls: that.data.uploaderList,
      current: that.data.uploaderList[e.currentTarget.dataset.index]
    })
  },
  //上传图片
  upload: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1 - that.data.uploaderNum, // 默认1
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log("返回选定照片的本地文件路径列表", res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        let uploaderList = that.data.uploaderList.concat(tempFilePaths);
        if (uploaderList.length == 1) {
          that.setData({
            showUpload: false
          })
        }
        that.setData({
          uploaderList: uploaderList,
          uploaderNum: uploaderList.length,
        })
      }
    })
  },


  grouptext: function (e) {
    // console.log(e.detail.value)
    this.setData({
      grouptext: e.detail.value,
    })
  },

  groupname: function (e) {
    this.setData({
      groupname: e.detail.value,
    })
  },

  groupcode: function (e) {
    this.setData({
      groupcode: e.detail.value,
    })
  },

  stock:function(e){
    this.setData({
      stock: e.detail.value,
    })
  },

  exchangenum:function(e){
    this.setData({
      exchange_num: e.detail.value,
    })
  },

  PickerChange(e) {
    console.log(e.detail.value);
    this.setData({
      ifstock: e.detail.value
    })
  },

  PickerChangenum(e) {
    console.log(e.detail.value);
    this.setData({
      ifexchange: e.detail.value
    })
  },

    //开始时间
    DateChange: function (e) {
      this.setData({
        start_time: e.detail.value
      })
  
    },

  sumittask: function (e) {


    // let start_time=this.data.timeDivision;
    // let new_start_time=common.timestampGetTime(start_time);
   
    // console.log("转换时间戳后",new_start_time)

    // return


    if(this.data.ifstock == 1){
      console.log("设置了库存")
      if(this.data.stock == null || this.data.stock < 1 ){
        wx.showToast({
          title: '请设置正确的库存',
          icon: 'none',
          duration: 2500,
        })
        return;
      }
    }

    if(this.data.ifexchange == 1){
      console.log("设置了库存")
      if(this.data.exchange_num == null || this.data.exchange_num < 1 ){
        wx.showToast({
          title: '请设置正确的限制数量',
          icon: 'none',
          duration: 2500,
        })
        return;
      }
    }




    if (this.data.uploaderNum == 0 || this.data.groupname == null || this.data.groupcode == null) {
      wx.showToast({
        title: '信息不能为空',
        icon: 'none',
        duration: 2500,
      })
      return;
    } else if (this.data.uploaderNum == 0) {
      this.setData({
        loadModal: true,
      })
      //console.log("图片为空")
      let logo = "http://material.gzywudao.top/morencrowd.png"
      this.creategroup(logo)
    } else {
      this.setData({
        loadModal: true,
      })
      //console.log("图片不为空")
      this.moredata()
    }
  },


  creategroup: function (logo) {
    var that = this
    var crowd_id = this.data.crowd_id
    var groupcode = this.data.groupcode
    var groupname = this.data.groupname
    var logo = logo
    var stock=999999999;
    if(this.data.ifstock == 1){
      stock=this.data.stock;
    }

    var exchange_num=0;
    if(this.data.ifstock == 1){
      exchange_num=this.data.exchange_num;
    }

    //开始时间处理
    var start_time=this.data.timeDivision;
    var new_start_time=common.timestampGetTime(start_time);
   
    request({
      service: 'group/groupgoods/newpushgoods',
      data: {
        crowd_id: crowd_id,
        price: groupcode,
        goodsname: groupname,
        stock:stock,
        exchange_num:exchange_num,
        images: logo,
        start_time:new_start_time
      },
      success: res => {
        this.setData({
          loadModal: false,
        })
        wx.showToast({
          title: '发布商品成功',
          icon: 'none',
          duration: 2500,
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


  moredata: function () {
    var that = this;
    var imgList = []; //多张图片地址，保存到一个数组当中
    var state = 0; //state记录当前已经上传到第几张图片
    new Promise(function (resolve, reject) {
      for (var i = 0; i < that.data.uploaderList.length; i++) {
        qiniuUploader.upload(that.data.uploaderList[i], (res) => { //that.data.uploaderList逐个取出来去上传
          state++;
          imgList.push(res.imageURL);
          console.log(state) //输出上传到第几个了
          if (state == that.data.uploaderList.length) {
            resolve(imgList);
          }
        }, (error) => {
          reject('error');
          console.log('error: ' + error);
        }, {
            region: 'NCN',
            uploadURL: 'https://up-z1.qiniup.com',
            domain: 'http://grouppermanent.gzywudao.top/',
            uptokenURL: baseConfig.host + 'qiniu/grouppermanent',
          })
      }
    }).then(function (imgList) {
      console.log("多张图片返回结果上传数据库的", imgList[0])
      let logo = imgList[0]
      that.creategroup(logo)
    })
  }

})