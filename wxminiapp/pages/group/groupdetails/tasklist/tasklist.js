// pages/my/exchange_detailed/exchange_detailed.js
const app = getApp()
const {
  request
} = require('./../../../../utils/request.js');
const common = require('./../../../../utils/common.js') //公共函数
let interstitialAd = null; //插屏广告

Page({

  /**
   * 页面的初始数据
   */
  data: {
    usertasklist: [],
    loadModal: true,
    crowd_id: null,
    deteleid: null,
    deteleModal: false,
    detelelimittasksid: null,
    detelelimittasksModal: false,
    pages: 1,
    count: 0,
    TabCur: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      crowd_id: options.crowd_id,
    })
    
    this.gdtinsertad() //加载插屏广告
    this.havetasklist(1)
  },


  tabSelect(e) {
    let id=e.currentTarget.dataset.id;
    this.setData({
      TabCur: id,
      usertasklist:[],
      count:0,
      loadModal:true

    })
    this.havetasklist(1)

    console.log("切换tab",id)
  },


  havetasklist: function (pages){
    var that=this
    var user_id = wx.getStorageSync('userdata').id
    var crowd_id = this.data.crowd_id
    let service='group/limittask/usertasklist'
    if(this.data.TabCur==0){
       service='group/userdata/usergrouptasklist'
    }
    request({
      service: service,
      data: {
        pages: pages,
        user_id: user_id,
        crowd_id: crowd_id
      },
      success: res => {
        let usertasklist = this.data.usertasklist;
        var newusertasklist = [...usertasklist, ...res.usertasklist];
        that.setData({
          usertasklist: newusertasklist,
          count: res.count,
          loadModal: false,
        })
      },
    })


  },

  clicktasklist: function(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/my/score_detailed/task_detailed/task_detailed?id=' + e.currentTarget.dataset.id
    })
  },

  clicklimittasklist: function(e) {
    console.log("限时任务")
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/my/score_detailed/limit_task_detailed/limit_task_detailed?id=' + e.currentTarget.dataset.id
    })
  },

  deletemode: function(e) {
    console.log("删除id", e.currentTarget.dataset.id)
    this.setData({
      deteleid: e.currentTarget.dataset.id,
      deteleModal: true,
    })

  },


  deletelimittasksmode:function(e){
    console.log("删除限时任务id", e.currentTarget.dataset.id)
    this.setData({
      detelelimittasksid: e.currentTarget.dataset.id,
      detelelimittasksModal: true,
    })
  },

  hideModal: function() {
    this.setData({
      deteleModal: false,
      detelelimittasksModal:false,
    })
  },



  //确认删除普通任务
  confirmdel: function() {
    var that=this
    let task_id = this.data.deteleid;
    let crowd_id = this.data.crowd_id;
    let user_id = wx.getStorageSync('userdata').id
    request({
      service: 'task/usertask/deletetask',
      data: {
        user_id: user_id,
        crowd_id: crowd_id,
        task_id: task_id
      },
      success: res => {
        that.setData({
          deteleModal: false,
          pages:1,
          usertasklist: []
        })
        that.havetasklist(1)
      },
    })

  },


    //用户确认删除限时任务
    confirlimittasksmdel: function() {
      var that=this
      let task_id = this.data.detelelimittasksid;
      let crowd_id = this.data.crowd_id;
      let user_id = wx.getStorageSync('userdata').id
      console.log("-----------------------")
      console.log(task_id)
      console.log(user_id)
      console.log(crowd_id)
      console.log("-----------------------")
      request({
        service: 'group/limittask/userdeletelimittask',
        data: {
          user_id: user_id,
          crowd_id: crowd_id,
          id: task_id
        },
        success: res => {
          that.setData({
            detelelimittasksModal: false,
            pages:1,
            usertasklist: []
          })
          that.havetasklist(1)
        },
      })
  
    },

  gdtvideoadclick: function(e) {
    let data = {
      'adtype': 4,
      'position': "群任务记录页面"
    };
    common.clickgdtadstatistics(data)
  },

  //加载插屏广告
  gdtinsertad: function() {
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
    var insertad = 'adunit-547d5780f1b444d9';
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

    setTimeout(function() {
      that.onshowgdtinsertad()
    }, 2000);


  },

  //点击banner广告
  gdtbannerclick:function(){
    let data={
      'adtype':1,
      'position':"任务记录页面"
    };
    common.clickgdtadstatistics(data)
  },

  //显示插屏广告
  onshowgdtinsertad: function() {
    var state = 0;
    interstitialAd.show((res) => {
      console.log("插屏广告展示成功", res)
    }).catch((err) => {
      console.error("插屏广告错误啦", err)
      state = 1;
    })
    setTimeout(function() {
      if (state == 0) {
        console.log("插屏广告显示成功")
        let gdtdata = {
          'adtype': 7,
          'position': "群任务记录页面"
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
    if (pages * 20 >= count) {
      return;
      console.log("达到数量，不加载")
    }
    else {
      let newpages = pages + 1;
      that.setData({
        pages: newpages
      })
      that.havetasklist(newpages)
    }
  }


})