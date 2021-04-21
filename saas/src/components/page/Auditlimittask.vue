<template>



  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item style="font-size:18px;">
          <i class="el-icon-lx-cascades"></i> 任务标题：{{title}}</el-breadcrumb-item>
      </el-breadcrumb>
      
    </div>
    <div class="container">

    <div class="handle-box">

       <el-input
          v-model="nickName"
          placeholder="用户昵称(支持模糊查询)"
          class="handle-input"
        ></el-input>
        <el-button type="primary" icon="search" class="search jianju" @click="search"
          >搜索</el-button
        >
        <el-button type="primary" icon="search" class="search" @click="newsearch"
          >重置</el-button
        >



        <!-- <el-button type="primary" icon="search" class="search" @click="getData"
          >刷新</el-button
        > -->
      </div>

      <!-- <div class="handle-box">
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
         <el-table-column prop="user_id" label="用户id" width="100">
         </el-table-column>
        <el-table-column prop="logo" label="任务图片" width="500">
        <template slot-scope="scope">
        <div class="imgbody"> <img class="taskimg" v-for="img in JSON.parse(scope.row.images)" :src="img"  @click="clickimg" ></img> </div>
          </template>
        </el-table-column>
        <el-table-column prop="nickName" label="用户昵称" width="120">
        </el-table-column>
        <el-table-column prop="avatarUrl" label="用户头像" width="120">
          <template slot-scope="scope" style="height:100px">
            <img class="logo" :src="scope.row.avatarUrl"></img>
          </template>
        </el-table-column>
        </el-table-column>
        <el-table-column prop="explain" label="任务描述" width="220">
        </el-table-column>p
        <el-table-column prop="create_time" label="上传时间" width="160">
        </el-table-column>
        <el-table-column prop="state" label="审核状态" width="100">p
        <template slot-scope="scope">
        <p>{{scope.row.state==0?"未审核":scope.row.state==1?"审核成功":"审核失败"}}</p>
         </template>
        </el-table-column>
        <el-table-column label="操作" width="270" align="center">
          <template slot-scope="scope" v-if="scope.row.state == 0 ">
            <el-button type="text" icon="el-icon-edit" @click="directpass(scope.$index, scope.row)">审核通过</el-button>
            <el-button type="text" icon="el-icon-delete" class="red"   @click="handleDelete(scope.$index, scope.row)" >审核不通过</el-button>
          </template>
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
    <el-dialog title="审核通过" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="score" label-width="120px">
        <el-form-item label="合格奖励积分">
          <el-input v-model="score"></el-input>
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
      title: "这是任务标题",
      limit_id: null,
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
      nickName: "", //查询昵称
    };
  },
  created() {
    //this.getData();
  },
  activated() {
    this.init();
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

    //页面加载执行方法
    init() {
      this.limit_id = this.$route.query.id || "";
      this.title = this.$route.query.title || "任务标题";

      if (this.limit_id) {
        this.getData();
      } else {
        console.log("id不存在");
      }
    },

    //获取数据
    async getData() {
      let url = "configure/limittasks/usertaskslist";
      let token = localStorage.getItem("token");
      let params = {
        limit_id: this.limit_id,
        pages: this.cur_page,
        nickName: this.nickName,
        state: 0,
        token: token,
      };
      try {
        const res = await this.$axios.post(url, params);
        if (res.status == "200") {
          this.tableData = res.data.data;
          this.datapages = res.data.countnumber;
        } else {
          this.$message({
            message: res.message,
            type: "error",
          });
          console.log(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },

    search() {
      this.getData();
    },

    newsearch() {
      this.nickName = "";
      this.cur_page = 1;
      this.datapages = 0;

      this.getData();
    },

    //直接审核通过
    directpass(index, row) {
      console.log("点击编辑", row);
      this.idx = index;
      const item = this.tableData[index];
      this.form = item;

      let data = this.form;
      data.state = 1;
      this.$set(this.tableData, this.idx, this.form);
      this.editVisible = false;
      let postdata = {};
      postdata.result = "任务合格";
      postdata.id = data.id;
      postdata.limit_id = this.limit_id;
      postdata.state = 1;
      postdata.token = localStorage.getItem("token");
      console.log("提交修改信息", postdata);
      this.$axios
        .post("configure/limittasks/audittask", postdata)
        .then((res) => {
          console.log("直接审核通过返回数据", res);
          this.$message.success(`操作成功`);
          //this.getData();
        });
    },

    //调起审核不通过
    handleDelete(index, row) {
      this.deleteid = row.id;
      this.idx = index;
      const item = this.tableData[index];
      this.form = item;
      this.delVisible = true;
    },

    //确认审核不通过
    confirmdelete() {
      //改变列表
      let data = this.form;
      data.state = 2;
      this.$set(this.tableData, this.idx, this.form);
      this.delVisible = false;
      let postdata = {};
      postdata.limit_id = this.limit_id;
      postdata.result = this.nopasstext;
      postdata.id = data.id;
      postdata.state = 2;
      postdata.token = localStorage.getItem("token");
      console.log("提交审核不通过信息", postdata);
      this.$message.success(`操作成功`);
      this.$axios
        .post("configure/limittasks/audittask", postdata)
        .then((res) => {
          console.log("审核返回数据", res);
          this.$message.success(`操作成功`);
        });
    },

    //放大图片
    clickimg(e) {
      console.log("点击图片", e.target.src);
      this.imgVisible = true;
      this.yulanimg = e.target.src;
    },

    //调起审核通过，二次审核
    handleEdit(index, row) {
      console.log("点击编辑", row);
      this.idx = index;
      const item = this.tableData[index];
      this.form = item;
      this.editVisible = true;
    },
    // 保存编辑，审核通过
    saveEdit() {
      console.log("审核通过");
      console.log(this.form);
      //改变列表
      let data = this.form;
      data.state = 1;
      this.$set(this.tableData, this.idx, this.form);
      this.editVisible = false;
      let postdata = {};
      postdata.score = this.score;
      postdata.result = "任务合格";
      postdata.id = data.id;
      postdata.taskstate = 1;
      postdata.user_id = data.user_id;
      postdata.token = localStorage.getItem("token");
      console.log("提交修改信息", postdata);
      this.$message.success(`操作成功`);
      this.$axios.post("configure/tasks/handletask", postdata).then((res) => {
        console.log("修改信息返回数据", res);
        //this.getData();
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

.jianju {
  margin-left: 10px;
}

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
