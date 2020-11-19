var app = getApp();
const {
  request
} = require('./../../../../utils/request.js');
Page({

  data: {
    crowd_id:null,
    crowdkeywordlist:[],
    deletemodel:false,
    deleteid:null
  },

  onLoad: function (options) {
    this.setData({
      crowd_id: options.crowd_id,
    })
   this.crowdkeyword()
  },

  crowdkeyword:function(){
    let crowd_id = this.data.crowd_id
    request({
      service: 'group/chatkeyword/crowdkeyword',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
        type:0
      },
      success: res => {
        console.log("查询群关键字",res.data)
          this.setData({
            crowdkeywordlist:res.data
          })
      },
    })
  },

  statechange: function(e) {
    console.log("修改关键词状态",e)
    let id= e.currentTarget.dataset.id
    let value = e.detail.value ? 0 : 1;
    let crowd_id = this.data.crowd_id

    request({
      service: 'group/chatkeyword/updatekeyword',
      method: 'GET',
      data: {
        crowd_id: crowd_id,
        id:id,
        open:value
      },
      success: res => {
        console.log("修改状态成功",res)
      },
    })
  },
  edit:function(e){
    console.log("点击编辑")
    let keywordid= e.currentTarget.dataset.id
    let crowd_id = this.data.crowd_id;
    wx.navigateTo({
      url: '/pages/group/chat/keyword/addkeyword/addkeyword?crowd_id=' + crowd_id +'&id='+keywordid
    })
  },
  detele:function(e){
    console.log("点击删除")
    let deleteid= e.currentTarget.dataset.id
     this.setData({
      deletemodel: true,
      deleteid:deleteid
    })
  },
  hideModal:function(){
    this.setData({
      deletemodel: false
    })
  },
  confirmdelete:function(){
    console.log("确认删除关键词")
    let deleteid=this.data.deleteid;
    request({
      service: 'group/chatkeyword/deletekeyword',
      method: 'GET',
      data: {
        id:deleteid,
      },
      success: res => {
        console.log("删除关键词成功",res)
        this.crowdkeyword()
        this.setData({
          deletemodel: false,
        })
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000,
        })
      },
    })
  },
  //跳转到打卡设置页面
  addkeyword: function () {
    let crowd_id = this.data.crowd_id;
    wx.navigateTo({
      url: '/pages/group/chat/keyword/addkeyword/addkeyword?crowd_id=' + crowd_id
    })
  },

  
})