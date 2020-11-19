// pages/group/chat/keyword/addkeyword/addkeyword.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploaderList: [],
    showUpload: true,
    matchingpicker: ['精准匹配', '模糊匹配'],
    saytypepicker: ['文案', '图片'],
    matching: 0,
    say_type: 'image',
    open: 0,
    id:null,
    crowd_id:null

  },

  onLoad: function (options) {
    let crowd_id= options.crowd_id;
    let  id=options.id;
    if(id){
      this.setData({
        id: id,
        crowd_id:crowd_id
      })
    }
    else{
      this.setData({
        crowd_id:crowd_id
      })
    }

  },

  PickerChange(e) {
    console.log(e.detail.value);
    let matching=0;
    if(e.detail.value==0)
    {
      matching=1
    }
    else{
      matching=0
    }
    // 开奖方式，0是模糊匹配，1是精准匹配
    this.setData({
      matching: matching
    })
  },

  saytypePickerChange(e) {
    console.log(e.detail.value);
    if (e.detail.value == 0) {
      this.setData({
        say_type: 'text'
      })
    }
    else {
      this.setData({
        say_type: 'image'
      })
    }
  },




})