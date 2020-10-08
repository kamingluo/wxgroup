const baseConfig = require('./../../utils/config.js')//配置文件
Page({

  data: {
    goodslist:[]

  },

  onLoad: function() {
    this.getdata()

  },

  /*
调起微信支付 
@param 支付价格，不填写默认为1分钱
*/
  pay:function () {
    console.log("点击下单")
    let openid = wx.getStorageSync('userdata').openid;
    wx.request({
      url: baseConfig.host+'pay/testpay/pay',
      method: "POST",
      data: {
        openid:openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {  //后端返回的数据
        console.log("统一下单返回数据",res)
        var data = res.data;
        console.log(data);
        console.log(data["timeStamp"]);
        wx.requestPayment({
          timeStamp: data['timeStamp'],
          nonceStr: data['nonceStr'],
          package: data['package'],
          signType: data['signType'],
          paySign: data['paySign'],
          success: function (res) {
            console.log("支付成功返回数据",res)
            wx.showModal({
              title: '支付成功',
              content: '',
            })
          },
          fail: function (res) {
            console.log(res);
          }
        })
      }
    });

  },


  getdata: function() {
    let data = [{
        "category_id": 50006865,
        "category_name": "玻璃杯",
        "commission_rate": "45",
        "commission_type": "MKT",
        "coupon_amount": "3",
        "coupon_end_time": "2020-09-15",
        "coupon_id": "7beee7f2ec3a439ba4065cfceb63fcf6",
        "coupon_info": "满12元减3元",
        "coupon_remain_count": 86911,
        "coupon_share_url": "//uland.taobao.com/coupon/edetail?e=zmdVqSuSBXcNfLV8niU3RxrSI%2FOabn6qNg4Gqf8CT4AKuDLwELihneNnWpM9bd57ZAAX7mvFnIhSb1iTPJNWk5cN858c36buIiltiIaWRnyrzKwuolQYevXXC2ljQ3Wg4p8WUOWJ6oYGQASttHIRqYyrw5dcnsiMsqK1kHaaeCAkUUsykOvsBu2EH9ZkW0infjHMNTxsYKQCGruttYDvNg%3D%3D&&app_pvid=59590_11.132.118.112_1153_1599841010911&ptl=floorId:2836;app_pvid:59590_11.132.118.112_1153_1599841010911;tpp_pvid:100_11.178.155.133_5793_9871599841010912361&xId=7oNKSImloRpJWwVZTikfc7i1WVMHP1lesHP9ELbIYVjGizZ2NZneZ6FTD0uvih4OmgiQ91WLK4kEDayakmxm8swRaMl4jJWx4ETUIiSmkCjV&union_lens=lensId%3AMAPI%401599841010%400b847670_b3b1_1747df48535_7914%4001",
        "coupon_start_fee": "12",
        "coupon_start_time": "2020-09-01",
        "coupon_total_count": 100000,
        "include_dxjh": "false",
        "include_mkt": "true",
        "info_dxjh": "{}",
        "item_description": "",
        "item_id": 596116426626,
        "item_url": "https://detail.tmall.com/item.htm?id=596116426626",
        "level_one_category_id": 122952001,
        "level_one_category_name": "餐饮具",
        "nick": "奇古堂旗舰店",
        "num_iid": 596116426626,
        "pict_url": "https://img.alicdn.com/bao/uploaded/i4/2448754880/O1CN01M2eOrZ1lv5Pm4kuu6_!!0-item_pic.jpg",
        "provcity": "浙江 杭州",
        "real_post_fee": "0.00",
        "reserve_price": "138",
        "seller_id": 2448754880,
        "shop_dsr": 48416,
        "shop_title": "奇古堂旗舰店",
        "short_title": "茶水分离双层创意个性高档泡茶杯",
        "small_images": {
          "string": [
            "https://img.alicdn.com/i3/2448754880/O1CN01lQ6Iq41lv5OWMr1qx_!!2448754880.jpg",
            "https://img.alicdn.com/i2/2448754880/O1CN01RYi6aJ1lv5Kj595B7_!!2448754880.jpg",
            "https://img.alicdn.com/i3/2448754880/O1CN01j1D6z41lv5Kpow1Vo_!!2448754880.jpg",
            "https://img.alicdn.com/i2/2448754880/O1CN015XsSXL1lv5KoV7Xk3_!!2448754880.jpg"
          ]
        },
        "title": "茶水分离泡茶杯双层玻璃杯子男防摔便携创意个性高档过滤保温水杯",
        "tk_total_commi": "1213.67",
        "tk_total_sales": "4869",
        "url": "//s.click.taobao.com/t?e=m%3D2%26s%3DGBrk6aAr%2FSEcQipKwQzePOeEDrYVVa64r4ll3HtqqoxyINtkUhsv0HuCEKUKFHLqIt9UHUMzYhJSQC64qPwMacrVk5Dv1vWjSeifjUPT2IJMNleMcTBms7OHvhaHxUAvSD99OVE0eUjDgr4VLPkfYTQBDvmislIJkgE9X1el7a9%2F%2FnowhNtOfUxMOWtVK2b5hw3g78jgZa4%3D&scm=null&pvid=100_11.178.155.133_5793_9871599841010912361&app_pvid=59590_11.132.118.112_1153_1599841010911&ptl=floorId:2836;originalFloorId:2836;pvid:100_11.178.155.133_5793_9871599841010912361;app_pvid:59590_11.132.118.112_1153_1599841010911&xId=7oNKSImloRpJWwVZTikfc7i1WVMHP1lesHP9ELbIYVjGizZ2NZneZ6FTD0uvih4OmgiQ91WLK4kEDayakmxm8swRaMl4jJWx4ETUIiSmkCjV&union_lens=lensId%3AMAPI%401599841010%400b847670_b3b1_1747df48535_7914%4001",
        "user_type": 1,
        "volume": 25625,
        "white_image": "https://img.alicdn.com/bao/uploaded/TB1y.3kQpP7gK0jSZFjXXc5aXXa.png",
        "x_id": "7oNKSImloRpJWwVZTikfc7i1WVMHP1lesHP9ELbIYVjGizZ2NZneZ6FTD0uvih4OmgiQ91WLK4kEDayakmxm8swRaMl4jJWx4ETUIiSmkCjV",
        "zk_final_price": "12.8"
      },
      {
        "category_id": 50006865,
        "category_name": "玻璃杯",
        "commission_rate": "135",
        "commission_type": "COMMON",
        "coupon_amount": "10",
        "coupon_end_time": "2020-09-15",
        "coupon_id": "b358a110128b403c886a03a29343201d",
        "coupon_info": "满29元减10元",
        "coupon_remain_count": 8600,
        "coupon_share_url": "//uland.taobao.com/coupon/edetail?e=P74szBTA%2FgANfLV8niU3RxrSI%2FOabn6qNg4Gqf8CT4DAKd2z05ewPtvCfhtQ%2FiMXmMHpNfYdHdCnlP4xUTPjsveLv0pUSk1Ib0lCQyf1EuR3n56Al%2FaX2HmAnkvv%2FrGcTwylIUGNirDdxnRyTHGQGQHEDkzPQQMRCC280KQ7GppyQqTeAHBYNM%2FkpnwP6%2F3nt1rShQB%2F%2FA4CGruttYDvNg%3D%3D&&app_pvid=59590_11.132.118.112_1153_1599841010911&ptl=floorId:2836;app_pvid:59590_11.132.118.112_1153_1599841010911;tpp_pvid:100_11.178.155.133_5793_9871599841010912361&xId=3yCnMTuJjQL7OEZpltgbgfjMmvfVxdIffu9Ey95Ia4gxBITbQ1mWOQplfZkWM8TuMuwzOpzRhuRqOlCJfBJFV4Q5qWRIz8MItuvSd11MRMcw&union_lens=lensId%3AMAPI%401599841010%400b847670_b3b1_1747df48536_791d%4001",
        "coupon_start_fee": "29",
        "coupon_start_time": "2020-09-09",
        "coupon_total_count": 10000,
        "include_dxjh": "false",
        "include_mkt": "false",
        "info_dxjh": "{}",
        "item_description": "750/1000/1500/2000 茶水分离 一杯双网可选",
        "item_id": 548605446958,
        "item_url": "https://detail.tmall.com/item.htm?id=548605446958",
        "level_one_category_id": 122952001,
        "level_one_category_name": "餐饮具",
        "nick": "佳沃斯家居专营店",
        "num_iid": 548605446958,
        "pict_url": "https://img.alicdn.com/bao/uploaded/i2/2453105584/O1CN01oUwnJ81r7WEzknBBZ_!!2453105584-0-lubanu-s.jpg",
        "provcity": "安徽 合肥",
        "real_post_fee": "0.00",
        "reserve_price": "99",
        "seller_id": 2453105584,
        "shop_dsr": 48557,
        "shop_title": "佳沃斯家居专营店",
        "short_title": "富光大容量透明带盖过滤男便携杯子",
        "small_images": {
          "string": [
            "https://img.alicdn.com/i1/2453105584/TB2eLPGnUlnpuFjSZFjXXXTaVXa_!!2453105584.jpg",
            "https://img.alicdn.com/i1/2453105584/TB2L9ExlwFkpuFjSspnXXb4qFXa_!!2453105584.jpg",
            "https://img.alicdn.com/i2/2453105584/TB2g8kJlB8kpuFjSspeXXc7IpXa_!!2453105584.jpg",
            "https://img.alicdn.com/i2/2453105584/TB25CCVdCtYBeNjSspkXXbU8VXa_!!2453105584.jpg"
          ]
        },
        "title": "富光玻璃杯大容量透明水杯带盖过滤男耐热茶杯单层便携杯子1000ml",
        "tk_total_commi": "352.06",
        "tk_total_sales": "592",
        "url": "//s.click.taobao.com/t?e=m%3D2%26s%3Dm2MB1%2FKZOwscQipKwQzePOeEDrYVVa64r4ll3HtqqoxyINtkUhsv0HuCEKUKFHLqIt9UHUMzYhJSQC64qPwMacrVk5Dv1vWjSeifjUPT2IJMNleMcTBms7OHvhaHxUAvSD99OVE0eUhIPdh1yz8oXgtpgcQxT8dGIu0Ntojfvl2o4WJ3O%2B0A14GAqSpR518Hxg5p7bh%2BFbQ%3D&scm=null&pvid=100_11.178.155.133_5793_9871599841010912361&app_pvid=59590_11.132.118.112_1153_1599841010911&ptl=floorId:2836;originalFloorId:2836;pvid:100_11.178.155.133_5793_9871599841010912361;app_pvid:59590_11.132.118.112_1153_1599841010911&xId=3yCnMTuJjQL7OEZpltgbgfjMmvfVxdIffu9Ey95Ia4gxBITbQ1mWOQplfZkWM8TuMuwzOpzRhuRqOlCJfBJFV4Q5qWRIz8MItuvSd11MRMcw&union_lens=lensId%3AMAPI%401599841010%400b847670_b3b1_1747df48536_791d%4001",
        "user_type": 1,
        "volume": 2241,
        "white_image": "https://img.alicdn.com/bao/uploaded/TB11hoeVxTpK1RjSZFKXXa2wXXa.png",
        "x_id": "3yCnMTuJjQL7OEZpltgbgfjMmvfVxdIffu9Ey95Ia4gxBITbQ1mWOQplfZkWM8TuMuwzOpzRhuRqOlCJfBJFV4Q5qWRIz8MItuvSd11MRMcw",
        "zk_final_price": "38"
      },
      {
        "category_id": 50003757,
        "category_name": "酒杯",
        "commission_rate": "600",
        "commission_type": "MKT",
        "coupon_amount": "5",
        "coupon_end_time": "2020-09-13",
        "coupon_id": "d0b01e08a0aa4fb6990fcf319e1be32d",
        "coupon_info": "满6元减5元",
        "coupon_remain_count": 9983,
        "coupon_share_url": "//uland.taobao.com/coupon/edetail?e=DfDYwLg%2BE5MNfLV8niU3RxrSI%2FOabn6qNg4Gqf8CT4AKuDLwELihnc1C%2F0PeiWnYuTvSwfAf6IdSb1iTPJNWk5cN858c36buIiltiIaWRnyrzKwuolQYevXXC2ljQ3Wg4p8WUOWJ6oYE%2BdAb1JoOOoj8hniEb1XGHmMXMofcFVrxFaLYey94tO2EH9ZkW0infjHMNTxsYKRroXBFP6oz%2BA%3D%3D&&app_pvid=59590_11.132.118.112_1153_1599841010911&ptl=floorId:2836;app_pvid:59590_11.132.118.112_1153_1599841010911;tpp_pvid:100_11.178.155.133_5793_9871599841010912361&xId=1YFP5lrluC6UehJInSRq2CcGph2KtYNKSqeqIJ4vRP9V2bZVGNnsPCVqBWZrURrv6CtYdSIFPnyZAqbj20EXvz3ebzh4WRDfbKankQpEmBlA&union_lens=lensId%3AMAPI%401599841010%400b847670_b3b1_1747df48536_7926%4001",
        "coupon_start_fee": "6",
        "coupon_start_time": "2020-09-07",
        "coupon_total_count": 10000,
        "include_dxjh": "false",
        "include_mkt": "true",
        "info_dxjh": "{}",
        "item_description": "",
        "item_id": 603554260785,
        "item_url": "https://item.taobao.com/item.htm?id=603554260785",
        "level_one_category_id": 122952001,
        "level_one_category_name": "餐饮具",
        "nick": "tb81943434",
        "num_iid": 603554260785,
        "pict_url": "https://img.alicdn.com/bao/uploaded/i1/1721537523/O1CN01FHll4Z25RaABc2unh_!!1721537523.jpg",
        "provcity": "广东 潮州",
        "real_post_fee": "0.00",
        "reserve_price": "46.5",
        "seller_id": 1721537523,
        "shop_dsr": 49221,
        "shop_title": "樱花阁日式家居",
        "short_title": "樱花阁创意云雾白锤目纹清酒米酒杯",
        "small_images": {
          "string": [
            "https://img.alicdn.com/i4/1721537523/O1CN011BKKWA25RaAHYGsyt_!!1721537523.jpg",
            "https://img.alicdn.com/i3/1721537523/O1CN01vglN7H25RaAEJmFSY_!!1721537523.jpg",
            "https://img.alicdn.com/i1/1721537523/O1CN01eAPTHp25RaAG3X4Tm_!!1721537523.jpg",
            "https://img.alicdn.com/i3/1721537523/O1CN01GJiNqF25RaAEZkXFJ_!!1721537523.jpg"
          ]
        },
        "title": "樱花阁 创意云雾白酒具套装锤目纹玻璃酒壶家用温酒壶清酒米酒杯",
        "tk_total_commi": "491.52",
        "tk_total_sales": "38",
        "url": "//s.click.taobao.com/t?e=m%3D2%26s%3D62kTPjDqO9McQipKwQzePOeEDrYVVa64lwnaF1WLQxlyINtkUhsv0HuCEKUKFHLqIt9UHUMzYhJSQC64qPwMacrVk5Dv1vWjSeifjUPT2IJMNleMcTBms7OHvhaHxUAvSD99OVE0eUi8GJ8%2BYTMII5PVpWI8jB2sS4IW9YJ%2Ba%2FzknyJlt9ccuExMOWtVK2b5hw3g78jgZa4%3D&scm=null&pvid=100_11.178.155.133_5793_9871599841010912361&app_pvid=59590_11.132.118.112_1153_1599841010911&ptl=floorId:2836;originalFloorId:2836;pvid:100_11.178.155.133_5793_9871599841010912361;app_pvid:59590_11.132.118.112_1153_1599841010911&xId=1YFP5lrluC6UehJInSRq2CcGph2KtYNKSqeqIJ4vRP9V2bZVGNnsPCVqBWZrURrv6CtYdSIFPnyZAqbj20EXvz3ebzh4WRDfbKankQpEmBlA&union_lens=lensId%3AMAPI%401599841010%400b847670_b3b1_1747df48536_7926%4001",
        "user_type": 0,
        "volume": 131,
        "white_image": "https://img.alicdn.com/bao/uploaded/i3/1721537523/O1CN01GJiNqF25RaAEZkXFJ_!!1721537523.jpg",
        "x_id": "1YFP5lrluC6UehJInSRq2CcGph2KtYNKSqeqIJ4vRP9V2bZVGNnsPCVqBWZrURrv6CtYdSIFPnyZAqbj20EXvz3ebzh4WRDfbKankQpEmBlA",
        "zk_final_price": "16.5"
      },
    ]

    this.setData({
      goodslist: data,
    })




  },



})