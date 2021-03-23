
const {
  request
} = require('./../../../../utils/request.js');
const app = getApp();
let preventShake = 0;

Page({

  data: {
    role:0,//角色
    model:false,
    minusStatus: '',
    crowd_id:null,
    user_id:'',
    userdata:null,
    birthday:'',
    num:'',
    userscore:'',
    deletegroupusermodel: false,
    remarksmodal:false,
    remarksValue:null,
    zengjia: true,
    jianshao: false,
    state: 0,
    remarktext: "",
    operationscore:1,
    adminnot:true//是管理员但是不给权限的群


  },

  onLoad: function (options) {
    this.setData({
      role: options.role,
      crowd_id: options.crowd_id,
      user_id: options.user_id,
    })


    this.userdata(options.role, options.crowd_id)
    this.adminnot(options.role, options.crowd_id)

  },

  adminnot: function (role, crowd_id){
    if (role == 2 && crowd_id == 786 || crowd_id == 127 || crowd_id == 1488 || crowd_id == 1489 ){
      console.log("是管理员但是不给权限")
      this.setData({
        adminnot:false
      })
    }

  },





  userdata: function (e) {
    var that = this
    var crowd_id = this.data.crowd_id
    var user_id = this.data.user_id
    request({
      service: 'group/handlegroup/querygroupuserdata',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
        user_id: user_id,
      },
      success: res => {
        that.setData({
          userdata: res.querygroupuserdata[0],
          num: res.querygroupuserdata[0].score,
          userscore:res.querygroupuserdata[0].score,
        })
        that.birthday(res.querygroupuserdata[0].birthday)
      },
    })

  },



  birthday: function (e) {
    if (e) {
      var shijian = e.replace(/\.|\-/g, '/')
      var temp = new Date(shijian);
      var t = temp.getFullYear() + "-" + (temp.getMonth() + 1) + "-" + temp.getDate(); //去除时分秒
      this.setData({
        birthday: t,
      })
    }

  },

  querytasklist:function(){
    wx.navigateTo({
      url: '/pages/group/user/userdetailed/usertasklist/usertasklist?crowd_id=' + this.data.crowd_id + '&user_id=' + this.data.user_id,
    })

  },





 
  /*点击减号*/
  bindMinus: function () {
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
  bindPlus: function () {
    var num = this.data.num;
    num++;
    var minusStatus = num >= 1 ? 'normal' : 'disable';
    this.setData({
      num: num,
      minusStatus: minusStatus
    })
  },

/*点击修改分数*/
  showmodel:function(){
    this.setData({
      model: true,
      remarktext: ""
    })

  },

  /*点击取消*/
  hidemodal: function () {
    this.setData({
      model: false,
      deletegroupusermodel: false,
      remarksmodal: false,
    })
  },

 /*点击确定，旧的代码*/
  // sure:function(){
  //   var that = this
  //   var crowd_id = this.data.crowd_id
  //   var user_id = this.data.user_id
  //   var score = this.data.num
  //   request({
  //     service: 'group/handlegroup/updateusergroupscore',
  //     data: {
  //       crowd_id: crowd_id,
  //       user_id: user_id,
  //       score: score
  //     },
  //     success: res => {
  //       that.setData({
  //         model: false,
  //         userscore: score
  //       })
  //       wx.showToast({
  //         title: '修改成功',
  //         icon: 'success',
  //         duration: 2000,
  //       })
  //     },
  //   })
  // },


  bindKeyInput:function(e){
    this.setData({
      operationscore: e.detail.value,
    })

  },

  add: function (e) {
    this.setData({
      zengjia: true,
      jianshao: false,
      state: 0
    })
  },
  jian: function () {
    this.setData({
      zengjia: false,
      jianshao: true,
      state: 1
    })
  },
  remarktext: function (e) {
    this.setData({
      remarktext: e.detail.value,
    })
  },


  sure: function () {
    //防止快速多次触发
    const nowTime = Date.now();
    if (nowTime - preventShake < 2000) {
      return
    }
    preventShake = nowTime;

    //获取群主的通知授权
    var that = this
    wx.requestSubscribeMessage({
      tmplIds: ['zhWe1Om6o3IK-A7ruaJoGvrtshuD-H5Fg0UpMQrzseU'],
      success(res) { },
      complete() {
        that.newsure()
      }
    })
  },

  /*点击确定*/
  newsure: function () {
    var that = this
    var score = this.data.operationscore;
    if (score <= 0){
      wx.showToast({
        title: '积分数量要大于0',
        icon: 'none',
        duration: 2500,
      })
      return;
    }
    var crowd_id = this.data.crowd_id;
    var user_id = this.data.user_id;
    var state = this.data.state;
    var explain = this.data.remarktext || "群管理操作";
    request({
      service: 'group/handlegroup/operationusergroupscore',
      data: {
        crowd_id: crowd_id,
        user_id: user_id,
        score: score,
        state: state,
        explain: explain
      },
      success: res => {
        that.setData({
          model: false,
        })
        that.userdata()
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000,
        })
      },
    })
  },


 /**
   * 设置群管理员
   */

  setupadministrators: function () {
    var that = this
    var crowd_id = this.data.crowd_id
    var user_id = this.data.user_id
    request({
      service: 'group/handlegroup/setupadministrators',
      data: {
        crowd_id: crowd_id,
        user_id: user_id,
      },
      success: res => {
        wx.showToast({
          title: '设置成功',
          icon: 'success',
          duration: 2000,
        })
        that.userdata()
      },
    })
  },

 /**
   * 取消群管理员
   */

  canceladministrators: function () {
    var that = this
    var crowd_id = this.data.crowd_id
    var user_id = this.data.user_id
    request({
      service: 'group/handlegroup/canceladministrators',
      data: {
        crowd_id: crowd_id,
        user_id: user_id,
      },
      success: res => {
        wx.showToast({
          title: '取消成功',
          icon: 'success',
          duration: 2000,
        })
        that.userdata()
      },
    })
  },

/**
   * 删除群成员
   */
  deletegroupuser:function(){
    this.setData({
      deletegroupusermodel: true,
    })
  },


  confirmdeleteuser:function(){
    var that = this
    var crowd_id = this.data.crowd_id
    var user_id = this.data.user_id
    request({
      service: 'group/handlegroup/deletegroupuser',
      data: {
        crowd_id: crowd_id,
        user_id: user_id,
      },
      success: res => {
        wx.showToast({
          title: '踢除成功',
          icon: 'success',
          duration: 2000,
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1500) 
      },
    })

  },

 //设置备注弹框
  showremarksmodel: function () {
    this.setData({
      remarksmodal: true,
      remarksValue: this.data.userdata.remarks
    })
  },

  remarksInput: function (e) {
    this.setData({
     remarksValue: e.detail.value
    })
  },

  confirmremarks:function(){
    if (this.data.remarksValue){
      this.reviseremarks()
    }else{
      wx.showToast({
        title: '不能为空',
        icon:'none',
        duration: 2000,
      })
      return;
    }
  },


  reviseremarks: function () {
    var that = this
    var crowd_id = this.data.crowd_id
    var user_id = this.data.user_id
    var remarks = this.data.remarksValue
    request({
      service: 'group/handlegroup/remarks',
      data: {
        crowd_id: crowd_id,
        user_id: user_id,
        remarks: remarks,
      },
      success: res => {
        wx.showToast({
          title: '设置成功',
          icon: 'success',
          duration: 2000,
        })
        that.hidemodal()
        that.userdata()
      },
    })

  },

})