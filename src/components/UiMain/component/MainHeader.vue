<template>
  <header height="auto" class="ui-main__header__warp">
    <div class="ui-main__header">
      <div v-if="headerTitle" class="ui-main__header__left">
        <span class="ui-main__header__title">{{ headerTitle }}</span>
      </div>
      <div class="ui-main__header__right">
        <span v-if="systemType === 'project'" class="ui-main__header__item">
          <el-dropdown @command="handleSelectProduct">
            <span class="el-dropdown-link">
              <span class="user" :title="currentType">
                <svg-icon :icon-class="systemType" />
                {{ currentType }}
              </span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in dataList"
                :key="item.key"
                :command="item"
              >
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
        <span
          v-if="systemType === 'product'"
          class="ui-main__header__item ellipsis"
          :title="currentType"
          @click="dialogVisible = true"
        >
          <svg-icon :icon-class="systemType" />
          {{ currentType }}
        </span>
        <span class="ui-main__header__item">
          <el-dropdown @command="handleChangeTheme">
            <span class="el-dropdown-link">
              <span
                class="theme-icon"
                :style="{ backgroundColor: currentTheme.primaryColor }"
              />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in themeList"
                :key="item.key"
                :command="item.key"
              >
                <i
                  class="el-icon-s-help"
                  :style="{ color: item.primaryColor }"
                />{{ item.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
        <span class="ui-main__header__item">
          <el-dropdown class="ui-main__header__item" @command="doSetAction">
            <span class="el-dropdown-link">
              <i class="el-icon-setting" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout" icon="">
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
        <span class="ui-main__header__item">{{ userName }}</span>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
      :show-close="true"
      class="header-product-dialog"
      append-to-body
    >
      <template slot="title">
        <el-dropdown @command="handleSelectCus">
          <span class="el-dropdown-link">
            {{ currentName }}
            <i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="item in dataCusList"
              :key="item.key"
              :command="item"
            >
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <div class="fit">
        <div v-for="(product, index) in dataList"
             :key="index"
             class="work_content"
             @click="handleSelectProduct(product)"
        >
          <div class="product_content">
            <div :style="product.product_color?'background:'+product.product_color+';':'background:linear-gradient(180deg,rgba(250,201,0,1) 0%,rgba(243,152,0,1) 100%);'" class="left_icon">
              <span :class="product.product_icon?product.product_icon:'mdi mdi-weather-cloudy'" />
            </div>
          </div>
          <div class="title_a">
            <p class="pro_name">
              {{ product.label }}
            </p>
            <p class="pro_id">
              {{ product.product_code }}
            </p>
          </div>
        </div>
      </div>
    </el-dialog>
  </header>
</template>

<script>
import utilsTheme from '@/utils/theme'
import {
  getClientId,
  setClientId
} from '@utils/db/auth'

const publicPath = process.env.BASE_URL
const { themeConfArr } = utilsTheme
const themeList = themeConfArr.map(item => ({
  key: item.key,
  name: item.name,
  primaryColor: item.conf['color-primary']
}))
export default {
  name: 'MainHeader',
  props: {
    systemType: {
      type: String,
      default: 'product'
    },
    headerTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      userName: '',
      dataList: [], // 产品数据列表
      fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
      titles: [
        '运输管理系统',
        '仓储管理系统',
        '综合考评系统',
        '开发配置平台',
        '非成品运输系统'
      ],
      urls: [
        'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2601025923,734136478&fm=26&gp=0.jpg',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594186882094&di=887954d4c1052ca36992266d914aeb8e&imgtype=0&src=http%3A%2F%2Fgwall.cn%2Fuploads%2Fallimg%2F170928%2F1-1F92Q03A2126.jpg',
        'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=689757089,2093495159&fm=26&gp=0.jpg',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594186832549&di=551996c7ff9a3b1080a8e6ca8bb8f60c&imgtype=0&src=http%3A%2F%2Fwww.xitongzhijia.net%2Fuploads%2Fallimg%2F160405%2F66-1604051FT3B9.jpg',
        'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1149630133,2308558230&fm=26&gp=0.jpg'
      ],
      url:
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      themeList: Object.freeze(themeList),
      themeName: utilsTheme.getThemeName(),
      currentType: '',
      currentProduct: '', // 当前产品 如果是租户切换 则需要记录当前的产品code
      clientId: getClientId(), // 租户id
      currentName: '', // 当前租户名
      dataCusList: []// 租户数据
    }
  },
  computed: {
    currentTheme() {
      // return this.$store.state.theme;
      return (
        this.themeList.find(item => item.key === this.themeName)
        || this.themeList[0]
      )
    }
  },
  watch: {
    clientId: {
      immediate: true,
      handler(clientId) {
        setClientId(clientId)
      }
    }
  },

  async mounted() {
    await this.getUserInfo()
    await this.getDataCustomer()
    await this.getDataList()
  },

  methods: {
    // 获取租户
    async getDataCustomer() {
      await this.$server.listClientUser().then(res => {
        // this.currentName = res[0].label
        // this.clientId = res[0].id
        // this.ruleForm.clientId = res[0].id
        this.dataCusList = res
      })
    },
    // 获取租户或者产品列表
    async getDataList() {
      let sqlId = '1278966499505532929'
      if (this.systemType === 'project') {
        sqlId = '1288769746943086593'
      }
      await this.$server.executeSqls(sqlId, {
        clientId: this.clientId
      }).then(res => {
        this.dataList = res
      })
    },

    // 获取用户信息
    async getUserInfo() {
      await this.$server.getUserInfo({}).then(res => {
        this.userName = res.userName
        this.currentProduct = res.productCode
        this.clientId = res.clientId
        this.currentName = res.clientName
        this.currentType = this.systemType === 'project' ? res.clientShortName : res.productName

        this.$Global.setUserInfo('name', res.userName)
      })
    },
    // 点击切换租户
    handleSelectCus(product) {
      if (product.id === this.clientId) {
        return
      }
      this.currentName = product.label
      this.clientId = product.id
      // setClientId(product.id)
      this.getDataList()
    },
    // 点击切换产品
    handleSelectProduct(product) {
      this.dialogVisible = false
      if (product.label === this.currentType) {
        return
      }
      let paramsObj = {
        appCode: product.product_code,
        clientId: this.clientId
      }
      if (this.systemType === 'project') {
        paramsObj = {
          appCode: this.currentProduct,
          clientId: this.clientId
        }
      }

      this.$server
        .getToken({
          token: {
            ...paramsObj
          }
        })
        .then(async token => {
          sessionStorage.removeItem('permission')
          const rights = await this.$server.getPermission()
          sessionStorage.setItem('permission', JSON.stringify(rights))
          // 页面重载
          window.location.reload()
        })
    },

    // 切换主题
    handleChangeTheme(newThemeName) {
      if (!newThemeName) {
        return
      }
      this.themeName = newThemeName
      utilsTheme.change(newThemeName)
    },

    doSetAction(command) {
      if (command === 'logout') {
        this.$server.getLogout()
      }
    }
  }
}
</script>
<style lang="scss">
.header-product-dialog{
  .fit{
    .work_content{
      float: left;
      width: 160px;
      margin: 10px 8px 32px 8px;
      position:relative;
      cursor: pointer;
      text-align: center;
      height: 164px;
      .product_content{
        .left_icon{
          width:60px;
          height:60px;
          border-radius:8px;
          margin: auto;
          text-align: center;
          line-height: 60px;
          font-size: 28px;
          color: #ffffff;
        }
      }
      .title_a{
        text-align: center;
        .pro_name{
          font-size:18px;
          font-weight:500;
          color:#333;
          line-height:32px;
          margin: 16px 0 0;
        }
        .pro_id{
          font-size:15px;
          font-weight:500;
          color:#999999;
          line-height:20px;
          margin: 2px 0 0;
        }
      }
    }
  }
}
</style>
