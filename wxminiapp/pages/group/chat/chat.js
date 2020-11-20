var app = getApp();
const qiniuUploader = require("../../../utils/sdk/qiniu/qiniuUploader");
const {
  request
} = require('./../../../utils/request.js');
const common = require('./../../../utils/common.js');
let baseConfig = require('./../../../utils/config.js')
var socketOpen = false;
var frameBuffer_Data, session, SocketTask;
var url = 'wss://group.gzywudao.top/wss'; //长链接接口
var timing; //定时
Page({
  data: {
    inputValue: '',
    InputBottom: 0, //输入框交互
    crowd_id: null, //群id
    crowd_name: null, //群名称
    owner_id: null, //群主id
    user_id: null, //用户id
    chatdata: [], //聊天记录数据
    groupnum: 0, //在线人数
    offchat: 0, //是否禁言。0正常1禁言
    modalName: null,
    scrollTop: 10000000,
    CustomBar: app.globalData.CustomBar,
    onlinelist: [],//在线人数列表
    hideNotice: false,//关闭公告
    notice: '',//公告内容
    keyworddata: [],//查询群关键字
    password:null,//打卡口令

  },

  //输入框交互
  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height
    })
  },
  InputBlur(e) {
    this.setData({
      InputBottom: 0
    })
  },

  //跳转发送公告页面
  pushnotice: function () {
    let crowd_id = this.data.crowd_id;
    wx.navigateTo({
      url: '/pages/group/chat/pushnotice/pushnotice?crowd_id=' + crowd_id
    })
  },

  //跳转到打卡设置页面
  punchseting: function () {
    let crowd_id = this.data.crowd_id;
    wx.navigateTo({
      url: '/pages/group/chat/punchseting/punchseting?crowd_id=' + crowd_id
    })
  },

  //跳转关键字设置页面
  keyword: function () {
    let crowd_id = this.data.crowd_id;
    wx.navigateTo({
      url: '/pages/group/chat/keyword/keyword?crowd_id=' + crowd_id
    })
  },

  //公告开始
  noticestart: function () {
    console.log("公告开始动起来")
    let data = {};
    var that = this;
    var oldlength = that.data.notice;
    if (!oldlength) {
      console.log("公告不存在")
      return;

    }
    var length = oldlength * 12;
    // console.log("公告长度")
    // console.log(length)
    // return;
    var windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕宽度
    that.setData({
      length: length,
      windowWidth: windowWidth
    });
    //marqueeDistance: 10, //初始滚动距离
    that.setData({
      marqueeDistance: windowWidth
    });
    that.noticerun();
  },

  //公告动起来
  noticerun: function () {
    var that = this;
    that.data.countTime = setInterval(function () {
      let noticelong = that.data.notice.length || 0;
      if (-that.data.marqueeDistance < noticelong * 12) {
        that.setData({
          marqueeDistance: that.data.marqueeDistance - 1,//1是滚动速度
        });
      } else {
        clearInterval(that.data.countTime);
        that.setData({
          marqueeDistance: that.data.windowWidth
        });
        that.noticerun();
      }
    }, 20);//20是时间间隔，写死
  },

  //关闭公告
  closeNotice: function () {
    this.setData({
      hideNotice: true
    })

  },


  // 页面加载
  onLoad: function (e) {
    let user_id = wx.getStorageSync('userdata').id;
    this.setData({
      crowd_id: e.crowd_id,
      crowd_name: e.crowd_name,
      user_id: user_id
    })

    // this.textdata()
    // this.noticestart()//公告动起来
    this.chatconfig()
    this.havekeyword()
    this.punchdata()
  },
  onShow: function (e) {
    if (!socketOpen) {
      this.webSocket()
    }
    this.sendCode()
  },


  //定时发送消息到服务器
  sendCode: function (e) {
    var that = this;
    var times = 0
    timing = setInterval(function () {
      times++
      if (times >= 15) {
        let data = {
          type: "ping"
        }
        sendSocketMessage(data)
        times = 0
      } else {
        //console.log("时间没到不发心跳")
      }
    }, 2000) //两秒执行一次
  },

  //获取配置信息
  chatconfig: function () {
    let crowd_id = this.data.crowd_id;
    request({
      service: 'group/chat/chatconfig',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
      },
      success: res => {
        console.log("配置信息", res)
        this.setData({
          chatdata: res.chatdata,
          owner_id: res.configdata.owner_id,
          offchat: res.configdata.offchat,
          notice: res.configdata.notice,
        })
        this.noticestart()//公告动起来
        setTimeout(function () {
          wx.pageScrollTo({
            scrollTop: 10000000,
          })
        }, 1000);

      }
    })
  },

  
  punchdata: function() {
    let crowd_id = this.data.crowd_id
    request({
      service: 'group/punchcard/querypunchdata',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
      },
      success: res => {
        let punchdata = res.punchdata;
        if (punchdata) {
          this.setData({
            password: punchdata.password,
          })
        }
      },
    })
  },


  //获取关键字配置
  havekeyword: function () {
    var that = this
    let crowd_id = this.data.crowd_id;
    request({
      service: 'group/chatkeyword/crowdkeyword',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
        type: 1//查询开启的关键字
      },
      success: res => {
        console.log("获取群设置的开启的关键字", res)
        that.setData({
          keyworddata: res.data,
        })
      }
    })
  },




  //数据库修改禁言状态
  updateoffchat: function (offchat) {
    let crowd_id = this.data.crowd_id;
    request({
      service: 'group/chat/offchat',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
        offchat: offchat
      },
      success: res => {
        console.log("修改禁言状态成功", res)
      }
    })
  },


  //点击修改禁言状态
  clickoffchat: function () {
    let offchat = this.data.offchat;
    (offchat == 0) ? offchat = 1 : offchat = 0;
    this.setData({
      offchat: offchat,
    })
    this.updateoffchat(offchat) //调接口改状态
    console.log(offchat)
    let crowd_id = this.data.crowd_id;
    let data = {
      type: "offchat",
      message: "修改禁言状态",
      to_client_id: "all",
      offchat: offchat,
      room_id: crowd_id
    }
    if (socketOpen) {
      sendSocketMessage(data)
    }

  },






  //页面加载链接长链接
  onReady: function () {
    console.log("开始加载")
    var that = this;
    SocketTask.onOpen(res => {
      socketOpen = true;
      console.log('监听 WebSocket 连接打开事件。', res)
    })
    SocketTask.onClose(onClose => {
      console.log('监听 WebSocket 连接关闭事件。', onClose)
      socketOpen = false;
      that.webSocket()
    })
    SocketTask.onError(onError => {
      console.log('监听 WebSocket 错误。错误信息', onError)
      socketOpen = false
    })
    SocketTask.onMessage(onMessage => {
      console.log('监听WebSocket接受到服务器的消息事件。服务器返回的消息', JSON.parse(onMessage.data))
      var onMessage_data = JSON.parse(onMessage.data)
      if (onMessage_data.type == "connect") {
        console.log("长链接创建成功")
        that.userlogin()
      } else if (onMessage_data.type == "login" || onMessage_data.type == "bye") {
        console.log("用户登录成功，信息绑定成功")
        let groupnum = onMessage_data.groupnum; //在线人数
        let onlinelistdata = onMessage_data.onlinelist; //在线列表
        var onlinelist = [];
        for (let key in onlinelistdata) {
          onlinelist.push(onlinelistdata[key])
        }
        that.setData({
          groupnum: groupnum,
          onlinelist: onlinelist
        })
      } else if (onMessage_data.type == "say") {
        console.log("有消息进来，判断一下是不是自己的,不是自己发的才set到数据上去")
        if (onMessage_data.user_id != that.data.user_id) {
          that.data.chatdata.push(onMessage_data);
          that.setData({
            chatdata: this.data.chatdata,
          })
          wx.pageScrollTo({
            scrollTop: 10000000,
          })
        }
      } else if (onMessage_data.type == "ping") {
        console.log("服务器心跳回调")
      } else if (onMessage_data.type == "offchat") {
        console.log("修改禁言状态")
        let offchat = onMessage_data.offchat;
        that.setData({
          offchat: offchat,
        })
      }
      return;
    })
  },

  //用户登录
  userlogin: function () {
    let user_id = wx.getStorageSync('userdata').id;
    let user_name = wx.getStorageSync('userdata').nickName;
    let avatarUrl = wx.getStorageSync('userdata').avatarUrl;
    let crowd_id = this.data.crowd_id;
    var data = {
      type: "login",
      message: "返回的数据",
      user_id: user_id,
      imgurl: avatarUrl,
      name: user_name,
      to_client_id: "all",
      room_id: crowd_id
    }
    if (socketOpen) {
      // 如果打开了socket就发送数据给服务器
      sendSocketMessage(data)
    }
  },

  //发送内容啊
  sendmsg: function (content, say_type) {
    let user_id = wx.getStorageSync('userdata').id;
    let user_name = wx.getStorageSync('userdata').nickName;
    let avatarUrl = wx.getStorageSync('userdata').avatarUrl;
    let crowd_id = this.data.crowd_id;

    var data = {
      type: "say",
      message: "发送给服务器的数据",
      user_id: user_id,
      imgurl: avatarUrl,
      name: user_name,
      to_client_id: "all",
      say_type: say_type,
      content: content,
      room_id: crowd_id
    }

    //将数据set到页面上
    this.data.chatdata.push(data);
    this.setData({
      chatdata: this.data.chatdata,
      inputValue: ''
    })
    console.log("将页面滑动到底部")
    wx.pageScrollTo({
      scrollTop: 10000000,
    })

    if (socketOpen) {
      sendSocketMessage(data)
    }
  },

  // 创建Socket
  webSocket: function () {
    SocketTask = wx.connectSocket({
      url: url,
      data: 'data',
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        console.log('WebSocket连接创建', res)
      },
      fail: function (err) {
        wx.showToast({
          title: '网络异常！',
        })
        wx.navigateBack({
          delta: 1
        })
        console.log(err)
      },
    })
  },

  // 提交文字
  submitTo: function (e) {
    console.log("提交文字")
    var content = this.data.inputValue;
    if (content == '' || content == null) {
      wx.showToast({
        title: '内容不能为空！',
        icon: 'none'
      })
      return;
    }
    this.sendmsg(content, "text")
    this.punchcard(content)//检查打卡
    this.checkkeyword(content)
  },

  //检查关键字
  checkkeyword: function (content) {
    var that= this;
    let newcontent=content;
    let keyworddata = this.data.keyworddata;
    if (keyworddata.length > 0) {
      for (var i = 0; i < keyworddata.length; i++) {
        let newkeyword=keyworddata[i].keyword;
        console.log("打印关键字",keyworddata[i])
        if(keyworddata[i].matching==0){
          if(newcontent==newkeyword){
            console.log("触发精准匹配",newkeyword)
            that.setkeyword(keyworddata[i])
          }
        }else{
          let successcheck=newkeyword.indexOf(newcontent) != -1;
          if(successcheck){
            console.log("触发模糊匹配",newkeyword)
            that.setkeyword(keyworddata[i])
          }
        }
      }

    }

  },

    //触发关键字
    setkeyword: function (keyworddata) {
      let keywork_id = keyworddata.id;
      let say_type =keyworddata.say_type;
      let content = keyworddata.content;
      let crowd_id = this.data.crowd_id;
  
      var data = {
        type: "keyword",
        message: "发送给服务器的数据",
        keywork_id: keywork_id,
        to_client_id: "all",
        say_type: say_type,
        content: content,
        room_id: crowd_id
      }
      if (socketOpen) {
        sendSocketMessage(data)
      }
    },

  //用户打卡
  punchcard: function (content) {
    var that =this
    let password=this.data.password;
    if (content == password) {
      console.log("触发打卡")
      let crowd_id = this.data.crowd_id;
      let user_id = wx.getStorageSync('userdata').id;
      request({
        service: 'group/punchcard/userpunchcard',
        method: 'GET',
        data: {
          crowd_id: crowd_id,
          user_id: user_id
        },
        success: res => {
          console.log("用户打卡成功返回", res)
          that.successpunchcard(res.message)
          // {"state":"200","message":"用户打卡成功","ifcontinuity_punch":false,"new_all_punch_number":10,"new_continuity_number":1,"ranking":1}
        }
      })
    }
    return;
  },

  //触发打卡
  successpunchcard: function (newcontent) {
    let say_type ='text';
    let content = newcontent;
    let crowd_id = this.data.crowd_id;

    var data = {
      type: "punchcard",
      message: "发送给服务器的数据",
      to_client_id: "all",
      say_type: say_type,
      content: content,
      room_id: crowd_id
    }
    if (socketOpen) {
      sendSocketMessage(data)
    }
  },

  //长按聊天文案
  longclick: function (e) {
    //console.log("longclick",e)
    let data = e.currentTarget.dataset.data
    wx.setClipboardData({
      data: data,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2000,
        })
      }
    })

  },

  //用户输入文字
  bindKeyInput: function (e) {
    //console.log("输入框输入文档", e.detail.value)
    this.setData({
      inputValue: e.detail.value
    })
  },


  //上传图片
  upload: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认1
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log("返回选定照片的本地文件路径列表", res)
        // // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths[0];
        //console.log("打印上传照片的本地路径", res.tempFilePaths[0])
        that.qiuniuupload(tempFilePaths) //拿到本地链接，去调用七牛上传
      }
    })
  },
  //把图片上传到七牛
  qiuniuupload: function (tempFilePaths) {
    var that = this;
    new Promise(function (resolve, reject) {
      qiniuUploader.upload(tempFilePaths, (res) => {
        let qiniuimgurl = res.imageURL;
        resolve(qiniuimgurl);
        //console.log('上传七牛返回: ' , qiniuimgurl);
      }, (error) => {
        reject('error');
        console.log('error: ' + error);
      }, {
        region: 'SCN', //华南代号
        uploadURL: 'https://up-z2.qiniup.com',
        domain: 'http://groupchat.luojiaming.vip/',
        uptokenURL: baseConfig.host + 'currency/qiniugroupchatdata',
      })
    }).then(function (qiniuimgurl) {
      that.sendmsg(qiniuimgurl, "image") //拿到图片地址去发送消息
    })
  },

  //图片点击事件
  imgYu: function (event) {
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = [src]; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },


  //页面隐藏就关闭连接
  onHide: function () {
    // SocketTask.close(function (close) {
    //   console.log('关闭 WebSocket 连接。', close)
    // })

    clearInterval(timing)

  },

  showModal(e) {
    console.log("在线人员", this.data.onlinelist)
    this.setData({
      modalName: e.currentTarget.dataset.target
    })

  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
    wx.pageScrollTo({
      scrollTop: 10000000,
    })
  },

  //页面卸载就关闭连接
  onUnload: function () {
    SocketTask.close(function (close) {
      console.log('页面卸载就关闭连接', close)
    })
    clearInterval(timing)
  }


})

//通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。
function sendSocketMessage(msg) {
  console.log("发送消息到服务器", msg)
  var that = this;
  // console.log('通过 WebSocket 连接发送数据', JSON.stringify(msg))
  console.log('通过 WebSocket 连接发送数据')
  SocketTask.send({
    data: JSON.stringify(msg)
  }, function (res) {
    console.log('已发送', res)
  })
}