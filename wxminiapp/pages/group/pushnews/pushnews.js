//index.js
//获取应用实例
const qiniuUploader = require("../../../utils/sdk/qiniu/qiniuUploader");
const {
  request
} = require('./../../../utils/request.js');
const app = getApp();

Page({
  data: {
    uploaderList: [],
    uploaderNum: 0,
    showUpload: true,
    loadModal: false,
    tasktext: null,
    crowd_id: null,
    crowd_name: "默认群",
    faceList: [{
      "image": "http://material.gzywudao.top/image/group/news/quntongzhi.jpg",
        "id": 0
      },
      {
        "image": "http://material.gzywudao.top/image/group/news/fangjiatongzhi.jpg",
        "id": 1
      },
      {
        "image": "http://material.gzywudao.top/image/group/news/huodongjuhui.jpg",
        "id": 2
      },
      {
        "image": "http://material.gzywudao.top/image/group/news/huiyitongzhi.jpg",
        "id": 3
      },
    ],
    isChecked: 0,
    checkedimg:"http://material.gzywudao.top/image/group/news/quntongzhi.jpg"
  },



  facehandler(e) {
    var id = e.currentTarget.dataset.data.id;
    var checkedimg = e.currentTarget.dataset.data.image;
    console.log(id, checkedimg)
    this.setData({
      isChecked: id,
      checkedimg: checkedimg
    })
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
      count: 9 - that.data.uploaderNum, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        console.log("返回选定照片的本地文件路径列表", res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        let uploaderList = that.data.uploaderList.concat(tempFilePaths);
        if (uploaderList.length == 9) {
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
    console.log("提交任务页面logo", options)
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

  sumittask: function(e) {
    console.log(this.data.uploaderList.length)
    if (this.data.uploaderList.length == 0 && this.data.tasktext == null ) {
      wx: wx.showToast({
        title: "图片或者描述不能为空",
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    else {
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
    if (that.data.uploaderList.length == 0){
      //没有上传图片，给个0
       let imgList = null
      that.uploadtask(imgList)

    }else{
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
              domain: 'https://groupqiniu.luojiaming.vip/',
              uptokenURL: 'https://littlefun.gzywudao.top/php/public/index.php/index/qiniu/qiniu',
            })
        }
      }).then(function (imgList) {
        console.log("多张图片返回结果上传数据库的", imgList)
        that.uploadtask(imgList)
      })

    }


  },


  uploadtask: function(imgList) {
    var that = this
    var imgList = imgList
    // console.log("没有图片的时候", imgList)
    // return;
    var checkedimg = this.data.checkedimg
    var crowd_id = this.data.crowd_id
    if (this.data.tasktext == null) {
      var explain = "用户未填写消息描述"
    } else {
      var explain = this.data.tasktext
    }
    wx.login({
      success: res => {
        request({
          service: 'group/groupnews/pushgroupnews',
          data: {
            code: res.code,
            images: imgList,
            content: explain,
            crowd_id: crowd_id,
            titleimage: checkedimg,
          },
          success: res => {
            that.setData({
              loadModal: false,
              uploaderList: [],
              uploaderNum: 0,
              tasktext: null
            })

            that.senmsg()//开始推送

            wx.showToast({
              title: '发布成功',
              icon: 'success',
              duration: 2000,
            })


            setTimeout(function () {
              wx.navigateBack({
                delta:1
              })
            }, 1500) 
          },
        })
      }
    })
  },


  senmsg:function(){
    let crowd_id = this.data.crowd_id
    let crowd_name = this.data.crowd_name
    request({
      service: 'temmsg/sendmsg/pushnewmsg',
      data: {
        crowd_id: crowd_id,
        crowd_name:crowd_name
      },
      success: res => {
        console.log('消息推送成功');
      },
    })


  },



})