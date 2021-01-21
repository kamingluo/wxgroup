const app = getApp()
const {
  request
} = require('./../../utils/request.js');
const common = require('./../../utils/common.js') //公共函数

let preventShake = 0;

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    adid: {
      type: String, //属性的类型
      value: "adunit-a090166402a1c55e" // 广告id
    },
    adtype:{
      type: String, //属性的类型
      value: "1" // 广告类型
    },
    position:{
      type: String, //属性的类型
      value: "广告位置" // 广告位置
    }
  },


  /**
   * 组件的初始数据
   */
  data: {
    url: '',
    title: '',
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //阻止冒泡
    catchtap(e) {
      return false
    },
    adclick(e) {
      console.log("点击新广告组件广告")
      console.log(e.currentTarget.dataset.position)
      console.log(e.currentTarget.dataset.adtype)
      let data={
        'adtype':e.currentTarget.dataset.adtype,
        'position':e.currentTarget.dataset.position
      };
      common.clickgdtadstatistics(data)

      if (e.currentTarget.dataset.adtype==5){
        console.log("点击模板广告，将替换到banner广告")
        let data = wx.getStorageSync('todayclickad');
        data.adtype=1;
        wx.setStorageSync('todayclickad', data)
      }
      else if (e.currentTarget.dataset.adtype == 1){
        console.log("点击banner广告，将替换到格子广告")
        let data = wx.getStorageSync('todayclickad');
        data.adtype = 3;
        wx.setStorageSync('todayclickad', data)
      }
      else{
        console.log("点击不是模板也不是格子广告，不替换")
      }

    },
    gridaderr(e){
      console.log("格子广告加载失败",e)

    },
    //点击事件
    tapEvent(e) {
      //防止快速多次触发
      const nowTime = Date.now();
      if (nowTime - preventShake < 500) {
        return
      }
      preventShake = nowTime;

      //触发点击回调
      this.triggerEvent('click', e, {});
    },

  }
})