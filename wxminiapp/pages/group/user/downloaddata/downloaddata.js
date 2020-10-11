
const app = getApp()
const {
  request
} = require('./../../../../utils/request.js');
const baseConfig = require('./../../../../utils/config.js')//配置文件
Page({

  /**
   * 页面的初始数据
   */
  data: {
    crowd_id:null,
    //下载数据
    data_mode:"0",
    datatype: ['未发货', '全部数据'],

     //发送方式
     send_mode:"0",
     sendtype: ['在线查看', '邮箱接收'],

     email:null,
     loadModal:false,

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      crowd_id: options.crowd_id
    })
  },

  send:function(){
    this.setData({
      loadModal: true,
    })
    
    let send_mode=this.data.send_mode;
    if(send_mode==0){
      console.log("在线查看")
      this.online()
    }
    else{
      console.log("发送邮箱")
      this.emailsend()
    }
  },

  email:function(e){
    this.setData({
      email: e.detail.value,
    })
  },


  emailsend:function(){
    var that =this;
    let email=this.data.email;

    let str = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/; 
    if (!str.test(email)) {
      wx.showToast({
        title: '邮箱不规范，请重新输入',
        icon: 'none',
        duration: 2000,
      })
      that.setData({
        loadModal: false,
      })
      return ;
    } 
    let crowd_id =this.data.crowd_id;
    let data_mode=this.data.data_mode;
    let sendmode=1;

    request({
      service: 'group/downloadfile/socerlist',
      method: 'POST',
      data: {
        crowd_id: crowd_id,
        state:data_mode,
        sendmode:sendmode,
        user_email:email
      },
      success: res => {
        console.log('发送成功', res);
        that.setData({
          loadModal: false,
        })
        wx.showToast({
          title: '发送成功请到邮箱查收。',
          icon: 'none',
          duration: 2000,
        })
       
      },
    })

    //邮箱发送

  },

  online:function(){
    var that =this;
    //在线查看
    let crowd_id =this.data.crowd_id;
    let data_mode=this.data.data_mode;
    let sendmode=0;
    let url = baseConfig.host + 'group/downloadfile/socerlist?crowd_id='+ crowd_id  + '&sendmode='+ sendmode;
    wx.downloadFile({
      url: url,
      success: function (res) {
        console.log("下载成功", res);
        console.log("保存地址",res.tempFilePath)
        that.setData({
          loadModal: false,
        })
        //图片保存到本地
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '下载成功，打开文档',
              duration: 2000,
              icon: 'none',
            })
            console.log("保存成功", res);
            // const savedFilePath = res.savedFilePath;
            var savedFilePath = res.savedFilePath;
            console.log('文件已下载到' + savedFilePath);
           // 打开文件
            wx.openDocument({
              filePath: savedFilePath,
              success: function (res) {
                console.log('打开文档成功')
              },
            });
          },
          fail: function (err) {
            console.log('保存失败：', err)
          }
        });
      }
    })
  },





  dataPickerChange(e){

    this.setData({
      data_mode: e.detail.value
    })

  },

  sendPickerChange:function(e){

     this.setData({
      send_mode: e.detail.value
    })

  },
})