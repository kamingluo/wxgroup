var app = getApp();
const {
  request
} = require('./../../request.js')
const baseConfig = require('./../../config.js')
const qiniuUploader = require("./qiniuUploader");
let preventShake = 0;


//上传一张图片
function oneimage(url, callback){
  console.log("页面传过来上传的图片链接",url)
    var imageURL = ''; //多张图片地址，保存到一个数组当中
    new Promise(function (resolve, reject) {
      qiniuUploader.upload(url, (res) => {
            console.log("图片上传成功",res);
          imageURL = res.imageURL;
            resolve(imageURL);
        }, (error) => {
          reject('error');
          console.log('图片上传失败: ' + error);
        }, {
            region: 'NCN',
            uploadURL: 'https://up-z1.qiniup.com',
            domain: 'https://groupqiniu.luojiaming.vip/',
            uptokenURL: baseConfig.host + 'currency/qiniu',
          })
    }).then(function (imageURL) {
      // that.uploadtask(imgList)
      console.log("返回图片链接")
      callback(imageURL)
    })
}



//广告统计
function clickgdtadstatistics(e) {
  const nowTime = Date.now();
  if (nowTime - preventShake < 2000) {
    return
  }
  preventShake = nowTime;

  let data = e;
  let user_id = wx.getStorageSync('userdata').id || 0;
  data.user_id = user_id;
  request({
    service: 'business/gdtad/clickad',
    data: data,
    success: res => {
      console.log("点击广告统计返回", res)
    }
  })
}


module.exports = {
  oneimage: oneimage,
  clickgdtadstatistics: clickgdtadstatistics
}