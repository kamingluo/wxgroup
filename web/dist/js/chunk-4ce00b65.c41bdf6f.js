(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4ce00b65"],{"0a49":function(t,e,a){var o=a("9b43"),i=a("626a"),s=a("4bf8"),r=a("9def"),l=a("cd1c");t.exports=function(t,e){var a=1==t,n=2==t,c=3==t,d=4==t,u=6==t,p=5==t||u,f=e||l;return function(e,l,g){for(var b,h,v=s(e),m=i(v),_=o(l,g,3),w=r(m.length),y=0,x=a?f(e,w):n?f(e,0):void 0;w>y;y++)if((p||y in m)&&(b=m[y],h=_(b,y,v),t))if(a)x[y]=h;else if(h)switch(t){case 3:return!0;case 5:return b;case 6:return y;case 2:x.push(b)}else if(d)return!1;return u?-1:c||d?d:x}}},1169:function(t,e,a){var o=a("2d95");t.exports=Array.isArray||function(t){return"Array"==o(t)}},"17c1":function(t,e,a){"use strict";a.r(e);var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"table"},[a("div",{staticClass:"crumbs"},[a("el-breadcrumb",{attrs:{separator:"/"}},[a("el-breadcrumb-item",[a("i",{staticClass:"el-icon-lx-cascades"}),t._v(" 总群数："+t._s(t.datapages))])],1)],1),a("div",{staticClass:"container"},[a("div",{staticClass:"handle-box"},[a("el-select",{staticClass:"handle-select mr10",attrs:{placeholder:"筛选方式"},model:{value:t.select_cate,callback:function(e){t.select_cate=e},expression:"select_cate"}},[a("el-option",{key:"1",attrs:{label:"群名称",value:"0"}}),a("el-option",{key:"2",attrs:{label:"群ID",value:"1"}})],1),a("el-input",{staticClass:"handle-input mr10",attrs:{placeholder:"筛选关键词"},model:{value:t.select_word,callback:function(e){t.select_word=e},expression:"select_word"}}),a("el-button",{staticClass:"search",attrs:{type:"primary",icon:"search"},on:{click:t.search}},[t._v("搜索")]),a("el-button",{staticClass:"search",attrs:{type:"primary",icon:"search"},on:{click:t.newsearch}},[t._v("重置")]),a("el-button",{staticClass:"search",attrs:{type:"primary",icon:"search"},on:{click:t.havewxnumber}},[t._v("查询有微信号的")])],1),a("div",{staticClass:"handle-box"}),a("el-table",{ref:"multipleTable",staticClass:"table",attrs:{data:t.tableData,border:""}},[a("el-table-column",{attrs:{prop:"id",label:"群id",width:"80"}}),a("el-table-column",{attrs:{prop:"logo",label:"群图标",width:"120"},scopedSlots:t._u([{key:"default",fn:function(t){return[a("img",{staticClass:"logo",attrs:{src:t.row.logo}})]}}])}),a("el-table-column",{attrs:{prop:"crowd_name",label:"群名称",width:"200"}}),a("el-table-column",{attrs:{prop:"crowd_ownerid",label:"群主id",width:"100"}}),a("el-table-column",{attrs:{prop:"introduce",label:"群介绍",width:"300"}}),a("el-table-column",{attrs:{prop:"count",label:"群人数",width:"100"}}),a("el-table-column",{attrs:{prop:"wxnumber",label:"群主微信",width:"200"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("p",[t._v(t._s(e.row.wxnumber?e.row.wxnumber:"未填写"))])]}}])}),a("el-table-column",{attrs:{prop:"create_time",label:"创建时间",width:"170"}}),a("el-table-column",{attrs:{label:"操作",width:"260",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{staticClass:"blue",attrs:{type:"text"},on:{click:function(a){t.getqrcode(e.$index,e.row)}}},[t._v("群二维码")]),a("el-button",{staticClass:"green",attrs:{type:"text",icon:"el-icon-edit"},on:{click:function(a){t.seetodaydata(e.$index,e.row)}}},[t._v("查看今日数据")]),a("el-button",{staticClass:"red",attrs:{type:"text",icon:"el-icon-delete"},on:{click:function(a){t.handleDelete(e.$index,e.row)}}},[t._v("删除")])]}}])})],1),a("div",{staticClass:"pagination"},[a("el-pagination",{attrs:{background:"",layout:"prev, pager, next",total:t.datapages},on:{"current-change":t.handleCurrentChange}})],1)],1),a("el-dialog",{attrs:{title:"删除群",visible:t.delVisible,width:"30%"},on:{"update:visible":function(e){t.delVisible=e}}},[a("el-form",{ref:"form",attrs:{"label-width":"120px"}},[a("p",[t._v("确认删除？？")])]),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.delVisible=!1}}},[t._v("取 消")]),a("el-button",{attrs:{type:"primary"},on:{click:t.confirmdelete}},[t._v("确 定")])],1)],1),a("el-dialog",{attrs:{title:"群二维码",visible:t.qrcodeVisible,width:"30%"},on:{"update:visible":function(e){t.qrcodeVisible=e}}},[a("el-form",{ref:"form",attrs:{model:t.qrcodedata,"label-width":"120px"}},[a("div",[a("p",[t._v("群名称："+t._s(t.qrcodedata.crowd_name)+"   ")])]),a("div",[a("img",{staticClass:"qrcode",attrs:{src:t.qrcodedata.imageurl}})])]),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.qrcodeVisible=!1}}},[t._v("取 消")]),a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.qrcodeVisible=!1}}},[t._v("确 定")])],1)],1),a("el-dialog",{attrs:{title:"群今日数据",visible:t.grouptodaydataVisible,width:"30%"},on:{"update:visible":function(e){t.grouptodaydataVisible=e}}},[a("el-form",{ref:"form",attrs:{model:t.grouptodaydata,"label-width":"120px"}},[a("div",[a("p",[t._v("今日注册人数："+t._s(t.grouptodaydata.groupregister)+"   ")])]),a("div",[a("p",[t._v("今日活跃人数："+t._s(t.grouptodaydata.groupactive))])]),a("div",[a("p",[t._v("今日签到人数："+t._s(t.grouptodaydata.groupsigins))])]),a("div",[a("p",[t._v("今日上传任务数："+t._s(t.grouptodaydata.grouptasks))])]),a("div",[a("p",[t._v("今日抽奖人数："+t._s(t.grouptodaydata.grouplotterys))])]),a("div",[a("p",[t._v("今日兑换人数："+t._s(t.grouptodaydata.groupexchanges))])])]),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.grouptodaydataVisible=!1}}},[t._v("取 消")]),a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.grouptodaydataVisible=!1}}},[t._v("确 定")])],1)],1)],1)},i=[],s=(a("7f7f"),a("d25f"),{name:"basetable",data:function(){return{url:"./static/vuetable.json",tableData:[],cur_page:1,multipleSelection:[],select_cate:"1",select_word:"",del_list:[],is_search:!1,editVisible:!1,userdataVisible:!1,adminuserdata:null,admintaskdata:null,admincoinsdata:null,wxnumberif:null,idx:-1,delVisible:!1,deleteid:"",datapages:0,grouptodaydata:{},grouptodaydataVisible:!1,qrcodeVisible:!1,group_name:null,qrcodedata:{}}},created:function(){this.getData()},computed:{data:function(){var t=this;return this.tableData.filter(function(e){for(var a=0;a<t.del_list.length;a++)if(e.name===t.del_list[a].name){!0;break}})}},methods:{handleCurrentChange:function(t){this.cur_page=t;var e=this.select_word;null==e||""==e?this.getData():this.gosearch(t)},havewxnumber:function(){this.cur_page=1,this.wxnumberif=!0,this.getData()},getqrcode:function(t,e){var a=this;console.log("获取群二维码"),console.log(e.id);var o={};o["crowd_id"]=e.id,o["crowd_name"]=e.crowd_name,o["imageurl"]="https://group.gzywudao.top/php/public/qrcode/"+e.id+".png";var i="configure/desgroup/groupqrcode?crowd_id="+e.id;this.$axios(i).then(function(t){console.log("获取二维码成功",t),a.$message.success("获取成功！"),console.log("二维码data值",o),a.qrcodedata=o,a.qrcodeVisible=!0})},getData:function(){var t=this;this.url="configure/desgroup/groupslist";var e=this.wxnumberif;this.$axios.post(this.url,{pages:this.cur_page,wxnumberif:e}).then(function(e){console.log("群列表信息",e),t.tableData=e.data.data,t.datapages=e.data.countnumber})},newsearch:function(){var t=this;this.cur_page=1,this.select_word="",this.select_cate="1",this.wxnumberif=null;var e="configure/desgroup/groupslist";this.$axios.post(e,{pages:1}).then(function(e){console.log("群列表信息",e),t.tableData=e.data.data,t.datapages=e.data.countnumber})},search:function(){console.log("点击筛选");var t=this.select_word;if(console.log("打印关键词",t),null==t||""==t)return console.log("11111111"),void this.$message.error("关键词不能为空！！！");console.log("去筛选"),this.gosearch(1)},gosearch:function(t){var e=this,a=this.select_cate,o=this.select_word;this.ifwxnumber;if(console.log("开始筛选",t),"1"==a)var i={pages:t,id:o};else i={pages:t,crowd_name:o};var s="configure/desgroup/groupslist";this.$axios.post(s,i).then(function(t){console.log("搜索群返回",t),e.$message.success("操作成功"),e.tableData=t.data.data,e.datapages=t.data.countnumber})},handleDelete:function(t,e){console.log("点击删除的id",e.id),this.deleteid=e.id,this.delVisible=!0},confirmdelete:function(){var t=this,e=this.deleteid,a="configure/desgroup/deletegroup?id="+e;this.$axios(a).then(function(e){console.log("删除群返回",e),t.$message.success("操作成功"),t.delVisible=!1,t.gosearch()})},seetodaydata:function(t,e){var a=this;console.log("点击查看今日数据");var o=e.id,i="configure/desgroup/groupdetails?id="+o;this.$axios(i).then(function(t){console.log("查询群今日数据返回",t.data.data),a.grouptodaydata=t.data.data,a.grouptodaydataVisible=!0})},getuserData:function(t){var e=this;this.url="/admin.php/configure/dataquery/userdata",this.$axios.post(this.url,{openid:t}).then(function(t){console.log("用户操作信息",t.data),e.adminuserdata=t.data.userdata,e.admintaskdata=t.data.task,e.admincoinsdata=t.data.coins,e.userdataVisible=!0})},userdata:function(){this.userdataVisible=!0}}}),r=s,l=(a("25c4"),a("2877")),n=Object(l["a"])(r,o,i,!1,null,"15111838",null);n.options.__file="Groups.vue";e["default"]=n.exports},"25c4":function(t,e,a){"use strict";var o=a("99e3"),i=a.n(o);i.a},"7f7f":function(t,e,a){var o=a("86cc").f,i=Function.prototype,s=/^\s*function ([^ (]*)/,r="name";r in i||a("9e1e")&&o(i,r,{configurable:!0,get:function(){try{return(""+this).match(s)[1]}catch(t){return""}}})},"99e3":function(t,e,a){},cd1c:function(t,e,a){var o=a("e853");t.exports=function(t,e){return new(o(t))(e)}},d25f:function(t,e,a){"use strict";var o=a("5ca1"),i=a("0a49")(2);o(o.P+o.F*!a("2f21")([].filter,!0),"Array",{filter:function(t){return i(this,t,arguments[1])}})},e853:function(t,e,a){var o=a("d3f4"),i=a("1169"),s=a("2b4c")("species");t.exports=function(t){var e;return i(t)&&(e=t.constructor,"function"!=typeof e||e!==Array&&!i(e.prototype)||(e=void 0),o(e)&&(e=e[s],null===e&&(e=void 0))),void 0===e?Array:e}}}]);