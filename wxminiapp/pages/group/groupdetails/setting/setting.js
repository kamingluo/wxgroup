//index.js
//获取应用实例
const qiniuUploader = require("../../../../utils/sdk/qiniu/qiniuUploader");
const {
  request
} = require('./../../../../utils/request.js');
const common = require('./../../../../utils/common.js') //公共函数
let baseConfig = require('./../../../../utils/config.js')
const app = getApp();

Page({
  data: {
    crowd_id:null,
    crowddata:null,
    uploaderList: [],
    uploaderNum: 0,
    showUpload: true,
    loadModal: false,
    detelModal:false
  },




  //删除群空间
  detelegroup:function(){
    this.setData({
      detelModal: true,
    })
  },
  //确认删除
  confirmdel:function(){
    this.setData({
      loadModal: false,
    })
    let crowd_id = this.data.crowd_id;
    let crowd_ownerid = this.data.crowddata.crowd_ownerid;
    request({
      service: 'group/usergroup/deletegroup',
      data: {
        crowd_id: crowd_id,
        crowd_ownerid: crowd_ownerid

      },
      success: res => {
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 2000,
        })

        setTimeout(function () {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }, 1500)

      },
    })


  },

  hideModal:function(){
    this.setData({
      detelModal: false,
      loadModal: false,
      showUpload: false,
    })
  },

  





  // 删除图片
  clearImg: function () {
    let data = this.data.crowddata
    data.logo = null
    this.setData({
      crowddata: data,
    })
  },
  //展示图片
  showImg: function (e) {
    console.log("暂时不放大")
    // var that = this;
    // wx.previewImage({
    //   urls: that.data.uploaderList,
    //   current: that.data.uploaderList[e.currentTarget.dataset.index]
    // })
  },
  //上传图片
  upload: function (e) {
    console.log("上传图片",e)
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        let tempFilePaths = res.tempFilePaths;
        let uploaderList = that.data.uploaderList.concat(tempFilePaths);
        that.setData({
          uploaderList: uploaderList,
        })

        that.moredata()
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      crowd_id: options.crowd_id,
    })
    let crowd_id = options.crowd_id;
    request({
      service: 'group/groupinformation/groupdetails',
      data: {
        crowd_id: crowd_id,
      },
      success: res => {
        console.log("查询群信息", res.groupdata)
        this.setData({
          crowddata: res.groupdata,
        })
      },
      complete: res => {
        this.setData({
          loadModal: false,
        })
      },
    })
  },

  grouptext: function (e) {
    
    let data = this.data.crowddata
    data.introduce = e.detail.value
    this.setData({
      crowddata: data,
    })
  },

  groupname: function (e) {
    console.log(e.detail.value)
    let data = this.data.crowddata
    data.crowd_name = e.detail.value
    console.log(data)
    this.setData({
      crowddata: data,
    })
  },


  sumittask: function (e) {
    var that=this
    let data=this.data.crowddata

    console.log("保存修改",data)
    if (data.crowd_name == null || data.logo == null) {
      wx.showToast({
        title: '群名称或者群头像不能为空',
        icon: 'none',
        duration: 2500,
      })
      this.setData({
        loadModal: false,
      })
      return;
    } 
    request({
      service: 'group/groupinformation/updategroupinformation',
      data: data,
      success: res => {
        this.setData({
          loadModal: false,
        })
        wx.showToast({
          title: '保存成功',
          icon: 'none',
          duration: 2500,
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
          //console.log(state) //输出上传到第几个了
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
            uptokenURL: baseConfig.host + 'currency/qiniumaterial',
          })
      }
    }).then(function (imgList) {
      console.log("多张图片返回结果上传数据库的", imgList[0])
      let data = that.data.crowddata
      data.logo = imgList[0]
      console.log(data)
      that.setData({
        crowddata: data,
      })
    })
  }

})