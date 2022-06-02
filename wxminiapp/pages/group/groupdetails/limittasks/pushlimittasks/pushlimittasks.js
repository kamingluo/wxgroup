const app = getApp()
const {
  request
} = require('./../../../../../utils/request.js');
const upimages = require('./../../../../../utils/sdk/qiniu/upimages.js') //上传图片
Page({


  data: {
    crowd_id: null,
    title: null,
    describe: "",
    score: null,
    //限量
    ifnumber: "0",
    numberpicker: ['不限量', '限量'],
    number: null, //限量数
    //限制次数
    limitpicker: ['每人一次', '每日一次'],
    limit: "0",
    //选择结束时间
    end_time: null,//结束时间
    step: [{
      explain: "",
      image: ""
    }],
    loadModal: false
  },

  onLoad: function (options) {
    this.setData({
      crowd_id: options.crowd_id
    })
    this.havetime()
    this.initialization()//初始化数据
  },

  //获取年月日
  havetime: function () {
    var date = new Date();
    let year = date.getFullYear(); //获取完整的年份(4位)
    let month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    let day = date.getDate(); //获取当前日(1-31)
    let nowtime = year + "-" + month + "-" + + day;
    console.log("当前时间", nowtime)
    this.setData({
      end_time: nowtime,
    })
  },

  //初始化数据
  initialization: function () {

    console.log("进入发布限时任务初始化")
    let data = wx.getStorageSync('limittasksdetails');
    if (data) {
      console.log("初始化数据存在", data)
      let limit="0";
      if(data.limit != 0 ){
        limit="1";
      }
      let ifnumber="1";
      if(data.number == 0 ){
        ifnumber="0";
      }


      this.setData({
        title: data.title,
        describe: data.describe,
        score: data.score,
        step: data.step,
        number: data.number,
        limit: limit,
        ifnumber:ifnumber,
      })
      wx.removeStorage({key: 'limittasksdetails'})
    }

  },

  //标题
  title: function (e) {
    this.setData({
      title: e.detail.value,
    })
  },
  //积分
  score: function (e) {
    this.setData({
      score: e.detail.value,
    })
  },

  //限制数量
  number: function (e) {
    this.setData({
      number: e.detail.value,
    })
  },

  //任务说明
  describe: function (e) {
    this.setData({
      describe: e.detail.value
    })
  },

  //是否限量选择
  numberPickerChange: function (e) {
    console.log("是否限量选择")
    console.log(e.detail.value);
    this.setData({
      ifnumber: e.detail.value
    })

  },
  //限时次数
  limitPickerChange: function (e) {
    console.log("限时次数")
    console.log(e.detail.value);
    this.setData({
      limit: e.detail.value
    })
  },

  //结束时间
  DateChange: function (e) {
    this.setData({
      end_time: e.detail.value
    })

  },
  //步骤文案输入
  stepdescribe: function (e) {
    let index = e.currentTarget.dataset.index
    let describe = e.detail.value
    let data = this.data.step;
    data[index].explain = describe
    this.setData({
      step: data
    })

  },

  //新增一个步骤
  addstep: function () {
    let data = this.data.step;
    let newdata = {
      explain: "",
      image: null
    };
    data.push(newdata)

    this.setData({
      step: data
    })


  },

  //减少一个步骤
  reducestep: function () {
    let data = this.data.step;
    data.pop()
    this.setData({
      step: data
    })


  },

  //上传图片
  ChooseImage: function (e) {
    let index = e.currentTarget.dataset.index
    var that = this;
    wx.chooseImage({
      count: 1, // 默认1
      sizeType: ['compressed'], // 只有压缩图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        let tempFilePaths = res.tempFilePaths[0];
        upimages.oneyear(tempFilePaths, (res) => {
          console.log("请求上传图片公共方法返回的url", res)
          let data = that.data.step
          data[index].image = res
          that.setData({
            step: data
          })
        });
        // that.setData({
        //   cover: res.tempFilePaths,
        // })
      }
    })
  },

  //删除图片
  DelImg: function (e) {
    console.log("删除图片", e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index
    let data = this.data.step
    data[index].image = ""
    this.setData({
      step: data
    })

  },
  //放大图片
  ViewImage(e) {
    let data = [e.currentTarget.dataset.url]
    wx.previewImage({
      urls: data,
      current: e.currentTarget.dataset.url
    });
  },

  wxtoast: function (text) {
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000,
    })
  },

  sumbit: function () {
    var that = this
    console.log("提交任务")

    let data = this.data;
    if (data.title == "" || data.title == null) {
      this.wxtoast("标题不能为空")
      return;
    }
    if (data.describe == "" || data.describe == null) {
      this.wxtoast("任务说明不能为空")
      return;
    }

    if (data.score == "" || data.score == null || data.score == 0) {
      this.wxtoast("奖励积分不能为空")
      return;
    }

    if (data.step[0].image == "" && data.step[0].explain == "") {
      this.wxtoast("任务步骤不能为空")
      return;
    }

    that.setData({
      loadModal: true,
    })

    let postdata = {};
    postdata.crowd_id = data.crowd_id;
    postdata.title = data.title;
    postdata.describe = data.describe;
    postdata.score = data.score;
    postdata.step = data.step;
    postdata.limit = data.limit;
    postdata.end_time = data.end_time + " " + "23:59:59";
    postdata.open = 0;
    postdata.code = "kaming";
    if (this.data.ifnumber == 0) {
      postdata.number = 0;
    }
    else {
      postdata.number = data.number;
    }
    console.log(postdata)

    request({
      service: 'group/limittask/pushlimittask',
      method: 'POST',
      data: postdata,
      success: res => {
        that.setData({
          loadModal: false,
        })
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 2000,
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