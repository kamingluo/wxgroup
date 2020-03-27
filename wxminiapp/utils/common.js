var app = getApp();
const {
  request
} = require('./request.js')
const baseConfig = require('./config.js')

function register(e) {
  var data = e
  wx.login({
    success: res => {
      data.code = res.code
      request({
        service: 'user/register',
        data: data,
        success: res => {
          // console.log('注册成功', res);
          wx.setStorageSync('userdata', res.userdata)
        },
        fail: res => {
          //console.log('错误捕捉', res);
        },
        complete: res => {
          // console.log('成功不成功都执行函数', res);
        },
      })
    }
  })
}



function authorized(e) {
  var data = e
  wx.login({
    success: res => {
      data.code = res.code
      request({
        service: 'user/authorized',
        data: data,
        success: res => {
          // console.log('注册成功', res);
          wx.setStorageSync('userdata', res.userdata)
        },
        fail: res => {
          //console.log('错误捕捉', res);
        },
        complete: res => {
          // console.log('成功不成功都执行函数', res);
        },
      })
    }
  })
}

function xmaddata() {
  request({
    service: 'ad/xmad/xmadconfig',
    method: 'GET',
    success: res => {
      //console.log('小盟ad配置', res.xmaddata);
      wx.setStorageSync('xmadconfig', res.xmaddata)

    },
  })
}


function shareconfig() {
  request({
    service: 'currency/shareconfig',
    method: 'GET',
    success: res => {
      //console.log('分享配置', res.xmaddata);
      wx.setStorageSync('shareconfig', res.shareconfig)

    },
  })
}



//跳转内部页面
function insidejump(e) {
  //console.log("跳转页面",e)
  let type = e.type
  if (type == 0) {
    wx.switchTab({
      url: e.url
    })
  } else if (type == 1) {
    wx.navigateTo({
      url: e.url
    })
  } else if (type == 2) {
    wx.navigateToMiniProgram({
      appId: e.appid,
      path: e.url,
    })
  } else {
    wx.reLaunch({
      url: e.url
    })
  }
}


function haveopenid() {
  return new Promise(function(resolve, reject) {
    wx.login({
      success: function(res) {
        request({
          service: 'user/obtainopenid',
          data: {
            code: res.code,
          },
          success: res => {
            console.log("fanfaopenid", res.openid)
            resolve(res.openid);
          },
          fail: res => {
            console.log(res)
          },
        })
      }
    });
  })
}



function recordmsg(e){
  console.log("传过来的推送信息",e)
  request({
    service: 'temmsg/sendmsg/collectmsg',
    data: e,
    success: res => {
      console.log("记录推送", res)
    },
    fail: res => {
      console.log(res)
    },
  })
}




module.exports = {
  register: register,
  authorized: authorized,
  insidejump: insidejump,
  xmaddata: xmaddata,
  shareconfig: shareconfig,
  haveopenid: haveopenid,
  recordmsg: recordmsg
}