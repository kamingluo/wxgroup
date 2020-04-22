Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },


  ceshi:function(){
    wx.downloadFile({
      url: 'https://group.gzywudao.top/php/public/miniapp.php/group/downloadfile/exchangelist?crowd_id=14&state=1',
      success: function (res) {
        console.log("下载成功", res);
        console.log("保存地址",res.tempFilePath)
        //图片保存到本地
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '下载成功',
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



test2:function(guid,fileName){
  const FileSystemManager = wx.getFileSystemManager()
  wx.downloadFile({
    url: 'https://group.gzywudao.top/php/public/miniapp.php/group/downloadfile/exchangelist',
    success(res) {
      if (res.statusCode === 200) {
        FileSystemManager.saveFile({//下载成功后保存到本地
          tempFilePath: res.tempFilePath,
          filePath: wx.env.USER_DATA_PATH + "/" + fileName,
          success(res2) {
            if (res2.errMsg == 'saveFile:ok') {
              console.log("111111111")
            }else{
              console.log("22222")
            }
          },
          fail() {
            console.log("333333333")
          }
        })
      }else{
        console.log("44444444")
      }
    },
    fail(){
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
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
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