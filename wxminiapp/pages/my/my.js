
const app = getApp()

const {
  request
} = require('./../../utils/request.js');
const {
  share
} = require('./../../utils/share.js');
const common = require('./../../utils/common.js') //公共函数
const baseConfig = require('./../../utils/config.js')//配置文件
let interstitialAd = null; //插屏广告


Page({
  data: {
    userdata:{},//用户信息
    imageurl:'https://group.gzywudao.top/php/public/',//默认图片链接
    xiaouad:[],//小U广告数据
    xiaouadtitle:"社群工具推荐",
    moredatatitle:"更多推荐",
    moredata:[],//更多工具数据
    vipdisplay:false,
    condition:1,//会员开通情况，0是已经开通且有效，1是未开通过，2是已经过期
    end_time:"",//会员结束时间
    

  },
  onLoad: function (e) {
    let imageurl = baseConfig.imageurl;
    this.setData({
      imageurl: imageurl,
    })

    this.gdtinsertad()//加载插屏广告
    this.havexiaouad()
    this.havemoredata()
  },
  onShow: function () {
    this.userdata()
    this.queryuservipdata()
  },


//查询用户的vip信息
  queryuservipdata:function(){
    let user_id = wx.getStorageSync('userdata').id;
    request({
      service: '/vip/uservipdata',
      data: {
        user_id:user_id
      },
      success: res => {
        console.log("查询用户会员情况",res)
        this.setData({
          condition: res.condition,
          end_time:res.end_time
        })
      },
    })
  },


   //用户地址
   myaddress:function(){
    wx.navigateTo({
      url: '/pages/my/my_address/my_address'
    })
  },

  ceshipage:function(){
    wx.navigateTo({
      url: '/pages/test/test'
    })
  },

  haveuserid:function(){
    let user_id = wx.getStorageSync('userdata').id;
      wx.showToast({
        title: '用户id:' + user_id,
        icon: 'none',
        duration: 2000,
      })
  },


  //用户空间任务记录
  usertasklist:function(){
    wx.navigateTo({
      url: '/pages/my/score_detailed/score_detailed'
    })
  },

  //跳转兑换记录页面
  exchangelist:function(){
    wx.navigateTo({
      url: '/pages/my/exchangelist/exchangelist'
    })
  },

  lotterylist:function(){
    wx.navigateTo({
      url: '/pages/my/lotterylist/lotterylist'
    })
  },

  shuoming:function(){
    let jumpurl=encodeURIComponent("https://qing.utaojs.com/app/index.php?i=3&c=entry&m=zk_jqmanual&do=Home&ClassID=1&wxref=mp.weixin.qq.com&from=groupmessage")
    console.log("--------------------")
    console.log(jumpurl)
    
    wx.navigateTo({
      url: '/pages/webview/webview?url=' +jumpurl
    })
  },

  orderlist: function () {
    wx.navigateTo({
      url: '/pages/my/orderlists/orderlists'
    })

  },

  openvip:function(){
    wx.navigateTo({
      url: '/pages/members/openvip/openvip'
    })

  },

    //点击小U广告和更多跳转
    clickjump: function (e) {
      let type=e.currentTarget.dataset.data.type;
      if(type=='kefu' || type=='jianyi'){
        console.log("不跳转")
        return;
      }
      console.log("点击轮播图",e)
      common.insidejump(e.currentTarget.dataset.data)
    },


  //获取小U广告
  havexiaouad:function(){
    request({
      service: 'appdata/my/xiaouad',
      data: {},
      success: res => {
        this.setData({
          xiaouad: res.data,
          xiaouadtitle: res.xiaouadtitle,
        })
      },
    })
  },

   //获取下面更多数据
   havemoredata:function(){
    request({
      service: 'appdata/my/moredata',
      data: {},
      success: res => {
        this.setData({
          moredata: res.moredata,
          moredatatitle:res.moredatatitle,
          vipdisplay:res.vipdisplay
        })
      },
    })
  },

  //获取用户信息
  userdata:function(){
    wx.login({
      success: res => {
        request({
          service: 'user/userdata',
          data: {
            code: res.code,
          },
          success: res => {
            // this.birthday(res.userdata.birthday)
            this.setData({
              userdata: res.userdata,
            })
            wx.setStorageSync('userdata', res.userdata)
          },
        })
      }
    })

  },

  mobanadclick: function (e) {
    let data={
      'adtype':5,
      'position':"我的页面"
    };
    common.clickgdtadstatistics(data)
  },

//点击小盟广告
  clickxmad:function(e){
    // console.log("点击小盟广告携带页面参数", e)
    let position=e.currentTarget.dataset.position;
    wx.setStorageSync("xmclickposition", position)
  },

  
  //加载插屏广告
  gdtinsertad: function () {
    var that=this;
    console.log("加载插屏广告")
    var insertad ='adunit-b8955104700af731';
    console.log("插屏广告代码", insertad)
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: insertad
      })
      interstitialAd.onLoad((e) => {
        console.log('插屏广告加载onLoad event emit', e)
      })
      interstitialAd.onError((err) => {
        console.log('插屏广告错误onError event emit', err)
      })
      interstitialAd.onClose((res) => {
        console.log('插屏广告被关闭onClose event emit', res)
      })
    }

    setTimeout(function () {
      that.onshowgdtinsertad()
    }, 2000);


  },

  //显示插屏广告
  onshowgdtinsertad: function () {
    var state = 0;
    interstitialAd.show((res) => {
      console.log("插屏广告展示成功", res)
    }).catch((err) => {
      console.error("插屏广告错误啦", err)
      state = 1;
    })
    setTimeout(function () {
      if (state == 0) {
        console.log("插屏广告显示成功")
        let gdtdata = {
          'adtype': 7,
          'position': "我的页面"
        };
        common.clickgdtadstatistics(gdtdata)
      } else {
        console.log("插屏广告显示失败")
      }
    }, 500);
  },




  onShareAppMessage: function (options) {
    return share();
  }
})