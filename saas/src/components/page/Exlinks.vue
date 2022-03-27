<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <!-- <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 已经兑换数：{{alreadyexchangenum}}
          <i >>>></i> 剩余优惠券数：{{noexchangenum}}</el-breadcrumb-item> -->
      </el-breadcrumb>

    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="phone" placeholder="根据手机号搜索" class="handle-input mr10 " style="width: 280px" maxlength="11"
          type='number'>
          <i class="el-icon-delete el-input__icon" slot="suffix" @click="phone = null">
          </i>
        </el-input>
        <el-button type="primary" icon="search" class="search distance" @click="search">搜索</el-button>
        <el-button type="primary" icon="search" class="search distance" @click="newsearch">重置搜索</el-button>
        <el-button type="primary" class="handle-del mr10 distance" @click="clickuploadfile">上传数据文件</el-button>
        <el-button type="primary" class="handle-del mr10 distance" @click="deleteall">清空所有数据</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable">
        <el-table-column prop="id" label="序号" width="100"> </el-table-column>
        <el-table-column prop="product" label="品名" width="280"> </el-table-column>
        <el-table-column prop="name" label="姓名" width="250">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="200">
        </el-table-column>
        <el-table-column prop="link" label="专属链接" width="350">
        </el-table-column>
        <el-table-column prop="usetime" label="使用时间" width="180">
        </el-table-column>
        <el-table-column prop="create_time" label="兑换时间" width="180">
        </el-table-column>

      </el-table>

      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="datapages">
        </el-pagination>
      </div>
    </div>

    <!-- //上传文件弹框 -->
    <el-dialog title="上传文件" :visible.sync="uploadfilemodel" width="410px" center>
      <el-upload class="upload-demo avatar-uploader" drag
        action="https://group.gzywudao.top/php/public/saas.php/configure/exlinks/uploadfile" multiple
        :on-success="upsuccess" :on-error="uperror" :on-progress="upprogress" accept=".xls, .xlsx">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能处理excel文件，请正确上传
        </div>
      </el-upload>
    </el-dialog>


    <!-- 操作中提示框 -->
    <el-dialog title="处理中....." :visible.sync="operationVisible" width="300px" center>
      <div class="del-dialog-cnt">
        <img class="operationimg" src="../../assets/images/timg.gif" />
      </div>
    </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="deleteallmole" width="300px" center>
          <div class="del-dialog-cnt">清空之后不可恢复，请谨慎操作？</div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="deleteallmole = false">取 消</el-button>
            <el-button type="primary" @click="querydelete">确 定</el-button>
          </span>
        </el-dialog>
    




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
        phone: null,
        uploadfilemodel: false,//上传文件弹框
        operationVisible: false, //操作动态 图片
        deleteallmole: false,
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
        this.getData();
      },

      getData() {
        this.url = "configure/exlinks/getexlinks";
        let token = localStorage.getItem("token");
        let phone = parseInt(this.phone);
        this.$axios
          .post(this.url, { pages: this.cur_page, token: token, phone: phone })
          .then((res) => {
            console.log("专属列表信息", res);
            this.tableData = res.data.data;
            this.datapages = res.data.countnumber;
        });
      },


      //上传文件弹框
      clickuploadfile() {
        this.uploadfilemodel = true;
      },

      //点击搜索的时候，页面自动定位到第一页
      search() {
        //点击搜索的时候，页面自动定位到第一页
        this.cur_page = 1;
        this.datapages = 1;
        this.getData(0);
      },

      //重置搜索
      newsearch() {
        this.phone = null;
        this.getData(0);
      },

      deleteall() {
        //清空所有数据
        this.deleteallmole=true;
      },


      querydelete(){
        this.url = "configure/exlinks/deleteall";
        let token = localStorage.getItem("token");
        this.$axios
          .post(this.url, {token: token})
          .then((res) => {
            this.$message.success(`操作成功`);
            console.log("清空表成功", res);
            this.deleteallmole=false;
            this.getData(0);
          });
      },

      //入库文件上传成功
      upsuccess(response) {
        console.log("文件上传成功", response);
        this.operationVisible = false;
        this.$message.success(`文件上传成功,共上传文件:` + response.num, 10000);
        this.getData(); //更新一下列表
      },
      //入库文件上传失败
      uperror() {
        console.log("文件上传失败");
        this.operationVisible = false;
        this.$message.error("文件上传失败");
      },
      //入库文件上传中....
      upprogress() {
        this.uploadfilemodel = false;
        this.operationVisible = true;
        console.log("文件上传中");
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

  .distance {
    margin-left: 10px;
  }
</style>