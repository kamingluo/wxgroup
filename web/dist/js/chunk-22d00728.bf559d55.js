(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-22d00728"],{"03ed":function(t,i,s){"use strict";var a=s("473b"),e=s.n(a);e.a},"0a49":function(t,i,s){var a=s("9b43"),e=s("626a"),n=s("4bf8"),h=s("9def"),o=s("cd1c");t.exports=function(t,i){var s=1==t,r=2==t,d=3==t,c=4==t,l=6==t,u=5==t||l,f=i||o;return function(i,o,g){for(var v,p,x=n(i),m=e(x),b=a(o,g,3),y=h(m.length),C=0,P=s?f(i,y):r?f(i,0):void 0;y>C;C++)if((u||C in m)&&(v=m[C],p=b(v,C,x),t))if(s)P[C]=p;else if(p)switch(t){case 3:return!0;case 5:return v;case 6:return C;case 2:P.push(v)}else if(c)return!1;return l?-1:d||c?c:P}}},1169:function(t,i,s){var a=s("2d95");t.exports=Array.isArray||function(t){return"Array"==a(t)}},"11e9":function(t,i,s){var a=s("52a7"),e=s("4630"),n=s("6821"),h=s("6a99"),o=s("69a8"),r=s("c69a"),d=Object.getOwnPropertyDescriptor;i.f=s("9e1e")?d:function(t,i){if(t=n(t),i=h(i,!0),r)try{return d(t,i)}catch(s){}if(o(t,i))return e(!a.f.call(t,i),t[i])}},"473b":function(t,i,s){},"52a7":function(t,i){i.f={}.propertyIsEnumerable},"5dbc":function(t,i,s){var a=s("d3f4"),e=s("8b97").set;t.exports=function(t,i,s){var n,h=i.constructor;return h!==s&&"function"==typeof h&&(n=h.prototype)!==s.prototype&&a(n)&&e&&e(t,n),t}},"7ed4":function(t,i,s){"use strict";s("cadf"),s("551c"),s("097d");var a=s("a026"),e=new a["default"];i["a"]=e},"7f7f":function(t,i,s){var a=s("86cc").f,e=Function.prototype,n=/^\s*function ([^ (]*)/,h="name";h in e||s("9e1e")&&a(e,h,{configurable:!0,get:function(){try{return(""+this).match(n)[1]}catch(t){return""}}})},"8b97":function(t,i,s){var a=s("d3f4"),e=s("cb7c"),n=function(t,i){if(e(t),!a(i)&&null!==i)throw TypeError(i+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,i,a){try{a=s("9b43")(Function.call,s("11e9").f(Object.prototype,"__proto__").set,2),a(t,[]),i=!(t instanceof Array)}catch(e){i=!0}return function(t,s){return n(t,s),i?t.__proto__=s:a(t,s),t}}({},!1):void 0),check:n}},"8c93":function(t,i,s){var a;
/*!
 * sChart JavaScript Library v2.0.1
 * http://blog.gdfengshuo.com/example/sChart/ | Released under the MIT license
 * Date: 2018-04-16T18:59Z
 */
/*!
 * sChart JavaScript Library v2.0.1
 * http://blog.gdfengshuo.com/example/sChart/ | Released under the MIT license
 * Date: 2018-04-16T18:59Z
 */
(function(e,n){a=function(){return n(e)}.call(i,s,i,t),void 0===a||(t.exports=a)})(this,function(t){"use strict";function i(t,i,s,a){this.canvas=document.getElementById(t),this.ctx=this.canvas.getContext("2d"),this.dpi=window.devicePixelRatio||1,this.type=i,this.data=s,this.dataLength=this.data.length,this.showValue=!0,this.autoWidth=!1,this.width=this.canvas.width*this.dpi,this.height=this.canvas.height*this.dpi,this.topPadding=50*this.dpi,this.leftPadding=50*this.dpi,this.rightPadding=0*this.dpi,this.bottomPadding=50*this.dpi,this.yEqual=5,this.yLength=0,this.xLength=0,this.yFictitious=0,this.yRatio=0,this.bgColor="#ffffff",this.fillColor="#1E9FFF",this.axisColor="#666666",this.contentColor="#eeeeee",this.titleColor="#000000",this.title="",this.titlePosition="top",this.radius=100*this.dpi,this.innerRadius=70*this.dpi,this.colorList=["#1E9FFF","#13CE66","#F7BA2A","#FF4949","#72f6ff","#199475","#e08031","#726dd1"],this.legendColor="#000000",this.legendTop=40*this.dpi,this.totalValue=this.getTotalValue(),this.init(a)}return i.prototype={init:function(t){if(0===this.dataLength)return!1;if(t){var i=["topPadding","leftPadding","rightPadding","bottomPadding","radius","innerRadius","legendTop"];for(var s in t)"colorList"===s&&Array.isArray(t[s])?this[s]=t[s].concat(this[s]):i.indexOf(s)>-1?this[s]=t[s]*this.dpi:this[s]=t[s]}t.autoWidth?(this.width=this.canvas.width=this.canvas.parentNode.offsetWidth*this.dpi,this.height=this.canvas.height=this.canvas.parentNode.offsetHeight*this.dpi,this.canvas.setAttribute("style","width:"+this.canvas.parentNode.offsetWidth+"px;height:"+this.canvas.parentNode.offsetHeight+"px;")):(this.canvas.setAttribute("style","width:"+this.canvas.width+"px;height:"+this.canvas.height+"px;"),this.canvas.width*=this.dpi,this.canvas.height*=this.dpi),"bar"===this.type||"line"===this.type?(this.yLength=Math.floor((this.height-this.topPadding-this.bottomPadding-10)/this.yEqual),this.xLength=Math.floor((this.width-this.leftPadding-this.rightPadding-10)/this.dataLength),this.yFictitious=this.getYFictitious(this.data),this.yRatio=this.yLength/this.yFictitious,this.drawBarUpdate()):this.drawPieUpdate()},drawBarUpdate:function(){this.ctx.fillStyle=this.bgColor,this.ctx.fillRect(0,0,this.width,this.height),this.drawAxis(),this.drawPoint(),this.drawTitle(),this.drawBarChart()},drawPieUpdate:function(){this.ctx.fillStyle=this.bgColor,this.ctx.fillRect(0,0,this.width,this.height),this.drawLegend(),this.drawTitle(),this.drawPieChart()},drawBarChart:function(){this.ctx.fillStyle=this.fillColor,this.ctx.strokeStyle=this.fillColor;for(var t=0;t<this.dataLength;t++)this.data[t].left=this.leftPadding+this.xLength*(t+.25),this.data[t].top=this.height-this.bottomPadding-this.data[t].value*this.yRatio,this.data[t].right=this.leftPadding+this.xLength*(t+.75),this.data[t].bottom=this.height-this.bottomPadding,"line"===this.type?(this.ctx.beginPath(),this.ctx.arc(this.data[t].left+this.xLength/4,this.data[t].top,2,0,2*Math.PI,!0),this.ctx.fill(),0!==t&&(this.ctx.moveTo(this.data[t].left+this.xLength/4,this.data[t].top),this.ctx.lineTo(this.data[t-1].left+this.xLength/4,this.data[t-1].top)),this.ctx.stroke()):"bar"===this.type&&this.ctx.fillRect(this.data[t].left,this.data[t].top,this.data[t].right-this.data[t].left,this.data[t].bottom-this.data[t].top),this.showValue&&(this.ctx.font=12*this.dpi+"px Arial",this.ctx.fillText(this.data[t].value,this.data[t].left+this.xLength/4,this.data[t].top-5))},drawPieChart:function(){for(var t=this.width/2,i=this.height/2,s=0,a=0,e=0;e<this.dataLength;e++)this.ctx.beginPath(),this.ctx.fillStyle=this.colorList[e],this.ctx.moveTo(t,i),this.data[e].start=0===e?-Math.PI/2:this.data[e-1].end,this.data[e].end=this.data[e].start+this.data[e].value/this.totalValue*2*Math.PI,this.ctx.arc(t,i,this.radius,this.data[e].start,this.data[e].end),this.ctx.closePath(),this.ctx.fill(),this.data[e].middle=(this.data[e].start+this.data[e].end)/2,s=Math.ceil(Math.abs(this.radius*Math.cos(this.data[e].middle))),a=Math.floor(Math.abs(this.radius*Math.sin(this.data[e].middle))),this.ctx.strokeStyle=this.colorList[e],this.showValue&&(this.data[e].middle<=0?(this.ctx.textAlign="left",this.ctx.moveTo(t+s,i-a),this.ctx.lineTo(t+s+10,i-a-10),this.ctx.moveTo(t+s+10,i-a-10),this.ctx.lineTo(t+s+this.radius/2,i-a-10),this.ctx.stroke(),this.ctx.fillText(this.data[e].value,t+s+5+this.radius/2,i-a-5)):this.data[e].middle>0&&this.data[e].middle<=Math.PI/2?(this.ctx.textAlign="left",this.ctx.moveTo(t+s,i+a),this.ctx.lineTo(t+s+10,i+a+10),this.ctx.moveTo(t+s+10,i+a+10),this.ctx.lineTo(t+s+this.radius/2,i+a+10),this.ctx.stroke(),this.ctx.fillText(this.data[e].value,t+s+5+this.radius/2,i+a+15)):this.data[e].middle>Math.PI/2&&this.data[e].middle<Math.PI?(this.ctx.textAlign="right",this.ctx.moveTo(t-s,i+a),this.ctx.lineTo(t-s-10,i+a+10),this.ctx.moveTo(t-s-10,i+a+10),this.ctx.lineTo(t-s-this.radius/2,i+a+10),this.ctx.stroke(),this.ctx.fillText(this.data[e].value,t-s-5-this.radius/2,i+a+15)):(this.ctx.textAlign="right",this.ctx.moveTo(t-s,i-a),this.ctx.lineTo(t-s-10,i-a-10),this.ctx.moveTo(t-s-10,i-a-10),this.ctx.lineTo(t-s-this.radius/2,i-a-10),this.ctx.stroke(),this.ctx.fillText(this.data[e].value,t-s-5-this.radius/2,i-a-5)));"ring"===this.type&&(this.ctx.beginPath(),this.ctx.fillStyle=this.bgColor,this.ctx.arc(t,i,this.innerRadius,0,2*Math.PI),this.ctx.fill())},drawAxis:function(){this.ctx.beginPath(),this.ctx.strokeStyle=this.axisColor,this.ctx.moveTo(this.leftPadding+.5,this.height-this.bottomPadding+.5),this.ctx.lineTo(this.leftPadding+.5,this.topPadding+.5),this.ctx.moveTo(this.leftPadding+.5,this.height-this.bottomPadding+.5),this.ctx.lineTo(this.width-this.rightPadding-.5,this.height-this.bottomPadding+.5),this.ctx.stroke()},drawPoint:function(){this.ctx.beginPath(),this.ctx.font=12*this.dpi+"px Microsoft YaHei",this.ctx.textAlign="center",this.ctx.fillStyle=this.axisColor;for(var t=0;t<this.dataLength;t++){var i=this.data[t].name,s=this.xLength*(t+1);this.ctx.moveTo(this.leftPadding+s+.5,this.height-this.bottomPadding+.5),this.ctx.lineTo(this.leftPadding+s+.5,this.height-this.bottomPadding+5.5),this.ctx.fillText(i,this.leftPadding+s-this.xLength/2,this.height-this.bottomPadding+15*this.dpi)}this.ctx.stroke(),this.ctx.beginPath(),this.ctx.font=12*this.dpi+"px Microsoft YaHei",this.ctx.textAlign="right",this.ctx.fillStyle=this.axisColor,this.ctx.moveTo(this.leftPadding+.5,this.height-this.bottomPadding+.5),this.ctx.lineTo(this.leftPadding-4.5,this.height-this.bottomPadding+.5),this.ctx.fillText(0,this.leftPadding-10,this.height-this.bottomPadding+5);for(t=0;t<this.yEqual;t++){var a=this.yFictitious*(t+1),e=this.yLength*(t+1);this.ctx.beginPath(),this.ctx.strokeStyle=this.axisColor,this.ctx.moveTo(this.leftPadding+.5,this.height-this.bottomPadding-e+.5),this.ctx.lineTo(this.leftPadding-4.5,this.height-this.bottomPadding-e+.5),this.ctx.stroke(),this.ctx.fillText(a,this.leftPadding-10,this.height-this.bottomPadding-e+5),this.ctx.beginPath(),this.ctx.strokeStyle=this.contentColor,this.ctx.moveTo(this.leftPadding+.5,this.height-this.bottomPadding-e+.5),this.ctx.lineTo(this.width-this.rightPadding-.5,this.height-this.bottomPadding-e+.5),this.ctx.stroke()}},drawTitle:function(){this.title&&(this.ctx.beginPath(),this.ctx.textAlign="center",this.ctx.fillStyle=this.titleColor,this.ctx.font=16*this.dpi+"px Microsoft YaHei","bottom"===this.titlePosition&&this.bottomPadding>=40?this.ctx.fillText(this.title,this.width/2,this.height-5):this.ctx.fillText(this.title,this.width/2,this.topPadding/2+5))},drawLegend:function(){for(var t=0;t<this.dataLength;t++)this.ctx.fillStyle=this.colorList[t],this.ctx.fillRect(10,this.legendTop+15*t*this.dpi,20,11),this.ctx.fillStyle=this.legendColor,this.ctx.font=12*this.dpi+"px Microsoft YaHei",this.ctx.textAlign="left",this.ctx.fillText(this.data[t].name,35,this.legendTop+10+15*t*this.dpi)},getYFictitious:function(t){var i=t.slice(0);i.sort(function(t,i){return-(t.value-i.value)});var s=Math.ceil(i[0].value/this.yEqual),a=s.toString().length-1;return a=a>2?2:a,Math.ceil(s/Math.pow(10,a))*Math.pow(10,a)},getTotalValue:function(){for(var t=0,i=0;i<this.dataLength;i++)t+=this.data[i].value;return t}},i})},9093:function(t,i,s){var a=s("ce10"),e=s("e11e").concat("length","prototype");i.f=Object.getOwnPropertyNames||function(t){return a(t,e)}},aa77:function(t,i,s){var a=s("5ca1"),e=s("be13"),n=s("79e5"),h=s("fdef"),o="["+h+"]",r="​",d=RegExp("^"+o+o+"*"),c=RegExp(o+o+"*$"),l=function(t,i,s){var e={},o=n(function(){return!!h[t]()||r[t]()!=r}),d=e[t]=o?i(u):h[t];s&&(e[s]=d),a(a.P+a.F*o,"String",e)},u=l.trim=function(t,i){return t=String(e(t)),1&i&&(t=t.replace(d,"")),2&i&&(t=t.replace(c,"")),t};t.exports=l},ac6a:function(t,i,s){for(var a=s("cadf"),e=s("0d58"),n=s("2aba"),h=s("7726"),o=s("32e9"),r=s("84f2"),d=s("2b4c"),c=d("iterator"),l=d("toStringTag"),u=r.Array,f={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},g=e(f),v=0;v<g.length;v++){var p,x=g[v],m=f[x],b=h[x],y=b&&b.prototype;if(y&&(y[c]||o(y,c,u),y[l]||o(y,l,x),r[x]=u,m))for(p in a)y[p]||n(y,p,a[p],!0)}},c5f6:function(t,i,s){"use strict";var a=s("7726"),e=s("69a8"),n=s("2d95"),h=s("5dbc"),o=s("6a99"),r=s("79e5"),d=s("9093").f,c=s("11e9").f,l=s("86cc").f,u=s("aa77").trim,f="Number",g=a[f],v=g,p=g.prototype,x=n(s("2aeb")(p))==f,m="trim"in String.prototype,b=function(t){var i=o(t,!1);if("string"==typeof i&&i.length>2){i=m?i.trim():u(i,3);var s,a,e,n=i.charCodeAt(0);if(43===n||45===n){if(s=i.charCodeAt(2),88===s||120===s)return NaN}else if(48===n){switch(i.charCodeAt(1)){case 66:case 98:a=2,e=49;break;case 79:case 111:a=8,e=55;break;default:return+i}for(var h,r=i.slice(2),d=0,c=r.length;d<c;d++)if(h=r.charCodeAt(d),h<48||h>e)return NaN;return parseInt(r,a)}}return+i};if(!g(" 0o1")||!g("0b1")||g("+0x1")){g=function(t){var i=arguments.length<1?0:t,s=this;return s instanceof g&&(x?r(function(){p.valueOf.call(s)}):n(s)!=f)?h(new v(b(i)),s,g):b(i)};for(var y,C=s("9e1e")?d(v):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),P=0;C.length>P;P++)e(v,y=C[P])&&!e(g,y)&&l(g,y,c(v,y));g.prototype=p,p.constructor=g,s("2aba")(a,f,g)}},cd1c:function(t,i,s){var a=s("e853");t.exports=function(t,i){return new(a(t))(i)}},da26:function(t,i,s){t.exports=s.p+"img/img.1b12d3a4.jpg"},e2ad:function(t,i,s){"use strict";s.r(i);var a=function(){var t=this,i=t.$createElement,a=t._self._c||i;return a("div",[a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:8}},[a("el-card",{staticClass:"mgb20",attrs:{shadow:"hover"}},[a("div",{staticClass:"user-info"},[a("img",{staticClass:"user-avator",attrs:{src:s("da26"),alt:""}}),a("div",{staticClass:"user-info-cont"},[a("div",{staticClass:"user-info-name"},[t._v(t._s(t.name))]),a("div",[t._v(t._s(t.role))])])])]),t.channelif?a("el-card",{attrs:{shadow:"hover"}},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("span",[t._v("渠道用户比例(总用户数:"+t._s(t.allusersnumber)+")")])]),t._l(t.channeldata,function(i){return a("div",[a("div",{on:{click:function(s){t.getchannelData(i.channel)}}},[t._v("\n                 "+t._s(i.name)+"(渠道号:"+t._s(i.channel)+") (注册人数:"+t._s(i.count)+")\n                 ")]),a("el-progress",{attrs:{percentage:t.channelnumber(i.count),"stroke-width":8,color:"#42b983"}})],1)})],2):t._e()],1),a("el-col",{attrs:{span:16}},[a("el-row",{staticClass:"mgb20",attrs:{gutter:20}},[a("el-col",{attrs:{span:8}},[a("el-card",{attrs:{shadow:"hover","body-style":{padding:"0px"}}},[a("div",{staticClass:"grid-content grid-con-1"},[a("i",{staticClass:"el-icon-lx-people  grid-con-icon"}),a("div",{staticClass:"grid-cont-right"},[a("div",{staticClass:"grid-num"},[t._v(t._s(t.usersdata.allusersnumber))]),a("div",[t._v("总注册用户数")])])])])],1),a("el-col",{attrs:{span:8}},[a("el-card",{attrs:{shadow:"hover","body-style":{padding:"0px"}}},[a("div",{staticClass:"grid-content grid-con-1"},[a("i",{staticClass:"el-icon-lx-people grid-con-icon"}),a("div",{staticClass:"grid-cont-right"},[a("div",{staticClass:"grid-num"},[t._v(t._s(t.usersdata.todayregisterusersnumber))]),a("div",[t._v("今日注册用户数")])]),a("div",{staticClass:"grid-cont-right"},[a("div",{staticClass:"grid-num"},[t._v(t._s(t.usersdata.yesterdayregisterusersnumber))]),a("div",[t._v("昨日注册用户数")])])])])],1),a("el-col",{attrs:{span:8}},[a("el-card",{attrs:{shadow:"hover","body-style":{padding:"0px"}}},[a("div",{staticClass:"grid-content grid-con-1"},[a("i",{staticClass:"el-icon-lx-people grid-con-icon"}),a("div",{staticClass:"grid-cont-right"},[a("div",{staticClass:"grid-num"},[t._v(t._s(t.usersdata.todayactiveusersnumber))]),a("div",[t._v("今日活跃用户数")])])])])],1),a("el-col",{attrs:{span:8}},[a("el-card",{attrs:{shadow:"hover","body-style":{padding:"0px"}}},[a("div",{staticClass:"grid-content grid-con-1"},[a("i",{staticClass:"el-icon-lx-group grid-con-icon"}),a("div",{staticClass:"grid-cont-right"},[a("div",{staticClass:"grid-num"},[t._v(t._s(t.statistics.builtcrowd))]),a("div",[t._v("今日创建群数")])])])])],1),a("el-col",{attrs:{span:8}},[a("el-card",{attrs:{shadow:"hover","body-style":{padding:"0px"}}},[a("div",{staticClass:"grid-content grid-con-1"},[a("i",{staticClass:"el-icon-lx-friend grid-con-icon"}),a("div",{staticClass:"grid-cont-right"},[a("div",{staticClass:"grid-num"},[t._v(t._s(t.statistics.joincrowd))]),a("div",[t._v("今日加入群数")])])])])],1),a("el-col",{attrs:{span:8}},[a("el-card",{attrs:{shadow:"hover","body-style":{padding:"0px"}}},[a("div",{staticClass:"grid-content grid-con-1"},[a("i",{staticClass:"el-icon-lx-favorfill grid-con-icon"}),a("div",{staticClass:"grid-cont-right"},[a("div",{staticClass:"grid-num"},[t._v(t._s(t.statistics.task_record))]),a("div",[t._v("今日提交任务数")])])])])],1),a("el-col",{attrs:{span:8}},[a("el-card",{attrs:{shadow:"hover","body-style":{padding:"0px"}}},[a("div",{staticClass:"grid-content grid-con-1"},[a("i",{staticClass:"el-icon-lx-newsfill grid-con-icon"}),a("div",{staticClass:"grid-cont-right"},[a("div",{staticClass:"grid-num"},[t._v(t._s(t.statistics.crowd_news))]),a("div",[t._v("今日发布群消息数")])])])])],1),a("el-col",{attrs:{span:8}},[a("el-card",{attrs:{shadow:"hover","body-style":{padding:"0px"}}},[a("div",{staticClass:"grid-content grid-con-1"},[a("i",{staticClass:"el-icon-lx-hotfill grid-con-icon"}),a("div",{staticClass:"grid-cont-right"},[a("div",{staticClass:"grid-num"},[t._v(t._s(t.statistics.sigin))]),a("div",[t._v("今日签到人次数")])])])])],1),a("el-col",{attrs:{span:8}},[a("el-card",{attrs:{shadow:"hover","body-style":{padding:"0px"}}},[a("div",{staticClass:"grid-content grid-con-1"},[a("i",{staticClass:"el-icon-lx-presentfill grid-con-icon"}),a("div",{staticClass:"grid-cont-right"},[a("div",{staticClass:"grid-num"},[t._v(t._s(t.statistics.lottery))]),a("div",[t._v("今日抽奖人次数")])])])])],1)],1)],1)],1)],1)},e=[],n=(s("ac6a"),s("f3e2"),s("c5f6"),s("7f7f"),s("cadf"),s("551c"),s("097d"),function(){var t=this,i=t.$createElement,s=t._self._c||i;return s("div",[s("canvas",{attrs:{id:t.canvasId}})])}),h=[],o=s("8c93"),r=s.n(o),d={data:function(){return{schart:null,opt:{}}},props:{canvasId:{type:String,default:""},type:{type:String,default:"bar"},data:{type:Array,default:[]},options:{type:Object,required:!1}},mounted:function(){this.renderChart()},methods:{renderChart:function(){this.schart=null,this.opt=this.options,this.width&&this.height||(this.opt?this.opt["autoWidth"]=!0:this.opt={autoWidth:!0}),this.schart=new r.a(this.canvasId,this.type,this.data,this.opt)}},watch:{data:function(){this.renderChart()},options:function(){this.renderChart()},type:function(){this.renderChart()}}},c=d,l=s("2877"),u=Object(l["a"])(c,n,h,!1,null,null,null);u.options.__file="vue-schart.vue";var f=u.exports,g=s("7ed4"),v={name:"dashboard",data:function(){return{name:localStorage.getItem("ms_username"),usersdata:"",statistics:null,channeldata:[],allusersnumber:0,channelif:!1,channeldataVisible:!1,channelcoinsdata:null,data:[{name:"2018/09/04",value:1083},{name:"2018/09/05",value:941},{name:"2018/09/06",value:1139},{name:"2018/09/07",value:816},{name:"2018/09/08",value:327},{name:"2018/09/09",value:228},{name:"2018/09/10",value:1065}],options:{title:"最近七天每天的用户访问量",showValue:!1,fillColor:"rgb(45, 140, 240)",bottomPadding:30,topPadding:30},options2:{title:"最近七天用户访问趋势",fillColor:"#FC6FA1",axisColor:"#008ACD",contentColor:"#EEEEEE",bgColor:"#F5F8FD",bottomPadding:30,topPadding:30}}},components:{Schart:f},computed:{role:function(){return"admin"===this.name?"超级管理员":"普通用户"}},created:function(){this.handleListener(),this.changeDate(),this.todaydata(),this.adminchanneldata(),this.adminusersdata()},activated:function(){this.handleListener()},deactivated:function(){window.removeEventListener("resize",this.renderChart),g["a"].$off("collapse",this.handleBus)},methods:{channelnumber:function(t){var i=t/this.allusersnumber*100;return i=i.toFixed(1),Number(i)},adminchanneldata:function(){var t=this;this.$axios.post("/index/channeldata").then(function(i){console.log("拿到渠道用户注册数",i.data),t.channeldata=i.data.data,t.allusersnumber=i.data.allusersnumber,t.channelif=!0})},todaydata:function(){var t=this;this.$axios.post("/statistics/statistics").then(function(i){console.log("拿到今天的数据",i.data),t.statistics=i.data.data})},adminusersdata:function(){var t=this;this.$axios.post("/index/usersdata").then(function(i){console.log("拿到用户数据",i.data),t.usersdata=i.data.data})},changeDate:function(){var t=(new Date).getTime();this.data.forEach(function(i,s){var a=new Date(t-864e5*(6-s));i.name="".concat(a.getFullYear(),"/").concat(a.getMonth()+1,"/").concat(a.getDate())})},handleListener:function(){g["a"].$on("collapse",this.handleBus),window.addEventListener("resize",this.renderChart)},handleBus:function(t){var i=this;setTimeout(function(){i.renderChart()},300)},renderChart:function(){this.$refs.bar.renderChart(),this.$refs.line.renderChart()}}},p=v,x=(s("03ed"),Object(l["a"])(p,a,e,!1,null,"69202b38",null));x.options.__file="Dashboard.vue";i["default"]=x.exports},e853:function(t,i,s){var a=s("d3f4"),e=s("1169"),n=s("2b4c")("species");t.exports=function(t){var i;return e(t)&&(i=t.constructor,"function"!=typeof i||i!==Array&&!e(i.prototype)||(i=void 0),a(i)&&(i=i[n],null===i&&(i=void 0))),void 0===i?Array:i}},f3e2:function(t,i,s){"use strict";var a=s("5ca1"),e=s("0a49")(0),n=s("2f21")([].forEach,!0);a(a.P+a.F*!n,"Array",{forEach:function(t){return e(this,t,arguments[1])}})},fdef:function(t,i){t.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"}}]);