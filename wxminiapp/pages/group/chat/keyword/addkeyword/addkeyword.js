var app = getApp();
const {
  request
} = require('./../../../../../utils/request.js');

// const qiniuUploader = require("./../../../../../utils/sdk/qiniu/qiniuUploader");

// let baseConfig = require('./../../../../../utils/config.js')

const upimages = require('./../../../../../utils/sdk/qiniu/upimages.js') //上传图片


Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploaderList: [],
    showUpload: true,
    matchingpicker: ['精准匹配', '模糊匹配'],
    saytypepicker: ['文案', '图片'],
    matching: 0,
    say_type: 'text',
    open: 0,
    id:null,
    crowd_id:null,
    keyword:null,
    content:null,
    loadModal:false,
    cover: ''//封面

  },

  onLoad: function (options) {
    let crowd_id= options.crowd_id;
    let  id=options.id;
    if(id){
      this.setData({
        id: id,
        crowd_id:crowd_id
      })
      this.querykeyword(id)
    }
    else{
      this.setData({
        crowd_id:crowd_id
      })
    }

  },
  querykeyword:function(id){
    request({
      service: 'group/chatkeyword/querykeyword',
      method: 'GET',
      data: {
        id: id
      },
      success: res => {
        console.log("查询关键字详情",res.data)
          this.setData({
            keyword:res.data.keyword,
            matching:res.data.matching,
            open:res.data.open,
            say_type:res.data.say_type,
            content:res.data.content,
            cover:res.data.cover,
          })
      },
    })

  },

  PickerChange(e) {
    console.log(e.detail.value);
    let matching=0;
    if(e.detail.value==0)
    {
      matching=1
    }
    else{
      matching=0
    }
    // 开奖方式，0是模糊匹配，1是精准匹配
    this.setData({
      matching: matching
    })
  },

  saytypePickerChange(e) {
    console.log(e.detail.value);
    if (e.detail.value == 0) {
      this.setData({
        say_type: 'text'
      })
    }
    else {
      this.setData({
        say_type: 'image'
      })
    }
  },


  keyword:function(e){
    this.setData({
      keyword: e.detail.value,
    })
  },

  openchange: function(e) {
    let value = e.detail.value ? 0 : 1;
    this.setData({
      open: value
    })

  },
  content:function(e){
    this.setData({
      content: e.detail.value,
    })
  },

  sumit:function(){
    var that=this
    console.log(this.data)
    let id=this.data.id;
    let crowd_id=this.data.crowd_id;
    let content=this.data.content;
    let keyword=this.data.keyword;
    let matching=this.data.matching;
    let say_type=this.data.say_type;
    let open=this.data.open;
    let cover=this.data.cover;
    if(keyword==null||keyword==''){
      wx.showToast({
        title: '关键字不能为空',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    if(content==null||content==''&& cover==null||cover==""){
      wx.showToast({
        title: '回复内容不能为空',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    this.setData({
      loadModal:true
    })
    request({
      service: 'group/chatkeyword/setkeyword',
      method: 'POST',
      data: {
        id: id,
        crowd_id:crowd_id,
        content:content,
        keyword:keyword,
        matching:matching,
        say_type:say_type,
        open:open
      },
      success: res => {
        console.log("修改关键字",res)
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 2000,
        })
        that.setData({
          loadModal:false
        })
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      },
    })
  },
    // 删除封面
    clearcover: function () {
      this.setData({
        cover: '',
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

  //上传封面
  uploadcover: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认1
      sizeType: ['compressed'], // 只有压缩图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        let tempFilePaths = res.tempFilePaths[0];
        that.setData({
          loadModal: true
        });
        upimages.oneimage(tempFilePaths, (res) => {
          console.log("请求上传图片公共方法返回的url", res)
          that.setData({
            cover: res,
            loadModal: false
          });

        });
      }
    })
  },



})