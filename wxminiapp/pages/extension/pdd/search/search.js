

const app = getApp()
const {
  request
} = require('./../../../../utils/request.js');
Page({
  data: {
    page:1,
    searchtext:"",
    goodslist:[],
    nodata:false,

  },
  onLoad: function (options) {

  },

  searchtext: function (e) {
    this.setData({
      searchtext: e.detail.value,
    })
  },
  qingkong:function(){
    console.log("清空搜索词")
    this.setData({
      searchtext: "",
    })
  },
  clicksearch:function(){
    console.log("点击搜索")
    this.setData({
      page: 1,
      goodslist:[]
    })
    this.searchgoods()
  },

  searchgoods: function () {
    var that=this
    let page = this.data.page;
    let keyword = this.data.searchtext;
    if (keyword == "" || keyword==null){
      wx.showToast({
        title: '请输入搜索词',
        icon: 'none',
        duration: 1500,
      })
      return;

    }
    request({
      service: 'pdd/Search/goodssearch',
      method: 'GET',
      data: {
        page: page,
        keyword: keyword
      },
      success: res => {
        console.log("查询商品结果", res.goodslist.goods_search_response.goods_list)
        let goodslist = this.data.goodslist;
        var newgoodslist = [...goodslist, ...res.goodslist.goods_search_response.goods_list];
        console.log(newgoodslist.length)
        that.setData({
          goodslist: newgoodslist,
          nodata:true
        })
      },
    })

  },

  // 获取滚动条当前位置
  onPageScroll: function (e) {
    console.log(e)
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    let page = that.data.page;
    let newpage= page + 1;
    that.setData({
        page: newpage
    })
    that.searchgoods()
  }

})