(function(e){function t(t){for(var r,a,c=t[0],i=t[1],f=t[2],s=0,l=[];s<c.length;s++)a=c[s],o[a]&&l.push(o[a][0]),o[a]=0;for(r in i)Object.prototype.hasOwnProperty.call(i,r)&&(e[r]=i[r]);p&&p(t);while(l.length)l.shift()();return u.push.apply(u,f||[]),n()}function n(){for(var e,t=0;t<u.length;t++){for(var n=u[t],r=!0,a=1;a<n.length;a++){var c=n[a];0!==o[c]&&(r=!1)}r&&(u.splice(t--,1),e=i(i.s=n[0]))}return e}var r={},a={app:0},o={app:0},u=[];function c(e){return i.p+"js/"+({}[e]||e)+"."+{"chunk-0af95675":"d6e1e429","chunk-267e25b5":"86a7c3fc","chunk-2690e87e":"5fedbe27","chunk-578590e0":"8d57f396","chunk-66ff1f80":"61322a26","chunk-72949ec8":"e843263c","chunk-9ec19868":"c5e96cf2","chunk-b47ec044":"54c1c1d6"}[e]+".js"}function i(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.e=function(e){var t=[],n={"chunk-0af95675":1,"chunk-267e25b5":1,"chunk-2690e87e":1,"chunk-578590e0":1,"chunk-66ff1f80":1,"chunk-72949ec8":1,"chunk-9ec19868":1,"chunk-b47ec044":1};a[e]?t.push(a[e]):0!==a[e]&&n[e]&&t.push(a[e]=new Promise(function(t,n){for(var r="css/"+({}[e]||e)+"."+{"chunk-0af95675":"07d8ae18","chunk-267e25b5":"fa350a65","chunk-2690e87e":"52a60f6a","chunk-578590e0":"2ef6ea83","chunk-66ff1f80":"a081e7d7","chunk-72949ec8":"67cd667f","chunk-9ec19868":"d3e094d2","chunk-b47ec044":"470950ab"}[e]+".css",o=i.p+r,u=document.getElementsByTagName("link"),c=0;c<u.length;c++){var f=u[c],s=f.getAttribute("data-href")||f.getAttribute("href");if("stylesheet"===f.rel&&(s===r||s===o))return t()}var l=document.getElementsByTagName("style");for(c=0;c<l.length;c++){f=l[c],s=f.getAttribute("data-href");if(s===r||s===o)return t()}var p=document.createElement("link");p.rel="stylesheet",p.type="text/css",p.onload=t,p.onerror=function(t){var r=t&&t.target&&t.target.src||o,u=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");u.request=r,delete a[e],p.parentNode.removeChild(p),n(u)},p.href=o;var h=document.getElementsByTagName("head")[0];h.appendChild(p)}).then(function(){a[e]=0}));var r=o[e];if(0!==r)if(r)t.push(r[2]);else{var u=new Promise(function(t,n){r=o[e]=[t,n]});t.push(r[2]=u);var f,s=document.getElementsByTagName("head")[0],l=document.createElement("script");l.charset="utf-8",l.timeout=120,i.nc&&l.setAttribute("nonce",i.nc),l.src=c(e),f=function(t){l.onerror=l.onload=null,clearTimeout(p);var n=o[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src,u=new Error("Loading chunk "+e+" failed.\n("+r+": "+a+")");u.type=r,u.request=a,n[1](u)}o[e]=void 0}};var p=setTimeout(function(){f({type:"timeout",target:l})},12e4);l.onerror=l.onload=f,s.appendChild(l)}return Promise.all(t)},i.m=e,i.c=r,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i.oe=function(e){throw console.error(e),e};var f=window["webpackJsonp"]=window["webpackJsonp"]||[],s=f.push.bind(f);f.push=t,f=f.slice();for(var l=0;l<f.length;l++)t(f[l]);var p=s;u.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"034f":function(e,t,n){"use strict";var r=n("64a9"),a=n.n(r);a.a},"4ce0":function(e,t,n){},"56d7":function(e,t,n){"use strict";n.r(t);var r={};n.r(r),n.d(r,"add",function(){return P});var a={};n.r(a),n.d(a,"couter",function(){return E});n("57e7"),n("cadf"),n("551c"),n("097d");var o=n("a026"),u=(n("58b2"),n("be94")),c=n("bc3a"),i=n.n(c),f={baseURL:"https://group.gzywudao.top/php/public/saas.php/"},s=i.a.create(f);s.interceptors.request.use(function(e){return"get"==e.method&&(e.params=Object(u["a"])({_t:Date.parse(new Date)/1e3},e.params)),console.log("这是处理过后的请求",e),e},function(e){return Promise.reject(e)}),s.interceptors.response.use(function(e){return 0===e.data.ret&&(e=e.data.content),e},function(e){return Promise.reject(e)}),Plugin.install=function(e,t){e.axios=s,window.axios=s,Object.defineProperties(e.prototype,{axios:{get:function(){return s}},$axios:{get:function(){return s}}})},o["default"].use(Plugin);var l=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},p=[],h={name:"app",components:{}},d=h,m=(n("034f"),n("2877")),b=Object(m["a"])(d,l,p,!1,null,null,null);b.options.__file="App.vue";var v=b.exports,g=n("8c4f");o["default"].use(g["a"]);var k=new g["a"]({mode:"history",base:"",routes:[{path:"/",redirect:"/dashboard"},{path:"/",component:function(e){return n.e("chunk-267e25b5").then(function(){var t=[n("bfe9")];e.apply(null,t)}.bind(this)).catch(n.oe)},meta:{title:"自述文件"},children:[{path:"/dashboard",component:function(e){return n.e("chunk-72949ec8").then(function(){var t=[n("e2ad")];e.apply(null,t)}.bind(this)).catch(n.oe)},meta:{title:"系统首页"}},{path:"/tasks",component:function(e){return n.e("chunk-0af95675").then(function(){var t=[n("53c8")];e.apply(null,t)}.bind(this)).catch(n.oe)},meta:{title:"任务审核"}},{path:"/limittasks",component:function(e){return n.e("chunk-66ff1f80").then(function(){var t=[n("eb8b")];e.apply(null,t)}.bind(this)).catch(n.oe)},meta:{title:"限时任务"}},{path:"/auditlimittask",component:function(e){return n.e("chunk-b47ec044").then(function(){var t=[n("7c3b")];e.apply(null,t)}.bind(this)).catch(n.oe)},meta:{title:"处理限时任务",noActive:!0}},{path:"/scorelist",component:function(e){return n.e("chunk-9ec19868").then(function(){var t=[n("c6be")];e.apply(null,t)}.bind(this)).catch(n.oe)},meta:{title:"积分流水"}},{path:"/coupon",component:function(e){return n.e("chunk-578590e0").then(function(){var t=[n("02f2")];e.apply(null,t)}.bind(this)).catch(n.oe)},meta:{title:"优惠券"}}]},{path:"/login",component:function(e){return n.e("chunk-2690e87e").then(function(){var t=[n("0290")];e.apply(null,t)}.bind(this)).catch(n.oe)}},{path:"*",redirect:"/404"}]}),y=n("2f62"),w=n("ade3"),j="TEST",x=Object(w["a"])({},j,function(e,t){e.count+=t}),O=(n("96cf"),n("1da1")),P=function(){var e=Object(O["a"])(regeneratorRuntime.mark(function e(t,n){var r,a;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:r=t.commit,t.state,a=n.value,r(j,a);case 3:case"end":return e.stop()}},e,this)}));return function(t,n){return e.apply(this,arguments)}}(),E=function(e){return e.singer},S={count:1,login:!1,userInfo:{}},T={namespaced:!0,state:{urlGroups:[{title:"管理"}]},mutations:{},actions:{},getters:{}};o["default"].use(y["a"]);var _=new y["a"].Store({state:S,mutations:x,actions:r,getters:a,modules:{urlGroups:T}}),A=(n("0fae"),n("9e2f")),B=n.n(A);o["default"].use(B.a,{size:"small"});n("fbb7"),n("4ce0");k.beforeEach(function(e,t,n){var r=localStorage.getItem("ms_username"),a=localStorage.getItem("token");a||"/login"===e.path?e.meta.permission?"admin"===r?n():n("/403"):navigator.userAgent.indexOf("MSIE")>-1&&"/editor"===e.path?o["default"].prototype.$alert("vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看","浏览器不兼容通知",{confirmButtonText:"确定"}):n():n("/login")}),o["default"].config.productionTip=!1,new o["default"]({router:k,store:_,render:function(e){return e(v)}}).$mount("#app")},"64a9":function(e,t,n){},fbb7:function(e,t,n){}});