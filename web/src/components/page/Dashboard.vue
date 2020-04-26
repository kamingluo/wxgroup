<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
              <el-card shadow="hover" class="mgb20" >
                    <div class="user-info">
                        <img src="../../assets/images/img.jpg" class="user-avator" alt="">
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                            <div>{{role}}</div>
                        </div>
                    </div>
                   <!-- <div class="user-info-list">上次登录时间：<span>2018-01-01</span></div>
                    <div class="user-info-list">上次登录地点：<span>东莞</span></div>-->
                </el-card>

                <el-card shadow="hover"   v-if="channelif" >
                    <div slot="header" class="clearfix">
                        <span>渠道用户比例(总用户数:{{allusersnumber}})</span>
                    </div>
                   <div v-for="item in channeldata"  >
                   <div @click="getchannelData(item.channel)">
                     {{item.name}}(渠道号:{{item.channel}}) (注册人数:{{item.count}})
                     </div>
                    <el-progress :percentage="channelnumber(item.count)"  :stroke-width="8"    color="#42b983"></el-progress>
                  </div>
                </el-card>
            </el-col>



            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people  grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{usersdata.allusersnumber}}</div>
                                    <div>总注册用户数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>

                                 <div class="grid-cont-right">
                                    <div class="grid-num">{{usersdata.todayregisterusersnumber}}</div>
                                    <div>今日注册用户数</div>
                                </div>
                                 <div class="grid-cont-right">
                                    <div class="grid-num">{{usersdata.yesterdayregisterusersnumber}}</div>
                                    <div>昨日注册用户数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>


                     <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{usersdata.todayactiveusersnumber}}</div>
                                    <div>今日活跃用户数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>


                      <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-group grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{statistics.builtcrowd}}</div>
                                    <div>今日创建群数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>

                      <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-friend grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{statistics.joincrowd}}</div>
                                    <div>今日加入群数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>

                      <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-favorfill grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{statistics.task_record}}</div>
                                    <div>今日提交任务数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>

                      <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-newsfill grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{statistics.crowd_news}}</div>
                                    <div>今日发布群消息数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>

                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-hotfill grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{statistics.sigin}}</div>
                                    <div>今日签到人次数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>


                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-presentfill grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{statistics.lottery}}</div>
                                    <div>今日抽奖人次数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>














                </el-row>
            </el-col>
        </el-row>
     <!--    <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="bar" class="schart" canvasId="bar" :data="data" type="bar" :options="options"></schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line" :data="data" type="line" :options="options2"></schart>
                </el-card>
            </el-col>
        </el-row> --> 
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import bus from '../common/bus';
    export default {
        name: 'dashboard',
        data() {
            return {
                name: localStorage.getItem('ms_username'),
                usersdata:'',
                statistics:null,
                channeldata:[],
                allusersnumber:0,
                channelif:false,
                channeldataVisible:false,
                channelcoinsdata:null,
                data: [{
                        name: '2018/09/04',
                        value: 1083
                    },
                    {
                        name: '2018/09/05',
                        value: 941
                    },
                    {
                        name: '2018/09/06',
                        value: 1139
                    },
                    {
                        name: '2018/09/07',
                        value: 816
                    },
                    {
                        name: '2018/09/08',
                        value: 327
                    },
                    {
                        name: '2018/09/09',
                        value: 228
                    },
                    {
                        name: '2018/09/10',
                        value: 1065
                    }
                ],
                options: {
                    title: '最近七天每天的用户访问量',
                    showValue: false,
                    fillColor: 'rgb(45, 140, 240)',
                    bottomPadding: 30,
                    topPadding: 30
                },
                options2: {
                    title: '最近七天用户访问趋势',
                    fillColor: '#FC6FA1',
                    axisColor: '#008ACD',
                    contentColor: '#EEEEEE',
                    bgColor: '#F5F8FD',
                    bottomPadding: 30,
                    topPadding: 30
                }
            }
        },
        components: {
            Schart
        },
        computed: {
            role() {
                return this.name === 'admin' ? '超级管理员' : '普通用户';
            }
        },
       
        created(){
            this.handleListener();
            this.changeDate();
            this.todaydata();
            this.adminchanneldata();
            this.adminusersdata();
        },
        activated(){
            this.handleListener();
        },
        deactivated(){
            window.removeEventListener('resize', this.renderChart);
            bus.$off('collapse', this.handleBus);
        },
        methods: {
            channelnumber:function(number){
                 var num =number / this.allusersnumber*100;
                  num = num.toFixed(1); //保留一位小数
                    // console.log(typeof num);
                return Number(num);//转变成Number类型才不会报错
            },

            //拿到渠道用户注册数
            adminchanneldata() {
               
                this.$axios.post('/index/channeldata').then((res) => {
                    console.log("拿到渠道用户注册数",res.data)
                    this.channeldata = res.data.data;
                    this.allusersnumber=res.data.allusersnumber;
                    this.channelif = true;
                    
                })
            },

             //拿到今天的数据
            todaydata() {
                //this.url = '/admin.php/configure/extension/extension';
                this.$axios.post('/statistics/statistics').then((res) => {
                    console.log("拿到今天的数据",res.data)
                    this.statistics = res.data.data;
                })
            },
            //拿到用户数据
            adminusersdata() {
                //this.url = '/admin.php/configure/extension/extension';
                this.$axios.post('/index/usersdata').then((res) => {
                    console.log("拿到用户数据",res.data)
                    this.usersdata = res.data.data;
                })
            },

            
            changeDate(){
                const now = new Date().getTime();
                this.data.forEach((item, index) => {
                    const date = new Date(now - (6 - index) * 86400000);
                    item.name = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
                })
            },
            handleListener(){
                bus.$on('collapse', this.handleBus);
                // 调用renderChart方法对图表进行重新渲染
                window.addEventListener('resize', this.renderChart)
            },
            handleBus(msg){
                setTimeout(() => {
                    this.renderChart()
                }, 300);
            },
            renderChart(){
                this.$refs.bar.renderChart();
                this.$refs.line.renderChart();
            }
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

    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }
    .grid-cont-jia {
        font-size: 18px;
         color: #999;
         text-align: center;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }

</style>
