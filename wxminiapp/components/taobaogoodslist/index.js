const app = getApp()
const {
  request
} = require('./../../utils/request.js');
const common = require('./../../utils/common.js') //公共函数
let preventShake = 0;
Component({
  properties: {
    goodslist: {
      type: Object, //属性的类型
      value: [] // 数据
    },
  },
  data: {
  },
  methods: {
    clickgoods: function (e) {
     console.log("点击商品",e)
      // let goodsdata = e.currentTarget.dataset.data;
      // wx.setStorageSync('taobaogoodsdata', goodsdata)//将点击的淘宝商品存入缓存
      let num_iids = e.currentTarget.dataset.data.item_id;//商品id
      let url = encodeURIComponent(e.currentTarget.dataset.data.url);
      wx.navigateTo({
        url: '/pages/extension/taobao/goodsdetails/goodsdetails?num_iids=' + num_iids + '&url=' + url 
      })


    }
  }
})