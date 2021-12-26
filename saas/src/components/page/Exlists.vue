<template>



  <div class="table">
    <div class="crumbs">
    </div>
    <div class="container">

    <div class="handle-box">

       <el-input
          v-model="nickName"
          placeholder="用户微信昵称(支持模糊查询)"
          class="handle-input"
        ></el-input>
        <el-button type="primary" icon="search" class="search jianju" @click="search"
          >搜索</el-button
        >
        <el-button type="primary" icon="search" class="search" @click="newsearch"
          >重置</el-button
        >
        <el-button type="primary" icon="search" class="search" @click="allpass"
          >一键审核通过</el-button
        >
      </div>

      <div class="handle-box"></div>
      <el-table :data="tableData" border class="table" ref="multipleTable">
         <el-table-column prop="user_id" label="用户id" width="100">
         </el-table-column>
        <el-table-column prop="nickName" label="微信昵称" width="180">
        </el-table-column>


        <el-table-column prop="goodsname" label="商品名称" width="200">
        </el-table-column>
        
        <el-table-column prop="images" label="商品图片" width="120">
          <template slot-scope="scope" style="height:100px">
            <img class="logo" :src="scope.row.images"></img>
          </template>
        </el-table-column>
        
        <el-table-column prop="price" label="商品积分" width="80">
        </el-table-column>

        <el-table-column  label="发货地址" width="150">
         <template slot-scope="scope">
          <p>{{scope.row.provinceName}}、{{scope.row.cityName}}、{{scope.row.countyName}}、{{scope.row.detailInfo}}</p>
         </template>
        </el-table-column>
        
        <el-table-column prop="postalCode" label="邮政编码" width="130">
        </el-table-column>
        <el-table-column prop="telNumber" label="电话号码" width="170">
        </el-table-column>

        <el-table-column prop="remarks" label="备注" width="170">
        </el-table-column>

        <el-table-column prop="state" label="发货状态" width="150">
        <template slot-scope="scope">
        <p>{{scope.row.state==0?"未发货":scope.row.state==1?"已经发货":"审核不通过"}}</p>
         </template>
        </el-table-column>
        <el-table-column prop="expressnumber" label="发货备注" width="180">
        </el-table-column>
        <el-table-column prop="create_time" label="兑换时间" width="180">
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope"   v-if="scope.row.state == 0 " >
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">审核通过发货</el-button>
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

     <!--一键设置全部审核通过 -->
    <el-dialog title="未处理兑换全部设置为已经兑换" :visible.sync="allpassVisible" width="15%" > 
       <el-form ref="form" label-width="150px">
       <p>确认将所有未处理兑换全部设置为已经兑换，处理后不可恢复！</P>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allpassVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmallpass">确 定</el-button>
      </span>
    </el-dialog>




     <!--审核不通过 -->
    <el-dialog title="兑换不通过" :visible.sync="delVisible" width="25%" > 
 <el-form ref="form"  label-width="80px">
        <el-form-item label="原因">
          <el-input v-model="nopasstext" placeholder="请输入兑换不通过原因"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmdelete">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 审核通过发货 -->
    <el-dialog title="审核通过发货" :visible.sync="editVisible" width="20%">
      <el-form ref="form"  label-width="80px">

              <el-form-item >
             <el-radio-group v-model="editdata.exchange_type">
                  <el-radio :label="0">快递发货</el-radio>
                  <el-radio :label="1">其他</el-radio>
             </el-radio-group>
        </el-form-item>
        <el-form-item label="快递单号" v-if="this.editdata.exchange_type == 0 ">
          <el-input v-model="editdata.expressnumber" placeholder="请输入快递单号"></el-input>
        </el-form-item>

        <el-form-item label="奖励信息" v-else>
          <el-input v-model="editdata.expressnumber" placeholder="请奖励信息"></el-input>
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
      allpassVisible:false,
      yulanimg: null,
      deleteid: "",
      datapages: 0,
      editdata:{
            exchange_type: 0,
            expressnumber:null,
      },
      nopasstext:null,
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
      this.url = "configure/exchangelist/groupexchangelist";
      let token = localStorage.getItem("token");
      this.$axios
        .post(this.url, { pages: this.cur_page, token: token,nickName:this.nickName })
        .then((res) => {
          console.log("兑换列表信息", res);
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

    //一键审核 通过
    allpass(){
    console.log("全部设置为审核通过")
     this.allpassVisible = true;
    },

    confirmallpass(){
    let postdata = {};
    postdata.token = localStorage.getItem("token");
    this.$axios.post("configure/exchangelist/delivergoods", postdata).then((res) => {
        console.log("所有兑换处理成已经兑换接口返回", res);
              this.allpassVisible = false;
              this.$message.success(`操作成功`);
               this.getData();
      });

    },
    
    
    //调起不通过弹框
    handleDelete(index, row) {
      console.log("点击删除的id", row.id);
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
      let postdata = {};
      postdata.exchange_id = this.form.id;
      postdata.expressnumber = this.nopasstext;
      postdata.state = 2;
      postdata.exchange_type=0;
      postdata.token = localStorage.getItem("token");
      console.log("提交修改信息", postdata);
      this.$axios.post("configure/exchangelist/sendoutgoods", postdata).then((res) => {
        console.log("确认审核不通过返回数据", res);
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

      //改变列表
      console.log("111111112333333")
      this.editVisible = false;
      let postdata = {};
      postdata.state = 1;
      postdata.exchange_id = this.form.id;
      postdata.expressnumber = this.editdata.expressnumber;
      postdata.exchange_type = this.editdata.exchange_type;
      postdata.token = localStorage.getItem("token");
      console.log("审核成功发货信息", postdata);
      this.$message.success(`操作成功`);
      this.$axios.post("configure/exchangelist/sendoutgoods", postdata).then((res) => {
        console.log("审核成功发货返回数据", res);
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
.jianju{
margin-left:10px;
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
