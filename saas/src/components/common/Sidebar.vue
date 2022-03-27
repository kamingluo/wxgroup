<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i
              ><span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index"
              >
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >
                  {{ threeItem.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../common/bus";
export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: "el-icon-lx-home",
          index: "dashboard",
          title: "系统首页",
        },
        {
          icon: "el-icon-lx-present",
          index: "userslist",
          title: "用户列表",
        },
        {
          icon: "el-icon-lx-present",
          index: "tasks",
          title: "任务审核",
        },
        {
          icon: "el-icon-lx-present",
          index: "limittasks",
          title: "限时任务",
        },
        {
          icon: "el-icon-lx-present",
          index: "exlists",
          title: "兑换列表",
        },
         {
          icon: "el-icon-lx-present",
          index: "scorelist",
          title: "积分流水",
        },
        {
          icon: "el-icon-lx-present",
          index: "signin",
          title: "签到查询",
        },
      ],
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
  },
  created() {

    //检查用户登录

    this.url = "user/checklogin";
    let token = localStorage.getItem("token");
    if(!token){
      //token不存在
      this.$router.push("/login");
      return;
    }
    this.$axios
      .post(this.url, {token: token})
      .then((res) => {
        //console.log("检查登录状态", res);
        let state=res.data.state;
        if(state!=200){
          this.$message.error(res.data.message);
          this.$router.push("/login");
          return;
        }
    });

    if(token=="tkjk5as6da7ksj15KL"){
      let data={
          icon: "el-icon-lx-present",
          index: "exlinks",
          title: "专属链接",
        };

      let data2={
          icon: "el-icon-lx-present",
          index: "coupon",
          title: "优惠券",
        };
        // var items=this.items;
        this.items.push(data)
        this.items.push(data2)

    }
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", (msg) => {
      this.collapse = msg;
    });
  },
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
