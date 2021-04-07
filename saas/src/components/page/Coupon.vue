<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 已经兑换数：{{alreadyexchangenum}}
          <i >>>></i> 剩余优惠券数：{{noexchangenum}}</el-breadcrumb-item>
      </el-breadcrumb>
      
    </div>
    <div class="container">


      <div class="handle-box"></div>
      <el-table :data="tableData" border class="table" ref="multipleTable">
        <el-table-column prop="id" label="序号" width="80"> </el-table-column>
        <el-table-column prop="user_id" label="用户id" width="100"> </el-table-column>
         <el-table-column prop="nickName" label="用户昵称" width="200">
         <template slot-scope="scope" style="height:100px">
            <p>{{scope.row.nickName?scope.row.nickName:"未授权"}}</p>
          </template>
        </el-table-column>

         <el-table-column prop="avatarUrl" label="用户头像" width="150">
          <template slot-scope="scope" style="height:120px">
            <img class="logo" :src="scope.row.avatarUrl"></img>
          </template>
        </el-table-column>

        <el-table-column prop="code" label="优惠券码" width="250">
        </el-table-column>
        <el-table-column prop="create_time" label="兑换时间" width="180">
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


  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    return {
      url: "./static/vuetable.json",
      tableData: [],
      cur_page: 1,
      multipleSelection: [],
      idx: -1,
      datapages: 0,
      noexchangenum: null,
      alreadyexchangenum: null,
    };
  },
  created() {
    this.getData();
    this.couponnum();
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
      this.getData();
    },

    getData() {
      this.url = "configure/Special/querylist";
      let token = localStorage.getItem("token");
      this.$axios
        .post(this.url, { pages: this.cur_page, token: token })
        .then((res) => {
          console.log("用户列表信息", res);
          this.tableData = res.data.data;
          this.datapages = res.data.countnumber;
        });
    },

    couponnum() {
      this.url = "configure/Special/couponnum";
      let token = localStorage.getItem("token");
      this.$axios.post(this.url, { token: token }).then((res) => {
        console.log("用户列表信息", res);
        this.alreadyexchangenum = res.data.alreadyexchangenum;
        this.noexchangenum = res.data.noexchangenum;
      });
    },
  },
};
</script>

<style scoped>
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
