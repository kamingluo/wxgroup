<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> vip配置页面</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
        <div class="handle-box">
                
          </div>
            <el-table :data="tableData" border class="table" ref="multipleTable">
                <el-table-column prop="id" label="id" width='120'>
                </el-table-column>
                <el-table-column prop="beizhu" label="备注"  width='180'>
                </el-table-column>
                <el-table-column prop="ifopen" label="开关(0开1关)" width='180'>
                </el-table-column>
                <el-table-column prop="ifopen" label="操作开关" width="120">
             <template slot-scope="scope">
            <el-switch
              v-model="scope.row.ifopen === 0 ? true : false"@change="handleservice(scope.$index, scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="datapages">
                </el-pagination>
            </div>

        </div>



    </div>
</template>

<script>
    export default {
        name: 'basetable',
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                userdataVisible:false,
                adminuserdata:null,
                admintaskdata:null,
                admincoinsdata:null,
                delVisible: false,
                idx: -1,
                datapages:0,
            }
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
                })
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
           
             getData() {
                this.url = '/configure/vipconfig/vipdata';
                this.$axios.post(this.url,{pages:this.cur_page}).then((res) => {
                    console.log("vip配置",res)
                    this.tableData = res.data.data;
                    this.datapages=res.data.countnumber;
                })
            },
            handleEdit(index, row) {
                console.log("点击编辑")
                this.idx = index;
                const item = this.tableData[index];
                this.form = item
                this.editVisible = true;
            },
            handleservice(index, row) {
            let ifopen = row.ifopen;
             var resservice = 1;
            if (ifopen === 0) {
                this.tableData[index].ifopen = 1;
                var resservice = 1;
            } else {
                this.tableData[index].ifopen = 0;
                var resservice = 0;
            }
            let apiurl ="/configure/vipconfig/updatedata?ifopen=" + resservice;
            this.$axios(apiurl).then(res => {
                this.$message.success(`修改成功`);
            });
            },
           




        }
    }

</script>

<style scoped>

 .bodaydata{
     margin-top:25px;
 }
.userdatadiv{
     display:inline;
     margin-left:15px;
      
} 
.userdatatitle{
    font-size: 30px;
}

.keyname{
font-size: 20px;
}
.keyvalue{
font-size: 25px;
color:red;
font-weight:600;
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
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
</style>
