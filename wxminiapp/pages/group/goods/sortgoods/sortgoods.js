const {
  request
} = require('./../../../../utils/request.js');
const app = getApp();
Page({


  data: {
    crowd_id: null,
    goodslist:[],
    loadModal:false
  },


  onLoad: function (e) {
    this.setData({
      crowd_id: e.crowd_id
    })
    this.goodsdata()

  },

  goodsdata: function () {
    var crowd_id = this.data.crowd_id
    request({
      service: 'group/groupgoods/newgoodslist',
      method: 'GET',
      data: {
        crowd_id: crowd_id
      },
      success: res => {
        console.log('兑换商品列表', res);
        this.setData({
          goodslist: res.data
        })
      }
    })
  },


  swapItems:function(index1, index2) {
    let  arr=this.data.goodslist;
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    console.log("处理过的数据")
    console.log(arr)
    this.setData({
      goodslist:arr
    })

    return;
  },
  
  // 上移
  upRecord:function(e) {
    console.log("lalalalalalla")
    console.log(e)
    let index=e.currentTarget.dataset.index
    if(index == 0) {
      return;
    }
    this.swapItems(index, index - 1);
  },
  
  // 下移
 downRecord:function(e) {
   let index=e.currentTarget.dataset.index;
   let arr =this.data.goodslist;
    if(index == arr.length -1) {
      return;
    }
    this.swapItems(index, index + 1);
  },


  //保存修改
  save:function(){
    var that =this;
    that.setData({
      loadModal:true
    })
    console.log("保存修改")
    var data = that.data.goodslist
    request({
      service: 'group/groupgoods/sortgoods',
      method: 'POST',
      data: {
        data: data
      },
      success: res => {
        console.log('调整接口返回', res);
        that.setData({
          loadModal:false
        })
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 2500,
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1500) 
      }
    })

  },






 
})