const app = getApp()
const {
  request
} = require('./../../../../../utils/request.js');
Page({


  data: {
    crowd_id:null,
    limit_id:null,
    user_type:null,
    taskdetails:{},//任务详情
    taskdata:{},//任务数据
    partake:false,//用户是否可以参与任务
    message:""//用户不可参与时参考文案

  },

  onLoad: function (options) {
    console.log("进入任务详情携带参数",options)
    this.setData({
      crowd_id: options.crowd_id,
      limit_id:options.id,
      user_type:options.user_type,
    })
    
  },

  onShow:function(){
    this.querydetails()
    this.userifpartake()
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
        console.log("任务详情",res)
        let taskdetails=res.newsdetails;
        let taskdata=res.taskdata;
        that.setData({
          taskdetails: taskdetails,
          taskdata: taskdata,
        })
      },
    })
  },

  //复制发布新的限时任务
  editpush:function(){
    let data=this.data.taskdetails;
    wx.setStorageSync('limittasksdetails', data)
    wx.navigateTo({
      url: '/pages/group/groupdetails/limittasks/pushlimittasks/pushlimittasks' + '?crowd_id=' + this.data.crowd_id,
    })

  },

    //发布限时任务
    pushlimittask: function () {
      wx.navigateTo({
        url: '/pages/group/groupdetails/limittasks/pushlimittasks/pushlimittasks' + '?crowd_id=' + this.data.crowd_id + '&crowd_name=' + this.data.crowddata.groupdata.crowd_name,
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
        console.log("是否可以参与任务",res)
        let partake=res.partake;
        let message=res.message;
        that.setData({
          partake: partake,
          message:message
        })
      },
    })
  },

  //跳转提交限时任务
  userpushlimittask:function(){
    let limit_id=this.data.limit_id;
    let crowd_id=this.data.crowd_id;

    wx.navigateTo({
      url: '/pages/group/groupdetails/limittasks/submittasks/submittasks?limit_id=' + limit_id + '&crowd_id=' + crowd_id
    })

  },


})