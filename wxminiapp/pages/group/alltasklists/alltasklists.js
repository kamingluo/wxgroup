// pages/my/exchange_detailed/exchange_detailed.js
const app = getApp()
const {
  request
} = require('./../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    alltasklists: [],
    loadModal: true,
    crowd_id:null,
    pages:1,
    count:0,
    keyword:null,
    inputword:null,
    TabCur: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    this.setData({
      crowd_id: options.crowd_id,
    })

    // this.havedata(1)

  },
  onShow:function(){
    this.setData({
      pages:1,
      alltasklists:[]
    })
    this.havedata(1)
  },


  tabSelect(e) {
    let id=e.currentTarget.dataset.id;
    this.setData({
      TabCur: id,
      alltasklists:[],
      count:0,
      loadModal:true

    })
    this.havedata(1)

    console.log("切换tab",id)
  },


  havedata:function(pages){
    var that=this;
    let crowd_id = that.data.crowd_id;
    let keyword = that.data.keyword;

    let server='task/handletask/alltasklists';
    if(this.data.TabCur == 1){
      server='group/handlelimittask/pushlimittask';
    }

    request({
      service: server,
      data: {
        pages:pages,
        crowd_id: crowd_id,
        keyword: keyword
      },
      success: res => {
        let alltasklists=this.data.alltasklists;
        var newalltasklists=[...alltasklists,...res.alltasklists];
        that.setData({
          alltasklists: newalltasklists,
          count: res.count,
          loadModal: false,
        })
      },
    })

  },


//点击搜索词
  clicksearch:function(){
    let keyword = this.data.inputword;
    this.setData({
      pages: 1,
      keyword: keyword,
      alltasklists: []
    })
    this.havedata(1)
  },

//输入关键词
  inputword:function(e){
    this.setData({
      inputword: e.detail.value
    })
  },


  clicktasklist: function(e) {
    let id=e.currentTarget.dataset.id;
    if(this.data.TabCur==0){
      wx.navigateTo({
        url: '/pages/group/alltasklists/taskdetailed/taskdetailed?id=' + id
      })
    }
    else{
      // wx.showToast({
      //   title: '请前往网页版后台审核和查看',
      //   icon: 'none',
      //   duration: 2000,
      // })
      wx.navigateTo({
        url: '/pages/group/alltasklists/limittaskdetailed/limittaskdetailed?id=' + id
      })
    }
   
  },



  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
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
      that.havedata(newpages)
    }
  }
})