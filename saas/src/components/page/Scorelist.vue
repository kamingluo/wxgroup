<template>



  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item style="font-size:18px;">
          <i class="el-icon-lx-cascades"></i> 用户积分流水
        </el-breadcrumb-item>
      </el-breadcrumb>

    </div>
    <div class="container">

      <div class="handle-box">

        <el-input v-model="nickName" placeholder="用户昵称(支持模糊查询)" class="handle-input"></el-input>
        <el-button type="primary" icon="search" class="search jianju" @click="search">搜索</el-button>
        <el-button type="primary" icon="search" class="search" @click="newsearch">重置</el-button>

        <el-button type="primary" icon="search" class="search" @click="socerranking">统计下载用户积分获取情况</el-button>

      </div>

      <div class="handle-box"></div>
      <el-table :data="tableData" border class="table" ref="multipleTable">
        <el-table-column prop="user_id" label="用户id" width="100">
        </el-table-column>
        <el-table-column prop="nickName" label="用户昵称" width="120">
        </el-table-column>
        <el-table-column prop="avatarUrl" label="用户头像" width="120">
          <template slot-scope="scope" style="height:100px">
            <img class="logo" :src="scope.row.avatarUrl"></img>
          </template>
        </el-table-column>
        </el-table-column>
        <el-table-column prop="score" label="积分数" width="220">
        </el-table-column>
        <el-table-column prop="explain" label="积分流水描述" width="220">
        </el-table-column>

        <el-table-column prop="state" label="积分类型" width="100">p
          <template slot-scope="scope">
            <p>{{scope.row.state==0?"增加积分":scope.row.state==1?"减少积分":"其他"}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="操作时间" width="160">
        </el-table-column>
      </el-table>
      <!-- 换页 -->
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="datapages">
        </el-pagination>
      </div>
    </div>


    <!-- 预览图片 -->
    <el-dialog title="预览图片" :visible.sync="imgVisible" width="25%">
      <img class="yulan" :src="yulanimg"></img>
    </el-dialog>




    <!-- 下载弹出框 -->
    <el-dialog title="统计下载用户积分获取情况" :visible.sync="socerrankingModel" width="30%">
      <el-form ref="form" label-width="80px">
        <el-date-picker v-model="timeslot" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="socerrankingModel = false">取 消</el-button>
        <el-button type="primary" @click="Downloadfile">下载数据</el-button>
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
        datapages: 0,
        nickName: "", //查询昵称
        timeslot: [],
        socerrankingModel: false,
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
        let url = "configure/scorelist/userscorerecord";
        let token = localStorage.getItem("token");
        let params = {
          pages: this.cur_page,
          nickName: this.nickName,
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

      //用户积分情况
      socerranking() {
        this.socerrankingModel = true;
      },


      //下载数据
      async Downloadfile() {
        let time = this.timeslot;
        console.log("下载数据")
        console.log(time)
        if (!time) {
          this.$message.error("请选择时间");
          return;
        }

        let start_time = time[0];
        let end_time = time[1];

        let url = "configure/scorelist/socerranking";
        let token = localStorage.getItem("token");
        let params = {
          start_time: start_time,
          end_time: end_time,
          token: token,
        };
        try {
          const res = await this.$axios.post(url, params);
          console.log("获取下载链接")
          console.log(res.data.downloadurl)

          let downloadurl = res.data.downloadurl;

          window.open(downloadurl, '_self');



          //const downloadurlres = await this.$axios.get(downloadurl, { responseType: 'blob' });



          this.$message.success(`下载完成`);

        } catch (error) {
          console.log(error);
          this.$message.error("下载失败，请稍后重试或者联系管理人员");
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