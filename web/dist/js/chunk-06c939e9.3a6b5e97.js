(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-06c939e9"],{"0a49":function(e,t,a){var o=a("9b43"),l=a("626a"),s=a("4bf8"),i=a("9def"),r=a("cd1c");e.exports=function(e,t){var a=1==e,n=2==e,c=3==e,d=4==e,u=6==e,f=5==e||u,m=t||r;return function(t,r,p){for(var b,h,v=s(t),g=l(v),w=o(r,p,3),_=i(g.length),k=0,x=a?m(t,_):n?m(t,0):void 0;_>k;k++)if((f||k in g)&&(b=g[k],h=w(b,k,v),e))if(a)x[k]=h;else if(h)switch(e){case 3:return!0;case 5:return b;case 6:return k;case 2:x.push(b)}else if(d)return!1;return u?-1:c||d?d:x}}},1169:function(e,t,a){var o=a("2d95");e.exports=Array.isArray||function(e){return"Array"==o(e)}},3533:function(e,t,a){"use strict";a.r(t);var o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"table"},[a("div",{staticClass:"crumbs"}),a("div",{staticClass:"container"},[a("div",{staticClass:"handle-box"},[a("el-select",{staticClass:"handle-select mr10",attrs:{placeholder:"筛选方式"},model:{value:e.select_cate,callback:function(t){e.select_cate=t},expression:"select_cate"}},[a("el-option",{key:"1",attrs:{label:"群名称",value:"0"}}),a("el-option",{key:"2",attrs:{label:"群ID",value:"1"}})],1),a("el-input",{staticClass:"handle-input mr10",attrs:{placeholder:"筛选关键词"},model:{value:e.select_word,callback:function(t){e.select_word=t},expression:"select_word"}}),a("el-button",{staticClass:"search",attrs:{type:"primary",icon:"search"},on:{click:e.search}},[e._v("搜索")]),a("el-button",{staticClass:"search",attrs:{type:"primary",icon:"search"},on:{click:e.newsearch}},[e._v("重置")]),a("el-button",{staticClass:"handle-del mr10",attrs:{type:"primary"},on:{click:e.add}},[e._v("新增数据")])],1),a("div",{staticClass:"handle-box"}),a("el-table",{ref:"multipleTable",staticClass:"table",attrs:{data:e.tableData,border:""}},[a("el-table-column",{attrs:{prop:"id",label:"群id",width:"80"}}),a("el-table-column",{attrs:{prop:"logo",label:"群图标",width:"120"},scopedSlots:e._u([{key:"default",fn:function(e){return[a("img",{staticClass:"logo",attrs:{src:e.row.logo}})]}}])}),a("el-table-column",{attrs:{prop:"crowd_name",label:"群名称",width:"200"}}),a("el-table-column",{attrs:{prop:"crowd_ownerid",label:"群主id",width:"100"}}),a("el-table-column",{attrs:{prop:"name",label:"账号",width:"200"}}),a("el-table-column",{attrs:{prop:"password",label:"密码",width:"200"}}),a("el-table-column",{attrs:{prop:"open",label:"当前状态",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("p",[e._v(e._s(0==t.row.open?"无限制":1==t.row.open?"审核中":2==t.row.open?"体验中":3==t.row.open?"体验过期":4==t.row.open?"删除中":5==t.row.open?"正常使用":"未知状态"))])]}}])}),a("el-table-column",{attrs:{prop:"end_time",label:"结束时间",width:"180"}}),a("el-table-column",{attrs:{prop:"remarks",label:"备注",width:"250"}}),a("el-table-column",{attrs:{label:"操作",width:"260",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{staticClass:"blue",attrs:{type:"text",icon:"el-icon-edit"},on:{click:function(a){e.handleEdit(t.$index,t.row)}}},[e._v("编辑")]),a("el-button",{staticClass:"red",attrs:{type:"text",icon:"el-icon-delete"},on:{click:function(a){e.handleDelete(t.$index,t.row)}}},[e._v("删除")])]}}])})],1),a("div",{staticClass:"pagination"},[a("el-pagination",{attrs:{background:"",layout:"prev, pager, next",total:e.datapages},on:{"current-change":e.handleCurrentChange}})],1)],1),a("el-dialog",{attrs:{title:"编辑",visible:e.addformvisible,width:"20%"},on:{"update:visible":function(t){e.addformvisible=t}}},[a("el-form",{ref:"form",attrs:{model:e.form,"label-width":"120px"}},[a("el-form-item",{attrs:{label:"群id"}},[a("el-input",{model:{value:e.addform.crowd_id,callback:function(t){e.$set(e.addform,"crowd_id",t)},expression:"addform.crowd_id"}})],1),a("el-form-item",{attrs:{label:"账号"}},[a("el-input",{model:{value:e.addform.name,callback:function(t){e.$set(e.addform,"name",t)},expression:"addform.name"}})],1),a("el-form-item",{attrs:{label:"密码"}},[a("el-input",{model:{value:e.addform.password,callback:function(t){e.$set(e.addform,"password",t)},expression:"addform.password"}})],1),a("el-form-item",{attrs:{label:"备注"}},[a("el-input",{model:{value:e.addform.remarks,callback:function(t){e.$set(e.addform,"remarks",t)},expression:"addform.remarks"}})],1)],1),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.addformvisible=!1}}},[e._v("取 消")]),a("el-button",{attrs:{type:"primary"},on:{click:e.saveAdd}},[e._v("确 定")])],1)],1),a("el-dialog",{attrs:{title:"编辑",visible:e.editformvisible,width:"20%"},on:{"update:visible":function(t){e.editformvisible=t}}},[a("el-form",{ref:"form",attrs:{model:e.form,"label-width":"120px"}},[a("el-form-item",{attrs:{label:"群id"}},[a("el-input",{attrs:{disabled:!0},model:{value:e.form.id,callback:function(t){e.$set(e.form,"id",t)},expression:"form.id"}})],1),a("el-form-item",{attrs:{label:"账号"}},[a("el-input",{model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),a("el-form-item",{attrs:{label:"密码"}},[a("el-input",{model:{value:e.form.password,callback:function(t){e.$set(e.form,"password",t)},expression:"form.password"}})],1),a("el-form-item",{attrs:{label:"结束时间"}},[a("el-date-picker",{attrs:{type:"date","value-format":"yyyy-MM-dd",placeholder:"选择日期"},model:{value:e.form.end_time,callback:function(t){e.$set(e.form,"end_time",t)},expression:"form.end_time"}})],1),a("el-form-item",{attrs:{label:"备注"}},[a("el-input",{model:{value:e.form.remarks,callback:function(t){e.$set(e.form,"remarks",t)},expression:"form.remarks"}})],1)],1),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.editformvisible=!1}}},[e._v("取 消")]),a("el-button",{attrs:{type:"primary"},on:{click:e.saveEdit}},[e._v("确 定")])],1)],1),a("el-dialog",{attrs:{title:"删除群",visible:e.delVisible,width:"30%"},on:{"update:visible":function(t){e.delVisible=t}}},[a("el-form",{ref:"form",attrs:{"label-width":"120px"}},[a("p",[e._v("确认删除？？")])]),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.delVisible=!1}}},[e._v("取 消")]),a("el-button",{attrs:{type:"primary"},on:{click:e.confirmdelete}},[e._v("确 定")])],1)],1)],1)},l=[],s=(a("7f7f"),a("d25f"),a("cadf"),a("551c"),a("097d"),{name:"basetable",data:function(){return{url:"./static/vuetable.json",tableData:[],cur_page:1,multipleSelection:[],select_cate:"1",select_word:"",del_list:[],is_search:!1,idx:-1,delVisible:!1,deleteid:"",datapages:0,addformvisible:!1,addform:{crowd_id:null,name:null,password:null,remarks:null},editformvisible:!1,form:{}}},created:function(){this.getData()},computed:{data:function(){var e=this;return this.tableData.filter(function(t){for(var a=0;a<e.del_list.length;a++)if(t.name===e.del_list[a].name){!0;break}})}},methods:{handleCurrentChange:function(e){this.cur_page=e;var t=this.select_word;null==t||""==t?this.getData():this.gosearch(e)},getData:function(){var e=this;this.url="configure/adminuser/groupslist";var t=this.wxnumberif;this.$axios.post(this.url,{pages:this.cur_page,wxnumberif:t}).then(function(t){console.log("群列表信息",t),e.tableData=t.data.data,e.datapages=t.data.countnumber})},newsearch:function(){var e=this;this.cur_page=1,this.select_word="",this.select_cate="1",this.wxnumberif=null;var t="configure/adminuser/groupslist";this.$axios.post(t,{pages:1}).then(function(t){console.log("群列表信息",t),e.tableData=t.data.data,e.datapages=t.data.countnumber})},search:function(){console.log("点击筛选");var e=this.select_word;if(console.log("打印关键词",e),null==e||""==e)return console.log("11111111"),void this.$message.error("关键词不能为空！！！");console.log("去筛选"),this.gosearch(1)},gosearch:function(e){var t=this,a=this.select_cate,o=this.select_word;this.ifwxnumber;if(console.log("开始筛选",e),"1"==a)var l={pages:e,id:o};else l={pages:e,crowd_name:o};var s="configure/adminuser/groupslist";this.$axios.post(s,l).then(function(e){console.log("搜索群返回",e),t.$message.success("操作成功"),t.tableData=e.data.data,t.datapages=e.data.countnumber})},add:function(){console.log("点击新增"),this.addformvisible=!0},saveAdd:function(){var e=this,t=this.addform;null!=t.crowd_id&&null!=t.name&&null!=t.password?this.$axios.post("configure/adminuser/add",t).then(function(t){console.log("新增用户返回数据",t),e.$message.success("操作成功"),e.addformvisible=!1,e.getData()}):this.$message.error("信息不正确")},handleEdit:function(e,t){console.log("点击编辑"),this.idx=e;var a=this.tableData[e];this.form=a,this.editformvisible=!0},saveEdit:function(){var e=this;this.$set(this.tableData,this.idx,this.form),console.log("提交修改信息",this.form),this.editVisible=!1,this.$axios.post("configure/adminuser/edit",this.form).then(function(t){console.log("修改信息返回数据",t),e.$message.success("操作成功"),e.editformvisible=!1,e.gosearch()})},handleDelete:function(e,t){console.log("点击删除的id",t.id),this.deleteid=t.id,this.delVisible=!0},confirmdelete:function(){var e=this,t=this.deleteid,a="configure/adminuser/delete?id="+t;this.$axios(a).then(function(t){console.log("删除群返回",t),e.$message.success("操作成功"),e.delVisible=!1,e.gosearch()})}}}),i=s,r=(a("3d3c"),a("2877")),n=Object(r["a"])(i,o,l,!1,null,"3f645bb0",null);n.options.__file="Adminmanage.vue";t["default"]=n.exports},"3d3c":function(e,t,a){"use strict";var o=a("b483"),l=a.n(o);l.a},"7f7f":function(e,t,a){var o=a("86cc").f,l=Function.prototype,s=/^\s*function ([^ (]*)/,i="name";i in l||a("9e1e")&&o(l,i,{configurable:!0,get:function(){try{return(""+this).match(s)[1]}catch(e){return""}}})},b483:function(e,t,a){},cd1c:function(e,t,a){var o=a("e853");e.exports=function(e,t){return new(o(e))(t)}},d25f:function(e,t,a){"use strict";var o=a("5ca1"),l=a("0a49")(2);o(o.P+o.F*!a("2f21")([].filter,!0),"Array",{filter:function(e){return l(this,e,arguments[1])}})},e853:function(e,t,a){var o=a("d3f4"),l=a("1169"),s=a("2b4c")("species");e.exports=function(e){var t;return l(e)&&(t=e.constructor,"function"!=typeof t||t!==Array&&!l(t.prototype)||(t=void 0),o(t)&&(t=t[s],null===t&&(t=void 0))),void 0===t?Array:t}}}]);