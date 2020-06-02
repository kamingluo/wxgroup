Page({

  /**
   * 页面的初始数据
   */
  data: {

  },


  ceshi: function () {
    wx.downloadFile({
      url: 'https://group.gzywudao.top/php/public/miniapp.php/group/downloadfile/exchangelist?crowd_id=14&state=1',
      success: function (res) {
        //图片保存到本地
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '下载成功',
              duration: 2000,
              icon: 'none',
            })
            // const savedFilePath = res.savedFilePath;
            var savedFilePath = res.savedFilePath;
            // 打开文件
            wx.openDocument({
              filePath: savedFilePath,
              success: function (res) {
                //console.log('打开文档成功')
              },
            });
          },
          fail: function (err) {
            //console.log('保存失败：', err)
          }
        });
      }
    })

  },



  test2: function (guid, fileName) {
    const FileSystemManager = wx.getFileSystemManager()
    wx.downloadFile({
      url: 'https://group.gzywudao.top/php/public/miniapp.php/group/downloadfile/exchangelist',
      success(res) {
        if (res.statusCode === 200) {
          FileSystemManager.saveFile({ //下载成功后保存到本地
            tempFilePath: res.tempFilePath,
            filePath: wx.env.USER_DATA_PATH + "/" + fileName,
            success(res2) {
              if (res2.errMsg == 'saveFile:ok') {
                console.log("111111111")
              } else {
                console.log("22222")
              }
            },
            fail() {
              console.log("333333333")
            }
          })
        } else {
          console.log("44444444")
        }
      },
      fail() {
        console.log("55555555555")
      }
    })


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var data = {
      "type": "login",
      "user_id": 10086,
      "message": "登录成功,并返回群人数，告诉全部人，包括用户自己11",
      "from_client_id": "7f0000010b5500000002",
      "from_client_name": "kamng22",
      "groupnum": 2,
      "onlinelist": {
        "7f0000010b5500000001": {
          "room_id": 1,
          "client_name": "kamng",
          "user_id": 10084,
          "imgurl": "www.baidu.com"
        },
        "7f0000010b5500000002": {
          "room_id": 1,
          "client_name": "kamng22",
          "user_id": 10086,
          "imgurl": "www.baidu.com"
        }
      },
      "create_time": "2020-06-02 08:23:02"
    };
    var kaming = data.onlinelist;
    var onlinelist=[];
    for (let key in kaming) {
      console.log(kaming[key])
      onlinelist.push(kaming[key])
    }
    console.log("处理之后的数据",onlinelist)



  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

    // var data = {
    //   "type": "login",
    //   "user_id": 10086,
    //   "message": "登录成功,并返回群人数，告诉全部人，包括用户自己11",
    //   "from_client_id": "7f0000010b5500000001",
    //   "from_client_name": "kamng22",
    //   "groupnum": 1,
    //   "onlinelist": [{
    //     "7f0000010b5500000001": {
    //       "room_id": 1,
    //       "client_name": "kamng22",
    //       "user_id": 10086,
    //       "imgurl": "www.baidu.com"
    //     },
    //   },{
    //     "7f0000010b5500000002": {
    //       "room_id": 1,
    //       "client_name": "kamng",
    //       "user_id": 10084,
    //       "imgurl": "www.baidu.com"
    //     },
    //   }],
    //   "create_time": "2020-06-02 08:09:30"
    // };
    // var kaming = data.onlinelist;
    // for(let j = 0,len=kaming.length; j < len; j++) {
    //   console.log("循环数据", kaming[j])

    // }

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})