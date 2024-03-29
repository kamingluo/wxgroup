const {
  request
} = require('./../../../utils/request.js');
const common = require('./../../../utils/common.js') //公共函数
const baseConfig = require('./../../../utils/config.js')//配置文件
const app = getApp();
let preventShake = 0;
let interstitialAd = null; //插屏广告


Page({
  data: {
    imageurl:'',
    tabSelect: 0,
    model: false,
    signinrankinglist:[],//签到排行榜
    pages: 1,//默认第一页
    count: 0,
    modeltips:"群记分小程序提供技术支持",
    banneradshow:true,
    siginnum:0,
    userranking:0,
    adtype: null,
    ifgroupvip:false,
    ifadspecialshow:false,
    kaming:false


  },
  onLoad: function(e) {
    let imageurl=baseConfig.imageurl;
    let user_id = wx.getStorageSync('userdata').id;
    let avatarUrl = wx.getStorageSync('userdata').avatarUrl;
    let nickName = wx.getStorageSync('userdata').nickName;
    let ifgroupvip = wx.getStorageSync('ifgroupvip') || false;
    let ifadspecialshow = wx.getStorageSync('ifadspecialshow') || false;//强制显示广告
    this.setData({
      imageurl:imageurl,
      crowd_id: e.crowd_id,
      crowd_name: e.crowd_name,
      user_type:e.user_type,
      user_id: user_id,
      avatarUrl: avatarUrl,
      nickName: nickName,
      ifgroupvip: ifgroupvip,
      ifadspecialshow: ifadspecialshow
    })


    this.gdtinsertad()//加载插屏广告
    this.havetime() //当前时间获取
    this.usersigindata() //用户的签到数据
    this.todaywhethersignin() //签到配置
    this.signinrankinglist(1)//签到排行榜
    this.userranking()//用户当日排行和总签到数

  },


  onShow: function () {
    let adtype = wx.getStorageSync('todayclickad').adtype || 5;
    console.log("拿到的广告类型", adtype)
    this.setData({
      adtype: adtype,
    })
  },


  //签到排行
  signinrankinglist: function (pages) {
    var that=this
    let crowd_id = this.data.crowd_id
    request({
      service: 'group/signin/newsigninrankinglist',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
        pages: pages
      },
      success: res => {
        console.log("签到排行榜",res)
        let signinrankinglist = that.data.signinrankinglist;
        var newsigninrankinglist = [...signinrankinglist, ...res.data];
        that.setData({
          signinrankinglist: newsigninrankinglist,
          count: res.count,
        })
      },
    })
  },

  //刷新排行榜
  refreshsigninrankinglist: function () {
    var that = this
    let crowd_id = this.data.crowd_id
    request({
      service: 'group/signin/newsigninrankinglist',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
        pages: 1
      },
      success: res => {
        console.log("签到排行榜", res)
        that.setData({
          signinrankinglist: res.data,
          count: res.count,
          pages:1
        })
      },
    })
  },

  //查询用户的签到数据
  usersigindata: function() {
    let crowd_id = this.data.crowd_id
    let user_id = wx.getStorageSync('userdata').id
    request({
      service: 'group/signin/queryusersigindata',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
        user_id: user_id,
      },
      success: res => {
        console.log(res)
        this.setData({
          usersigindata: res.usersigindata, //用户的签到数据
        })
      }
    })

  },

  //检查今天是否还能签到
  todaywhethersignin: function() {
    let crowd_id = this.data.crowd_id
    let user_id = wx.getStorageSync('userdata').id
    request({
      service: 'group/signin/todaywhethersignin',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
        user_id: user_id,
      },
      success: res => {
        //console.log("今天是否能签到查询")
        console.log(res)
        this.setData({
          signindata: res.signindata, //签到配置数据
          todaywhethersignin: res.ifsignin, //是否能签到
          modeltips:res.modeltips,
          viewdata: res.viewdata, //群员是否能看数据
          adconfig: res.adconfig //签到弹框广告配置
        })
      }
    })
  },

  //检查今天是否还能签到
  userranking: function() {
    let crowd_id = this.data.crowd_id
    let user_id = wx.getStorageSync('userdata').id
    request({
      service: 'group/signin/userranking',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
        user_id: user_id,
      },
      success: res => {
        //console.log("今天是否能签到查询")
        console.log(res)
        this.setData({
          siginnum: res.siginnum,
          userranking: res.userranking,
        })
      }
    })
  },


  //用户签到
  usersignin: function() {
    const nowTime = Date.now();
    if (nowTime - preventShake < 2000) {
      return
    }
    preventShake = nowTime;

    var that = this
    let crowd_id = this.data.crowd_id
    let user_id = wx.getStorageSync('userdata').id
    request({
      service: 'group/signin/usersignin',
      data: {
        crowd_id: crowd_id,
        user_id: user_id,
      },
      success: res => {
        console.log("签到成功", res)
        // wx.showToast({
        //   title: '签到成功',
        //   icon: 'success',
        //   duration: 2000,
        // })
        that.setData({
          todaywhethersignin: false, //是否能签到
          model: true, //签到弹框
          new_continuity_number: res.new_continuity_number, //连续签到天数
          new_all_signin_number: res.new_all_signin_number, //累计签到天数
          ranking: res.ranking, //排名
        })

        that.kaming()//点击广告提示动画

        that.refreshsigninrankinglist()//刷新一下排行榜
        that.usersigindata() //刷新一下首页数据
        this.userranking()//刷新用户当日排行和总签到数
      },
      fail: res => {
        console.log("签到失败", res)
      },
    })
  },

//跳动动画
  kaming:function(){
    var that=this
    setTimeout(function() {
      that.setData({
        kaming: false
      })
      //console.log("关闭动画")
    }, 1200)
    setTimeout(function() {
      that.setData({
        kaming: true
      })
      that.kaming()
     //console.log("开启动画")
    }, 1200)
  },

  completesigin: function() {
    wx.showToast({
      title: '你今天已经签到过了，请明天再来！',
      icon: 'none',
      duration: 2500,
    })

  },

  jumpsignindata: function() {
    let crowd_id = this.data.crowd_id
    let user_type = this.data.user_type
    wx.navigateTo({
      url: '/pages/group/signdata/signdata?crowd_id=' + crowd_id + '&user_type=' + user_type,
    })
  },



  //当前时间获取
  havetime: function() {
    let date = new Date();
    let year = date.getFullYear(); //获取完整的年份(4位)
    let day = date.getDate(); //获取日期
    let month = date.toDateString().split(" ")[1];
    this.setData({
      year: year,
      day: day,
      month: month
    })
    // console.log(year, day, month)

  },

  //点击广告统计
  gdtbanneradclick: function(e) {
    console.log("点击banner广告'")
    let data = {
      'adtype': 1,
      'position': "签到页面"
    };
    common.clickgdtadstatistics(data)
  },

  
  //点击模板广告统计
  gdtcustomadclick:function(){
    console.log("点击模板广告'")
    let data = {
      'adtype': 5,
      'position': "签到页面"
    };
    common.clickgdtadstatistics(data)

  },

  //选择签到记录
  selectsigindata: function() {
    this.setData({
      tabSelect: 0
    })
  },

  //选择跳转商品兑换
  selectgoodslist: function() {
    let crowd_id = this.data.crowd_id
    let crowd_name = this.data.crowd_name
    wx.navigateTo({
      url: '/pages/group/goods/goodslist/goodslist?user_type=0&crowd_id=' + crowd_id + '&crowd_name=' + crowd_name,
    })
  },
  //选择规则说明
  selectrule: function() {
    this.setData({
      tabSelect: 2
    })
  },

  //关闭弹框
  hideModal: function() {
    this.setData({
      model: false
    })
  },
  //展示弹框
  showModal: function() {
    this.setData({
      model: true
    })
  },

  //点击弹框广告
  clickmodelad: function() {
    common.insidejump(this.data.adconfig)
  },

  //广告加载成功或者失败展示交互
  banneradsuccess: function () {
    console.log("签到页面banner广告加载成功")
    this.setData({
      banneradshow: true
    })
  },
  banneraderr: function () {
    console.log("签到页面banner广告加载失败")
    this.setData({
      banneradshow: false
    })
  },

 //点击视频广告统计
  gdtvideoadclick: function (e) {
    let data = {
      'adtype': 4,
      'position': "签到页面"
    };
    common.clickgdtadstatistics(data)
  },


  //加载插屏广告
  gdtinsertad: function () {
    let ifgroupvip = wx.getStorageSync('ifgroupvip') || false;
    if (ifgroupvip) {
      console.log("vip群成员，不显示插屏广告")
      return;
    }
    let nowTime = Date.now();
    let insertadshowtime = wx.getStorageSync('insertadshowtime') || 0;
    if (nowTime - insertadshowtime < 7200000) {
      console.log("时间未到不展示广告")
      return;
    }

    console.log("不执行插屏广告")
    return;


    var that = this;
    console.log("加载插屏广告")
    var insertad = 'adunit-b8955104700af731';
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
          'position': "签到页面"
        };
        common.clickgdtadstatistics(gdtdata)
        //显示成功修改一下广告展示时间
        let nowTime = Date.now();
        wx.setStorageSync('insertadshowtime', nowTime)
      } else {
        console.log("插屏广告显示失败")
      }
    }, 500);
  },

  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    var that = this
    var count = that.data.count;//拿到总数
    var pages = that.data.pages;
    if (pages * 10 >= count) {
      return;
    }
    else {
      let newpages = pages + 1;
      that.setData({
        pages: newpages
      })
      that.signinrankinglist(newpages)
    }

  },


})