var app = getApp();
const qiniuUploader = require("../../../utils/sdk/qiniu/qiniuUploader");
const {
  request
} = require('./../../../utils/request.js');
const common = require('./../../../utils/common.js');
var socketOpen = false;
var frameBuffer_Data, session, SocketTask;
var url = 'wss://group.gzywudao.top/wss';//长链接接口
Page({
  data: {
    inputValue: '',
    InputBottom: 0,//输入框交互
    crowd_id:null,//群id
    owner_id:null,//群主id
    user_id: null,//用户id
    chatdata: [],//聊天记录数据
    groupnum:0,//在线人数
    offchat:0,//是否禁言。0正常1禁言
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


  // 页面加载
  onLoad: function(e) {
    let user_id = wx.getStorageSync('userdata').id;
    this.setData({
      crowd_id: e.crowd_id,
      user_id: user_id
    })

    // this.textdata()
    this.chatconfig()
  },
  onShow: function(e) {
    if (!socketOpen) {
      this.webSocket()
    }
  },

  //获取配置信息
  chatconfig:function(){
    let crowd_id = this.data.crowd_id;
    request({
      service: 'group//chat/chatconfig',
      method: 'GET',
      data: {
        crowd_id:crowd_id,
      },
      success: res => {
        console.log("配置信息",res)
        this.setData({
          chatdata: res.chatdata,
          owner_id:res.configdata.owner_id,
          offchat:res.configdata.offchat,
        })
      }
    })
  },



//假数据
  // textdata: function() {
  //   let data = [{
  //       type: "say",
  //       message: "发送消息出去",
  //       user_id: 10084,
  //       imgurl: "https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg",
  //       client_name: "kamng2",
  //       say_type: "text",
  //       content: "微信小程序",
  //       create_time: "2018-03-23 13:23"
  //     },
  //     {
  //       type: "say",
  //       message: "发送消息出去",
  //       user_id: 10084,
  //       imgurl: "https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg",
  //       client_name: "kamng2",
  //       say_type: "image",
  //       content: "https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg",
  //       create_time: "2018-03-23 13:23"
  //     },

  //     {
  //       type: "say",
  //       message: "发送消息出去",
  //       user_id: 10086,
  //       imgurl: "https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg",
  //       client_name: "kamng2",
  //       say_type: "text",
  //       content: "微信小程序",
  //       create_time: "2018-03-23 13:23"
  //     },
  //     {
  //       type: "say",
  //       message: "发送消息出去",
  //       user_id: 10086,
  //       imgurl: "https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg",
  //       client_name: "kamng2",
  //       say_type: "image",
  //       content: "https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg",
  //       create_time: "2018-03-23 13:23"
  //     },
  //     {
  //       type: "say",
  //       message: "发送消息出去",
  //       user_id: 10084,
  //       imgurl: "https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg",
  //       client_name: "kamng2",
  //       say_type: "text",
  //       content: "微信小程序",
  //       create_time: "2018-03-23 13:23"
  //     },
  //     {
  //       type: "say",
  //       message: "发送消息出去",
  //       user_id: 10084,
  //       imgurl: "https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg",
  //       client_name: "kamng2",
  //       say_type: "image",
  //       content: "https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg",
  //       create_time: "2018-03-23 13:23"
  //     },

  //     {
  //       type: "say",
  //       message: "发送消息出去",
  //       user_id: 10086,
  //       imgurl: "https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg",
  //       client_name: "kamng2",
  //       say_type: "text",
  //       content: "微信小程序",
  //       create_time: "2018-03-23 13:23"
  //     },
  //     {
  //       type: "say",
  //       message: "发送消息出去",
  //       user_id: 10086,
  //       imgurl: "https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg",
  //       client_name: "kamng2",
  //       say_type: "image",
  //       content: "https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg",
  //       create_time: "2018-03-23 13:23"
  //     }
  //   ];
  //   this.setData({
  //     chatdata: data,
  //   })

  //   //回到最底部,数值那么大，保证回到底部
  //   wx.pageScrollTo({
  //     scrollTop: 10000000,  
  //   })
  // },
  // 页面加载完成
  
  
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
      }
      else if (onMessage_data.type == "login"){
        console.log("用户登录成功，信息绑定成功")
        let groupnum = onMessage_data.groupnum;//在线人数
        that.setData({
          groupnum: groupnum,
        })
      }
      else if(onMessage_data.type == "say"){
        console.log("有消息进来，判断一下是不是自己的,不是自己发的才set到数据上去")
        if (onMessage_data.user_id != that.data.user_id){
          that.data.chatdata.push(onMessage_data);
          that.setData({
            chatdata: this.data.chatdata,
          })
          wx.pageScrollTo({
            scrollTop: 10000000,
          })
        }
      }
      else if (onMessage_data.type == "ping"){
        console.log("服务器心跳回调")
      }
      return;
    })
  },

  //用户登录
  userlogin: function() {
    let user_id = wx.getStorageSync('userdata').id;
    let user_name = wx.getStorageSync('userdata').nickName;
    let avatarUrl = wx.getStorageSync('userdata').avatarUrl;
    let crowd_id = this.data.crowd_id;
    var data = {
      type: "login",
      message: "返回的数据",
      user_id: user_id,
      imgurl: avatarUrl,
      client_name: user_name,
      to_client_id: "all",
      room_id: crowd_id
    }
    if (socketOpen) {
      // 如果打开了socket就发送数据给服务器
      sendSocketMessage(data)
    }
  },

//发送内容啊
  sendmsg: function (content, say_type){
    let user_id = wx.getStorageSync('userdata').id;
    let user_name = wx.getStorageSync('userdata').nickName;
    let avatarUrl = wx.getStorageSync('userdata').avatarUrl;
    let crowd_id=this.data.crowd_id;

    var data = {
      type: "say",
      message: "发送给服务器的数据",
      user_id: user_id,
      imgurl: avatarUrl,
      client_name: user_name,
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
  webSocket: function() {
    SocketTask = wx.connectSocket({
      url: url,
      data: 'data',
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function(res) {
        console.log('WebSocket连接创建', res)
      },
      fail: function(err) {
        wx.showToast({
          title: '网络异常！',
        })
        console.log(err)
      },
    })
  },

  // 提交文字
  submitTo: function(e) {
    console.log("提交文字")
    let that = this;
    var content = this.data.inputValue;
    if (content == '' || content == null  ){
      wx.showToast({
        title: '内容不能为空！',
        icon:'none'
      })
      return ;
    }
    this.sendmsg(content,"text")

  },

//用户输入文字
  bindKeyInput: function(e) {
    console.log("输入框输入文档", e.detail.value)
    this.setData({
      inputValue: e.detail.value
    })
  },


  //上传图片
  upload: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1 , // 默认1
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log("返回选定照片的本地文件路径列表", res)
        // // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths[0];
        //console.log("打印上传照片的本地路径", res.tempFilePaths[0])
        that.qiuniuupload(tempFilePaths)//拿到本地链接，去调用七牛上传
      }
    })
  },
//把图片上传到七牛
  qiuniuupload: function(tempFilePaths) {
    var that = this;
    new Promise(function(resolve, reject) {
        qiniuUploader.upload(tempFilePaths, (res) => {
          let qiniuimgurl=res.imageURL;
            resolve(qiniuimgurl);
            //console.log('上传七牛返回: ' , qiniuimgurl);
        }, (error) => {
          reject('error');
          console.log('error: ' + error);
        }, {
          region: 'SCN',//华南代号
          uploadURL: 'https://up-z2.qiniup.com',
          domain: 'http://groupchat.luojiaming.vip/',
          uptokenURL: 'https://group.gzywudao.top/php/public/miniapp.php/currency/qiniugroupchatdata',
        })
    }).then(function(qiniuimgurl) {
      that.sendmsg(qiniuimgurl,"image")//拿到图片地址去发送消息
    })
  },


  //页面隐藏就关闭连接
  // onHide: function () {
  //   SocketTask.close(function (close) {
  //     console.log('关闭 WebSocket 连接。', close)
  //   })
  // },


})

//通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。
function sendSocketMessage(msg) {
  console.log("发送消息到服务器", msg)
  var that = this;
  // console.log('通过 WebSocket 连接发送数据', JSON.stringify(msg))
  console.log('通过 WebSocket 连接发送数据')
  SocketTask.send({
    data: JSON.stringify(msg)
  }, function(res) {
    console.log('已发送', res)
  })
}