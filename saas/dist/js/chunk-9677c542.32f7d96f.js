(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-9677c542"],{"0a49":function(t,e,i){var a=i("9b43"),l=i("626a"),o=i("4bf8"),s=i("9def"),n=i("cd1c");t.exports=function(t,e){var i=1==t,r=2==t,c=3==t,u=4==t,d=6==t,f=5==t||d,p=e||n;return function(e,n,b){for(var m,h,g=o(e),v=l(g),k=a(n,b,3),w=s(v.length),y=0,x=i?p(e,w):r?p(e,0):void 0;w>y;y++)if((f||y in v)&&(m=v[y],h=k(m,y,g),t))if(i)x[y]=h;else if(h)switch(t){case 3:return!0;case 5:return m;case 6:return y;case 2:x.push(m)}else if(u)return!1;return d?-1:c||u?u:x}}},1169:function(t,e,i){var a=i("2d95");t.exports=Array.isArray||function(t){return"Array"==a(t)}},"3af4":function(t,e,i){"use strict";var a=i("d3a5"),l=i.n(a);l.a},"7f7f":function(t,e,i){var a=i("86cc").f,l=Function.prototype,o=/^\s*function ([^ (]*)/,s="name";s in l||i("9e1e")&&a(l,s,{configurable:!0,get:function(){try{return(""+this).match(o)[1]}catch(t){return""}}})},cd1c:function(t,e,i){var a=i("e853");t.exports=function(t,e){return new(a(t))(e)}},d25f:function(t,e,i){"use strict";var a=i("5ca1"),l=i("0a49")(2);a(a.P+a.F*!i("2f21")([].filter,!0),"Array",{filter:function(t){return l(this,t,arguments[1])}})},d3a5:function(t,e,i){},e853:function(t,e,i){var a=i("d3f4"),l=i("1169"),o=i("2b4c")("species");t.exports=function(t){var e;return l(t)&&(e=t.constructor,"function"!=typeof e||e!==Array&&!l(e.prototype)||(e=void 0),a(e)&&(e=e[o],null===e&&(e=void 0))),void 0===e?Array:e}},eb8b:function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"table"},[i("div",{staticClass:"crumbs"}),i("div",{staticClass:"container"},[i("div",{staticClass:"handle-box"}),i("el-table",{ref:"multipleTable",staticClass:"table",attrs:{data:t.tableData,border:""}},[i("el-table-column",{attrs:{prop:"id",label:"任务id",width:"80"}}),i("el-table-column",{attrs:{prop:"title",label:"任务标题",width:"200"}}),i("el-table-column",{attrs:{prop:"describe",label:"详细描述",width:"280"}}),i("el-table-column",{attrs:{prop:"number",label:"任务次数",width:"110"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("p",[t._v(t._s(0==e.row.number?"不限次数":e.row.number))])]}}])}),i("el-table-column",{attrs:{prop:"score",label:"奖励积分",width:"100"}}),i("el-table-column",{attrs:{prop:"limit",label:"任务类型",width:"120"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("p",[t._v(t._s(0==e.row.limit?"每人一次":1==e.row.limit?"每日一次":"未知类型"))])]}}])}),i("el-table-column",{attrs:{prop:"end_time",label:"结束时间",width:"160"}}),i("el-table-column",{attrs:{prop:"ifopen",label:"操作开关",width:"100"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("el-switch",{on:{change:function(i){t.handopen(e.$index,e.row)}},model:{value:0===e.row.open,callback:function(i){t.$set(e.row,"open === 0 ? true : false",i)},expression:"scope.row.open === 0 ? true : false"}})]}}])}),i("el-table-column",{attrs:{label:"操作",width:"250",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("el-button",{attrs:{type:"text",icon:"el-icon-edit"},on:{click:function(i){t.audittask(e.row)}}},[t._v("去审核任务")]),i("el-button",{attrs:{type:"text",icon:"el-icon-edit"},on:{click:function(i){t.handleEdit(e.$index,e.row)}}},[t._v("修改任务")])]}}])}),i("el-table-column",{attrs:{prop:"create_time",label:"发布任务时间",width:"160"}})],1),i("div",{staticClass:"pagination"},[i("el-pagination",{attrs:{background:"",layout:"prev, pager, next",total:t.datapages},on:{"current-change":t.handleCurrentChange}})],1)],1),i("el-dialog",{attrs:{title:"预览图片",visible:t.imgVisible,width:"25%"},on:{"update:visible":function(e){t.imgVisible=e}}},[i("img",{staticClass:"yulan",attrs:{src:t.yulanimg}})]),i("el-dialog",{attrs:{title:"审核不通过",visible:t.delVisible,width:"30%"},on:{"update:visible":function(e){t.delVisible=e}}},[i("el-form",{ref:"form",attrs:{"label-width":"150px"}},[i("el-form-item",{attrs:{label:"审核不通过原因"}},[i("el-select",{staticClass:"handle-select mr0 changdu",attrs:{placeholder:"审核不成功"},model:{value:t.nopasstext,callback:function(e){t.nopasstext=e},expression:"nopasstext"}},[i("el-option",{key:"1",attrs:{label:"其他",value:"其他"}}),i("el-option",{key:"2",attrs:{label:"图片不符合",value:"图片不符合"}}),i("el-option",{key:"3",attrs:{label:"该任务不加分",value:"该任务不加分"}}),i("el-option",{key:"4",attrs:{label:"未达到要求",value:"未达到要求"}})],1)],1)],1),i("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:function(e){t.delVisible=!1}}},[t._v("取 消")]),i("el-button",{attrs:{type:"primary"},on:{click:t.confirmdelete}},[t._v("确 定")])],1)],1),i("el-dialog",{attrs:{title:"编辑任务",visible:t.editVisible,width:"40%"},on:{"update:visible":function(e){t.editVisible=e}}},[i("el-form",{ref:"form",attrs:{"label-width":"120px"}},[i("el-form-item",{attrs:{label:"任务标题"}},[i("el-input",{model:{value:t.form.title,callback:function(e){t.$set(t.form,"title",e)},expression:"form.title"}})],1),i("el-form-item",{attrs:{label:"任务描述"}},[i("el-input",{model:{value:t.form.describe,callback:function(e){t.$set(t.form,"describe",e)},expression:"form.describe"}})],1),i("el-form-item",{attrs:{label:"结束时间"}},[i("el-date-picker",{attrs:{type:"datetime","value-format":"yyyy-MM-dd HH:mm:ss",placeholder:"选择日期时间"},model:{value:t.form.end_time,callback:function(e){t.$set(t.form,"end_time",e)},expression:"form.end_time"}})],1)],1),i("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:function(e){t.editVisible=!1}}},[t._v("取 消")]),i("el-button",{attrs:{type:"primary"},on:{click:t.saveEdit}},[t._v("确 定")])],1)],1)],1)},l=[],o=(i("7f7f"),i("d25f"),i("cadf"),i("551c"),i("097d"),{name:"basetable",data:function(){return{url:"./static/vuetable.json",tableData:[],cur_page:1,multipleSelection:[],del_list:[],editVisible:!1,form:{},idx:-1,delVisible:!1,imgVisible:!1,yulanimg:null,deleteid:"",datapages:0,score:1,nopasstext:"其他"}},created:function(){this.getData()},computed:{data:function(){var t=this;return this.tableData.filter(function(e){for(var i=0;i<t.del_list.length;i++)if(e.name===t.del_list[i].name){!0;break}})}},methods:{handleCurrentChange:function(t){this.cur_page=t,this.getData(t)},handopen:function(t,e){var i=this;console.log("开关");var a=e.open,l=1;if(0===a){this.tableData[t].open=1;l=1}else{this.tableData[t].open=0;l=0}var o={};o.id=e.id,o.token=localStorage.getItem("token"),o.open=l,this.$axios.post("configure/limittasks/updatestate",o).then(function(t){console.log("修改状态返回数据",t),i.$message.success("操作成功")})},getData:function(){var t=this;this.url="configure/limittasks/taskslist";var e=localStorage.getItem("token");this.$axios.post(this.url,{pages:this.cur_page,token:e}).then(function(e){console.log("群列表信息",e),t.tableData=e.data.data,t.datapages=e.data.countnumber})},audittask:function(t){console.log(t.id),this.$router.push({path:"/auditlimittask?id="+t.id+"&title="+t.title})},handleDelete:function(t,e){console.log("点击删除的id",e.id),this.deleteid=e.id,this.idx=t;var i=this.tableData[t];this.form=i,this.delVisible=!0},confirmdelete:function(){var t=this.form;t.state=2,this.$set(this.tableData,this.idx,this.form),this.delVisible=!1;var e={};e.score=this.score,e.result=this.nopasstext,e.id=t.id,e.taskstate=1,e.user_id=t.user_id,e.token=localStorage.getItem("token"),console.log("提交修改信息",e),this.$message.success("操作成功"),this.$axios.post("configure/tasks/handletask",e).then(function(t){console.log("修改信息返回数据",t)})},clickimg:function(t){console.log("点击图片",t.target.src),this.imgVisible=!0,this.yulanimg=t.target.src},handleEdit:function(t,e){console.log("点击编辑",e),this.idx=t,this.form=e,console.log("11111111"),this.editVisible=!0},saveEdit:function(){var t=this;console.log("保存编辑"),console.log(this.form);this.form;this.$set(this.tableData,this.idx,this.form),this.editVisible=!1;var e=this.form;console.log("1231231"),e.token=localStorage.getItem("token"),console.log("提交修改信息",e),this.$message.success("操作成功"),this.$axios.post("configure/Limittasks/updatetasks",e).then(function(e){console.log("修改信息返回数据",e),t.getData()})}}}),s=o,n=(i("3af4"),i("2877")),r=Object(n["a"])(s,a,l,!1,null,"6e0d4c18",null);r.options.__file="Limittasks.vue";e["default"]=r.exports}}]);