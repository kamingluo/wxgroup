var app = getApp();
const {
  request
} = require('./request.js')
const baseConfig = require('./config.js')
let preventShake = 0;

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
          return true;
        },
        fail: res => {
          //console.log('错误捕捉', res);
        },
        complete: res => {
          // console.log('成功不成功都执行函数', res);
          return true;
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
          let timestamp = Date.parse(new Date());
           wx.setStorageSync('updateAuthorization', timestamp)
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
  } else if (type == 1 || type == 4) {
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

function havewxcode() {
  return new Promise(function(resolve, reject) {
    wx.login({
      success: function(res) {
        console.log("公共方法拿的微信code",res)
        resolve(res.code);
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
    }
  })
}


//内容审核
function echecktext(content) {
  return new Promise(function (resolve, reject) {
        request({
          service: 'currency/echecktext',
          data: {
            content: content,
          },
          success: res => {
            resolve(res);
          },
          fail: res => {
            console.log("内容审核结果失败",res)
          },
        })
  })
}



//广告统计
function clickgdtadstatistics(e) {
  const nowTime = Date.now();
  if (nowTime - preventShake < 2000) {
    return
  }
  preventShake = nowTime;

  let data=e;
  let user_id = wx.getStorageSync('userdata').id || 0 ;
  data.user_id=user_id;
  request({
    service: 'business/gdtad/clickad',
    data:data,
    success: res => {
      console.log("点击广告统计返回",res)
    }
  })
}

//是否需要授权修改一下123123
function ifauthorized(){
  let nowtime=Date.parse(new Date());
  let updateAuthorization=wx.getStorageSync('updateAuthorization') || 0 ;
  let gender = wx.getStorageSync('userdata').gender;
  console.log("拿到性别啦啦啦啦啦")
  console.log(gender)
  if(nowtime-updateAuthorization > 2592000000 || gender == null)
  {
    return false;
  }
  else{
    return true;
  }
}

//将时间戳转换成日期格式

function timestampToTime(timestamp,lengths=false) {
  timestamp=Number(timestamp)
  var date = new Date(timestamp);//时间戳为13位的话不需乘1000
  if(lengths){
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000
  }
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y + M + D + h + m + s;
}

//将日期格式转换成时间戳

function timestampGetTime(timestamp,lengths=false) {
  let start_time=new Date(timestamp)
  let newtime= Date.parse(start_time);//转换默认13位数
  if(lengths){
    newtime = new Date(newtime/1000);//时间戳为10位需除于1000
  }
  return newtime;
}



// 获取当前时间
function getNowTime() {
  const yy = new Date().getFullYear()
  const MM = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)
  const dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
  const HH = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
  const mm = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
  const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
  return yy + '-' + MM + '-' + dd + ' ' + HH + ':' + mm + ':' + ss
}








module.exports = {
  register: register,
  authorized: authorized,
  insidejump: insidejump,
  xmaddata: xmaddata,
  shareconfig: shareconfig,
  haveopenid: haveopenid,
  havewxcode:havewxcode,
  recordmsg: recordmsg,
  echecktext: echecktext,
  clickgdtadstatistics:clickgdtadstatistics,
  ifauthorized:ifauthorized,
  timestampToTime:timestampToTime,
  timestampGetTime:timestampGetTime,
  getNowTime:getNowTime
}