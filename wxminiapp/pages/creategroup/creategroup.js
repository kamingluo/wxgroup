//index.js
//获取应用实例
const qiniuUploader = require("../../utils/sdk/qiniu/qiniuUploader");
const {
  request
} = require('./../../utils/request.js');
const common = require('./../../utils/common.js') //公共函数
let baseConfig = require('./../../utils/config.js')
const app = getApp();

Page({
  data: {
    display: false,
    uploaderList: [],
    uploaderNum: 0,
    showUpload: true,
    grouptext: null,
    groupname: null,
    groupcode: null,
    loadModal: false,
    wxnumber: null,
    userlogin: null, //用户登录状态
    checked: false //用户协议
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
        //console.log("返回选定照片的本地文件路径列表", res)
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
  onLoad: function () {
    this.setData({
      display: app.globalData.display || false
    })

    // this.haveopenid()

  },

  gdtvideoadclick: function (e) {
    let data = {
      'adtype': 4,
      'position': "创建群空间"
    };
    common.clickgdtadstatistics(data)
  },


  haveopenid: function () {
    var that = this;
    wx.login({
      success: function (res) {
        request({
          service: 'user/userlogin',
          data: {
            code: res.code,
          },
          success: res => {
            that.setData({
              userlogin: res.userlogin,
            })
          }
        })
      }
    });
  },

  //获取用户手机号码
  getPhoneNumber: function (e) {
    var that = this
    // console.log(e.detail.errMsg)
    // console.log(e.detail.iv) 
    //  console.log(e.detail.encryptedData) 
    let encryptedData = e.detail.encryptedData;
    let iv = e.detail.iv;
    let session_key = this.data.userlogin.session_key;
    let user_openid = this.data.userlogin.openid;
    let user_id = wx.getStorageSync('userdata').id
    if (encryptedData) {
      request({
        service: 'currency/phonedecrypt',
        data: {
          encryptedData: encryptedData,
          iv: iv,
          session_key: session_key,
          user_id: user_id,
          user_openid: user_openid,
        },
        success: res => {
          // console.log("fanfaopenid", res.userlogin)
          that.sumittask()
          // that.setData({
          //   loadModal: true,
          // })
        }
      })
    } else {
      wx.showToast({
        title: '请允许授权',
        icon: 'none',
        duration: 2500,
      })

    }
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

  wxnumber: function (e) {
    this.setData({
      wxnumber: e.detail.value,
    })
  },


  //跳转服务隐私页面
  joinagreement:function(){
    let url ='/pages/webview/webview?url='+baseConfig.host+'webviewa/agreement';
    console.log("跳转用户隐私页面",url)
    wx.navigateTo({
      url:url
    })
  },

  sumittask: function (e) {
    let userdata = wx.getStorageSync('userdata').openid;
    // console.log(this.data.grouptext)
    // console.log(this.data.groupname)
    // if (this.data.grouptext == null || this.data.groupname == null || this.data.groupcode == null) {
    if (!this.data.checked) {
      wx.showToast({
        title: '请阅读并同意协议',
        icon: 'none',
        duration: 2500,
      })
      return;


    }
    if (this.data.groupname == null) {
      wx.showToast({
        title: '信息不能为空',
        icon: 'none',
        duration: 2500,
      })
      this.setData({
        loadModal: false,
      })
      return;
    } else if (this.data.uploaderNum == 0) {
      this.setData({
        loadModal: true,
      })
      //console.log("图片为空")
      let logo = "https://material.gzywudao.top/image/group/groupicon.png"
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
    let crowd_name = this.data.groupname
    let introduce = this.data.grouptext
    let wxnumber = this.data.wxnumber
    var logo = logo
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
      } else {
        that.confirmcreategroup(logo)
      }
    })
  },




  confirmcreategroup: function (logo) {

    var open=0;
    let display = app.globalData.display || false;
    if (!display){
      var open = 1;
    }


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
            wxnumber: wxnumber,
            open: open
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
            setTimeout(function () {
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

  checked: function (e) {
    console.log("点击协议", e)
    let checked = this.data.checked;
    this.setData({
      checked: !checked,
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
          region: 'NCN',
          uploadURL: 'https://up-z1.qiniup.com',
            domain: 'http://grouppermanent.gzywudao.top/',
            uptokenURL: baseConfig.host + 'qiniu/grouppermanent',
        })
      }
    }).then(function (imgList) {
      //console.log("多张图片返回结果上传数据库的", imgList[0])
      let logo = imgList[0]
      that.creategroup(logo)
    })
  }

})