<template>
  <el-container class="main_container double-tab">
    <el-header class="ui-main__header" style="height:50px;">
      <p class="ui-main__logo">
        <img :src="logoIcon" class="ui-main__logo--icon">
        <span class="ui-main__logo--title">{{ projectName }}</span>
      </p>
      <ui-header :system-type="systemType" />
    </el-header>
    <el-container>
      <el-tabs class="ui-main__tabs" type="border-card" @tab-click="changeTab">
        <el-tab-pane v-for="(tab,idx) in treeData" :key="tab.id" :label="tab.meta.title">
          <el-container class="tab-container">
            <el-aside width="200px">
              <ui-aside>
                <ui-menu
                  slot="menu"
                  :default-value="menuId"
                  :model="'vertical'"
                  :variables="variables"
                  :is-transfer="false"
                  :is-collapse="isCollapse"
                  :data="tab.children"
                  @handle-menu-select="clickMenu"
                />
              </ui-aside>
              </ui-aside>
            </el-aside>
            <el-container>
              <el-main class="main-area">
                <ui-tabs :ref="'doubleMainTab_'+idx" :home-page="homePage" @click-menu="clickMenu" />
              </el-main>
            </el-container>
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </el-container>
</template>

<script>
import UiMenu from '@/components/UiMenu/Index.vue'
import UiAside from '@/components/doubleTabMain/layout/Aside.vue'
import UiHeader from '@/components/doubleTabMain/layout/Header.vue'
import UiTabs from '@/components/doubleTabMain/toolComponent/Tabs.vue'
// import UiFooter from '@/component/Footer.vue'
// import UiDashboard from '@/view/Dashboard.vue'
export default {
  name: 'MainView',
  components: {
    UiAside,
    UiMenu,
    UiHeader,
    UiTabs
    // UiFooter,
    // UiDashboard
  },
  props: [
    'projectName', // 系统名称
    'logoIcon', // 系统logo
    'variables', // 菜单样式
    'isCollapse', // 是否水平折叠收起菜单
    'menuId', // 默认选中的菜单值
    'homePage', // 默认显示的首页id
    'systemType', // 系统类型
    'menuData' // 菜单树数据
  ],
  data() {
    return {
      temTabIndex: 0 // 当前tab的index值
    }
  },
  computed: {
    treeData() {
      return this.arrayToTreeMenu(JSON.parse(JSON.stringify(this.menuData)), 'pid', 'id')
    }
  },
  mounted() {
    document.title = this.projectName
  },
  methods: {
    // 切换一级tab
    changeTab(tab) {
      this.temTabIndex = tab.index
    },
    // 菜单点击事件
    clickMenu(menu, isPassive) {
      const refStr = `doubleMainTab_${this.temTabIndex}`
      console.log('refStr', refStr)
      console.log('this.$refs.doubleMainTab', this.$refs, this.$refs[refStr], menu, isPassive) // 5个同样的
      if (isPassive) {
        const target = this.menuData.find(item => item.id === menu)
        const isRefresh = true // 默认已打开则刷新
        this.$refs[refStr][0].addTab(target, this.getParentNames(target.pid, [target.label]), isRefresh)
      } else if (menu.part_id) {
        this.$refs[refStr][0].addTab(menu, this.getParentNames(menu.pid, [menu.label]))
      } else if (menu.menu_href) {
        this.$router.push({
          path: menu.menu_href,
          query: {
            ...this.$route.query
            // sessionKey: this.$server.getSessionKey()
          }
        })
      } else {
        this.$message({
          showClose: true,
          type: 'warning',
          message: '菜单配置有误！'
        })
      }
    },
    // 向上查找父级菜单的名称 构成数组
    getParentNames(pid, nameArr = []) {
      const target = this.menuData.find(item => item.id === pid)
      if (target) {
        nameArr.unshift(target.label)
        this.getParentNames(target.pid, nameArr)
      }
      return nameArr
    },
    // 将一维数组转换为菜单需要的树状菜单数据格式
    arrayToTreeMenu(array, pid, id, childrensKey) {
      if (typeof childrensKey === 'undefined') {
        childrensKey = 'children'
      }
      array.splice(0, array.length, ...array.filter((item, i) => {
        item.meta = { title: item.label, icon: item.menu_icon || '' }
        item.path = '/'
        delete item.label
        const parent = array.find(compare => item[pid] === compare[id])
        if (parent) {
          if (!Array.isArray(parent[childrensKey])) {
            parent[childrensKey] = []
          }
          parent[childrensKey].push(item)
          return false
        }
        return true
      }))
      return array
    }

  }
}
</script>

<style>
  .main_container{width:100%;height:100%;position: relative; overflow:hidden;}
  .el-header{
    padding: 0px;
  }
  .bread-crumb{
      padding: 5px;
      padding-bottom: 20px;
  }
  .el-footer {
    background-color: #B3C0D1;
    color: #333;
  }

  .el-main {
    background-color: #fff;
    color: #333;
    height: 100vh;
    padding: 0px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  /* 新增双tab模板 独立样式 */
  .double-tab .ui-main__header{
    background-color: rgba(33, 150, 243, 0.6);
  }
  .double-tab .sub-header{
    background-color: rgba(0, 188, 212, 0.8);
  }
  .double-tab .main-area{
    height:100%;
  }
  .double-tab .sub-header .header-list{
    height:100%;
    line-height:32px;
    margin-top:3px;
    float: left;
    width: 100px;
    text-align: center;
  }
  .double-tab .sub-header .header-list.active{
    border-top-left-radius:5px;
    border-top-right-radius:5px;
    background-color:#fff;
  }
  .double-tab .el-tabs.el-tabs--card .el-tabs__item{
    height:32px;
    line-height:32px;
  }
  .double-tab .main_tab_container .breadcrumb{
    display:none;
  }
  .double-tab .page_aside{
    background-color: #eee;
  }
  .double-tab .page_aside .system_name{
    display: none;
  }


  .double-tab .ui-main__tabs{
    width:100%;
    display: flex;
    flex-direction: column;
  }
  .double-tab .ui-main__tabs>.el-tabs__content{
    padding:0px;
    height: 100%;
    position: relative;
  }
  .double-tab .ui-main__tabs>.el-tabs__content>.el-tab-pane{
    padding:0px;
    height: 100%;
    position: relative;
  }
  .double-tab .ui-main__tabs .tab-container{
    height:100%;
  }
  .double-tab .main_tab_container .con_wrapper{
    margin:0px;
  }
</style>
