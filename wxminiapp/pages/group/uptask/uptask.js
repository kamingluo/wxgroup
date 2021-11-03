//index.js
//获取应用实例
const qiniuUploader = require("../../../utils/sdk/qiniu/qiniuUploader");
const {
  request
} = require('./../../../utils/request.js');
const common = require('./../../../utils/common.js');
let baseConfig = require('./../../../utils/config.js')
const app = getApp();
let preventShake = 0;

Page({
  data: {
    uploaderList: [],
    uploaderNum: 0,
    showUpload: true,
    loadModal: false,
    tasktext: null,
    crowd_id: null,
    crowd_name: null,
  },
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
      count: 4 - that.data.uploaderNum, // 默认4
      // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sizeType: ['compressed'], // 只有压缩图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        let uploaderList = that.data.uploaderList.concat(tempFilePaths);
        if (uploaderList.length == 4) {
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

  onLoad: function(options) {
    this.setData({
      //设置active的值为用户点击按钮的索引值
      crowd_id: options.crowd_id,
      crowd_name: options.crowd_name
    })
  },


  tasktext: function(e) {
    // console.log(e.detail.value)
    this.setData({
      tasktext: e.detail.value,
    })
  },


  gdtvideoadclick:function(){
    console.log("点击广告")
    let data={
      'adtype':4,
      'position':"提交任务页面"
    };
    common.clickgdtadstatistics(data)

  },

  sumittask: function() {
    if (this.data.uploaderList.length == 0 && (this.data.tasktext=="" ||  this.data.tasktext==null)) {
      wx.showToast({
        title: '图片和描述不能同时为空',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    const nowTime = Date.now();
    if (nowTime - preventShake < 2000) {
      return
    }
    preventShake = nowTime;
    // console.log("点击了提交任务")
    // return;
    var that = this
    wx.requestSubscribeMessage({
      tmplIds: ['fIbB90FHxqlRURZGGo0PmcdAKWaUoxziV_loz90ftVs'],
      success(res) {
        //console.log("同意了请求，统计一下")
        //先写死一个推送id
        let tmpid = 'fIbB90FHxqlRURZGGo0PmcdAKWaUoxziV_loz90ftVs';
        let openid = wx.getStorageSync('userdata').openid
        let crowd_id = that.data.crowd_id
        let user_id = wx.getStorageSync('userdata').id
        let sendata = {
          openid: openid,
          temmsg_id: tmpid,
          crowd_id: crowd_id,
          user_id: user_id
        }
        common.recordmsg(sendata)
      },
      complete() {
        that.newsumittask() //成功不成功都执行下一步
      }
    })
  },



  newsumittask: function(e) {
    // this.uploadtask()
    // this.setData({
    //   loadModal: true,
    // })
    // return;
    if (this.data.uploaderList.length == 0) {
      // wx: wx.showToast({
      //   title: "审核图片不能为空",
      //   icon: 'none',
      //   duration: 2000,
      // })
      this.uploadtask()
      this.setData({
        loadModal: true,
      })
      return;
    } else {
      this.setData({
        loadModal: true,
      })
      this.moredata()

    }
  },


  moredata: function() {
    var that = this;
    var imgList = []; //多张图片地址，保存到一个数组当中
    var state = 0; //state记录当前已经上传到第几张图片
    new Promise(function(resolve, reject) {
      for (var i = 0; i < that.data.uploaderList.length; i++) {
        qiniuUploader.upload(that.data.uploaderList[i], (res) => { //that.data.uploaderList逐个取出来去上传
          state++;
          imgList.push(res.imageURL);
          if (state == that.data.uploaderList.length) {
            resolve(imgList);
          }
        }, (error) => {
          reject('error');
          console.log('error: ' + error);
        }, {
            region: 'ECN',
            uploadURL: 'https://up.qiniup.com',
            domain: 'http://groupsixty.gzywudao.top/',
            uptokenURL: baseConfig.host + 'qiniu/groupsixty',
        })
      }
    }).then(function(imgList) {
      that.uploadtask(imgList)

    })
  },


  uploadtask: function(imgList) {
    var that = this
    var imgList = imgList
    var crowd_id = this.data.crowd_id
    var crowd_name = this.data.crowd_name
    if (this.data.tasktext == null && imgList.length < 1 ) {
      wx.showToast({
        title: '图片和描述不能同时为空',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    if (this.data.tasktext == null) {
      var explain = "用户未填写任务描述"
    } else {
      var explain = this.data.tasktext
    }
    wx.login({
      success: res => {
        request({
          service: 'task/usertask/usersubmittask',
          data: {
            code: res.code,
            images: imgList,
            explain: explain,
            crowd_id: crowd_id,
            crowd_name: crowd_name,
          },
          success: res => {
            this.setData({
              loadModal: false,
              uploaderList: [],
              uploaderNum: 0,
              tasktext: null
            })
            wx.showToast({
              title: '提交成功',
              icon: 'success',
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
  },



})