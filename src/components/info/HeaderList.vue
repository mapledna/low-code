<template>
  <div class="headerlist">
    <router-link to="/MainPage" class="router-style">
      <!-- <img src="@/assets/img/login/logo3.png"> -->
      <img
        v-if="blackTheme"
        class="logo-black"
        src="../../assets/img/info/quotation-expert-pc/logo@2x.png"
        alt=""
      />
      <img
        v-else
        class="logo"
        src="../../assets/img/info/logo_red.png"
        alt=""
      />
    </router-link>
    <el-menu
      :default-active="activeIndex"
      router
      class="el-menu-demo"
      mode="horizontal"
      active-text-color="#409EFF"
    >
      <el-submenu index="1">
        <template slot="title"> 产品中心 </template>
        <el-menu-item index="/info/config"> 可配置化软件开发平台 </el-menu-item>
        <el-menu-item index="/info/lmis"> 物流管控平台 </el-menu-item>
        <el-menu-item index="/info/cloudwarehouse"> XXXXX </el-menu-item>
        <el-menu-item index="/info/SupplyChain"> 供应链 </el-menu-item>
        <el-menu-item index="/info/QuotationExpert"> 报价专家 </el-menu-item>
        <el-menu-item index="/info/crm"> 客户关系管理系统 </el-menu-item>
        <el-menu-item index="/ProductDetail"> 仓储管理系统 </el-menu-item>
        <el-menu-item index="/info/ctms"> 运输管理系统 </el-menu-item>
        <el-menu-item index="/info/cwms"> 云仓储管理系统 </el-menu-item>
        <el-menu-item index="/info/DigitalTwins"> 数字孪生系统 </el-menu-item>
        <el-menu-item index="/info/cwcs"> IWCS系统 </el-menu-item>
        <el-menu-item index="/Info/Datasmart"> 大数据开发平台 </el-menu-item>
        <el-menu-item index="/Info/DataAnalysis">
          <!-- <router-link to="/ProductDetail"> -->
          数据分析
          <!-- </router-link> -->
        </el-menu-item>
        <el-menu-item index="/Info/DataScreen">
          <!-- <router-link to="/ProductDetail"> -->
          数据大屏
          <!-- </router-link> -->
        </el-menu-item>
        <el-menu-item index="/Info/ReportAssistant">
          <!-- <router-link to="/ProductDetail"> -->
          报表助手
          <!-- </router-link> -->
        </el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title"> 解决方案 </template>
        <el-menu-item index="/Solution">
          <!-- <router-link to="/Solution"> -->
          智慧医疗
          <!-- </router-link> -->
        </el-menu-item>
        <el-menu-item index="/SmartLogist">
          <!-- <router-link to="/Solution"> -->
          智慧物流管理系统
          <!-- </router-link> -->
        </el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title"> 企业中台 </template>
        <el-menu-item index="/TechPlatform">
          <!-- <router-link to="/TechPlatform"> -->
          技术中台
          <!-- </router-link> -->
        </el-menu-item>
        <el-menu-item index="/DataPlatform">
          <!-- <router-link to="/TechPlatform"> -->
          数据中台
          <!-- </router-link> -->
        </el-menu-item>
        <el-menu-item index="/BusinessPlatform">
          <!-- <router-link to="/TechPlatform"> -->
          业务中台
          <!-- </router-link> -->
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="/Partner">
        <!-- <router-link to="/Partner"> -->
        合作伙伴
        <!-- </router-link> -->
      </el-menu-item>
      <el-menu-item index="/About">
        <!-- <router-link to="/About"> -->
        关于XXXXX
        <!-- </router-link> -->
      </el-menu-item>
    </el-menu>
    <div class="headerRight">
      <!-- <span class="control">控制台</span> -->
      <router-link v-if="userName" class="control" to="/Desk">
        控制台
      </router-link>
      <span v-if="userName" class="control" v-text="userName" />
      <!-- <span class="login">登录</span> -->
      <router-link v-if="!userName" class="login" to="/CloudLogin">
        登录
      </router-link>
      <!-- <span class="register">注册</span> -->
      <router-link v-if="!userName" class="register" to="/Register">
        注册
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Headerlist",
  props: {
    blackTheme: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // msg: 'Welcome to Your Vue.js App'
      // activeIndex: '/ProductDetail'
      userName: "",
    };
  },
  computed: {
    activeIndex() {
      const route = this.$route;
      const { meta, path } = route;
      // console.log(meta);
      // if set path, the sidebar will highlight the path you set
      // 可以在路由配置文件中设置自定义的路由路径到meta.activeMenu属性中，来控制菜单自定义高亮显示
      if (meta.activeIndex) {
        return meta.activeIndex;
      }
      return path;
    },
  },
  mounted() {
    const Authorization = sessionStorage.getItem("Authorization");
    if (Authorization) {
      this.getUserInfo();
    }
  },
  methods: {
    // clickMenu(key, keyPath) {
    //   console.log(key, keyPath)
    //   this.activeIndex = key
    // }
    getUserInfo() {
      this.$server.userLoginPlatInfo({}).then((res) => {
        // console.log('user', res)
        this.userName = res.userName;
      });
    },
  },
};
</script>
<style>
.headerlist .el-menu--horizontal > .el-submenu.is-active .el-submenu__title,
.headerlist .el-menu--horizontal > .el-submenu .el-submenu__title,
.headerlist .el-menu--horizontal > .el-menu-item {
  color: #ffffff !important;
}
.headerlist .el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
.headerlist .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
.headerlist .el-menu--horizontal > .el-submenu .el-submenu__title:hover {
  color: #ffffff !important;
  background: none;
  border-bottom-color: #409eff !important;
}
.el-menu.el-menu--popup {
  background: none !important;
}
.el-menu-demo {
  flex: 1;
}
</style>
<style scoped>
.router-style {
  padding-top: 33px;
}
.headerlist {
  height: 60px;
  text-align: left;
  /* position: fixed; */
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.headerlist .el-menu {
  border-bottom: none;
  display: inline-block;
  margin-left: 40px;
  background: transparent;
}
.headerlist .logo {
  display: inline-block;
  width: 150px;
  height: 30px;
  position: relative;
  top: -15px;
  margin-left: 40px;
}
.headerlist .logo-black {
  display: inline-block;
  width: 138px;
  height: 40px;
  position: relative;
  top: -15px;
  margin-left: 40px;
}
.headerlist .headerRight {
  float: right;
  line-height: 60px;
  margin-right: 40px;
}
.headerlist .headerRight span,
.headerlist .headerRight a {
  font-size: 15px;
  font-weight: 400;
  color: #ffffff;
  margin-left: 32px;
  cursor: pointer;
}
@media screen and (max-width: 850px) {
  .headerlist {
    display: none;
  }
}
</style>
