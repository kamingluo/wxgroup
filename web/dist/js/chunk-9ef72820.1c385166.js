(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-9ef72820"],{"0a49":function(t,e,a){var i=a("9b43"),s=a("626a"),l=a("4bf8"),n=a("9def"),o=a("cd1c");t.exports=function(t,e){var a=1==t,r=2==t,c=3==t,u=4==t,d=6==t,f=5==t||d,h=e||o;return function(e,o,m){for(var p,b,g=l(e),v=s(g),w=i(o,m,3),_=n(v.length),y=0,x=a?h(e,_):r?h(e,0):void 0;_>y;y++)if((f||y in v)&&(p=v[y],b=w(p,y,g),t))if(a)x[y]=b;else if(b)switch(t){case 3:return!0;case 5:return p;case 6:return y;case 2:x.push(p)}else if(u)return!1;return d?-1:c||u?u:x}}},1169:function(t,e,a){var i=a("2d95");t.exports=Array.isArray||function(t){return"Array"==i(t)}},"226e":function(t,e,a){"use strict";var i=a("374a"),s=a.n(i);s.a},"374a":function(t,e,a){},"7f7f":function(t,e,a){var i=a("86cc").f,s=Function.prototype,l=/^\s*function ([^ (]*)/,n="name";n in s||a("9e1e")&&i(s,n,{configurable:!0,get:function(){try{return(""+this).match(l)[1]}catch(t){return""}}})},cd1c:function(t,e,a){var i=a("e853");t.exports=function(t,e){return new(i(t))(e)}},d104:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"table"},[a("div",{staticClass:"crumbs"},[a("el-breadcrumb",{attrs:{separator:"/"}},[a("el-breadcrumb-item",[a("i",{staticClass:"el-icon-lx-cascades"}),t._v(" 总消息数："+t._s(t.datapages))])],1)],1),a("div",{staticClass:"container"},[a("div",{staticClass:"handle-box"},[a("el-select",{staticClass:"handle-select mr10",attrs:{placeholder:"筛选方式"},model:{value:t.select_cate,callback:function(e){t.select_cate=e},expression:"select_cate"}},[a("el-option",{key:"2",attrs:{label:"群ID",value:"1"}})],1),a("el-input",{staticClass:"handle-input mr10",attrs:{placeholder:"筛选关键词"},model:{value:t.select_word,callback:function(e){t.select_word=e},expression:"select_word"}}),a("el-button",{staticClass:"search",attrs:{type:"primary",icon:"search"},on:{click:t.search}},[t._v("搜索")]),a("el-button",{staticClass:"search",attrs:{type:"primary",icon:"search"},on:{click:t.newsearch}},[t._v("重置")])],1),a("div",{staticClass:"handle-box"}),a("el-table",{ref:"multipleTable",staticClass:"table",attrs:{data:t.tableData,border:""}},[a("el-table-column",{attrs:{prop:"crowd_id",label:"群id",width:"80"}}),a("el-table-column",{attrs:{prop:"logo",label:"消息图片",width:"300"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("div",{staticClass:"imgscrollable"},t._l(JSON.parse(e.row.images),function(e){return a("img",{staticClass:"taskimg",attrs:{src:e},on:{click:t.clickimg}})}))]}}])}),a("el-table-column",{attrs:{prop:"publisher",label:"用户昵称",width:"120"}}),a("el-table-column",{attrs:{prop:"headportrait",label:"用户头像",width:"120"},scopedSlots:t._u([{key:"default",fn:function(t){return[a("img",{staticClass:"logo",attrs:{src:t.row.headportrait}})]}}])}),a("el-table-column",{attrs:{prop:"content",label:"消息描述",width:"260"}}),a("el-table-column",{attrs:{prop:"create_time",label:"创建时间",width:"160"}}),a("el-table-column",{attrs:{prop:"watchnum",label:"观看次数",width:"120"}}),a("el-table-column",{attrs:{label:"操作",width:"150",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{staticClass:"red",attrs:{type:"text",icon:"el-icon-delete"},on:{click:function(a){t.handleDelete(e.$index,e.row)}}},[t._v("删除")])]}}])})],1),a("div",{staticClass:"pagination"},[a("el-pagination",{attrs:{background:"",layout:"prev, pager, next",total:t.datapages},on:{"current-change":t.handleCurrentChange}})],1)],1),a("el-dialog",{attrs:{title:"预览图片",visible:t.imgVisible,width:"25%"},on:{"update:visible":function(e){t.imgVisible=e}}},[a("img",{staticClass:"yulan",attrs:{src:t.yulanimg}})]),a("el-dialog",{attrs:{title:"删除群",visible:t.delVisible,width:"30%"},on:{"update:visible":function(e){t.delVisible=e}}},[a("el-form",{ref:"form",attrs:{model:t.form,"label-width":"120px"}},[a("el-text",[t._v("确认删除？？")])],1),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.delVisible=!1}}},[t._v("取 消")]),a("el-button",{attrs:{type:"primary"},on:{click:t.confirmdelete}},[t._v("确 定")])],1)],1),a("el-dialog",{attrs:{title:"编辑",visible:t.editVisible,width:"30%"},on:{"update:visible":function(e){t.editVisible=e}}},[a("el-form",{ref:"form",attrs:{model:t.form,"label-width":"120px"}},[a("el-form-item",{attrs:{label:"id"}},[a("el-input",{model:{value:t.form.id,callback:function(e){t.$set(t.form,"id",e)},expression:"form.id"}})],1),a("el-form-item",{attrs:{label:"支付宝姓名"}},[a("el-input",{model:{value:t.form.alipayName,callback:function(e){t.$set(t.form,"alipayName",e)},expression:"form.alipayName"}})],1),a("el-form-item",{attrs:{label:"支付宝账号"}},[a("el-input",{model:{value:t.form.alipayNumber,callback:function(e){t.$set(t.form,"alipayNumber",e)},expression:"form.alipayNumber"}})],1),a("el-form-item",{attrs:{label:"state(1过2失败)"}},[a("el-input",{model:{value:t.form.state,callback:function(e){t.$set(t.form,"state",e)},expression:"form.state"}})],1)],1),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.editVisible=!1}}},[t._v("取 消")]),a("el-button",{attrs:{type:"primary"},on:{click:t.saveEdit}},[t._v("确 定")])],1)],1)],1)},s=[],l=(a("7f7f"),a("d25f"),{name:"basetable",data:function(){return{url:"./static/vuetable.json",tableData:[],cur_page:1,multipleSelection:[],select_cate:"1",select_word:"",del_list:[],is_search:!1,editVisible:!1,userdataVisible:!1,adminuserdata:null,admintaskdata:null,admincoinsdata:null,form:{name:"",date:"",address:""},idx:-1,delVisible:!1,imgVisible:!1,yulanimg:null,deleteid:"",datapages:0}},created:function(){this.getData()},computed:{data:function(){var t=this;return this.tableData.filter(function(e){for(var a=0;a<t.del_list.length;a++)if(e.name===t.del_list[a].name){!0;break}})}},methods:{handleCurrentChange:function(t){this.cur_page=t;var e=this.select_word;null==e||""==e?this.getData():this.gosearch(t)},getData:function(){var t=this;this.url="configure/news/newslist",this.$axios.post(this.url,{pages:this.cur_page}).then(function(e){console.log("群列表信息",e),t.tableData=e.data.data,t.datapages=e.data.countnumber})},newsearch:function(){var t=this;this.cur_page=1,this.select_word="",this.select_cate="1";var e="configure/news/newslist";this.$axios.post(e,{pages:1}).then(function(e){console.log("群列表信息",e),t.tableData=e.data.data,t.datapages=e.data.countnumber})},search:function(){console.log("点击筛选");var t=this.select_word;if(console.log("打印关键词",t),null==t||""==t)return console.log("11111111"),void this.$message.error("关键词不能为空！！！");console.log("去筛选"),this.gosearch(1)},gosearch:function(t){var e=this,a=this.select_cate,i=this.select_word;if(console.log("开始筛选",t),"1"==a)var s={pages:t,id:i};else s={pages:t,crowd_name:i};var l="configure/news/newslist";this.$axios.post(l,s).then(function(t){console.log("搜索群返回",t),e.$message.success("操作成功"),e.tableData=t.data.data,e.datapages=t.data.countnumber})},handleDelete:function(t,e){console.log("点击删除的id",e.id),this.deleteid=e.id,this.delVisible=!0},confirmdelete:function(){var t=this,e=this.deleteid,a="configure/news/deletenew?id="+e;this.$axios(a).then(function(e){console.log("删除消息返回",e),t.$message.success("操作成功"),t.delVisible=!1,t.gosearch()})},clickimg:function(t){console.log("点击图片",t.target.src),this.imgVisible=!0,this.yulanimg=t.target.src},handleEdit:function(t,e){console.log("点击编辑"),this.idx=t;var a=this.tableData[t];this.form=a,this.editVisible=!0},saveEdit:function(){var t=this;this.$set(this.tableData,this.idx,this.form),console.log("提交修改信息",this.form),this.editVisible=!1,this.$message.success("操作成功"),this.$axios.post("/admin.php/configure/examine/sendrewards",this.form).then(function(e){console.log("修改信息返回数据",e),t.getData()})},getuserData:function(t){var e=this;this.url="/admin.php/configure/dataquery/userdata",this.$axios.post(this.url,{openid:t}).then(function(t){console.log("用户操作信息",t.data),e.adminuserdata=t.data.userdata,e.admintaskdata=t.data.task,e.admincoinsdata=t.data.coins,e.userdataVisible=!0})},userdata:function(){this.userdataVisible=!0}}}),n=l,o=(a("226e"),a("2877")),r=Object(o["a"])(n,i,s,!1,null,"18088e25",null);r.options.__file="News.vue";e["default"]=r.exports},d25f:function(t,e,a){"use strict";var i=a("5ca1"),s=a("0a49")(2);i(i.P+i.F*!a("2f21")([].filter,!0),"Array",{filter:function(t){return s(this,t,arguments[1])}})},e853:function(t,e,a){var i=a("d3f4"),s=a("1169"),l=a("2b4c")("species");t.exports=function(t){var e;return s(t)&&(e=t.constructor,"function"!=typeof e||e!==Array&&!s(e.prototype)||(e=void 0),i(e)&&(e=e[l],null===e&&(e=void 0))),void 0===e?Array:e}}}]);