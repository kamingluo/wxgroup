// pages/groupdetails/groupdetails.js
const {
  request
} = require('./../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icondata:[],
    adminicon:[],
    usertype:false,
    btns: ["群消息", "群成员"],
    active: 0,//控制当前显示盒子 
    isCard: false,
    groupnewslist:null,
    user_type:null,
    crowddata: null,
    crowd_id:null,
    score: 0,
    deletenewsid:null,
    deletenewsmodel: false,
    introducemodel: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("跳转携带过来的参数", options)
    if (options.user_type == 1 || options.user_type == 2 ){
      this.setData({
        user_type: options.user_type,
        score: options.score,
        usertype:true,
        crowd_id: options.id
      })
    }
    else{
      this.setData({
        score: options.score,
        user_type: options.user_type,
        crowd_id: options.id
      })
    }
    this.incondata()
    this.groupdata(options.id)
    
  },

  showcrowdid:function(){
    let user_type=this.data.user_type;
    let crowd_id = this.data.crowd_id
    if (user_type == 1){
      wx.showToast({
        title: "群Id:" + crowd_id,
        icon: 'none',
        duration: 2500,
      })
    }
   return;
  },

  incondata:function(){
    let icondata=[
      {
        id: 1,
        imagesurl: "http://qiniu.luojiaming.vip/image/group/icon/uptask.png",
        text: "提交任务",
        joumurl: '/pages/group/uptask/uptask'
      },
      {
        id: 2,
        imagesurl: "http://qiniu.luojiaming.vip/image/group/icon/exchangegoods2.png",
        text: "兑换商品",
        joumurl: '/pages/group/goods/goodslist/goodslist'
      },
      {
        id: 3,
        imagesurl: "http://qiniu.luojiaming.vip/image/group/icon/tasklist.png",
        text: "任务记录",
        joumurl: '/pages/group/groupdetails/tasklist/tasklist'
      },
      {
        id: 4,
        imagesurl: "http://qiniu.luojiaming.vip/image/group/icon/exchangelist.png",
        text: "积分记录",
        joumurl: '/pages/group/groupdetails/scorelist/scorelist'
      },
      {
        id: 5,
        imagesurl: "https://groupqiniu.luojiaming.vip/%2Fimage%2Fgroup%2Ficon%2Fnewshuoming.png",
        text: "群说明",
        joumurl: 666
      }
    ];

    let adminicon = [
      {
        id: 1,
        imagesurl: "http://qiniu.luojiaming.vip/image/group/icon/scorelist.png",
        text: "处理兑换",
        joumurl: '/pages/group/groupdetails/exchangelist/exchangelist'
      },
      {
        id: 2,
        imagesurl: "http://qiniu.luojiaming.vip/image/group/icon/audittasks.png",
        text: "任务审核",
        joumurl: '/pages/group/audittasks/audittasks'
      },
      {
        id: 3,
        imagesurl: "https://groupqiniu.luojiaming.vip/%2Fimage%2Fgroup%2Ficon%2Falltasklists.png",
        text: "全部任务",
        joumurl: '/pages/group/alltasklists/alltasklists'
      },
      {
        id: 4,
        imagesurl: "http://qiniu.luojiaming.vip/image/group/icon/pushnews.png",
        text: "发布消息",
        joumurl: '/pages/group/pushnews/pushnews'
      },
      {
        id: 5,
        imagesurl: "http://qiniu.luojiaming.vip/image/group/icon/useroperation1.png",
        text: "用户管理",
        joumurl: '/pages/group/user/user'
      },
    ];


    this.setData({
      icondata: icondata,
      adminicon: adminicon
    })

  },

  groupdata:function(crowd_id){
    request({
      service: 'group/groupinformation/groupdetails',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
      },
      success: res => {
        this.setData({
          crowddata: res,
        })
      }
    })
  },


  groupnewslist: function (crowd_id) {
    request({
      service: 'group/groupnews/groupnewslist',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
        pages:1
      },
      success: res => {
        console.log("----------------------")
        console.log(res)
        this.setData({
          groupnewslist: res.data,
        })
      }
    })
  },



  toggle: function (e) {
   // console.log(e.currentTarget.dataset.index)
      this.setData({
        //设置active的值为用户点击按钮的索引值
        active: e.currentTarget.dataset.index,
      })

  },



  clickicon:function(e){
    
    console.log("点击icon", e.currentTarget.dataset.data.joumurl)
    let joumurl = e.currentTarget.dataset.data.joumurl

    if (joumurl ==666){
      //多加一个，展示群说明
      this.setData({
        introducemodel: true,
      })
      return;
    }


    let crowd_id = this.data.crowddata.groupdata.id
    let crowd_name = this.data.crowddata.groupdata.crowd_name
    let user_type = this.data.user_type
    wx.navigateTo({
      url: joumurl + '?crowd_id=' + crowd_id + '&user_type=' + user_type + '&crowd_name=' + crowd_name,
    })
  },



  clicknewslist:function(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/group/newsdetailed/newsdetailed' + '?id=' + e.currentTarget.dataset.id ,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let id = this.data.crowd_id
    this.groupnewslist(id)
  },



  qrcode: function () {
    wx.navigateTo({
      url: '/pages/group/qrcode/qrcode' + '?crowd_id=' + this.data.crowd_id + '&crowd_name=' + this.data.crowddata.groupdata.crowd_name,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  deletenews:function(e){
    console.log(e.currentTarget.dataset.id)
    this.setData({
      deletenewsid: e.currentTarget.dataset.id,
      deletenewsmodel: true,
    })

  },

  hideModal:function(){
    this.setData({
      deletenewsmodel: false,
      introducemodel:false,
    })
  },

  showintroducemodel:function(){
    this.setData({
      introducemodel: true,
    })
  },

  confirmdeletenews:function(){
    var that=this
    var deletenewsid = that.data.deletenewsid
    var crowd_id = that.data.crowd_id
    request({
      service: 'group/groupnews/clearnews',
      method: 'GET',
      data: {
        id: deletenewsid,
      },
      success: res => {
        console.log("删除消息成功",res)
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000,
        })
        that.setData({
          deletenewsmodel: false,
        })
        that.groupnewslist(crowd_id)
      }
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   * pages/index/index?channel=1000&ald_media_id=26447&ald_link_key=6f92ad04b6256d10
   */
  onShareAppMessage: function () {
    let userchannel = wx.getStorageSync('userdata').channel
    let nickName = wx.getStorageSync('userdata').nickName
    let crowd_id = this.data.crowd_id
    let crowd_name = this.data.crowddata.groupdata.crowd_name
    return {
      title: nickName + "邀请你加入群" + "《" + crowd_name + "》",
      desc: nickName + "邀请你加入群" + "《" + crowd_name + "》",
      imageUrl: 'http://588ku.izihun.com/element_origin_min_pic/18/07/07/f7c2df27ff4d14cd4bb92054ff1dad3e.jpg%21/fw/820/quality/100/unsharp/true/compress/true/format/jpeg',
      path: '/pages/index/index?channel=1001&ald_media_id=33542&ald_link_key=c99244f0802f9f06' +  '&crowd_id=' + crowd_id, // 路径，传递参数到指定页面。
    }

  }
})