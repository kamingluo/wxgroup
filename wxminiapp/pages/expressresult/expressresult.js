const app = getApp()
const {
  request
} = require('./../../utils/request.js');


Page({
  data: {
    expressdata: '',
    fristdata: '',
    lastdata: '',
  },

  //加载框
  loadModal() {
    this.setData({
      loadModal: true
    })
  },
  //查询快递信息
  query: function(number) {
    var that = this
    wx.request({
      url: 'https://phpapi.gzywudao.top/api.php/express/express', //服务器地址
      data: {
        number: number,
      },
      header: {
        "Content-type": "application/json",
      },
      success: function(res) {
        //console.log("查询快递返回的信息",res)
        that.setData({
          loadModal: false
        })
        if (res.data.Success == false) {
          return;
        }
        // that.addexpress(res.data)
        var data = res.data.Traces
        var lastdata = data.pop() || null
        var fristdata = data.reverse()
        that.setData({
          expressdata: res.data,
          fristdata: fristdata,
          lastdata: lastdata,
          loadModal: false
        })
      },
      fail: function(err) {}
    })
  },
 
  addexpress:function(data){
    //console.log("传过来处理的信息",data)
    let expressNumber=data.LogisticCode
    let expressName=data.ShipperName
    wx.login({
      success: res => {
        request({
          service: '/express/addexpress',
          data: {
            code: res.code,
            expressNumber:expressNumber,
            expressName:expressName
          },
          success: res => {
            //console.log('添加快递信息结果返回', res);
          },
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   // console.log("结果页面加载数据", options)
    this.loadModal()
    this.query(options.number)
  },


  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function (options) {
  //   //console.log("分享掉起", options)
  //   if (options.from == 'button') {
  //     let expressName = options.target.dataset.name
  //     let expressNumber = options.target.dataset.number
  //     console.log("按钮分享", expressName, expressNumber)
  //     return share(1, expressName, expressNumber);
  //   } else {
  //     return share(2);
  //   }
  // },
})