! function (t, n) {
  "object" == typeof exports && "undefined" != typeof module ? module.exports = n() : "function" == typeof define && define.amd ? define(n) : t.Ald = n()
}(this, function () {
  function t() {
    this.concurrency = 4, this.queue = [], this.tasks = [], this.activeCount = 0;
    var t = this;
    this.push = function (n) {
      this.tasks.push(new Promise(function (e, o) {
        var a = function () {
          t.activeCount++, n().then(function (t) {
            e(t)
          }).then(function () {
            t.next()
          })
        };
        t.activeCount < t.concurrency ? a() : t.queue.push(a)
      }))
    }, this.all = function () {
      return Promise.all(this.tasks)
    }, this.next = function () {
      t.activeCount--, t.queue.length > 0 && t.queue.shift()()
    }
  }

  function n() {
    this.request = [], this.updata = !1, this.push = function (t) {
      if (this.request.length >= 8 && !this.updata && (this.updata = !0, e()), this.request.length >= 10) {
        let n = this.request.shift();
        n().then(function (t) {}).catch(t => {}), this.request.push(t)
      } else this.request.push(t)
    }, this.concat = function () {
      this.request.map(function (t) {
        wx.Queue.push(t)
      }), this.request = []
    }
  }

  function e() {
    "function" == typeof _t && "" === K && _t().then(function (t) {
      28 === t.length && (K = t, wx.setStorageSync("aldstat_op", t))
    })
  }

  function o(t) {
    this.app = t
  }

  function a(t) {
    B = m(), V = t, ft = t.scene, this.aldstat = new o(this)
  }

  function r(t) {
    e();
    var n;
    if (n = t.scene != ft, ft = t.scene, z = 0, V = t, F = t.query.ald_share_src, X = t.query.aldsrc || "", Y = t.query.ald_share_src, ut || ht || vt || (W = !1), ut = !1, (0 !== Q && Date.now() - Q > 3e4 || n) && (ht || (T = m(), N = Date.now(), wt = 0)), 0 !== Q && Date.now() - Q < 3e4 && (at = !0), t.query.ald_share_src && "1044" == t.scene && t.shareTicket ? wx.getShareInfo({
        shareTicket: t.shareTicket,
        success: function (t) {
          tt = t, I("event", "ald_share_click", JSON.stringify(t))
        }
      }) : t.query.ald_share_src && I("event", "ald_share_click", 1), "" === nt && wx.getSetting({
        withCredentials: !0,
        success: function (t) {
          if (t.authSetting["scope.userInfo"]) {
            dt && (dt = !1, wx.getUserInfo({
              withCredentials: !0,
              success: function (t) {
                var n = v();
                nt = t, n.ufo = y(t), G = _(t.userInfo.avatarUrl.split("/")), g(n)
              }
            }))
          }
        }
      }), D("app", "show"), "" === K) {
      let t = wx.getAccountInfoSync().miniProgram.appId;
      wx.login({
        success(n) {
          wx.request({
            url: "https://log.aldwx.com/authorize/mini_program_openid",
            data: {
              ai: t,
              uuid: $,
              jc: n.code,
              reqid: "1"
            },
            success(t) {
              t.data.code || (K = t.data.data.openid, wx.setStorageSync("aldstat_op", t.data.data.openid))
            }
          })
        },
        fail(t) {}
      })
    }
  }

  function s() {
    e(), Q = Date.now(), "" === nt && wx.getSetting({
      success: function (t) {
        t.authSetting["scope.userInfo"] && dt && (dt = !1, wx.getUserInfo({
          withCredentials: !0,
          success: function (t) {
            nt = t, G = _(t.userInfo.avatarUrl.split("/"));
            var n = v();
            n.ufo = y(t), g(n)
          }
        }))
      }
    }), D("app", "hide")
  }

  function i(t) {
    Z++, I("event", "ald_error_message", t)
  }

  function c(t) {
    it = t
  }

  function u() {
    pt = Date.now(), rt = j ? this.$mp.page.route : this.route, "" === nt && wx.getSetting({
      success: function (t) {
        t.authSetting["scope.userInfo"] && dt && (dt = !1, wx.getUserInfo({
          withCredentials: !0,
          success: function (t) {
            nt = t, G = _(t.userInfo.avatarUrl.split("/"));
            var n = v();
            n.ufo = y(t), g(n)
          }
        }))
      }
    }), q("page", "show"), at = !1
  }

  function h() {
    st = rt, wt = Date.now() - pt
  }

  function f() {
    st = rt, wt = Date.now() - pt
  }

  function l() {
    I("event", "ald_pulldownrefresh", 1)
  }

  function d() {
    I("event", "ald_reachbottom", 1)
  }

  function p(t) {
    ht = !0;
    var n = S(t.path),
      e = {};
    for (var o in V.query) "ald_share_src" !== o && "ald_share_op" !== o || (e[o] = V.query[o]);
    var a = "";
    if (a = t.path.indexOf("?") == -1 ? t.path + "?" : t.path.substr(0, t.path.indexOf("?")) + "?", "" !== n)
      for (var o in n) e[o] = n[o];
    e.ald_share_src ? e.ald_share_src.indexOf($) == -1 && e.ald_share_src.length < 200 && (e.ald_share_src = e.ald_share_src + "," + $) : e.ald_share_src = $, C.useOpen && (e.ald_share_op ? e.ald_share_op.indexOf(K) == -1 && e.ald_share_op.length < 200 && (e.ald_share_op = e.ald_share_op + "," + K) : e.ald_share_op = K);
    for (var r in e) r.indexOf("ald") == -1 && (a += r + "=" + e[r] + "&");
    return t.path = a + (C.useOpen ? "ald_share_op=" + e.ald_share_op + "&" : "") + "ald_share_src=" + e.ald_share_src, I("event", "ald_share_status", t), t
  }

  function w() {
    function t() {
      return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
    }
    return t() + t() + t() + t() + t() + t() + t() + t()
  }

  function g(t) {
    function n() {
      return new Promise(function (n, e) {
        var o = {
          AldStat: "MiniApp-Stat",
          se: J || "",
          op: K || "",
          img: G
        };
        "" === E || (o.ai = E), wx.request({
          url: "https://" + H + ".aldwx.com/d.html",
          data: t,
          header: o,
          method: "GET",
          success: function (t) {
            n(200 == t.statusCode ? "" : "status error")
          },
          fail: function () {
            n("fail")
          }
        })
      })
    }
    z++, t.at = T, t.uu = $, t.v = U, t.ak = C.app_key.replace(/(\t)|(\s)/g, ""), t.wsr = V, t.ifo = W, t.rq_c = z, t.ls = B, t.te = b, t.et = Date.now(), t.st = Date.now(), C.useOpen ? "" === K ? lt.push(n) : (wx.Queue.push(n), lt.concat()) : wx.Queue.push(n)
  }

  function v() {
    var t = {};
    for (var n in et) t[n] = et[n];
    return t
  }

  function _(t) {
    for (var n = "", e = 0; e < t.length; e++) t[e].length > n.length && (n = t[e]);
    return n
  }

  function m() {
    return "" + Date.now() + Math.floor(1e7 * Math.random())
  }

  function y(t) {
    var n = {};
    for (var e in t) "rawData" != e && "errMsg" != e && (n[e] = t[e]);
    return n
  }

  function S(t) {
    if (t.indexOf("?") == -1) return "";
    var n = {};
    return t.split("?")[1].split("&").forEach(function (t) {
      var e = t.split("=")[1];
      n[t.split("=")[0]] = e
    }), n
  }

  function x(t) {
    for (var n in t)
      if ("object" == typeof t[n] && null !== t[n]) return !0;
    return !1
  }

  function D(t, n) {
    var e = v();
    e.ev = t, e.life = n, e.ec = Z, e.dr = Date.now() - N, "show" == n && (e.uo = C.useOpen), X && (e.qr = X, e.sr = X), F && (e.usr = F), g(e)
  }

  function q(t, n) {
    var e = v();
    e.ev = t, e.life = n, e.pp = rt, e.pc = st, e.dr = Date.now() - N, (ht || vt) && (e.so = 1), vt = !1, ht = !1, it && "{}" != JSON.stringify(it) && (e.ag = it), X && (e.qr = X, e.sr = X), F && (e.usr = F), at && (e.ps = 1), ot ? e.pdr = wt : (ct = rt, ot = !0, e.ifp = ot, e.fp = rt, e.pdr = 0), g(e)
  }

  function I(t, n, e) {
    var o = v();
    o.ev = t, o.tp = n, o.dr = Date.now() - N, e && (o.ct = e), g(o)
  }

  function A(t, n, e) {
    if (t[n]) {
      var o = t[n];
      t[n] = function (t) {
        e.call(this, t, n), o.call(this, t)
      }
    } else t[n] = function (t) {
      e.call(this, t, n)
    }
  }

  function O(t) {
    var n = {};
    for (var e in t) "onLaunch" !== e && "onShow" !== e && "onHide" !== e && "onError" !== e && (n[e] = t[e]);
    return n.onLaunch = function (n) {
      a.call(this, n), "function" == typeof t.onLaunch && t.onLaunch.call(this, n)
    }, n.onShow = function (n) {
      r.call(this, n), t.onShow && "function" == typeof t.onShow && t.onShow.call(this, n)
    }, n.onHide = function () {
      s.call(this), t.onHide && "function" == typeof t.onHide && t.onHide.call(this)
    }, n.onError = function (n) {
      i.call(this, n), t.onError && "function" == typeof t.onError && t.onError.call(this, n)
    }, n
  }

  function M(t) {
    var n = {};
    for (var e in t) "onLoad" !== e && "onShow" !== e && "onHide" !== e && "onUnload" !== e && "onPullDownRefresh" !== e && "onReachBottom" !== e && "onShareAppMessage" !== e && (n[e] = t[e]);
    return n.onLoad = function (n) {
      c.call(this, n), "function" == typeof t.onLoad && t.onLoad.call(this, n)
    }, n.onShow = function (n) {
      u.call(this), "function" == typeof t.onShow && t.onShow.call(this, n)
    }, n.onHide = function (n) {
      h.call(this), "function" == typeof t.onHide && t.onHide.call(this, n)
    }, n.onUnload = function (n) {
      f.call(this), "function" == typeof t.onUnload && t.onUnload.call(this, n)
    }, n.onReachBottom = function (n) {
      d(), t.onReachBottom && "function" == typeof t.onReachBottom && t.onReachBottom.call(this, n)
    }, n.onPullDownRefresh = function (n) {
      l(), t.onPullDownRefresh && "function" == typeof t.onPullDownRefresh && t.onPullDownRefresh.call(this, n)
    }, t.onShareAppMessage && "function" == typeof t.onShareAppMessage && (n.onShareAppMessage = function (n) {
      var e = t.onShareAppMessage.call(this, n);
      return void 0 === e ? (e = {}, e.path = this.route) : void 0 === e.path && (e.path = this.route), p.call(this, e)
    }), n
  }

  function P(t) {
    return App(O(t))
  }

  function k(t) {
    return Page(M(t))
  }

  function L(t) {
    return j = !0, O(t)
  }

  function R(t) {
    return M(t)
  }
  var C = require("./ald-stat-conf");
  void 0 === wx.Queue && (wx.Queue = new t, wx.Queue.all()), "" === C.app_key && console.error("请在ald-stat-conf.js文件中填写小程序统计/广告监测平台创建小程序后生成的app_key，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南！"), C.useOpen && console.warn("提示：开启了useOpen配置后，如果不上传用户OpendID则不会上报数据，上传方式：http://doc.aldwx.com 小程序统计/广告监测平台-快速接入指南-上传OpenID！");
  var U = "7.3.8",
    H = "log",
    b = "wx",
    E = function () {
      return void 0 === wx.getAccountInfoSync ? "" : wx.getAccountInfoSync().miniProgram.appId.split("").map(function (t) {
        return t.charCodeAt(0) + 9
      }).join("-")
    }(),
    j = !1,
    T = m(),
    B = "",
    N = Date.now(),
    Q = 0,
    J = "",
    K = function () {
      var t = "";
      try {
        t = wx.getStorageSync("aldstat_op")
      } catch (t) {}
      return t
    }(),
    G = "",
    z = 0,
    V = "",
    W = "",
    $ = function () {
      var t = "";
      try {
        t = wx.getStorageSync("aldstat_uuid")
      } catch (n) {
        t = "uuid_getstoragesync"
      }
      if (t) W = !1;
      else {
        t = w();
        try {
          wx.setStorageSync("aldstat_uuid", t), W = !0
        } catch (t) {
          wx.setStorageSync("aldstat_uuid", "uuid_getstoragesync")
        }
      }
      return t
    }(),
    F = "",
    X = "",
    Y = "",
    Z = 0,
    tt = "",
    nt = "",
    et = {},
    ot = !1,
    at = !1,
    rt = "",
    st = "",
    it = "",
    ct = "",
    ut = !0,
    ht = !1,
    ft = "",
    lt = new n,
    dt = !0,
    pt = 0,
    wt = 0,
    gt = [{
      name: "scanCode"
    }, {
      name: "chooseAddress"
    }, {
      name: "chooseImage"
    }, {
      name: "previewImage"
    }, {
      name: "chooseInvoiceTitle"
    }, {
      name: "chooseInvoice"
    }],
    vt = !1;
  ! function () {
    gt.forEach(function (t) {
      t.fn = wx[t.name];
      var n = t.name;
      try {
        Object.defineProperty(wx, n, {
          get: function () {
            return vt = !0, t.fn
          }
        })
      } catch (t) {}
    })
  }();
  var _t = "";
  ! function () {
    wx.request({
      url: "https://" + H + ".aldwx.com/config/app.json",
      header: {
        AldStat: "MiniApp-Stat"
      },
      method: "GET",
      success: function (t) {
        200 === t.statusCode && (U < t.data.version && console.warn("您的SDK不是最新版本，部分功能不可用，请尽快前往 http://tj.aldwx.com/downSDK 升级"), t.data.warn && console.warn(t.data.warn), t.data.error && console.error(t.data.error))
      }
    })
  }(), wx.aldstat = new o("");
  try {
    var mt = wx.getSystemInfoSync();
    et.br = mt.brand, et.pm = mt.model, et.pr = mt.pixelRatio, et.ww = mt.windowWidth, et.wh = mt.windowHeight, et.lang = mt.language, et.wv = mt.version, et.wvv = mt.platform, et.wsdk = mt.SDKVersion, et.sv = mt.system
  } catch (t) {}
  wx.getNetworkType({
    success: function (t) {
      et.nt = t.networkType
    }
  }), wx.getSetting({
    success: function (t) {
      console.log(t)

    }
  }), o.prototype.sendEvent = function (t, n) {
    if ("" !== t && "string" == typeof t && t.length <= 255)
      if ("string" == typeof n && n.length <= 255) I("event", t, n);
      else if ("object" == typeof n) {
      if (JSON.stringify(n).length >= 255) return void console.error("自定义事件参数不能超过255个字符，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-自定义事件！");
      if (x(n)) return void console.error("事件参数内部只支持Number、String等类型，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-自定义事件！");
      I("event", t, JSON.stringify(n))
    } else void 0 === n ? I("event", t, !1) : console.error("事件参数必须为String、Object类型，且参数长度不能超过255个字符，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-自定义事件！");
    else console.error("事件名称必须为String类型且不能超过255个字符，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-自定义事件！")
  }, o.prototype.sendSession = function (t) {
    if ("" === t || !t) return void console.error("请传入从后台获取的session_key");
    J = t;
    var n = v();
    n.tp = "session", n.ct = "session", n.ev = "event", "" === nt ? wx.getSetting({
      success: function (t) {
        t.authSetting["scope.userInfo"] ? wx.getUserInfo({
          success: function (t) {
            n.ufo = y(t), G = _(t.userInfo.avatarUrl.split("/")), "" !== tt && (n.gid = tt), g(n)
          }
        }) : "" !== tt && (n.gid = tt, g(n))
      }
    }) : (n.ufo = nt, "" !== tt && (n.gid = tt), g(n))
  }, o.prototype.sendOpenid = function (t) {
    if ("" === t || !t || 28 !== t.length) return void console.error("OpenID不符合规则，请参考接入文档 http://doc.aldwx.com 小程序统计/广告监测平台-快速接入指南！");
    K = t, wx.setStorageSync("aldstat_op", t);
    var n = v();
    n.tp = "openid", n.ev = "event", n.ct = "openid", g(n)
  }, o.prototype.setOpenid = function (t) {
    "function" == typeof t && (_t = t, e())
  };
  return C.plugin ? {
    App: P,
    Page: k,
    MpvueApp: L,
    MpvuePage: R
  } : function (t) {
    ! function () {
      var t = App,
        n = Page,
        e = Component;
      App = function (n) {
        A(n, "onLaunch", a), A(n, "onShow", r), A(n, "onHide", s), A(n, "onError", i), t(n)
      }, Page = function (t) {
        var e = t.onShareAppMessage;
        A(t, "onLoad", c), A(t, "onUnload", f), A(t, "onShow", u), A(t, "onHide", h), A(t, "onReachBottom", d), A(t, "onPullDownRefresh", l), void 0 !== e && null !== e && (t.onShareAppMessage = function (t) {
          if (void 0 !== e) {
            var n = e.call(this, t);
            return void 0 === n ? (n = {}, n.path = rt) : void 0 === n.path && (n.path = rt), p(n)
          }
        }), n(t)
      }, Component = function (t) {
        try {
          var n = t.methods.onShareAppMessage;
          A(t.methods, "onLoad", c), A(t.methods, "onUnload", f), A(t.methods, "onShow", u), A(t.methods, "onHide", h), A(t.methods, "onReachBottom", d), A(t.methods, "onPullDownRefresh", l), void 0 !== n && null !== n && (t.methods.onShareAppMessage = function (t) {
            if (void 0 !== n) {
              var e = n.call(this, t);
              return void 0 === e ? (e = {}, e.path = rt) : void 0 === e.path && (e.path = rt), p(e)
            }
          }), e(t)
        } catch (n) {
          e(t)
        }
      }
    }()
  }()
});