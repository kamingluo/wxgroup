var app = getApp();
const {
  request
} = require('./../../../../utils/request.js');
Page({

  data: {
    crowd_id:null,
    crowdkeywordlist:[]
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
  edit:function(e){
    console.log("点击编辑")
  },
  detele:function(e){
    console.log("点击删除")
  }

  
})