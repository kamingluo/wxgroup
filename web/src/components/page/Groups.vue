<template>



  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          ><i class="el-icon-lx-cascades"></i> 总群数：{{datapages}}</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <div class="container">

    <div class="handle-box">
        <el-select
          v-model="select_cate"
          placeholder="筛选方式"
          class="handle-select mr10"
        >
          <el-option key="1" label="群名称" value="0" ></el-option>
          <el-option key="2" label="群ID" value="1"></el-option>
        </el-select>
        <el-input
          v-model="select_word"
          placeholder="筛选关键词"
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" icon="search" class="search" @click="search"
          >搜索</el-button
        >
        <el-button type="primary" icon="search" class="search" @click="newsearch"
          >重置</el-button
        ><el-button type="primary" icon="search" class="search" @click="havewxnumber"
          >查询有微信号的</el-button
        >
      </div>

      <!-- <div class="handle-box">
        <el-button type="primary" class="handle-del mr10" @click="add"
          >新增数据</el-button
        >
        <el-button
          type="primary"
          icon="delete"
          class="handle-del mr10"
          @click="delAll"
          >批量删除</el-button
        >
      </div> -->
      <div class="handle-box"></div>
      <el-table :data="tableData" border class="table" ref="multipleTable">
        <el-table-column prop="id" label="群id" width="80"> </el-table-column>
        <el-table-column prop="logo" label="群图标" width="120">
          <template slot-scope="scope" style="height:100px">
            <img class="logo" :src="scope.row.logo"></img>
          </template>
        </el-table-column>
        <el-table-column prop="crowd_name" label="群名称" width="200">
        </el-table-column>
        <el-table-column prop="crowd_ownerid" label="群主id" width="100">
        </el-table-column>
        <el-table-column prop="introduce" label="群介绍" width="300">
        </el-table-column>
        <el-table-column prop="count" label="群人数" width="100">
        </el-table-column>
        <el-table-column prop="wxnumber" label="群主微信" width="200">
         <template slot-scope="scope">
         <p >{{scope.row.wxnumber?scope.row.wxnumber:"未填写"}}</p>
         </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="170">
        </el-table-column>

        <el-table-column prop="open" label="当前状态" width="150">
        <template slot-scope="scope">
        <p>{{scope.row.open==0?"无限制":scope.row.open==1?"审核中":scope.row.open==2?"体验中":scope.row.open==3?"体验过期":scope.row.open==4?"删除中":scope.row.open==5?"正常使用":"未知状态"}}</p>
         </template>
        </el-table-column>
        <el-table-column prop="end_time" label="结束时间" width="170">
        </el-table-column>

        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" class="blue" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="text"  class="blue" @click="getqrcode(scope.$index, scope.row)">群二维码</el-button>
            <el-button type="text" icon="el-icon-edit" class="green" @click="seetodaydata(scope.$index, scope.row)">查看今日数据</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="datapages"
        >
        </el-pagination>
      </div>
    </div>

        <!-- 编辑弹框 -->
    <el-dialog title="编辑" :visible.sync="editformvisible" width="20%">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="群id">
          <el-input v-model="form.id" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="群状态">
          <el-select
          v-model="form.open"
          placeholder="请选择群状态"
          class="handle-select mr0 changdu"
        >
          <el-option key="0" label="无限制" value="0" ></el-option>
          <el-option key="1" label="审核中" value="1"></el-option>
          <el-option key="2" label="体验中" value="2"></el-option>
          <el-option key="3" label="体验过期" value="3"></el-option>
          <el-option key="4" label="删除中" value="4"></el-option>
          <el-option key="5" label="正常使用" value="5"></el-option>
        </el-select>
        </el-form-item>

        <el-form-item label="结束时间">
          <el-date-picker
            v-model="form.end_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editformvisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>


     <!-- 删除弹出框 -->
    <el-dialog title="删除群" :visible.sync="delVisible" width="30%">
      <el-form ref="form" label-width="120px">
        <p>确认删除？？</p>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmdelete">确 定</el-button>
      </span>
    </el-dialog>


     <!-- 群二维码 -->
    <el-dialog title="群二维码" :visible.sync="qrcodeVisible" width="30%">
      <el-form ref="form" :model="qrcodedata" label-width="120px">
       <div><p>群名称：{{qrcodedata.crowd_name}}   </p></div>
      
        <div>  <img class="qrcode"   :src="qrcodedata.imageurl"></img></div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="qrcodeVisible = false">取 消</el-button>
        <el-button type="primary" @click="qrcodeVisible = false">确 定</el-button>
      </span>
    </el-dialog>



    <!-- 群今日数据弹出框 -->
    <el-dialog title="群今日数据" :visible.sync="grouptodaydataVisible" width="30%">
      <el-form ref="form" :model="grouptodaydata" label-width="120px">
       <div><p>今日注册人数：{{grouptodaydata.groupregister}}   </p></div>
      <div> <p>今日活跃人数：{{grouptodaydata.groupactive}}</p></div>
      <div> <p>今日签到人数：{{grouptodaydata.groupsigins}}</p></div>
     <div>  <p>今日上传任务数：{{grouptodaydata.grouptasks}}</p></div>
       <div><p>今日抽奖人数：{{grouptodaydata.grouplotterys}}</p></div>
      <div> <p>今日兑换人数：{{grouptodaydata.groupexchanges}}</p></div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="grouptodaydataVisible = false">取 消</el-button>
        <el-button type="primary" @click="grouptodaydataVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "basetable",
  data() {
    return {
      url: "./static/vuetable.json",
      tableData: [],
      cur_page: 1,
      multipleSelection: [],
      select_cate: "1",
      select_word: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      userdataVisible: false,
      adminuserdata: null,
      admintaskdata: null,
      admincoinsdata: null,
      wxnumberif:null,
      idx: -1,
      delVisible: false,
      deleteid: "",
      datapages: 0,
      grouptodaydata:{},
      grouptodaydataVisible:false,
      qrcodeVisible:false,
      group_name:null,
      qrcodedata:{},
      editformvisible: false,
      form: {},
    };
  },
  created() {
    this.getData();
  },
  computed: {
    data() {
      return this.tableData.filter(d => {
        let is_del = false;
        for (let i = 0; i < this.del_list.length; i++) {
          if (d.name === this.del_list[i].name) {
            is_del = true;
            break;
          }
        }
      });
    }
  },
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      let select_word=this.select_word;
      if(select_word ==  null || select_word == ""){
          this.getData();
      }
      else{
          this.gosearch(val);
      }
    },

    havewxnumber(){
      this.cur_page = 1;
      this.wxnumberif=true;
      this.getData()

    },

    getqrcode(index, row){
      console.log("获取群二维码")
      console.log(row.id)
      let data={};
      data['crowd_id']=row.id;
      data['crowd_name']=row.crowd_name;
      data['imageurl']='https://group.gzywudao.top/php/public/qrcode/' + row.id + '.png';
      let url="configure/desgroup/groupqrcode?crowd_id=" + row.id;
       this.$axios(url).then(res => {
        console.log("获取二维码成功", res);
         this.$message.success(`获取成功！`);
         console.log("二维码data值",data)
         this.qrcodedata =data;
         this.qrcodeVisible=true;
      });
    },

    getData() {
      this.url = "configure/desgroup/groupslist";
      let wxnumberif=this.wxnumberif;
      this.$axios.post(this.url, { pages: this.cur_page,wxnumberif:wxnumberif}).then(res => {
        console.log("群列表信息", res);
        this.tableData = res.data.data;
        this.datapages = res.data.countnumber;
      });
    },

    newsearch(){
        this.cur_page = 1;
        this.select_word="";
        this.select_cate="1";
        this.wxnumberif=null;
        let url = "configure/desgroup/groupslist";
        this.$axios.post(url, { pages:1 }).then(res => {
        console.log("群列表信息", res);
        this.tableData = res.data.data;
        this.datapages = res.data.countnumber;
      });

    },

    //筛选
    search(){
        console.log("点击筛选")
        let select_word=this.select_word;//关键词
        console.log("打印关键词",select_word)
        if(select_word == null || select_word == ""){
            console.log("11111111")
            this.$message.error(`关键词不能为空！！！`);
            return ;
        }

        console.log("去筛选")
        this.gosearch(1)

    },

    gosearch(pages){
        let select_cate=this.select_cate;//筛选方式
        let select_word=this.select_word;//关键词
        let ifwxnumber=this.ifwxnumber;//是否有微信号
        console.log("开始筛选",pages)
        if(select_cate == "1"){
            var resdata={
                pages:pages,
                id:select_word,
            };
        }
        else{
            var resdata={
                pages:pages,
                crowd_name:select_word
            };
        }
        let url = "configure/desgroup/groupslist";
        this.$axios.post(url,resdata).then(res => {
        console.log("搜索群返回", res);
        this.$message.success(`操作成功`);
        this.tableData = res.data.data;
        this.datapages = res.data.countnumber;
        });
    },


    handleEdit(index, row) {
      console.log("点击编辑");
      this.idx = index;
      const item = this.tableData[index];
      this.form = item;
      this.form.open=String(this.form.open)
      this.editformvisible = true;
    },

    // 保存编辑
    saveEdit() {
      console.log("提交修改信息", this.form);
      this.$set(this.tableData, this.idx, this.form);
      this.editVisible = false;
      this.$axios
        .post("configure/desgroup/updateopen", this.form)
        .then((res) => {
          console.log("修改信息返回数据", res);
          this.$message.success(`操作成功`);
          this.editformvisible=false;
          this.gosearch();
        });
    },


    //调起删除
    handleDelete(index, row){
        console.log("点击删除的id",row.id)
        this.deleteid=row.id;
        this.delVisible=true;

    },

    //确认删除
    confirmdelete(){
     let id=this.deleteid;
     let url = "configure/desgroup/deletegroup?id=" + id;
      this.$axios(url).then(res => {
        console.log("删除群返回", res);
        this.$message.success(`操作成功`);
        this.delVisible=false;
        this.gosearch();
      });
    },

    seetodaydata(index, row) {
      console.log("点击查看今日数据");
       let id=row.id;
       let url = "configure/desgroup/groupdetails?id=" + id;
      this.$axios(url).then(res => {
        console.log("查询群今日数据返回", res.data.data);
        this.grouptodaydata=res.data.data;
        // this.$message.success(`操作成功`);
        this.grouptodaydataVisible=true;
      });
    },
   

    getuserData(openid) {
      this.url = "/admin.php/configure/dataquery/userdata";
      this.$axios.post(this.url, { openid: openid }).then(res => {
        console.log("用户操作信息", res.data);
        this.adminuserdata = res.data.userdata;
        this.admintaskdata = res.data.task;
        this.admincoinsdata = res.data.coins;
        this.userdataVisible = true;
      });
    },

    userdata() {
      this.userdataVisible = true;
    }
  }
};
</script>

<style scoped>
.logo {
  width: 70px;
  height: 70px;
}
.qrcode{
   width: 250px;
  height: 250px;
}

.bodaydata {
  margin-top: 25px;
}
.userdatadiv {
  display: inline;
  margin-left: 15px;
}
.userdatatitle {
  font-size: 30px;
}

.keyname {
  font-size: 20px;
}
.keyvalue {
  font-size: 25px;
  color: red;
  font-weight: 600;
}
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
</style>
