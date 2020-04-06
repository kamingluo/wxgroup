// pages/group/lottery/pushlottery/pushlottery.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //开奖方式选择
    picker: ['满人开奖', '到时开奖'],
    index: "0",
    //上传图片
    uploaderList: [],
    uploaderNum: 0,
    showUpload: true,
    //开奖时间选择
    timepicker: [],
    time: 12,
    lotterytime: '12:00:00',

  },
  onLoad: function(options) {
    this.timeicker()

  },


  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
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
  moredata: function() {
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
          region: 'ECN',
          uploadURL: 'https://up-z0.qiniup.com',
          domain: 'http://material.gzywudao.top/',
          uptokenURL: 'https://group.gzywudao.top/php/public/miniapp.php/currency/qiniumaterial',
        })
      }
    }).then(function(imgList) {
      console.log("多张图片返回结果上传数据库的", imgList[0])
      let logo = imgList[0]
      //that.creategroup(logo)
    })
  },





})