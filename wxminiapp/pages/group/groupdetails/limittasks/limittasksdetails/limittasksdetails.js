const app = getApp()
const { resolveSoa } = require('node:dns');
const {
  request
} = require('./../../../../../utils/request.js');
Page({


  data: {
    crowd_id:null,
    limit_id:null,
    taskdetails:{},//任务详情
    taskdata:{},//任务数据
    partake:false,//用户是否可以参与任务
    message:""//用户不可参与时参考文案

  },

  onLoad: function (options) {
    this.setData({
      crowd_id: options.crowd_id,
      limit_id:options.id,
    })
  },

  //查询任务详情
  querydetails:function(){
    let limit_id=this.data.limit_id;
    var that=this
    request({
      service: 'group/limittask/details',
      data: {
        id:limit_id,
      },
      success: res => {
        let taskdetails=res.newsdetails;
        let taskdata=res.taskdata;
        that.setData({
          taskdetails: taskdetails,
          taskdata: taskdata,
        })
      },
    })
  },


  //查询用户是否可以参与任务
  userifpartake:function(){
    let limit_id=this.data.limit_id;
    var user_id = wx.getStorageSync('userdata').id;
    var that=this
    request({
      service: 'group/limittask/ifpartake',
      data: {
        limit_id:limit_id,
        user_id:user_id
      },
      success: res => {
        let partake=res.partake;
        let message=res.message;
        that.setData({
          partake: partake,
          message:message
        })
      },
    })
  }


})