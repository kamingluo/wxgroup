(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-57811fb8"],{"0a49":function(t,e,n){var s=n("9b43"),i=n("626a"),o=n("4bf8"),l=n("9def"),a=n("cd1c");t.exports=function(t,e){var n=1==t,r=2==t,c=3==t,u=4==t,d=6==t,f=5==t||d,h=e||a;return function(e,a,m){for(var p,v,g=o(e),x=i(g),b=s(a,m,3),_=l(x.length),k=0,C=n?h(e,_):r?h(e,0):void 0;_>k;k++)if((f||k in x)&&(p=x[k],v=b(p,k,g),t))if(n)C[k]=v;else if(v)switch(t){case 3:return!0;case 5:return p;case 6:return k;case 2:C.push(p)}else if(u)return!1;return d?-1:c||u?u:C}}},1169:function(t,e,n){var s=n("2d95");t.exports=Array.isArray||function(t){return"Array"==s(t)}},1483:function(t,e,n){},"214f":function(t,e,n){"use strict";var s=n("32e9"),i=n("2aba"),o=n("79e5"),l=n("be13"),a=n("2b4c");t.exports=function(t,e,n){var r=a(t),c=n(l,r,""[t]),u=c[0],d=c[1];o(function(){var e={};return e[r]=function(){return 7},7!=""[t](e)})&&(i(String.prototype,t,u),s(RegExp.prototype,r,2==e?function(t,e){return d.call(t,this,e)}:function(t){return d.call(t,this)}))}},5005:function(t,e,n){"use strict";var s=n("a33e"),i=n.n(s);i.a},"5ebe":function(t,e,n){},"759f":function(t,e,n){"use strict";var s=n("5ca1"),i=n("0a49")(3);s(s.P+s.F*!n("2f21")([].some,!0),"Array",{some:function(t){return i(this,t,arguments[1])}})},"7f7f":function(t,e,n){var s=n("86cc").f,i=Function.prototype,o=/^\s*function ([^ (]*)/,l="name";l in i||n("9e1e")&&s(i,l,{configurable:!0,get:function(){try{return(""+this).match(o)[1]}catch(t){return""}}})},"9d14":function(t,e,n){"use strict";var s=n("1483"),i=n.n(s);i.a},a33e:function(t,e,n){},a481:function(t,e,n){n("214f")("replace",2,function(t,e,n){return[function(s,i){"use strict";var o=t(this),l=void 0==s?void 0:s[e];return void 0!==l?l.call(s,o,i):n.call(String(o),s,i)},n]})},bfe9:function(t,e,n){"use strict";n.r(e);var s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"wrapper"},[n("v-head"),n("v-sidebar"),n("div",{staticClass:"content-box",class:{"content-collapse":t.collapse}},[n("v-tags"),n("div",{staticClass:"content"},[n("transition",{attrs:{name:"move",mode:"out-in"}},[n("keep-alive",{attrs:{include:t.tagsList}},[n("router-view")],1)],1)],1)],1)],1)},i=[],o=(n("7f7f"),n("cadf"),n("551c"),n("097d"),function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"header"},[n("div",{staticClass:"collapse-btn",on:{click:t.collapseChage}},[n("i",{staticClass:"el-icon-menu"})]),n("div",{staticClass:"logo"},[t._v("后台管理系统")]),n("div",{staticClass:"header-right"},[n("div",{staticClass:"header-user-con"},[n("div",{staticClass:"btn-fullscreen",on:{click:t.handleFullScreen}},[n("el-tooltip",{attrs:{effect:"dark",content:t.fullscreen?"取消全屏":"全屏",placement:"bottom"}},[n("i",{staticClass:"el-icon-rank"})])],1),n("div",{staticClass:"user-avator"},[n("img",{attrs:{src:t.logo}})]),n("el-dropdown",{staticClass:"user-name",attrs:{trigger:"click"},on:{command:t.handleCommand}},[n("span",{staticClass:"el-dropdown-link"},[t._v("\n          "+t._s(t.username)+" "),n("i",{staticClass:"el-icon-caret-bottom"})]),n("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},[n("el-dropdown-item",{attrs:{divided:"",command:"loginout"}},[t._v("退出登录")])],1)],1)],1)])])}),l=[],a=n("a026"),r=new a["default"],c=r,u={data:function(){return{collapse:!1,fullscreen:!1,name:"群记分",logo:""}},computed:{username:function(){console.log("名称");var t=localStorage.getItem("ms_username"),e=localStorage.getItem("logo");return this.logo=e,t||this.name}},methods:{handleCommand:function(t){"loginout"==t&&(localStorage.removeItem("ms_username"),localStorage.removeItem("token"),localStorage.removeItem("logo"),this.$router.push("/login"))},collapseChage:function(){this.collapse=!this.collapse,c.$emit("collapse",this.collapse)},handleFullScreen:function(){var t=document.documentElement;this.fullscreen?document.exitFullscreen?document.exitFullscreen():document.webkitCancelFullScreen?document.webkitCancelFullScreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.msExitFullscreen&&document.msExitFullscreen():t.requestFullscreen?t.requestFullscreen():t.webkitRequestFullScreen?t.webkitRequestFullScreen():t.mozRequestFullScreen?t.mozRequestFullScreen():t.msRequestFullscreen&&t.msRequestFullscreen(),this.fullscreen=!this.fullscreen}},mounted:function(){document.body.clientWidth<1500&&this.collapseChage()}},d=u,f=(n("9d14"),n("2877")),h=Object(f["a"])(d,o,l,!1,null,"4bd99651",null);h.options.__file="Header.vue";var m=h.exports,p=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"sidebar"},[n("el-menu",{staticClass:"sidebar-el-menu",attrs:{"default-active":t.onRoutes,collapse:t.collapse,"background-color":"#324157","text-color":"#bfcbd9","active-text-color":"#20a0ff","unique-opened":"",router:""}},[t._l(t.items,function(e){return[e.subs?[n("el-submenu",{key:e.index,attrs:{index:e.index}},[n("template",{slot:"title"},[n("i",{class:e.icon}),n("span",{attrs:{slot:"title"},slot:"title"},[t._v(t._s(e.title))])]),t._l(e.subs,function(e){return[e.subs?n("el-submenu",{key:e.index,attrs:{index:e.index}},[n("template",{slot:"title"},[t._v(t._s(e.title))]),t._l(e.subs,function(e,s){return n("el-menu-item",{key:s,attrs:{index:e.index}},[t._v("\n                "+t._s(e.title)+"\n              ")])})],2):n("el-menu-item",{key:e.index,attrs:{index:e.index}},[t._v("\n              "+t._s(e.title)+"\n            ")])]})],2)]:[n("el-menu-item",{key:e.index,attrs:{index:e.index}},[n("i",{class:e.icon}),n("span",{attrs:{slot:"title"},slot:"title"},[t._v(t._s(e.title))])])]]})],2)],1)},v=[],g=(n("a481"),{data:function(){return{collapse:!1,items:[{icon:"el-icon-lx-home",index:"dashboard",title:"系统首页"},{icon:"el-icon-lx-present",index:"userslist",title:"用户列表"},{icon:"el-icon-lx-present",index:"tasks",title:"任务审核"},{icon:"el-icon-lx-present",index:"limittasks",title:"限时任务"},{icon:"el-icon-lx-present",index:"exlists",title:"兑换列表"},{icon:"el-icon-lx-present",index:"scorelist",title:"积分流水"},{icon:"el-icon-lx-present",index:"signin",title:"签到查询"}]}},computed:{onRoutes:function(){return this.$route.path.replace("/","")}},created:function(){var t=this;this.url="user/checklogin";var e=localStorage.getItem("token");if(e){if(this.$axios.post(this.url,{token:e}).then(function(e){var n=e.data.state;if(200!=n)return t.$message.error(e.data.message),void t.$router.push("/login")}),"tkjk5as6da7ksj15KL"==e){var n={icon:"el-icon-lx-present",index:"exlinks",title:"专属链接"},s={icon:"el-icon-lx-present",index:"coupon",title:"优惠券"};this.items.push(n),this.items.push(s)}c.$on("collapse",function(e){t.collapse=e})}else this.$router.push("/login")}}),x=g,b=(n("5005"),Object(f["a"])(x,p,v,!1,null,"14bd0456",null));b.options.__file="Sidebar.vue";var _=b.exports,k=function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.showTags?n("div",{staticClass:"tags"},[n("ul",t._l(t.tagsList,function(e,s){return n("li",{key:s,staticClass:"tags-li",class:{active:t.isActive(e.path)}},[n("router-link",{staticClass:"tags-li-title",attrs:{to:e.path}},[t._v("\n                "+t._s(e.title)+"\n            ")]),n("span",{staticClass:"tags-li-icon",on:{click:function(e){t.closeTags(s)}}},[n("i",{staticClass:"el-icon-close"})])],1)})),n("div",{staticClass:"tags-close-box"},[n("el-dropdown",{on:{command:t.handleTags}},[n("el-button",{attrs:{size:"mini",type:"primary"}},[t._v("\n                标签选项"),n("i",{staticClass:"el-icon-arrow-down el-icon--right"})]),n("el-dropdown-menu",{attrs:{slot:"dropdown",size:"small"},slot:"dropdown"},[n("el-dropdown-item",{attrs:{command:"other"}},[t._v("关闭其他")]),n("el-dropdown-item",{attrs:{command:"all"}},[t._v("关闭所有")])],1)],1)],1)]):t._e()},C=[],w=(n("759f"),n("d25f"),{data:function(){return{tagsList:[]}},methods:{isActive:function(t){return t===this.$route.fullPath},closeTags:function(t){var e=this.tagsList.splice(t,1)[0],n=this.tagsList[t]?this.tagsList[t]:this.tagsList[t-1];n?e.path===this.$route.fullPath&&this.$router.push(n.path):this.$router.push("/")},closeAll:function(){this.tagsList=[],this.$router.push("/")},closeOther:function(){var t=this,e=this.tagsList.filter(function(e){return e.path===t.$route.fullPath});this.tagsList=e},setTags:function(t){if("/auditlimittask"!=t.path){var e=this.tagsList.some(function(e){return e.path===t.fullPath});e||(this.tagsList.length>=8&&this.tagsList.shift(),this.tagsList.push({title:t.meta.title,path:t.fullPath,name:t.matched[1].components.default.name})),c.$emit("tags",this.tagsList)}},handleTags:function(t){"other"===t?this.closeOther():this.closeAll()}},computed:{showTags:function(){return this.tagsList.length>0}},watch:{$route:function(t,e){this.setTags(t)}},created:function(){this.setTags(this.$route)}}),$=w,y=(n("c5f3"),Object(f["a"])($,k,C,!1,null,null,null));y.options.__file="Tags.vue";var F=y.exports,S={data:function(){return{tagsList:[],collapse:!1}},components:{vHead:m,vSidebar:_,vTags:F},created:function(){var t=this;c.$on("collapse",function(e){t.collapse=e}),c.$on("tags",function(e){for(var n=[],s=0,i=e.length;s<i;s++)e[s].name&&n.push(e[s].name);t.tagsList=n})}},L=S,A=Object(f["a"])(L,s,i,!1,null,null,null);A.options.__file="Home.vue";e["default"]=A.exports},c5f3:function(t,e,n){"use strict";var s=n("5ebe"),i=n.n(s);i.a},cd1c:function(t,e,n){var s=n("e853");t.exports=function(t,e){return new(s(t))(e)}},d25f:function(t,e,n){"use strict";var s=n("5ca1"),i=n("0a49")(2);s(s.P+s.F*!n("2f21")([].filter,!0),"Array",{filter:function(t){return i(this,t,arguments[1])}})},e853:function(t,e,n){var s=n("d3f4"),i=n("1169"),o=n("2b4c")("species");t.exports=function(t){var e;return i(t)&&(e=t.constructor,"function"!=typeof e||e!==Array&&!i(e.prototype)||(e=void 0),s(e)&&(e=e[o],null===e&&(e=void 0))),void 0===e?Array:e}}}]);