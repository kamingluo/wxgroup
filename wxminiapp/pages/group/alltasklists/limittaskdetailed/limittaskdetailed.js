const app = getApp()
const {
  request
} = require('./../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskdetails:{},
    tasksuccessmodel: false,
    taskerrreasonmodel: false,
    taskerrtext: "其他",
    crowd_id: null,
    crowd_name: null,
    taskdata: null,
    loadModal: false,
    tankuang: false,
    taskimageurl: null

  },

  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    this.havetaskdata()
  },



   /**
   * 拿任务详情数据
   */
  havetaskdata: function() {
    var that = this
    var id = that.data.id
    request({
      service: 'group/handlelimittask/querytaskdetails',
      method: 'GET',
      data: {
        id: id
      },
      success: res => {
        console.log("这是拿到的任务数据啊",res)
        that.setData({
          taskdetails: res.taskdetails,
          crowd_id:res.taskdetails.crowd_id,
          loadModal:false
        })
      },
    })
  },

   /**
   * 点击任务合格按钮
   */
  tasksuccess: function() {
    this.setData({
      tasksuccessmodel: true
    })
  },

  /**
   * 点击任务不合格按钮
   */
  taskerr: function() {
    this.setData({
      taskerrreasonmodel: true
    })
  },

  hidetasksuccessmodal: function() {
    this.setData({
      tasksuccessmodel: false
    })
  },

  hidetaskerrmodal: function() {
    this.setData({
      taskerrreasonmodel: false
    })
  },

  closetankuang: function() {
    this.setData({
      tankuang: false
    })
  },

  //任务合格确定
  tasksuccesssure: function() {

    var that = this
    var crowd_id = that.data.crowd_id //群id
    var id = this.data.taskdetails.id //任务id
    var user_id = this.data.taskdetails.user_id //提交任务用户id
    that.hidetasksuccessmodal()
    that.setData({
      loadModal: true,
    })
    request({
      service: 'group/handlelimittask/handletask',
      data: {
        id: id,
        crowd_id: crowd_id,
        user_id: user_id,
        result: "任务合格",
        taskstate: 1,
      },
      success: res => {
        console.log("任务合格返回", res)
        that.audittasks()
        that.havetaskdata()
      },
    })

  },


  //任务不合格确定
  taskerrsure: function() {
    this.hidetaskerrmodal()
    this.setData({
      loadModal: true
    })
    var that = this
    var crowd_id = that.data.crowd_id //群id
    var id = this.data.taskdetails.id //任务id
    var user_id = this.data.taskdetails.user_id //提交任务用户id
    var result = this.data.taskerrtext //不合格说明
    request({
      service: 'group/handlelimittask/handletask',
      data: {
        id: id,
        crowd_id: crowd_id,
        user_id: user_id,
        taskstate: 2,
        result: result
      },
      success: res => {
        console.log("任务不合格返回", res)
        that.audittasks()
        that.havetaskdata()
      },
    })

  },

  audittasks: function() {
    wx.showToast({
      title: '审核完成',
      icon: 'success',
      duration: 1500,
    })

  },


  clicktaskimage: function(e) {
    console.log(e.currentTarget.dataset.data)
    this.setData({
      tankuang: true,
      taskimageurl: e.currentTarget.dataset.data
    })

  },



  radioChange: function(e) {
    // console.log("点击单选", e.currentTarget.dataset.data)
    this.setData({
      taskerrtext: e.currentTarget.dataset.data,
    })
  },




  
})