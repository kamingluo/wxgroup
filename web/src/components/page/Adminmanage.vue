<template>



  <div class="table">
    <div class="crumbs">
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
        >
                <el-button type="primary" class="handle-del mr10" @click="add"
          >新增数据</el-button
        >
      </div>
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

        <el-table-column prop="name" label="账号" width="200">
        </el-table-column>
        <el-table-column prop="password" label="密码" width="200">
        </el-table-column>

        <el-table-column prop="open" label="当前状态" width="150">
        <template slot-scope="scope">
        <p>{{scope.row.open==0?"无限制":scope.row.open==1?"审核中":scope.row.open==2?"体验中":scope.row.open==3?"体验过期":scope.row.open==4?"删除中":scope.row.open==5?"正常使用":"未知状态"}}</p>
         </template>
        </el-table-column>

        <el-table-column prop="end_time" label="结束时间" width="180">
        </el-table-column>

        <el-table-column prop="remarks" label="备注" width="250">
        </el-table-column>
        <el-table-column label="操作" width="260" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              class="blue"
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


        <!-- 新增弹框 -->
    <el-dialog title="编辑" :visible.sync="addformvisible" width="20%">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="群id">
          <el-input v-model="addform.crowd_id"></el-input>
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="addform.name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addform.password"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addform.remarks"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addformvisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd">确 定</el-button>
      </span>
    </el-dialog>



    <!-- 编辑弹框 -->
    <el-dialog title="编辑" :visible.sync="editformvisible" width="20%">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="群id">
          <el-input v-model="form.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>

        <el-form-item label="结束时间">

            <el-date-picker
      v-model="form.end_time"
      type="date"
      value-format="yyyy-MM-dd"
      placeholder="选择日期">
    </el-date-picker>
          <!-- <el-date-picker
          v-model="form.end_time"
          type="datetime"
          value-format="yyyy-MM-dd"
          placeholder="选择日期时间">
        </el-date-picker> -->
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="form.remarks"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editformvisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>






     <!-- 删除弹框 -->
    <el-dialog title="删除群" :visible.sync="delVisible" width="30%">
      <el-form ref="form" label-width="120px">
        <p>确认删除？？</p>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmdelete">确 定</el-button>
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
      idx: -1,
      delVisible: false,
      deleteid: "",
      datapages: 0,
      addformvisible:false,
      addform:{
        crowd_id:null,
        name:null,
        password:null,
        remarks:null
      },
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


    getData() {
      this.url = "configure/adminuser/groupslist";
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
        let url = "configure/adminuser/groupslist";
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
        let url = "configure/adminuser/groupslist";
        this.$axios.post(url,resdata).then(res => {
        console.log("搜索群返回", res);
        this.$message.success(`操作成功`);
        this.tableData = res.data.data;
        this.datapages = res.data.countnumber;
        });
    },

//点击新增
    add() {
      console.log("点击新增");
      this.addformvisible = true;
    },
//新增数据
saveAdd(){
   let data=this.addform;
   if(data.crowd_id != null && data.name != null && data.password != null){
        this.$axios
        .post("configure/adminuser/add", data)
        .then((res) => {
          console.log("新增用户返回数据", res);
          this.$message.success(`操作成功`);
          this.addformvisible = false;
          this.getData();
    });

   }
   else{
     this.$message.error(`信息不正确`);
   }

},


    handleEdit(index, row) {
      console.log("点击编辑");
      this.idx = index;
      const item = this.tableData[index];
      this.form = item;
      this.editformvisible = true;
    },

    // 保存编辑
    saveEdit() {
      this.$set(this.tableData, this.idx, this.form);
      console.log("提交修改信息", this.form);
      this.editVisible = false;
      this.$axios
        .post("configure/adminuser/edit", this.form)
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
     let url = "configure/adminuser/delete?id=" + id;
      this.$axios(url).then(res => {
        console.log("删除群返回", res);
        this.$message.success(`操作成功`);
        this.delVisible=false;
        this.gosearch();
      });
    },

   
  }
};
</script>

<style scoped>
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
