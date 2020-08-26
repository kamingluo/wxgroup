// pages/extension/extension.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let mall_type=options.mall_type;
    let goods_id=options.goods_id;
    let search_id=options.search_id;
    if(mall_type==1){
      wx.navigateTo({
        url: '/pages/extension/pdd/goodsdetails/goodsdetails?goods_id=' + goods_id + '&search_id=' + search_id
      })
    }


  },

  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  gosearch:function(){
    wx.navigateTo({
      url: '/pages/extension/pdd/search/search'
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})