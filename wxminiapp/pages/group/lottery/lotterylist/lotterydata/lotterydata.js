const app = getApp()
const {
  request
} = require('./../../../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadModal:false,
    deletemodel:false,
    openlotterymodel: false,
    sendmodel:false,
    lottery_id:null,
    crowd_id:null,
    allcount:null,
    topuser:[],
    prizeuserlist:[],
    lotterydata: null,
    sendid:null,
    sendindex:null,
  },

  onLoad: function (options) {
    //查询该群发布的所有抽奖活动
    // let crowd_id = options.crowd_id;
    // let lottery_id = options.lottery_id;
    this.setData({
      lottery_id: options.lottery_id,//抽奖id
      crowd_id: options.crowd_id,
    })
    this.lotterydetails()

  },

//查询一个活动的详细信息
  lotterydetails:function(){
    let lottery_id = this.data.lottery_id;
    request({
      service: 'group/lottery/lotterydetails',
      method: 'GET',
      data: {
        lottery_id: lottery_id,
      },
      success: res => {
        this.setData({
          lotterydata: res.data,
          allcount: res.allcount,
          topuser: res.topuser,
        })
        if (res.data.state == 1){
          this.prizeuserlist()//已经开奖就查询一下中奖列表
        } 
        this.hideModal()//关闭
      }
    })
  },

  
  //查询活动中所有的中奖用户
  prizeuserlist:function(){
    let lottery_id = this.data.lottery_id;
    request({
      service: 'group/lottery/prizeuserlist',
      method: 'GET',
      data: {
        lottery_id: lottery_id,
      },
      success: res => {
        this.setData({
          prizeuserlist: res.data
        })
      }
    })
  },

  seeall:function(){
    let lottery_id = this.data.lottery_id;
    wx.navigateTo({
      url: '/pages/group/lottery/partakedata/partakedata?lottery_id=' + lottery_id,
    })

  },

  hideModal:function(){
    this.setData({
      loadModal: false,
      deletemodel: false,
      openlotterymodel: false,
      sendmodel:false,
    })
  },



  //马上开奖
  openlottery:function(){
    if(this.data.allcount < 1){
      wx.showToast({
        title: '没用户参与不能开奖',
        icon: 'none',
        duration: 2000,
      })
      return;

    }

    this.setData({
      openlotterymodel: true,
    })

  },
  //确认马上开奖
  confirmopenlottery:function(){
    var that=this
    that.setData({
      loadModal: true,
      openlotterymodel: false,
    })
    let lottery_id = that.data.lottery_id;
    request({
      service: 'group/openlottery/manual',
      method: 'GET',
      data: {
        lottery_id: lottery_id,
      },
      success: res => {
        that.lotterydetails() //开奖成功刷新一下信息
      }
    })
  },

  
  //删除群抽奖
  deletelottery:function(){
    this.setData({
      deletemodel: true,
    })
  },

  confirmdelete:function(){
    var that = this
    let lottery_id = this.data.lottery_id;
    this.setData({
      deletemodel: false,
      loadModal:true
    })
    request({
      service: 'group/lottery/deletelottery',
      method: 'GET',
      data: {
        id: lottery_id,
      },
      success: res => {
        that.setData({
          deletemodel: false,
        })
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 2000,
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1500) 
      }
    })


  },

  send:function(e){
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    this.setData({
      sendid: id,
      sendindex: index,
      sendmodel:true,
    })

  },

  //标记为发奖
  confirmsend:function(e){
    console.log(e)
    let id =this.data.sendid;
    let index = this.data.sendindex;
    let data = this.data.prizeuserlist;
    data[index].send =0;
    console.log(data)
    this.setData({
      prizeuserlist: data,
      sendmodel:false,
    })
    request({
      service: 'group/lottery/handlelotteryuser',
      method: 'GET',
      data: {
        partake_id: id,
      },
      success: res => {
        console.log("处理成功",res)
      }
    })
  },




})