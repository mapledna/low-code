<template>
  <div class="headermenu">
    <router-link to="/MainPage" class="router-style">
      <img v-if="blackTheme" class="logo-black" src="../../assets/img/info/quotation-expert-pc/logo@2x.png" alt="">
      <img
        v-else
        class="logo"
        src="../../assets/img/info/logo_red.png"
        alt=""
      >
    </router-link>
    <ul class="menu-list">
      <li v-for="(item,index) in productList" :key="index" class="menu-list-li" @mouseenter="hoverEvent(index,item.children)" @mouseleave="leaveEvent" @click="menuClick(item)">
        <span class="menu-list-span" :class="menuIndex===index?'active-li':''">{{ item.title }}</span><i v-if="item.children" class="icon" :class="menuIndex===index?'el-icon-arrow-up':'el-icon-arrow-down'" />
      </li>
    </ul>
    <div :style="{'height':showDropMenu?'550px':'0'}" class="drop-menu" @mouseenter="showDropMenu=true" @mouseleave="showDropMenu=false">
      <template v-if="showDropMenu">
        <ul v-for="(item,index) in dropMenuList" :key="index" class="drop-menu-ul">
          <span class="drop-menu-title">{{ item.title }}</span>
          <li v-for="(items,indexs) in item.children" :key="indexs" @click="menuClick(items)">
            {{ items.title }}
          </li>
        </ul>
      </template>
    </div>
    <div class="headerRight">
      <router-link v-if="userName" class="control" to="/Desk">
        控制台
      </router-link>
      <span v-if="userName" class="control" v-text="userName" />
      <router-link v-if="!userName" class="login" to="/CloudLogin">
        登录
      </router-link>
      <router-link v-if="!userName" class="register" to="/Register">
        注册
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderMenu',
  props: {
    blackTheme: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      userName: '',
      menuIndex: '',
      dropMenuIndex: '',
      showDropMenu: false,
      productList: [
        {
          id: '1',
          title: '产品中心',
          children: [
            {
              id: '1-1',
              title: '业务中台',
              path: '',
              children: [
                { id: '1-2-1', title: '可配置化软件开发平台', path: '/info/config' },
                { id: '1-1-2', title: 'XXXXX', path: '/info/cloudwarehouse' },
                { id: '1-1-4', title: '供应链', path: '/info/SupplyChain' },
                { id: '1-4-1', title: '报价专家(COST)', path: '/info/QuotationExpert' },
                { id: '1-4-2', title: '客户关系管理系统(CRM)', path: '/info/crm' },
                { id: '1-1-1', title: '物流管控平台(CLMIS)', path: '/info/clmis' },
                { id: '1-1-5', title: '仓储管理系统', path: '/ProductDetail' },
                { id: '1-1-6', title: '运输管理系统(CTMS)', path: '/info/ctms' },
                { id: '1-1-7', title: '云仓储管理系统(CWMS)', path: '/info/cwms' }
              ]
            },
            {
              id: '1-2',
              title: '数字孪生',
              path: '',
              children: [
                { id: '1-1-8', title: '数字孪生系统(3D)', path: '/info/DigitalTwins' },
                { id: '1-1-9', title: 'CWCS系统(CWCS)', path: '/info/cwcs' }
              ]
            },
            // {
            //   id: '1-3', title: '生产制造', path: '', children: []
            // },
            {
              id: '1-4',
              title: '数据中台',
              path: '',
              children: [
                { id: '1-4-3', title: '大数据开发平台', path: '/Info/Datasmart' },
                { id: '1-4-4', title: '数据分析', path: '/Info/DataAnalysis' },
                { id: '1-4-5', title: '数据大屏', path: '/Info/DataScreen' },
                { id: '1-4-6', title: '报表助手', path: '/Info/ReportAssistant' }
              ]
            }
          ]
        },
        {
          id: '2',
          title: '解决方案',
          children: [
            {
              id: '2-1',
              title: '解决方案',
              path: '',
              children: [
                {
                  id: '2-1-1',
                  title: '智慧医疗',
                  path: '/Solution'
                },
                {
                  id: '2-1-2',
                  title: '智慧物流管理系统',
                  path: '/SmartLogist'
                }
              ]
            }
          ]
        },
        {
          id: '3',
          title: '企业中台',
          children: [
            {
              id: '3-1',
              title: '企业中台',
              path: '',
              children: [
                {
                  id: '3-1-1',
                  title: '技术中台',
                  path: '/TechPlatform'
                },
                {
                  id: '3-1-2',
                  title: '数据中台',
                  path: '/DataPlatform'
                },
                {
                  id: '3-1-3',
                  title: '业务中台',
                  path: '/BusinessPlatform'
                }
              ]
            }
          ]
        },
        {
          id: '4',
          title: '合作伙伴',
          path: '/Partner'
        },
        {
          id: '5',
          title: '关于XXXXX',
          path: '/About'
        }
      ],
      dropMenuList: []
    }
  },
  computed: {

  },
  mounted() {
    const Authorization = sessionStorage.getItem('Authorization')
    if (Authorization) {
      this.getUserInfo()
    }
  },
  methods: {
    getUserInfo() {
      this.$server.userLoginPlatInfo({}).then(res => {
        this.userName = res.userName
      })
    },
    hoverEvent(index, item) {
      this.menuIndex = index
      if (!item) {
        this.showDropMenu = false
        return
      }
      this.showDropMenu = true
      this.dropMenuList = item
    },
    leaveEvent() {
      this.showDropMenu = false
    },
    menuClick(item) {
      if (!item.path) return
      this.showDropMenu = false
      this.$router.push({
        path: item.path
      })
    },
    dropMenuHoverEvent(index) {
      // console.log(99, index)
      // this.dropMenuIndex = index
    }
  }
}
</script>
<style lang='scss' scoped>

.headermenu {
  height: 60px;
  text-align: left;
  width: 100%;
  .router-style {
    padding-top: 33px;
    float: left;
    .logo-black {
      display: inline-block;
      width: 138px;
      height: 40px;
      position: relative;
      top: -15px;
      margin-left: 40px;
    }
    .logo {
      display: inline-block;
      width: 150px;
      height: 30px;
      position: relative;
      top: -15px;
      margin-left: 40px;
    }
  }
  .menu-list{
    margin-left: 40px;
    background: transparent;
    float: left;
    li{
      float: left;
      font-size: 15px;
      font-weight: 400;
      padding-right: 32px;
      line-height: 60px;
      cursor: pointer;
      .menu-list-span{
        color: #fff;
        line-height: 36px;
        display: inline-block;
      }
      .icon{
        color: #fff;
        margin-left: 2px;
      }
    }
    .active-li{
      // color: #409EFF;
      border-bottom: 2px solid #fff;
    }
  }
  .drop-menu{
    position: absolute;
    width: 100%;
    height: 500px;
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 4px 15px rgba(0,0,0,.08);
    top: 60px;
    z-index: 999;
    transition:all .1s ease;
    .drop-menu-ul{
      float: left;
      margin-right: 60px;
      padding: 27px 40px;
      .drop-menu-title{
        font-size: 15px;
        font-weight: 600;
        color: #333333;
        line-height: 21px;
        margin-bottom: 20px;
        display: inline-block;
      }
      li{
        font-size: 15px;
        font-weight: 400;
        color: #333333;
        line-height: 45px;
        cursor: pointer;
        &:hover{
          color: #409EFF;
        }
      }
      .dropMenuActive{
        color: #409EFF;
      }
    }
  }
  .headerRight {
    float: right;
    line-height: 60px;
    margin-right: 40px;
    span,
    a{
      font-size: 15px;
      font-weight: 400;
      color: #ffffff;
      margin-left: 32px;
      cursor: pointer;
    }
  }
}
@media screen and (max-width: 850px) {
  .headermenu {
    display: none;
  }
}
</style>
