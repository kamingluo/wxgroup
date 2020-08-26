const {
  request
} = require('./../../../utils/request.js');
const app = getApp();
Page({
  data: {
    num: 1,
    minusStatus: '',
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



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //console.log("任务操作页面",options)
    this.setData({
      crowd_id: options.crowd_id,
      crowd_name: options.crowd_name
    })
    this.havetaskdata()
    this.operationscore()
  },

  operationscore: function() {
    console.log("获取历史操作积分数值")
    let score = wx.getStorageSync('operationscore')
    if (score) {
      console.log("存在")
      this.setData({
        num: score,
      })
    } else {
      console.log("不存在")
      wx.setStorageSync('operationscore', 1)
      this.setData({
        num: 1,
      })

    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 拿任务数据
   */
  havetaskdata: function() {
    var that = this
    var crowd_id = that.data.crowd_id
    request({
      service: 'task/handletask/taskdetails',
      method: 'GET',
      data: {
        crowd_id: crowd_id
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
    var that = this
    wx.requestSubscribeMessage({
      tmplIds: ['zhWe1Om6o3IK-A7ruaJoGvrtshuD-H5Fg0UpMQrzseU'],
      success(res) {},
      complete() {
        that.setData({
          tasksuccessmodel: true
        })
      }
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

  inputnum:function(e){
    console.log("编辑任务通过分数", e.detail.value)
    this.setData({
      num: e.detail.value,
    })

  },

  //任务合格确定
  tasksuccesssure: function() {

    var that = this
    var crowd_id = that.data.crowd_id //群id
    var score = this.data.num //分数
    if(score < 1){
      wx.showToast({
        title: '分数错误',
        icon: 'none',
        duration: 1500,
      })
      return;
    }
    var id = this.data.taskdata.taskdetails.id //任务id
    var user_id = this.data.taskdata.taskdetails.user_id //提交任务用户id
    that.hidetasksuccessmodal()
    wx.setStorageSync('operationscore', score)
    that.setData({
      loadModal: true,
      num: score,
    })
    request({
      service: 'task/handletask/handletask',
      data: {
        id: id,
        crowd_id: crowd_id,
        score: score,
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
    var score = this.data.num //分数
    var id = this.data.taskdata.taskdetails.id //任务id
    var user_id = this.data.taskdata.taskdetails.user_id //提交任务用户id
    var result = this.data.taskerrtext //不合格说明
    request({
      service: 'task/handletask/handletask',
      data: {
        id: id,
        crowd_id: crowd_id,
        score: score,
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

  /*点击减号*/
  bindMinus: function() {
    var num = this.data.num;
    if (num >= 1) {
      num--;
    }
    var minusStatus = num >= 1 ? 'normal' : 'disable';
    this.setData({
      num: num,
      minusStatus: minusStatus
    })
  },
  /*点击加号*/
  bindPlus: function() {
    var num = this.data.num;
    num++;
    var minusStatus = num >= 1 ? 'normal' : 'disable';
    this.setData({
      num: num,
      minusStatus: minusStatus
    })
  },


  radioChange: function(e) {
    // console.log("点击单选", e.currentTarget.dataset.data)
    this.setData({
      taskerrtext: e.currentTarget.dataset.data,
    })
  },
})