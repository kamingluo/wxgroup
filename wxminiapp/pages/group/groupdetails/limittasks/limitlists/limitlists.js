const {
  request
} = require('./../../../../../utils/request.js');
const app = getApp();
Page({

  data: {
    datalist:[],
    crowd_id:null,
    pages:1,
    count:0
  },

  onLoad: function (options) {
    this.setData({
      crowd_id: options.crowd_id,
    })
    this.limittaskslist()
  },


    //获取群限时任务列表
    limittaskslist: function (crowd_id) {
      var that=this
      var pages=that.data.pages;
      var crowd_id=that.data.crowd_id;
      request({
        service: 'group/handlelimittask/tasklist',
        method: 'GET',
        data: {
          crowd_id: crowd_id,
          keyword:null,
          pages: pages
        },
        success: res => {
          let list=this.data.datalist;
          var newlist=[...list,...res.data];
          that.setData({
            datalist: newlist,
            count: res.count,
            loadModal: false,
          })
        }
      })
    },


    //跳转到任务审核
    clicklimittasklist: function (e) {
      let crowd_id = this.data.crowd_id;
      let id =  e.currentTarget.dataset.id;
      let title =  e.currentTarget.dataset.title;
      console.log(e.currentTarget.dataset.id)
      wx.navigateTo({
        url: '/pages/group/groupdetails/limittasks/auditlimittasks/auditlimittasks?limit_id=' + id + '&crowd_id=' + crowd_id + '&title=' + title,
      })

    },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this
    var count=that.data.count;//拿到总数
    var pages =that.data.pages;
    if(pages * 20 >= count){
      return;
    }
    else{
     let  newpages=pages + 1 ;
      that.setData({
        pages: newpages
      })
      that.limittaskslist()
    }

  },
})