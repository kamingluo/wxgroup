<template>



  <div class="table">
    <div class="crumbs">
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
      </div>

      <div class="handle-box"></div>
      <el-table :data="tableData" border class="table" ref="multipleTable">
         <el-table-column prop="user_id" label="用户id" width="100">
         </el-table-column>
        <el-table-column prop="nickName" label="用户昵称" width="220">
        </el-table-column>
        <el-table-column prop="avatarUrl" label="用户头像" width="120">
          <template slot-scope="scope" style="height:100px">
            <img class="logo" :src="scope.row.avatarUrl"></img>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="用户积分" width="170">
        </el-table-column>
        <el-table-column prop="user_type" label="用户角色" width="150">p
        <template slot-scope="scope">
        <p>{{scope.row.user_type==0?"普通群员":scope.row.user_type==1?"群主":"管理员"}}</p>
         </template>
        </el-table-column>
        <el-table-column prop="remarks" label="用户备注" width="250">
        </el-table-column>
        <el-table-column prop="create_time" label="入群时间" width="180">
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope"  >
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">操作积分</el-button>
            <el-button type="text" icon="el-icon-delete" class="red"   @click="handleDelete(scope.$index, scope.row)"  v-if="scope.row.user_type != 1 ">踢出群</el-button>
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


       <!-- 删除弹出框 -->
    <el-dialog title="预览图片" :visible.sync="imgVisible" width="25%">
      <img class="yulan" :src="yulanimg"></img>
    </el-dialog>


     <!-- 删除框 -->
    <el-dialog title="把用户踢出群" :visible.sync="delVisible" width="15%" > 
       <el-form ref="form" label-width="150px">
       <p>确认踢出群空间，踢出后不可恢复！</P>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmdelete">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 编辑弹出框 -->
    <el-dialog title="操作用户积分" :visible.sync="editVisible" width="20%">
      <el-form ref="form" :model="editdata" label-width="80px">
        <el-form-item label="积分数">
          <el-input v-model="editdata.score" placeholder="积分数不能为空"></el-input>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="editdata.explain" placeholder="请输入积分操作说明"></el-input>
        </el-form-item>

        <el-form-item >
             <el-radio-group v-model="editdata.state">
                  <el-radio :label="0">增加积分</el-radio>
                  <el-radio :label="1">减少积分</el-radio>
             </el-radio-group>
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
      nickName:null,
      idx: -1,
      delVisible: false,
      imgVisible: false,
      yulanimg: null,
      deleteid: "",
      datapages: 0,
      editdata:{
            score: 1,
            explain:null,
            state:0,
      },
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

    getData() {
      this.url = "configure/userlist/userslist";
      let token = localStorage.getItem("token");
      this.$axios
        .post(this.url, { pages: this.cur_page, token: token,nickName:this.nickName })
        .then((res) => {
          console.log("群列表信息", res);
          this.tableData = res.data.data;
          this.datapages = res.data.countnumber;
        });
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
      let postdata = {};
      postdata.user_id = data.user_id;
      postdata.token = localStorage.getItem("token");
      console.log("提交修改信息", postdata);
      this.$axios.post("configure/userlist/deletegroupuser", postdata).then((res) => {
        console.log("修改信息返回数据", res);
              this.delVisible = false;
              this.$message.success(`操作成功`);
               this.getData();
      });
    },

    clickimg(e) {
      console.log("点击图片", e.target.src);
      this.imgVisible = true;
      this.yulanimg = e.target.src;
    },
    handleEdit(index, row) {
      console.log("点击编辑", row);
      this.idx = index;
      const item = this.tableData[index];
      this.form = item;
      this.editVisible = true;
    },
    // 保存编辑
    saveEdit() {
      console.log("保存编辑");
      console.log(this.form);
      console.log(this.editdata)

      if(this.editdata.score==null || this.editdata.explain==null ){
        this.$message.error(`积分或说明不能为空`);
        return;
      }


      //改变列表
      console.log("111111112333333")
      this.editVisible = false;
      let postdata = {};
      postdata.score = this.editdata.score;
      postdata.explain = this.editdata.score;
      postdata.state = this.editdata.state;
      postdata.user_id = this.form.user_id;
      postdata.token = localStorage.getItem("token");
      console.log("提交修改信息", postdata);
      this.$message.success(`操作成功`);
      this.$axios.post("configure/userlist/updateusergroupscore", postdata).then((res) => {
        console.log("操作积分返回数据", res);
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
