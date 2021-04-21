const qiniuUploader = require("../../../../utils/sdk/qiniu/qiniuUploader");
const {
  request
} = require('./../../../../utils/request.js');
let baseConfig = require('./../../../../utils/config.js')
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    crowd_id:null,//群id
    goodsname:'',//商品名称
    //上传图片
    uploaderList: [],
    uploaderNum: 0,
    showUpload: true,
    score:10,//所需积分

    //开奖方式选择
    picker: ['满人开奖', '到时开奖'],
    luck_mode: "0",
    //开奖人数
    packed_lottery:1,
    //开奖时间选择
    timepicker: [],
    time: 12,
    lotterytime: '12:00:00',
    datetime: '2020-08-30',

    //中奖方式
    lottery_mode:"0",
    openpicker: ['概率', '人数'],
    lottery_probability:30,//中奖概率
    lottery_number:10,//中奖人数

    wxnumber:null,//群主微信
    remarks:null,//备注
    loadModal:false,//提示框


  },
  onLoad: function(options) {
    this.setData({
      crowd_id: options.crowd_id
    })

    this.timeicker()
  },


  goodsname:function(e){
    this.setData({
      goodsname: e.detail.value,
    })
  },
  score:function(e){
    this.setData({
      score: e.detail.value,
    })
  },


  PickerChange(e) {
    console.log(e.detail.value);
    // 开奖方式，0是满人开奖，1是到时间开奖
    this.setData({
      luck_mode: e.detail.value
    })
  },
  DateChange:function(e){
    this.setData({
      datetime: e.detail.value
    })

  },

  packedlottery:function(e){
    this.setData({
      packed_lottery: e.detail.value
    })

  },

  lotteryPickerChange(e){
    //中奖方式
    this.setData({
      lottery_mode: e.detail.value
    })

  },

  lotteryprobability:function(e){
    this.setData({
      lottery_probability: e.detail.value
    })

  },


  lotterynumber: function (e) {
    this.setData({
      lottery_number: e.detail.value
    })

  },

  wxnumber:function(e){
    this.setData({
      wxnumber: e.detail.value
    })

  },

  remarks: function (e) {
    this.setData({
      remarks: e.detail.value
    })

  },


//开奖时间
  timeicker: function() {
    var timepicker = [];
    for (let i = 0; i < 24; i++) {
      if (i < 10) {
        i = '0' + i;
      }
      let time = i + ":00:00";
      timepicker.push(time);
    }
    this.setData({
      timepicker: timepicker
    })
    // console.log(timepicker)
  },
  TimeChange(e) {
    this.setData({
      time: e.detail.value,
      lotterytime: this.data.timepicker[e.detail.value]
    })
  },


  //图片处理开始
  // 删除图片
  clearImg: function(e) {
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
  showImg: function(e) {
    var that = this;
    wx.previewImage({
      urls: that.data.uploaderList,
      current: that.data.uploaderList[e.currentTarget.dataset.index]
    })
  },
  //上传图片
  upload: function(e) {
    var that = this;
    wx.chooseImage({
      count: 1 - that.data.uploaderNum, // 默认1
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
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

  //上传图片拿到链接
  pushimg: function() {
    var that = this;
    var imgList = []; //多张图片地址，保存到一个数组当中
    var state = 0; //state记录当前已经上传到第几张图片
    new Promise(function(resolve, reject) {
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
            region: 'SCN',
            uploadURL: 'https://up-z2.qiniup.com',
            domain: 'http://grouplongtime.gzywudao.top/',
            uptokenURL: baseConfig.host + 'qiniu/grouplongtime',
        })
      }
    }).then(function(imgList) {
      console.log("多张图片返回结果上传数据库的", imgList[0])
      let imgurl = imgList[0];//拿到图片链接，然后触发上传
      that.createlottery(imgurl)
    })
  },

  createlottery: function (imgurl){
    var that =this;
    let crowd_id = that.data.crowd_id;//群id
    let goodsname=that.data.goodsname;//奖品名称
    // let imgurl = imgurl;//奖品图片
    let score = that.data.score || 0;//奖励积分
    let luck_mode =that.data.luck_mode;//开奖方式
    let packed_lottery=that.data.packed_lottery;//开奖人数
    let datetime = that.data.datetime;
    let lotterytime = that.data.lotterytime;
    let time_lottery = datetime + " " + lotterytime;//开奖时间

    let lottery_mode=that.data.lottery_mode;//开奖方式

    let lottery_probability=that.data.lottery_probability;//中奖概率
    let lottery_number = that.data.lottery_number;//中奖人数
    let wxnumber=that.data.wxnumber;//群主微信号
    let remarks=that.data.remarks;//开奖备注

    request({
      service: 'group/lottery/pushlottery',
      method: 'POST',
      data: {
        crowd_id:crowd_id,
        goods_name: goodsname,
        goods_img: imgurl,
        score: score,
        luck_mode: luck_mode,
        packed_lottery: packed_lottery,
        time_lottery: time_lottery,
        lottery_mode: lottery_mode,
        lottery_probability: lottery_probability,
        lottery_number: lottery_number,
        wxnumber: wxnumber,
        remarks: remarks
      },
      success: res => {
        that.setData({
          loadModal: false,
        })
        wx.showToast({
          title: '发布成功',
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

  //提交发布
  pushlottery:function(){
    var that =this;
    let goodsname=this.data.goodsname;
    if (!goodsname){
      this.wxtoast("奖品名称不能为空")
      return;
    }
    let uploaderNum =this.data.uploaderNum

    if (uploaderNum == 0){
      this.wxtoast("图片不能为空")
      return;
    }

    let luck_mode = this.data.luck_mode;//开奖方式
    if (luck_mode == 0){
      let packed_lottery=this.data.packed_lottery;
      if (packed_lottery < 1){
        this.wxtoast("开奖人数错误")
        return;
      }
    }
    else{
      let time1= new Date();//获取当前时间
      let time2 = this.data.datetime;//设置的开奖时间
      let lotterytime = that.data.lotterytime;
      let time3 = time2 + " " + lotterytime;//开奖时间
      let startTime =Date.parse(time1);
      let endTime = Date.parse(time3);
      // console.log("开始时间",startTime)
      // console.log("结束时间",endTime)
      if (startTime > endTime) {
        this.wxtoast("开奖时间不规范")
        return;
      }
    }

    let lottery_mode = this.data.lottery_mode;//中奖方式
    if (lottery_mode ==0){
      //概率
      let lottery_probability = this.data.lottery_probability;//中奖概率
      if (lottery_probability == null || lottery_probability < 1){
        this.wxtoast("开奖概率值错误")
        return;
      }
    }
    else{
      //人数
      let lottery_number = this.data.lottery_number;//中奖概率
      if (lottery_number == null || lottery_number < 1) {
        this.wxtoast("开奖人数值错误")
        return;
      }
    }

  //都没有错误的情况下，执行上传图片
    this.setData({
      loadModal: true
    })
    this.pushimg()

  },

  wxtoast:function(title){
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 2000,
    })

  },


})