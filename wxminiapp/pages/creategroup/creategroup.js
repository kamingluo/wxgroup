//index.js
//获取应用实例
const qiniuUploader = require("../../utils/sdk/qiniu/qiniuUploader");
const {
  request
} = require('./../../utils/request.js');
const common = require('./../../utils/common.js') //公共函数
const app = getApp();

Page({
  data: {
    display:false,
    uploaderList: [],
    uploaderNum: 0,
    showUpload: true,
    grouptext: null,
    groupname: null,
    groupcode: null,
    loadModal: false,
    wxnumber:null,
    userlogin:null,//用户登录状态
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
  onLoad: function() {
    this.setData({
      display: app.globalData.display || false
    })

    this.haveopenid()

  },


  haveopenid:function() {
    var that =this;
      wx.login({
        success: function(res) {
          request({
            service: 'user/userlogin',
            data: {
              code: res.code,
            },
            success: res => {
              console.log("fanfaopenid", res.userlogin)
              that.setData({
                userlogin:res.userlogin,
              })
            },
            fail: res => {
              console.log(res)
            },
          })
        }
      });
  },

  //获取用户手机号码
getPhoneNumber: function(e) { 
    console.log(e.detail.errMsg) 
    console.log(e.detail.iv) 
     console.log(e.detail.encryptedData) 
},

  grouptext: function(e) {
    // console.log(e.detail.value)
    this.setData({
      grouptext: e.detail.value,
    })
  },

  groupname: function(e) {
    this.setData({
      groupname: e.detail.value,
    })
  },

  groupcode: function (e) {
    this.setData({
      groupcode: e.detail.value,
    })
  },

  wxnumber:function(e){
    this.setData({
      wxnumber: e.detail.value,
    })
  },

  textcheck:function(){
    console.log("测试文案审核")
    let content="习近平";
    common.echecktext(content).then(function (e) {
      console.log("返回的结果",e)
      console.log("返回结果后")
    })

  },


  sumittask: function(e) {
    // console.log(this.data.grouptext)
    // console.log(this.data.groupname)
    // if (this.data.grouptext == null || this.data.groupname == null || this.data.groupcode == null) {
    if (this.data.groupname == null ) {
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

  creategroup:function(logo){
    var that = this
    let crowd_name = this.data.groupname
    let introduce = this.data.grouptext
    let wxnumber = this.data.wxnumber
    var logo =logo
    //内容审核
    let content = crowd_name + introduce + wxnumber
    common.echecktext(content).then(function (e) {
      if (e.data == 1) {
        wx.showToast({
          title: '内容不安全,请重新输入',
          icon: 'none',
          duration: 2500,
        })
        that.setData({
          loadModal: false,
        })
        return;
      }
      else{
        that.confirmcreategroup(logo)
      }
    })
  },




  confirmcreategroup: function(logo) {
    var that = this
    var crowd_name = this.data.groupname
    var groupcode = this.data.groupcode
    var introduce = this.data.grouptext
    let wxnumber = this.data.wxnumber
    var logo = logo
    wx.login({
      success: res => {
        request({
          service: 'group/usergroup/setupgroup',
          data: {
            code: res.code,
            crowd_name: crowd_name,
            groupcode: groupcode,
            introduce: introduce,
            logo: logo,
            wxnumber: wxnumber
          },
          success: res => {
            this.setData({
              loadModal: false,
            })
            wx.showToast({
              title: '创建群成功',
              icon: 'none',
              duration: 2500,
            })
            setTimeout(function() {
              wx.switchTab({
                url: '/pages/index/index'
              })
            }, 1500)
          },
          complete: res => {
            this.setData({
              loadModal: false,
            })
          },


        })
      }
    })

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
      that.creategroup(logo)
    })
  }

})