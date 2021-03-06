(function() {
  var d = {
    qiniuUploadURL: "",
    qiniuImageURLPrefix: "",
    qiniuUploadToken: "",
    qiniuUploadTokenURL: "",
    qiniuUploadTokenFunction: null
  };
  module.exports = {
    init: f,
    upload: c,
  };

  function f(g) {
    d = {
      qiniuUploadURL: "",
      qiniuImageURLPrefix: "",
      qiniuUploadToken: "",
      qiniuUploadTokenURL: "",
      qiniuUploadTokenFunction: null
    };
    e(g)
  }

  function e(g) {
    if (g.uploadURL) {
      d.qiniuUploadURL = g.uploadURL
    } else {
      console.error("qiniu uploader need uploadURL")
    }
    if (g.uptoken) {
      d.qiniuUploadToken = g.uptoken
    } else {
      if (g.uptokenURL) {
        d.qiniuUploadTokenURL = g.uptokenURL
      } else {
        if (g.uptokenFunc) {
          d.qiniuUploadTokenFunction = g.uptokenFunc
        }
      }
    }
    if (g.domain) {
      d.qiniuImageURLPrefix = g.domain
    }
  }

  function c(i, j, g, h) {
    if (null == i) {
      console.error("qiniu uploader need filePath to upload");
      return
    }
    if (h) {
      f(h)
    }
    if (d.qiniuUploadToken) {
      b(i, j, g, h)
    } else {
      if (d.qiniuUploadTokenURL) {
        a(function() {
          b(i, j, g, h)
        })
      } else {
        if (d.qiniuUploadTokenFunction) {
          d.qiniuUploadToken = d.qiniuUploadTokenFunction()
        } else {
          console.error("qiniu uploader need one of [uptoken, uptokenURL, uptokenFunc]");
          return
        }
      }
    }
  }

  function b(j, l, g, i) {
    var h = d.qiniuUploadURL;
    var m = j.split("//")[1];
    if (i && i.key) {
      m = i.key
    }
    var k = {
      "token": d.qiniuUploadToken,
      "key": m
    };
    wx.uploadFile({
      url: h,
      filePath: j,
      name: "file",
      formData: k,
      success: function(o) {
        var q = o.data;
        var p = JSON.parse(q);
        var n = d.qiniuImageURLPrefix + p.key;
        p.imageURL = n;
        l(p)
      },
      fail: function(n) {
        g(n)
      }
    })
  }

  function a(g) {
    wx.request({
      url: d.qiniuUploadTokenURL,
      success: function(i) {
        var h = i.data.uptoken;
        d.qiniuUploadToken = h;
        if (g) {
          g()
        }
      }
    })
  }
})();