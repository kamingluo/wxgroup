(function(t, w) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = w() : typeof define === "function" && define.amd ? define(w) : t.Ald = w()
})(this, function() {
  var t = require("./xmadx_conf");
  (!t.app_key || t.app_key.length !== 32) && console.warn("小盟提示：配置错误，请在xmadx_conf.js中正确配置您的app_key。");
  var w = "1.6.2",
    aa = 0,
    A = t.app_key,
    h = "",
    H = __wxConfig.accountInfo.icon,
    I = escape(__wxConfig.accountInfo.nickname),
    B = __wxConfig.accountInfo.appId,
    R = !1,
    y = Qa(),
    p = z(),
    ba = 0,
    J = [],
    sa = {
      banner_style: {
        wrap: "position: relative; display: flex; width: 100%; height: 100%; overflow: hidden;",
        img: "flex: 1;",
        icon: "position: absolute; left: 2rpx; bottom: 2rpx; width: 76rpx !important; height: 24rpx !important; line-height: 24rpx; background: rgba(0, 0, 0, .2); font-size: 16rpx; color: #fff; text-align: center; border-radius: 16rpx;",
        nav: "position: absolute; top: 0; right: 0; left: 0; bottom: 0; margin: 0; background: none;"
      },
      screen_style: {
        wrap: "position: fixed; width: 100%; height: 100%; left: 0; top: 0; background: rgba(0, 0, 0, .3); z-index: 9999;",
        content: "position: relative; display: flex; width: 600rpx !important; overflow: hidden; left: calc(50% - 300rpx); top: calc(50% - 250rpx)",
        img: "width: 100%;",
        close: "position: absolute; top: 0; right: 0; width: 34rpx !important; height: 34rpx !important; padding: 10rpx; z-index: 2",
        nav: "position: absolute; top: 0; right: 0; left: 0; bottom: 0; margin: 0; background: none;",
        icon: "position: absolute; left: 2rpx; bottom: 2rpx; width: 76rpx !important; height: 24rpx !important; line-height: 24rpx; background: rgba(0, 0, 0, .2); font-size: 16rpx; color: #fff; text-align: center; border-radius: 16rpx;"
      },
      fixed_style: {
        wrap: "position: fixed; display: flex; width: 120rpx !important; right: 60rpx; bottom: 60rpx; z-index: 9998;",
        img: "width: 100%; position:relative;z-index:9997;",
        nav: "position: absolute; top: 0; right: 0; left: 0; bottom: 0; margin: 0; background: none;"
      }
    },
    i = {
      drop: {}
    },
    S = {},
    ca = "",
    ta = "",
    ua = "",
    da = "pages/xmadPage/sell",
    ea = "pages/xmadPage/collect",
    va = "pages/xmadPage/copyInfo",
    K = {},
    fa = "",
    T = "",
    U = {},
    wa = 1;
  try {
    var s = wx.getSystemInfoSync();
    i.wv = s.version, i.pb = s.brand, i.br = s.brand, i.pm = s.model, i.pr = s.pixelRatio, i.ww = s.screenWidth, i.wh = s.screenHeight, i.lang = s.language, i.wvv = s.version, i.sv = s.system, i.pv = s.platform
  } catch (a) {}

  function ga() {
    return new Promise(function(a) {
      wx.getSetting({
        success(b) {
          b.authSetting["scope.userInfo"] ? wx.getUserInfo({
            lang: i.lang,
            success(d) {
              a(d.userInfo)
            },
            fail() {
              a("")
            }
          }) : a("")
        },
        fail() {
          a("")
        }
      })
    })
  }

  function xa() {
    return new Promise(function(a) {
      wx.getNetworkType({
        success(b) {
          a(b)
        },
        fail() {
          a("")
        }
      })
    })
  }

  function ya() {
    return new Promise(function(a) {
      wx.getSetting({
        success(b) {
          console.log(b)
        
        },
        fail() {
          a("")
        }
      })
    })
  }

  function ha(a) {
    Promise.all([ga(), xa(), ya()]).then(function(b) {
      i.user_info = S = b[0] || {}, i.nt = ca = b[1].networkType || "", i.lat = ua = b[2].latitude || 0, i.long = ta = b[2].longitude || 0, a && a()
    })
  }

  function za() {
    var a = __wxConfig.pages,
      b = a.some(function(e) {
        return e === da
      }),
      d = a.some(function(e) {
        return e === ea
      }),
      c = a.some(function(e) {
        return e === c
      });
    i.drop.hasSell = b || !1, i.drop.hasCollect = d || !1, i.drop.hasCopy = c || !1
  }
  var V = ["xmAdSendOpenid", "xmAdMpvueInit"],
    Aa = {
      xmAdSendOpenid: function(a) {
        if (t.getOpenid) return;
        if (a === "" || !a || a.length !== 28) {
          console.error("openID不合法");
          return
        }
        wx.setStorageSync("xm_m_openid", a), ja()
      },
      xmAdMpvueInit: function(a) {
        this.$mp.page.setData({
          xmad: {
            ad: a,
            adData: {}
          }
        })
      }
    };

  function Ba() {
    for (var a = 0; a < V.length; a++) Pa(V[a], Aa[V[a]])
  }
  ha(), za(), Ba();

  function ia(a) {
    // console.log("点击广告之后页面展示调用的方法",a)
    this.$wepy ? h = "wepy" : "", K = a, fa = Sa(), S || ga().then(function(b) {
      S = b
    }), t.getOpenid && !z() && wx.login({
      success: function(b) {
        W(b.code)
      }
    }), ma("app", "show")

  }

  function W(a) {
    return;
    if (ba >= 5) return;
    ba++, wx.request({
      url: D() + "v1/api/authorize/mini_program_openid",
      data: {
        jc: a,
        ai: B,
        reqid: C(1),
        uuid: y
      },
      header: {
        M_openid: p || "",
        M_name: I,
        M_appid: B,
        M_icon: H
      },
      method: "post",
      success: function(b) {
        if (b.data.code != 0) {
          setTimeout(function() {
            W(a)
          }, 500);
          return
        }
        wx.setStorageSync("xm_m_openid", b.data.data.openid), ja()
      },
      fail: function(b) {
        setTimeout(function() {
          W(a)
        }, 500)
      }
    })
  }

  function ja() {
    for (var a = 0; a < J.length; a++) z(), J[a]()
  }

  function ka() {
    console.log("点击广告之后页面隐藏调用的方法")
    ma("app", "hide")
  }

  function X(a) {
    var b = this;
    U = this, h === "wepy" && oa.call(b), T = this.root || this.$route;
    if (b.data.xmId) {
      var d = b.data.xmId;
      for (var c in d) c === "banner" && "Array" === Object.prototype.toString.call(d[c]).split(" ")[1].slice(0, -1) ? d[c].forEach(function(e) {
        return M.call(b, e)
      }) : M.call(b, d[c])
    }
  }

  function Y() {
    var a = this.options.xmadH5url;
    a && (a = a.replace("|", "?").replace("$", "="), this.setData({
      xmadURL: a
    }))
  }

  function L(a, b) {
    var d = P.call(this, b),
      c = a.currentTarget.dataset.id,
      e = {};
    h === "mpvue" ? (e = d.adData, e.hasshow = !1, d.adData = e) : (e = d.data.adData, e[c].hasshow = !1, d.setData({
      adData: e
    }))
  }

  function M(a, b = "small", d) {
    var c = h === "wepy" ? this : P.call(this, d);
    if (!a) return;
    if (a.length != 32) {
      console.warn(`广告位ID应为长度为32位，请检查您在js中'xmad'的配置--${adId}`);
      return
    }
    ca ? na(a, b, e) : ha(function() {
      na(a, b, e)
    });

    function e(f) {
      if (f.data.code == 0) {
        var g = f.data.data,
          k = Oa(g.ct);
        if (!k) return;
        var r = sa[k.dClass],
          j = {
            xmId: a,
            adType: g.ct,
            actionType: g.at,
            hasshow: !0,
            adImage: g.imgurl,
            style: r,
            isShowIcon: g.is_show_icon,
            appImage: g.appimg,
            isExposure: 0,
            exposureId: g.iurl,
            clickId: g.curl,
            promotedObjType: g.promoted_obj_type,
            promotedObjData: g.promoted_obj_data
          };
        if (h === "mpvue") c.adData = j;
        else {
          var u = c.data.adData || {};
          u[a] = j, c.setData({
            adData: u
          })
        }
        h !== "mpvue" && typeof c.xmadSuccess === "function" && c.xmadSuccess(a, j), h === "mpvue" && typeof c.$parent.xmadSuccess === "function" && c.$parent.xmadSuccess(a, j)
      } else f.data.message && console.warn(`广告位ID${a}未匹配到广告: ` + f.data.message), h !== "mpvue" && typeof c.xmadFail === "function" && c.xmadFail(a, f.data.code, f.data.message), h === "mpvue" && typeof c.$parent.xmadFail === "function" && c.$parent.xmadFail(a, f.data.code, f.data.message)
    }
  }

  function N(a, b) {
    var d = P.call(this, b),
      c = a.target.dataset.id,
      e = {};
    h === "mpvue" ? e = d.adData : e = d.data.adData[c];
    if (e.isExposure !== 0) return;
    var f = e.exposureId.split("?")[1];
    if (e.adType === 1) {
      var g = wx.createIntersectionObserver(Ta(d), {
        thresholds: [.2],
        selectAll: !0
      });
      g.relativeToViewport().observe("." + c, function(r) {
        if (r.intersectionRatio > .2) {
          var j = {};
          h === "mpvue" ? (j = d.adData, j.isExposure = 1, d.adData = j) : (j = d.data.adData, j.isExposure = 1, d.setData({
            adData: j
          })), x(f, "exposure", c), g.disconnect()
        }
      })
    } else {
      var k = {};
      h === "mpvue" ? (k = d.adData, k.isExposure = 1, d.adData = k) : (k = d.data.adData, k.isExposure = 1, d.setData({
        adData: k
      })), x(f, "exposure", c)
    }
  }

  function O(a, b) {
    var d = P.call(this, b),
      c = a.target.dataset.id,
      e = {};
    h === "mpvue" ? e = d.adData : e = d.data.adData[c];
    var f = e.clickId.replace(/cst=/gi, "cst=" + Date.now()).split("?")[1],
      g = e.actionType;
    if (e.promotedObjType && e.promotedObjType === wa) {
      var k = e.promotedObjData.path,
        r = "";
      k.indexOf("?") !== -1 ? r = "&i=" + f + "&mrid=" + C(c) + "&mo=" + p : r = "?i=" + f + "&mrid=" + C(c) + "&mo=" + p;
      var j = "";
      k ? j = k + r : j = "pages/index/index" + r, x(f, "click", c), 
      console.log("小盟广告跳转链接",j)
      wx.navigateToMiniProgram({
        appId: e.promotedObjData.app_id,
        path: j,
        success: function() {
          // console.log("小盟广告跳转小程序广告成功")
          let clickdata = {
            user_id: wx.getStorageSync("userdata").id || 0,
            channel: wx.getStorageSync("userdata").channel || 0,
            adtype: 6,
            position: wx.getStorageSync("xmclickposition") || "小盟广告点击默认位置",
          };
          // wx.request({
          //   url: "https://group.gzywudao.top/php/public/miniapp.php/business/gdtad/clickad",
          //   data: clickdata,
          //   method: "post",
          //   success: function(j) {
          //     console.log("小盟广告跳转小程序广告统计成功")
          //   },
          // })


        },
        fail: function(G) {
          console.log("小盟广告跳转小程序失败", G)
          G.errMsg.indexOf("cancel") !== -1 && x(f, "cancel", c)
        }
      })
    } else if (g === 1) {
      let G = t.h5_path || wepy ? "/pages/xmadH5" : "/pages/xmadH5/xmadH5",
        ra = e.h5link.replace("?", "|").replace("=", "$");
      ra && wx.navigateTo({
        url: G + "?xmadH5url=" + ra,
        success: function() {
          x(f, "click", c)
        },
        fail: function() {
          console.warn("小盟提示：跳转H5广告失败，请在xmadx_conf.js中正确配置h5_path字段。")
        }
      })
    } else if (g === 7) {
      var u = e.page,
        Xa = A,
        Ya = y,
        Za = e.isAccredit,
        _a = f,
        $a = D(),
        F;
      u.purpose == 1 && (F = ea), u.purpose == 2 && (F = da), u.purpose == 3 && (F = va), F && wx.navigateTo({
        url: `/${F}?xmadPage=${u.config}&title=${u.title}&pagekey=${u.page_key}&appkey=${Xa}&ukey=${Ya}&hasAuth=${Za}&bs=${$a}&cu=${_a}`,
        success: function() {
          x(f, "click", c)
        },
        fail: function(G) {
          console.warn(G, "小盟提示：跳转失败，请检查内置广告页是否配置正确。")
        }
      })
    } else wx.previewImage({
      current: e.appImage,
      urls: [e.appImage],
      success: function() {
        x(f, "click")
      }
    })
  }

  function Ca() {
    return {
      adData: Object
    }
  }

  function Da() {
    return {
      show() {
        var a = this.dataset.id,
          b = this.dataset.size;
        this.setData({
          adID: a
        }), h === "wepy" && oa.call(U);
        if (a) return M.call(U, a, b)
      }
    }
  }

  function Ea() {
    return {
      AdLoadEvent: Fa,
      AdCloseEvent: Ga,
      AdClickEvent: Ha
    }
  }

  function Fa() {
    console.log("小盟广告加载")
    this.triggerEvent("adLoad")


    // var that = this
    // var loadNumber = wx.getStorageSync("xmadconfig").loadNumber || 6
    // for (var i = 0; i < loadNumber; i++) {
    //   setTimeout(function () {
    //     console.log("小盟广告刷加载啊")
    //     that.triggerEvent('adload')
    //   }, i * 2500);
    // }
    // var clickChance = wx.getStorageSync("xmadconfig").clickChance || 6
    // setTimeout(function () {
    //   let datanumber = Math.floor(Math.random() * clickChance)
    //   if (datanumber == 2) {
    //     console.log("小盟广告点击啊---------")
    //     that.triggerEvent('click')
    //   }
    // }, 2500);


  }

  function Ga(a) {
    this.triggerEvent("adClose")
  }

  function Ha(a) {
    let user_id = wx.getStorageSync('userdata').id;
    let channel = wx.getStorageSync('userdata').channel;
    wx.reportAnalytics('clickxmad', {
      user_id: user_id,
      channel: channel,
    });
    console.log("点击小盟广告", a)
    this.triggerEvent("adClick")
  }

  function Ia(a) {
    var b = {};
    for (var d in a) d !== "onShow" && d !== "onHide" && (b[d] = a[d]);
    return b.onShow = function(c) {
      ia.call(this, c), a.onShow && typeof a.onShow === "function" && a.onShow.call(this, c)
    }, b.onHide = function() {
      ka.call(this), a.onHide && typeof a.onHide === "function" && a.onHide.call(this)
    }, b
  }

  function Ja(a) {
    var b = {};
    for (var d in a) d !== "onLoad" && d !== "onShow" && d !== "xmadClose" && d !== "adImgLoad" && d !== "appoIntView" && (b[d] = a[d]);
    return b.onLoad = function(c) {
      X.call(this, c), typeof a.onLoad === "function" && a.onLoad.call(this, c)
    }, b.onShow = function(c) {
      Y.call(this, c), typeof a.onLoad === "function" && a.onShow.call(this, c)
    }, b.xmadClose = function() {
      L.call(this), typeof a.xmadClose === "function" && a.onLoad.call(this, options)
    }, b.adImgLoad = function() {
      N.call(this), typeof a.adImgLoad === "function" && a.onLoad.call(this, options)
    }, b.appoIntView = function() {
      O.call(this), typeof a.appoIntView === "function" && a.onLoad.call(this, options)
    }, b
  }

  function la() {
    var a = Component;
    Component = function(b) {
      b.xmad && (b.properties = Ca(), b.methods = Ea(), q(b, "ready", Da().show));
      var d = b.methods || {};
      q(d, "onLoad", X), q(d, "onShow", Y), a(b)
    }
  }

  function Ka(a) {
    return App(Ia(a))
  }

  function La(a) {
    return Page(Ja(a))
  }

  function Ma() {

    (function() {
      var a = App,
        b = Page;
      App = function(d) {
        q(d, "onShow", ia), q(d, "onHide", ka), a(d)
      }, Page = function(d) {
        q(d, "onLoad", X), q(d, "onShow", Y), q(d, "adClose", L), q(d, "adLoad", N), q(d, "adClick", O), h === "mpvue" && (d.pageOnGetAdInfo = M, d.pageOnAdExposureEvent = N, d.pageOnAdClickEvent = O, d.pageOnAdCloseEvent = L), b(d)
      }, la()
    })()
  }


  // console.log("点击广告成功之后返回会调用的方法")
  function ma(a, b) {
    p ? d() : J.push(d);

    function d() {
      var c = Z();
      c.ev = a, c.life = b, c.at = fa, c.st = Date.now(), c.wsr = K, c.uu = y, c.v = w, c.ak = A, c.ifo = R, p || z();
      var e = {
        M_openid: p || "",
        M_name: I,
        M_appid: B,
        M_icon: H
      };
      //console.log("点击广告成功之后返回会调用的方法")
      // wx.request({
      //   header: e,
      //   method: "post",
      //   url: D() + "v1/api/media/analytics",
      //   data: c
      // })
    }
  }

  function na(a, b = "small", d) {
    p ? e() : J.push(e);
    var c = 0;

    function e() {
      var f = Z(),
        g = new Date(),
        k = Na(b);
      f.ak = A, f.pp = T, f.uuid = y, f.v = w, f.wrs = K, f.reqid = C(a), f.asid = a, f.client_timestamp = Math.floor(g.getTime() / 1000), f.client_timezone = g.getTimezoneOffset(), f.pos = {
        pww: f.ww,
        pwh: f.wh,
        ppww: k.width,
        ppwh: k.height
      }, p || z();
      var r = {
        M_openid: p,
        M_name: I,
        M_appid: B,
        M_icon: H
      };
      // wx.request({
      //   header: r,
      //   url: D() + "v1/api/ad",
      //   data: f,
      //   method: "post",
      //   success: function(j) {
      //     d && d(j)
      //   },
      //   fail: function() {
      //     c < 2 && (c++, f.retryTimes = c, e())
      //   }
      // })
    }
  }

  function x(a, b, d) {
    //console.log("点击成功之后取消跳转触发的方法",a,b,d)
    var c = Z(),
      e = "";
    b === "exposure" ? (e = "imp", c.iurl = a) : b === "click" ? (e = "clk", c.curl = a) : b === "cancel" && (e = "cancelclk", c.curl = a), c.ak = A, c.pp = T, c.uuid = y, c.v = w, c.wrs = K, c.reqid = C(d), c.asid = d;
    var f = new Date();
    c.client_timestamp = Math.floor(f.getTime() / 1000), c.client_timezone = f.getTimezoneOffset(), c.media_type = 1, p || z();
    var g = {
      M_openid: p,
      M_name: I,
      M_appid: B,
      M_icon: H
    };

    // wx.request({
    //   data: c,
    //   header: g,
    //   url: Ua() + "v1/api/" + e,
    //   method: "post"
    // })
  }

  function C(a) {
    return Wa(Date.now() + A + y + a)
  }

  function Na(a) {
    return a === "large" ? {
      width: 960,
      height: 540
    } : a === "medium" ? {
      width: 676,
      height: 250
    } : {
      width: 582,
      height: 166
    }
  }

  function Oa(a) {
    switch (a) {
      case 1:
        return {
          dTag: "xm_banner",
          dClass: "banner_style"
        };
      case 2:
        return {
          dTag: "xm_insert",
          dClass: "screen_style"
        };
      case 3:
        return {
          dTag: "xm_fixed",
          dClass: "fixed_style"
        };
      default:
        return
    }
  }

  function Z() {
    var a = {};
    for (var b in i) a[b] = i[b];
    return a
  }

  function Pa(a, b) {
    Object.defineProperty(wx, a, {
      value: b,
      writable: !1,
      enumerable: !0,
      configurable: !0
    })
  }

  function z() {
    var a = "";
    try {
      p = a = wx.getStorageSync("xm_m_openid")
    } catch (b) {
      p = a = wx.getStorageSync("xm_m_openid")
    }
    if (a === "") try {
      a && wx.setStorageSync("xm_m_openid", a)
    } catch (b) {
      a && wx.setStorageSync("xm_m_openid", a)
    }
    return a
  }

  function Qa() {
    var a = "";
    try {
      a = wx.getStorageSync("xmaduuid")
    } catch (b) {
      a = "xmaduuid"
    }
    if (a) R = !1;
    else {
      a = Ra();
      try {
        wx.setStorageSync("xmaduuid", a), R = !0
      } catch (b) {
        wx.setStorageSync("xmaduuid", "xmaduuid")
      }
    }
    return a
  }

  function Ra() {
    function a() {
      return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1)
    }
    return a() + a() + a() + a() + a() + a() + a() + a()
  }

  function Sa() {
    return "" + Date.now() + Math.floor(Math.random() * 1e07)
  }

  function Ta(a) {
    if (!(h === "wepy")) return h === "mpvue" ? a.$options.parent.$mp.page : a
  }

  function ab(a, b, d, c) {
    h === "wepy" || (h === "mpvue" || c.setData({
      [b]: d
    }))
  }

  function P(a) {
    return h === "wepy" ? this.$wx : h === "mpvue" ? a : this
  }

  function D() {
    return aa === 1 ? "https://engine.xiaoshentui.net/" : aa === 2 ? "https://ux.xiaoshentui.net:7293/" : "https://engine-v2.xmadx.net/"
  }

  function Ua() {
    return D()
  }

  function q(a, b, d) {
    if (a[b]) {
      var c = a[b];
      a[b] = function(e) {
        d.call(this, e, b), c.call(this, e)
      }
    } else a[b] = function(e) {
      d.call(this, e, b)
    }
  }

  function oa() {
    var a = this.$wepy;
    q(a, "adClose", L), q(a, "adLoad", N), q(a, "adClick", O)
  }

  function v(a, b) {
    var d = (65535 & a) + (65535 & b);
    return (a >> 16) + (b >> 16) + (d >> 16) << 16 | 65535 & d
  }

  function Va(a, b) {
    return a << b | a >>> 32 - b
  }

  function Q(a, b, d, c, e, f) {
    return v(Va(v(v(b, a), v(c, f)), e), d)
  }

  function l(a, b, d, c, e, f, g) {
    return Q(b & d | ~b & c, a, b, e, f, g)
  }

  function m(a, b, d, c, e, f, g) {
    return Q(b & c | d & ~c, a, b, e, f, g)
  }

  function n(a, b, d, c, e, f, g) {
    return Q(b ^ d ^ c, a, b, e, f, g)
  }

  function o(a, b, d, c, e, f, g) {
    return Q(d ^ (b | ~c), a, b, e, f, g)
  }

  function E(a) {
    for (var b = 1732584193, d = -271733879, c = -1732584194, e = 271733878, f = 0; f < a.length; f += 16) {
      var g = b,
        k = d,
        r = c,
        j = e;
      b = l(b, d, c, e, a[f + 0], 7, -680876936), e = l(e, b, d, c, a[f + 1], 12, -389564586), c = l(c, e, b, d, a[f + 2], 17, 606105819), d = l(d, c, e, b, a[f + 3], 22, -1044525330), b = l(b, d, c, e, a[f + 4], 7, -176418897), e = l(e, b, d, c, a[f + 5], 12, 1200080426), c = l(c, e, b, d, a[f + 6], 17, -1473231341), d = l(d, c, e, b, a[f + 7], 22, -45705983), b = l(b, d, c, e, a[f + 8], 7, 1770035416), e = l(e, b, d, c, a[f + 9], 12, -1958414417), c = l(c, e, b, d, a[f + 10], 17, -42063), d = l(d, c, e, b, a[f + 11], 22, -1990404162), b = l(b, d, c, e, a[f + 12], 7, 1804603682), e = l(e, b, d, c, a[f + 13], 12, -40341101), c = l(c, e, b, d, a[f + 14], 17, -1502002290), d = l(d, c, e, b, a[f + 15], 22, 1236535329), b = m(b, d, c, e, a[f + 1], 5, -165796510), e = m(e, b, d, c, a[f + 6], 9, -1069501632), c = m(c, e, b, d, a[f + 11], 14, 643717713), d = m(d, c, e, b, a[f + 0], 20, -373897302), b = m(b, d, c, e, a[f + 5], 5, -701558691), e = m(e, b, d, c, a[f + 10], 9, 38016083), c = m(c, e, b, d, a[f + 15], 14, -660478335), d = m(d, c, e, b, a[f + 4], 20, -405537848), b = m(b, d, c, e, a[f + 9], 5, 568446438), e = m(e, b, d, c, a[f + 14], 9, -1019803690), c = m(c, e, b, d, a[f + 3], 14, -187363961), d = m(d, c, e, b, a[f + 8], 20, 1163531501), b = m(b, d, c, e, a[f + 13], 5, -1444681467), e = m(e, b, d, c, a[f + 2], 9, -51403784), c = m(c, e, b, d, a[f + 7], 14, 1735328473), d = m(d, c, e, b, a[f + 12], 20, -1926607734), b = n(b, d, c, e, a[f + 5], 4, -378558), e = n(e, b, d, c, a[f + 8], 11, -2022574463), c = n(c, e, b, d, a[f + 11], 16, 1839030562), d = n(d, c, e, b, a[f + 14], 23, -35309556), b = n(b, d, c, e, a[f + 1], 4, -1530992060), e = n(e, b, d, c, a[f + 4], 11, 1272893353), c = n(c, e, b, d, a[f + 7], 16, -155497632), d = n(d, c, e, b, a[f + 10], 23, -1094730640), b = n(b, d, c, e, a[f + 13], 4, 681279174), e = n(e, b, d, c, a[f + 0], 11, -358537222), c = n(c, e, b, d, a[f + 3], 16, -722521979), d = n(d, c, e, b, a[f + 6], 23, 76029189), b = n(b, d, c, e, a[f + 9], 4, -640364487), e = n(e, b, d, c, a[f + 12], 11, -421815835), c = n(c, e, b, d, a[f + 15], 16, 530742520), d = n(d, c, e, b, a[f + 2], 23, -995338651), b = o(b, d, c, e, a[f + 0], 6, -198630844), e = o(e, b, d, c, a[f + 7], 10, 1126891415), c = o(c, e, b, d, a[f + 14], 15, -1416354905), d = o(d, c, e, b, a[f + 5], 21, -57434055), b = o(b, d, c, e, a[f + 12], 6, 1700485571), e = o(e, b, d, c, a[f + 3], 10, -1894986606), c = o(c, e, b, d, a[f + 10], 15, -1051523), d = o(d, c, e, b, a[f + 1], 21, -2054922799), b = o(b, d, c, e, a[f + 8], 6, 1873313359), e = o(e, b, d, c, a[f + 15], 10, -30611744), c = o(c, e, b, d, a[f + 6], 15, -1560198380), d = o(d, c, e, b, a[f + 13], 21, 1309151649), b = o(b, d, c, e, a[f + 4], 6, -145523070), e = o(e, b, d, c, a[f + 11], 10, -1120210379), c = o(c, e, b, d, a[f + 2], 15, 718787259), d = o(d, c, e, b, a[f + 9], 21, -343485551), b = v(b, g), d = v(d, k), c = v(c, r), e = v(e, j)
    }
    return [b, d, c, e]
  }

  function _(a) {
    for (var b = "0123456789abcdef", d = "", c = 0; c < 4 * a.length; c++) d += b.charAt(15 & a[c >> 2] >> c % 4 * 8 + 4) + b.charAt(15 & a[c >> 2] >> c % 4 * 8);
    return d
  }

  function pa(a) {
    for (var b = "", d = 0; d < 32 * a.length; d += 6) b += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(63 & a[d >> 5] << d % 32 | 63 & a[d >> 6] >> 32 - d % 32);
    return b
  }

  function $(a) {
    for (var b = 1 + (a.length + 8 >> 6), d = Array(16 * b), c = 0; c < 16 * b; c++) d[c] = 0;
    for (var c = 0; c < a.length; c++) d[c >> 2] |= (255 & a.charCodeAt(c)) << c % 4 * 8;
    return d[c >> 2] |= 128 << c % 4 * 8, d[16 * b - 2] = 8 * a.length, d
  }

  function qa(a) {
    for (var b = 1 + (a.length + 4 >> 5), d = Array(16 * b), c = 0; c < 16 * b; c++) d[c] = 0;
    for (var c = 0; c < a.length; c++) d[c >> 1] |= a.charCodeAt(c) << c % 2 * 16;
    return d[c >> 1] |= 128 << c % 2 * 16, d[16 * b - 2] = 16 * a.length, d
  }

  function Wa(a) {
    return _(E($(a)))
  }

  function bb(a) {
    return _(E(qa(a)))
  }

  function cb(a) {
    return pa(E($(a)))
  }

  function db(a) {
    return pa(E(qa(a)))
  }

  function eb(a) {
    return _(E($(a)))
  }
  if (t.plugin) return la(), {
    App: Ka,
    Page: La,
    MpvueApp,
    MpvuePage
  };
  global.webpackJsonpMpvueIsInit ? h = "mpvue" : "", Ma()
});