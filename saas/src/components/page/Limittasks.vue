<template>



  <div class="table">
    <div class="crumbs">
    </div>
    <div class="container">

      <div class="handle-box"></div>
      <el-table :data="tableData" border class="table" ref="multipleTable">
         <el-table-column prop="id" label="任务id" width="80">
         </el-table-column>
        <el-table-column prop="title" label="任务标题" width="200">
        </el-table-column>
        <el-table-column prop="describe" label="详细描述" width="280">
        </el-table-column>
        <el-table-column prop="number" label="任务次数" width="110">
        <template slot-scope="scope">
        <p>{{scope.row.number==0?"不限次数":scope.row.number}}</p>
         </template>
        </el-table-column>
        <el-table-column prop="score" label="奖励积分" width="100">
        </el-table-column>
        <el-table-column prop="limit" label="任务类型" width="120">
           <template slot-scope="scope">
        <p>{{scope.row.limit==0?"每人一次":scope.row.limit==1?"每日一次":"未知类型"}}</p>
         </template>
        </el-table-column>
        <el-table-column prop="end_time" label="结束时间" width="160">
        </el-table-column>
        <el-table-column prop="ifopen" label="操作开关" width="100">
         <template slot-scope="scope">
            <el-switch
              v-model="scope.row.open === 0 ? true : false"@change="handopen(scope.$index, scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="audittask(scope.row)">去审核任务</el-button>
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index,scope.row)">修改任务</el-button>
            <!-- <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)" >删除</el-button> -->
          </template>
        </el-table-column>

        <el-table-column prop="create_time" label="发布任务时间" width="160">
        </el-table-column>


      </el-table>
       <!-- 换页 -->
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


       <!-- 编辑弹出框 -->
    <el-dialog title="预览图片" :visible.sync="imgVisible" width="25%">
      <img class="yulan" :src="yulanimg"></img>
    </el-dialog>


     <!-- 编辑弹出框 -->
    <el-dialog title="审核不通过" :visible.sync="delVisible" width="30%" > 
       <el-form ref="form" label-width="150px">
        <el-form-item label="审核不通过原因">
          <el-select
          v-model="nopasstext"
          placeholder="审核不成功"
          class="handle-select mr0 changdu"
        >
          <el-option key="1" label="其他" value="其他" ></el-option>
          <el-option key="2" label="图片不符合" value="图片不符合"></el-option>
          <el-option key="3" label="该任务不加分" value="该任务不加分"></el-option>
          <el-option key="4" label="未达到要求" value="未达到要求"></el-option>
        </el-select>
         
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmdelete">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 编辑弹出框 -->
    <el-dialog title="编辑任务" :visible.sync="editVisible" width="40%">
      <el-form ref="form"  label-width="120px">
        <el-form-item label="任务标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input v-model="form.describe"></el-input>
        </el-form-item>

        <el-form-item label="结束时间">
          <el-date-picker
          v-model="form.end_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间">
        </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
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
      del_list: [],
      editVisible: false,
      form: {},
      idx: -1,
      delVisible: false,
      imgVisible: false,
      yulanimg: null,
      deleteid: "",
      datapages: 0,
      score: 1,
      nopasstext: "其他",
    };
  },
  created() {
    this.getData();
  },
  computed: {
    data() {
      return this.tableData.filter((d) => {
        let is_del = false;
        for (let i = 0; i < this.del_list.length; i++) {
          if (d.name === this.del_list[i].name) {
            is_del = true;
            break;
          }
        }
      });
    },
  },
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData(val);
    },

    //开关
    handopen(index, row){
      console.log("开关");
      let open = row.open;
      var resservice = 1;
      if (open === 0) {
        this.tableData[index].open = 1;
        var resservice = 1;
      } else {
        this.tableData[index].open = 0;
        var resservice = 0;
      }
      let postdata = {};
      postdata.id = row.id;
      postdata.token = localStorage.getItem("token");
      postdata.open=resservice;

      this.$axios.post("configure/limittasks/updatestate", postdata).then((res) => {
        console.log("修改状态返回数据", res);
        this.$message.success(`操作成功`);
      });
    },

    //获取数据
    getData() {
      this.url = "configure/limittasks/taskslist";
      let token = localStorage.getItem("token");
      this.$axios
        .post(this.url, { pages: this.cur_page, token: token })
        .then((res) => {
          console.log("群列表信息", res);
          this.tableData = res.data.data;
          this.datapages = res.data.countnumber;
        });
    },

    //去审核任务
    audittask(row) {
      console.log(row.id);
      this.$router.push({
        path: "/auditlimittask?id=" + row.id + "&title=" + row.title,
      });
    },


    //调起删除
    handleDelete(index, row) {
      console.log("点击删除的id", row.id);
      this.deleteid = row.id;
      this.idx = index;
      const item = this.tableData[index];
      this.form = item;
      this.delVisible = true;
    },

    //确认删除
    confirmdelete() {
      //改变列表
      let data = this.form;
      data.state = 2;
      this.$set(this.tableData, this.idx, this.form);
      this.delVisible = false;
      let postdata = {};
      postdata.score = this.score;
      postdata.result = this.nopasstext;
      postdata.id = data.id;
      postdata.taskstate = 1;
      postdata.user_id = data.user_id;
      postdata.token = localStorage.getItem("token");
      console.log("提交修改信息", postdata);
      this.$message.success(`操作成功`);
      this.$axios.post("configure/tasks/handletask", postdata).then((res) => {
        console.log("修改信息返回数据", res);
      });
    },

    clickimg(e) {
      console.log("点击图片", e.target.src);
      this.imgVisible = true;
      this.yulanimg = e.target.src;
    },
    handleEdit(index,row) {
      console.log("点击编辑", row);
      this.idx = index;
      // const item = this.tableData[index];
      this.form = row;
      console.log("11111111")
      this.editVisible = true;
    },
    // 保存编辑
    saveEdit() {
      console.log("保存编辑");
      console.log(this.form);
      //console.log("未处理的结束时间",end_time)
      //改变列表
      let data = this.form;
      this.$set(this.tableData, this.idx, this.form);
      this.editVisible = false;

      let postdata =this.form;
      console.log("1231231")
      postdata.token = localStorage.getItem("token");
      console.log("提交修改信息", postdata);
      this.$message.success(`操作成功`);
      this.$axios.post("configure/Limittasks/updatetasks", postdata).then((res) => {
        console.log("修改信息返回数据", res);
        this.getData();
      });
    },
  },
};
</script>

<style scoped>
.yulan {
  width: 440px;
  height: 600px;
}
/* .imgbody image{
width: 100px;
height: 130px;
} */

.changdu {
  width: 300px;
}

.taskimg {
  width: 140px;
  height: 180px;
  margin-left: 15px;
  margin-bottom: 10rpx;
}
.logo {
  width: 70px;
  height: 70px;
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
