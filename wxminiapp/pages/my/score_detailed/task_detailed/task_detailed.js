const {
  request
} = require('./../../../../utils/request.js');
const app = getApp();
Page({
  data: {
    num: 1,
    minusStatus: '',
    taskerrtext: "",
    taskdata: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
   
    this.havetaskdata(options.id)
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

  },

  /**
   * 拿任务数据
   */
  havetaskdata: function (id) {
    var that = this
    var id =id
    request({
      service: 'task/handletask/querytaskdetails',
      method: 'GET',
      data: {
        id: id
      },
      success: res => {
        console.log("这是id拿到的任务数据啊",res)
        that.setData({
          taskdata: res,
        })
      },
    })
  },

 

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})