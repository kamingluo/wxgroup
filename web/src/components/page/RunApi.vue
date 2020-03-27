<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          ><i class="el-icon-lx-cascades"></i> 接口測試</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button
          type="primary"
          class="handle-del mr10"
          style="background-color:red; border-color:red;"
          @click="handleserviceall(0)"
          >切换正式</el-button
        >
        <el-button
          type="primary"
          icon="delete"
          class="handle-del mr10"
          style="background-color:green; border-color:green;"
          @click="handleserviceall(1)"
          >切换测试</el-button
        >

        <el-button type="primary" class="handle-del mr10" @click="add"
          >新增数据</el-button
        >

         <el-button type="primary" class="handle-del mr10" @click="clicktest"
          >测试按钮</el-button
        >

        
      </div>

      <!--<div class="handle-box">
        <el-select
          v-model="select_cate"
          placeholder="筛选项目"
          class="handle-select mr10"
        >
          <el-option key="1" label="车有料" value="车有料"></el-option>
          <el-option key="2" label="修连邦" value="修连邦"></el-option>
        </el-select>
        <el-input
          v-model="select_word"
          placeholder="筛选关键词"
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" icon="search" class="search" @click="search"
          >搜索</el-button
        >
      </div> -->

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

      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>

        <el-table-column prop="id" label="id" width="80"> </el-table-column>

        <el-table-column prop="project" label="项目" width="100">
        </el-table-column>

        <el-table-column prop="name" label="名称" width="150">
        </el-table-column>

        <el-table-column prop="remarks" label="备注" width="250">
        </el-table-column>

        <el-table-column
          prop="body"
          label="请求体"
          width="380"
          style="height:100"
        >
          <template slot-scope="scope" style="height:100px">
            <!--<el-text>{{scope.row.data}}</el-text>-->
            <pre class="pre-scrollable">{{ JSON.parse(scope.row.body) }}</pre>
          </template>
        </el-table-column>

        <el-table-column prop="request_url" label="请求接口" width="170">
        </el-table-column>
        <el-table-column prop="service" label="是否正式环境" width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.service === 0 ? true : false"
              @change="handleservice(scope.$index, scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-file"
              @click="handleRun(scope.$index, scope.row)"
              >运行</el-button
            >
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
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

      <!-- 下面的分页展示total="1000"这是总共多少条数据-->
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="countnumber"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="id">
          <el-input
            v-model="form.id"
            placeholder="id为空就是新增数据"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目">
          <el-input v-model="form.project"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remarks"></el-input>
        </el-form-item>
        <el-form-item label="请求值">
          <template slot-scope="scope">
            <pre
              class="pre-scrollable2"
              contenteditable="plaintext-only"
              @input="onDivInput((form.body = $event.target.innerHTML))"
              >{{ JSON.parse(form.body) }}</pre
            >
          </template>
        </el-form-item>
        <el-form-item label="请求接口">
          <el-input v-model="form.request_url"></el-input>
        </el-form-item>
        <el-form-item label="0正式1测试">
          <el-input v-model="form.service"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 结果提示 -->
    <el-dialog
      title="测试结果"
      :visible.sync="resultVisible"
      width="1120px"
      center
    >
      <el-table :data="runResulData" border class="table" ref="multipleTable">
        <el-table-column prop="case_name" label="名称" width="150px">
        </el-table-column>
        <el-table-column prop="response_time" label="请求耗时" width="100px">
        </el-table-column>
        <el-table-column prop="data" label="数据" width="700px">
          <template slot-scope="scope">
            <!--<el-text>{{scope.row.data}}</el-text>-->
            <pre class="pre-scrollable2">{{ scope.row.data }}</pre>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="结果" width="100px">
          <template slot-scope="scope">
            <el-text v-if="scope.row.status === 0" style="color:green"
              >成功</el-text
            >
            <el-text v-else style="color:red">失败</el-text>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 操作中提示框 -->
    <el-dialog
      title="处理中....."
      :visible.sync="operationVisible"
      width="300px"
      center
    >
      <div class="del-dialog-cnt">
        <img class="operationimg " src="../../assets/images/timg.gif" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import JsonViewer from "vue-json-viewer";

// Import JsonViewer as a Vue.js plugin
Vue.use(JsonViewer);
export default {
  name: "basetable",
  data() {
    return {
      url: "./static/vuetable.json",
      tableData: [],
      cur_page: 1,
      countnumber: 10,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      delVisible: false,
      operationVisible: false,
      resultVisible: false,
      form: {},
      idx: -1,
      deleteid: "",
      runResulData: ""
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
      this.getData();
    },

    clicktest(){
      // 获得[m,n]之间的随机整数：
      let m = 1
      let n = 3
      var rand=Math.floor(Math.random()*(n))+1
      console.log(rand)
    },

    //获取数据
    getData() {
      let pages = this.cur_page;
      this.url = "/supervise/api/runapi/apitest?pages=" + pages;
      this.$axios(this.url).then(res => {
        console.log(res);
        let data = res.data.data;
        this.countnumber = res.data.count;
        this.tableData = data;
        this.operationVisible = false;
      });
    },

    handleserviceall(service) {
      console.log(service);
      this.operationVisible = true;
      let apiurl =
        "/supervise/api/runapi/handleapi/handleall?service=" + service;
      this.$axios(apiurl).then(res => {
        this.$message.success(`更新完成`);
        this.getData();
      });
    },

    onDivInput(e) {
      let newform = JSON.parse(e);
      this.form.body = newform;
      console.log("form:", this.form);
    },

    handleservice(index, row) {
      let service = row.service;
      let id = row.id;
      if (service === 0) {
        this.tableData[index].service = 1;
        var resservice = 1;
      } else {
        this.tableData[index].service = 0;
        var resservice = 0;
      }
      let apiurl =
        "/supervise/api/runapi/handleapi/handle?service=" +
        resservice +
        "&id=" +
        id;

      this.$axios(apiurl).then(res => {
        this.$message.success(`修改成功`);
      });
    },
    add() {
      let data = {
        test: "test"
      };
      this.form = {};
      this.form.body = JSON.stringify(data);
      this.editVisible = true;
    },
    search() {
      this.is_search = true;
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    handleRun(index, row) {
      this.operationVisible = true;
      let service = { service: row.service };
      console.log("11111111", service);
      let resdata = JSON.parse(row.body);
      let newdata = Object.assign(resdata, service);
      console.log("2222222", newdata);
      this.url = row.request_url;
      this.$axios.post(this.url, newdata).then(res => {
        this.$message.success(`返回数据:` + res.data.code);
        this.runResulData = res.data.dataList;
        this.resultVisible = true;
        this.operationVisible = false;
      });
    },
    handleEdit(index, row) {
      this.idx = index;
      let item = this.tableData[index];
      this.form = item;
      this.editVisible = true;
    },

    handleDelete(index, row) {
      this.idx = index;
      this.deleteid = row.id;
      this.delVisible = true;
    },

    delAll() {
      const length = this.multipleSelection.length;
      let str = "";
      this.del_list = this.del_list.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + " ";
      }
      this.$message.error("删除了" + str);
      this.multipleSelection = [];
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 保存编辑
    saveEdit() {
      if (this.form.id == null || this.form.id == "") {
        this.url = "/supervise/api/runapi/apitest";
        let a = this.form.body;
        let newForm = JSON.parse(JSON.stringify(this.form));
        if (typeof a == "object") {
          newForm.body = a;
        } else {
          var temp = a.replace(/<\/?.+?>/g, "");
          var result = temp.replace(/ /g, ""); //result为得到后的内容
          newForm.body = JSON.parse(result);
        }
        this.$set(this.tableData, this.idx, newForm);
        this.editVisible = false;
        this.$axios.post(this.url, newForm).then(res => {
          this.$message.success(`新增成功`);
          this.getData();
          this.$router.go(0);
        });
      } else {
        this.url = "/supervise/api/runapi/apitest";
        this.$set(this.tableData, this.idx, this.form);
        this.editVisible = false;
        let a = this.form.body;
        let newForm = JSON.parse(JSON.stringify(this.form));
        if (typeof a == "object") {
          newForm.body = a;
        } else {
          var temp = a.replace(/<\/?.+?>/g, "");
          var result = temp.replace(/ /g, ""); //result为得到后的内容
          newForm.body = JSON.parse(result);
        }
        this.$axios.put(this.url, newForm).then(res => {
          this.$message.success(`操作成功`);
          this.getData();
          this.$router.go(0); //刷新一下页面，不刷新页面form.body数据会有问题
        });
      }
    },

    // 确定删除
    deleteRow() {
      this.delVisible = false;
      var resurl = "/supervise/api/runapi/apitest?id=" + this.deleteid;
      this.$axios.delete(resurl).then(res => {
        console.log("删除信息返回", res);
        this.$message.success("删除成功");
        this.getData();
      });
    }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
  margin-right: 10px;
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

.search {
  margin: 10px;
}
.pre-scrollable {
  display: flex;
  max-height: 120px;
  overflow-y: scroll;
}
.pre-scrollable2 {
  display: flex;
  max-height: 200px;
  max-width: 1000px;
  overflow-y: scroll;
}
.operationimg {
  height: 200px;
  width: 150px;
}
</style>
