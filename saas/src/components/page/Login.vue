<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">后台管理系统</div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入用户名">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="ruleForm.password"
            @keyup.enter.native="submitForm('ruleForm')"
          >
            <el-button slot="prepend" icon="el-icon-info"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')"
            >登录</el-button
          >
        </div>
        <!-- <p class="login-tips">Tips : 这是提示啊</p> -->
      </el-form>
    </div>



           <!--联系客服弹框 -->
    <el-dialog title="联系客服" :visible.sync="imgVisible" width="22%">
       <img class="yulan " src="../../assets/images/kefu.png" />
       <div class="tips"><p>扫码或添加客服微信:qunjifen,处理群使用问题</P></div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      imgVisible:false,
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      console.log("打印登录名称")
      console.log(this.ruleForm.username);

      this.url = 'user/login';
      this.$axios.post(this.url,{name:this.ruleForm.username,password:this.ruleForm.password}).then((res) => {
          console.log("登录返回消息",res)
          // this.tableData = res.data.data;
          // this.datapages=res.data.countnumber;
          if(res.data.state == 200){
            this.$refs[formName].validate((valid) => {
            if (valid) {
              localStorage.setItem("ms_username", res.data.data.crowd_name);
              localStorage.setItem("token", res.data.data.token);
              localStorage.setItem("logo", res.data.data.logo);
              this.$router.push("/");
            } else {
              console.log("error submit!!");
              return false;
            }
          });
          }
          else{
            this.imgVisible=true;
            this.$message.error(res.data.message);
            alert(res.data.message)
          }
      })
    },
  },
};
</script>

<style scoped>

.yulan{
  width:500px;
  height:600px;

}

.tips{
  margin-top:30px;
  font-size:25px;
  color:red;
}
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/images/login-bg.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>