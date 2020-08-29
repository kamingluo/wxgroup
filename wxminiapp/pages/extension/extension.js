// pages/extension/extension.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }, {
      id: 1,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
    }, {
      id: 5,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
    }, {
      id: 6,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
    }],

    iconList: [{
      icon: 'cardboardfill',
      color: 'red',
      badge: 120,
      name: '新人免单'
    }, {
      icon: 'recordfill',
      color: 'orange',
      badge: 1,
      name: '9.9包邮'
    }, {
      icon: 'picfill',
      color: 'yellow',
      badge: 0,
      name: '大牌清仓'
    }, {
      icon: 'noticefill',
      color: 'olive',
      badge: 22,
      name: '高佣精选'
    }, {
      icon: 'upstagefill',
      color: 'cyan',
      badge: 0,
      name: '百亿补贴'
    }],
    TabCur: 0,
    scrollLeft: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let mall_type=options.mall_type;
    let goods_id=options.goods_id;
    let search_id=options.search_id;

    //分享进来，直接跳转到商品详情页面
    if(mall_type==1){
      wx.navigateTo({
        url: '/pages/extension/pdd/goodsdetails/goodsdetails?goods_id=' + goods_id + '&search_id=' + search_id
      })
    }
  },

  //点击跳转到搜索页面
  gosearch:function(){
    wx.navigateTo({
      url: '/pages/extension/pdd/search/search'
    })
  },

//切换导航栏
  tabSelect(e) {
    console.log("切换导航栏",e)
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})