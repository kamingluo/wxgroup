const app = getApp();
const {
  request
} = require('./../../../../utils/request.js');
Page({
  data: {
    goodsdata: {},
    miniappurldata:{}
  },
  onLoad: function(options) {
    console.log(options)
    let goods_id = Number(options.goods_id);
    let search_id = options.search_id;
    let newgoodsid = [goods_id];
    
    this.goodsdata(newgoodsid)
    this.miniappurl(newgoodsid, search_id)
  },
  //点击购买
  purchase:function(){
    let jumpurl = this.data.miniappurldata.page_path
    let appid = this.data.miniappurldata.app_id
    wx.navigateToMiniProgram({
      appId: appid,
      path: jumpurl,
    })

  },

  goodsdata: function (goodsid) {
  
    request({
      service: 'pdd/Search/goodsdetail',
      method: 'GET',
      data: {
        goods_id: goodsid,
      },
      success: res => {
        console.log("商品详情", res.goodsdetails.goods_detail_response.goods_details[0])
        this.setData({
          goodsdata: res.goodsdetails.goods_detail_response.goods_details[0],
        })
      },
    })
  },



  miniappurl: function (goodsid, search_id) {
    request({
      service: 'pdd/Search/goodspromotion',
      method: 'GET',
      data: {
        goods_id: goodsid,
        search_id: search_id
      },
      success: res => {
        //console.log("跳转信息", res.goodsurldata.goods_promotion_url_generate_response.goods_promotion_url_list[0].we_app_info)
        this.setData({
          miniappurldata: res.goodsurldata.goods_promotion_url_generate_response.goods_promotion_url_list[0].we_app_info,
        })
      },
    })
  }

});