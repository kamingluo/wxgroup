const app = getApp()
// const {
//   request
// } = require('./../../../../../utils/request.js');
Page({


  data: {
    title:"",
    describe:"",
    score:null,
    //限量
    ifnumber: "0",
    numberpicker: ['限量', '不限量'],
    number: null, //限量数

    //限制次数
    limitpicker:['每日一次', '每人一次'],
    limit:"0",

    //选择结束时间
    end_time:null,//结束时间
  },

  onLoad: function (options) {
    this.havetime()

  },

  //获取年月日
  havetime:function(){
    var date = new Date();
    let year=date .getFullYear(); //获取完整的年份(4位)
    let month=date .getMonth() + 1; //获取当前月份(0-11,0代表1月)
    let day=date .getDate(); //获取当前日(1-31)
    let nowtime= year + "-" + month + "-"+ + day;
    console.log("当前时间",nowtime)
    this.setData({
      end_time:nowtime,
    })

  },

  sumbit:function(){
    console.log("提交任务")
    console.log(this.data)
  }

})