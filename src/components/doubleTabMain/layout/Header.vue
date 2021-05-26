<template>
  <div class="header">
    <div class="ui-header">
      <span class="welcome header-common">{{ userName }}</span>
      <el-dropdown style="float:right;" @command="doSetAction">
        <span class="el-dropdown-link">
          <i class="el-icon-setting header-common header-icon" style="fontSize:14px;" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout" icon="">
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown style="float:right;" @command="handleChangeTheme">
        <span class="el-dropdown-link">
          <span class="theme header-common header-icon" :style="{backgroundColor:currentTheme.primaryColor}" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in themeList" :key="item.key" :command="item.key">
            <i class="el-icon-s-help" :style="{color: item.primaryColor}" />{{ item.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span v-if="systemType==='product'" class="welcome header-common text-overflow" :title="currentType" @click="dialogVisible = true">
        <svg-icon :icon-class="systemType" />
        {{ currentType }}
      </span>
      <el-dropdown v-if="systemType==='project'" style="float:right;" @command="handleSelectProduct">
        <span class="el-dropdown-link">
          <span class="user header-common text-overflow" :title="currentType">
            <svg-icon :icon-class="systemType" />
            {{ currentType }}
          </span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in dataList" :key="item.key" :command="item">
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
      :show-close="true"
      class="transDialog"
      append-to-body
    >
      <template slot="title" />
      <div class="fit">
        <div v-for="(product,idx) in dataList" :key="product.id" class="block" @click="handleSelectProduct(product)">
          <el-avatar class="avatar" shape="square" :size="100" fit="cover" :src="urls[idx]" />
          <span class="title">{{ product.label }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import common from '@/utils/tool'
import utilsTheme from '@/utils/theme'

const publicPath = process.env.BASE_URL
const { themeConfArr } = utilsTheme
const themeList = themeConfArr.map(item => ({
  key: item.key,
  name: item.name,
  primaryColor: item.conf['color-primary']
}))

export default {
  name: 'UiHeader',
  props: {
    systemType: {
      type: String,
      default: 'product'
    }
  },
  data() {
    return {
      dialogVisible: false,
      userName: '',
      dataList: [], // 产品数据列表
      fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
      titles: ['运输管理系统', '仓储管理系统', '综合考评系统', '开发配置平台', '非成品运输系统'],
      urls: [
        'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2601025923,734136478&fm=26&gp=0.jpg',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594186882094&di=887954d4c1052ca36992266d914aeb8e&imgtype=0&src=http%3A%2F%2Fgwall.cn%2Fuploads%2Fallimg%2F170928%2F1-1F92Q03A2126.jpg',
        'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=689757089,2093495159&fm=26&gp=0.jpg',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594186832549&di=551996c7ff9a3b1080a8e6ca8bb8f60c&imgtype=0&src=http%3A%2F%2Fwww.xitongzhijia.net%2Fuploads%2Fallimg%2F160405%2F66-1604051FT3B9.jpg',
        'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1149630133,2308558230&fm=26&gp=0.jpg'
      ],
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      themeList: Object.freeze(themeList),
      themeName: 'theme-default',
      currentType: '',
      currentProduct: '' // 当前产品 如果是租户切换 则需要记录当前的产品code
    }
  },
  computed: {
    currentTheme() {
      // return this.$store.state.theme;
      return this.themeList.find(item => item.key === this.themeName) || this.themeList[0]
    }
  },
  mounted() {
    this.getDataList()
    this.getUserInfo()
    // 初始化主题设置
    this.handleChangeTheme(localStorage.getItem('themeName'))
  },
  methods: {
    // 获取租户或者产品列表
    getDataList() {
      let sqlId = '1278966499505532929'
      if (this.systemType === 'project') {
        sqlId = '1288769746943086593'
      }
      this.$server.executeSqls(sqlId).then(res => {
        this.dataList = res
      })
    },
    // 获取用户信息
    getUserInfo() {
      this.$server.getUserInfo({}).then(res => {
        // console.log('user', res)
        this.userName = res.userName
        this.currentProduct = res.productCode
        this.currentType = this.systemType === 'project' ? res.clientShortName : res.productName
      })
    },
    // 点击切换产品
    handleSelectProduct(product) {
      // console.log(222, product)
      // this.$sotre.dispatch('product/setCurrentProduct', product)

      this.dialogVisible = false
      if (product.label === this.currentType) {
        return
      }
      let paramsObj = {
        appCode: product.product_code
      }
      if (this.systemType === 'project') {
        paramsObj = {
          appCode: this.currentProduct,
          clientId: product.id
        }
      }

      this.$server.getToken({
        token: {
          // sessionKey: res.sessionKey,
          ...paramsObj
        }
      }).then(async token => {
        // sessionStorage.setItem('Authorization', token)
        sessionStorage.removeItem('permission')

        const rights = await this.$server.getPermission()
        // console.log('rights', rights)
        sessionStorage.setItem('permission', JSON.stringify(rights))
        // 页面重载
        window.location.reload()
      })
    },
    // 切换主题
    handleChangeTheme(newThemeName) {
      if (!newThemeName) { return }
      const oldThemeName = this.themeName
      // if (oldThemeName === newThemeName) { return }
      // this.$store.dispatch('theme/changeTheme', newThemeName);
      this.themeName = newThemeName
      localStorage.setItem('themeName', newThemeName)
      // console.log('handleChangeTheme', oldThemeName, newThemeName, publicPath)
      this.loadCss(`${newThemeName}/index.css`)
      Array.from(document.querySelectorAll(`.${oldThemeName}`)).forEach(el => {
        el.classList.remove(oldThemeName)
        el.classList.add(newThemeName)
      })
    },
    loadCss(path) {
      if (!path || path.length === 0) {
        return null
      }
      const head = document.getElementsByTagName('head')[0]
      const link = document.createElement('link')
      link.href = path
      link.rel = 'stylesheet'
      link.type = 'text/css'
      head.appendChild(link)
      return link
    },
    doSetAction(command) {
      // console.log('command', command)
      if (command === 'logout') {
        this.$server.getLogout()
      }
    }
  }
}
</script>
<style scoped>
  .header-common{
    margin:19px 8px 0px;
    font-size:14px;
    float: right;
    position: relative;
  }
  .header-icon::after{
    display:inline-block;
    content:'';
    width:30px;
    height:50px;
    position: absolute;
    left:-8px;
    top: -19px;
    background-color: transparent;
    cursor: pointer;
  }
  .header .welcome{
    line-height:50px;
    margin:0px;
  }
  .header /deep/ .el-dialog__header{
    height: 0px !important;
    padding: 0px !important;
  }
  .theme{
    height: 10px;
    width: 10px;
    border: 1px solid #555;
    display:inline-block;
  }
  .fit {
     display: flex;
    justify-content: center;
  }
  .block {
    width:100px;
    padding:0 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    flex-grow: 0;
    cursor: pointer;
  }
  .block:hover .title{
    color: #0ea2f1;
  }
  .avatar:hover{
    box-shadow: 2px 2px 2px #AAAAAA;
  }
  .title{
    font-size: 14px;
    margin-top: 5px;
    color: #8492a6;
  }
  .ui-header{
    text-align: right;
    line-height: 50px;
    position: absolute;
    width: 210px;
    padding: 0 20px;
    z-index: 999;
    right: 0px;
    top: 0px;
  }
  .ui-header span{
    font-size: 14px;
  }
  .ui-header .header-common.text-overflow{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inline-block;
    width: 85px;
    cursor: pointer;
  }
   .ui-header .user.header-common.text-overflow{
    height:50px;
    line-height:50px;
    margin:0px 10px -18px 0px;
  }
</style>
