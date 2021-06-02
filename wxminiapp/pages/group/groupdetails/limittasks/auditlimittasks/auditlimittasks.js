const {
  request
} = require('./../../../../../utils/request.js');
const app = getApp();
Page({
  data: {
    limit_id:null,
    limit_name:"限时任务名称",
    tasksuccessmodel: false,
    taskerrreasonmodel: false,
    taskerrtext: "其他",
    crowd_id: null,
    taskdata: null,
    loadModal: false,
    tankuang: false,
    taskimageurl: null
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //console.log("任务操作页面",options)
    this.setData({
      crowd_id: options.crowd_id,
      limit_id:options.limit_id,
      limit_name:options.title,
    })
    this.havetaskdata()
  },

  //图片点击事件
  clicktaskimage: function (event) {
    var src = event.currentTarget.dataset.data; //获取data-src
    var imgList = this.data.taskdata.taskdetails.images; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },

  /**
   * 拿任务数据
   */
  havetaskdata: function() {
    var that = this
    var crowd_id = that.data.crowd_id
    var limit_id = that.data.limit_id
    request({
      service: 'group/Handlelimittask/taskdetails',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
        limit_id:limit_id
      },
      success: res => {
        //console.log("这是拿到的任务数据啊",res)
        that.setData({
          taskdata: res,
          loadModal: false,
          tankuang: false,
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
    var id = this.data.taskdata.taskdetails.id //任务id
    that.hidetasksuccessmodal()
    that.setData({
      loadModal: true,
    })
    request({
      service: 'group/Handlelimittask/handletask',
      data: {
        id: id,
        crowd_id: crowd_id,
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
    var id = this.data.taskdata.taskdetails.id //任务id
    var result = this.data.taskerrtext //不合格说明
    request({
      service: 'group/Handlelimittask/handletask',
      data: {
        id: id,
        crowd_id: crowd_id,
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

  radioChange: function(e) {
    // console.log("点击单选", e.currentTarget.dataset.data)
    this.setData({
      taskerrtext: e.currentTarget.dataset.data,
    })
  },
})