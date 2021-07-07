<template>



  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item style="font-size:18px;">
          <i class="el-icon-lx-cascades"></i> 连续签到排行查询</el-breadcrumb-item>
      </el-breadcrumb>
      
    </div>
    <div class="container">

    <div class="handle-box">

       <el-input
          v-model="day"
          placeholder="连续签到天数（大于等于）"
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
      <el-table :data="tableData" border height="600" class="table" ref="multipleTable">
         <el-table-column prop="user_id" label="用户id" width="100">
         </el-table-column>
        <el-table-column prop="nickName" label="用户昵称" width="180">
        </el-table-column>
        <el-table-column prop="avatarUrl" label="用户头像" width="120">
          <template slot-scope="scope" style="height:100px">
            <img class="logo" :src="scope.row.avatarUrl"></img>
          </template>
        </el-table-column>
        </el-table-column>
        <el-table-column prop="continuity_number" label="连续签到天数" width="150">
        </el-table-column>
        <el-table-column prop="all_signin_number" label="总签到天数" width="150">
        </el-table-column>
        <el-table-column prop="update_time" label="最后签到时间" width="180">
        </el-table-column>
      </el-table>
       <!-- 换页 -->
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :page-size="pagesize"
          layout="prev, pager, next"
          :total="datapages"
        >
        </el-pagination>
      </div>
    </div>


    <!-- 预览图片 -->
    <el-dialog title="预览图片" :visible.sync="imgVisible" width="25%">
      <img class="yulan" :src="yulanimg"></img>
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
      pagesize: 50,
      del_list: [],
      editVisible: false,
      form: {},
      idx: -1,
      delVisible: false,
      imgVisible: false,
      yulanimg: null,
      datapages: 0,
      day: 7, //连续签到天数
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

    //获取数据
    async getData() {
      console.log("获取数据")
      let url = "configure/signin/continuityday";
      let token = localStorage.getItem("token");
      let params = {
        pages: this.cur_page,
        day: this.day,
        token: token,
      };
      try {
        const res = await this.$axios.post(url, params);
        console.log(res.data)
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
      this.day = 7;
      this.cur_page = 1;
      this.datapages = 0;
      this.getData();
    },

    //放大图片
    clickimg(e) {
      console.log("点击图片", e.target.src);
      this.imgVisible = true;
      this.yulanimg = e.target.src;
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
