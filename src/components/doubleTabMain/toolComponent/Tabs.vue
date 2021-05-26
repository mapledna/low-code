<template>
  <div class="main_tab_container">
    <el-tabs
      v-model="editableTabsValue"
      class="page_tabs"
      type="card"
      style="height:100%;"
      @tab-remove="removeTab"
    >
      <el-tab-pane
        v-for="(item) in editableTabs"
        :key="item.id"
        class="admin_pane"
        :label="item.label"
        :name="item.id"
        :closable="(item.id=='home'?null:'closable')"
      >
        <bread-crumb :bread-data="item.breadData" />
        <div class="con_wrapper">
          <component :is="item.content" :tab-data="item" class="main_iframe" v-on="$listeners" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Dashboard from '@/views/pages/Dashboard'
import BreadCrumb from './BreadCrumb'
import common from '@/utils/tool'

export default {
  components: {
    Dashboard,
    BreadCrumb
  },
  props: {
    homePage: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      editableTabsValue: '', // 默认显示的标签对应的index值
      editableTabs: []
    }
  },
  mounted() {
    let defaultHomePage = {
      id: 'home',
      menu_href: 'home',
      part_id: 'home',
      label: '我的桌面',
      content: Dashboard,
      breadData: ['我的桌面']
    }
    if (this.homePage.id) {
      let targetComponent = {}
      try {
        // eslint-disable-next-line
        targetComponent = require(`@/views/pages/page_${this.homePage.id}`)
      } catch (err) {
        targetComponent.default = {}
      }
      defaultHomePage = {
        ...this.homePage,
        content: targetComponent.default,
        breadData: [this.homePage.label]
      }
    }
    // console.log('homePage', this.homePage, defaultHomePage)
    this.editableTabsValue = defaultHomePage.id
    this.editableTabs.push(defaultHomePage)

    // this.$store.dispatch('tab/addVisitedTabs',{
    //     title:this.editableTabs[0].title,
    //     name:this.editableTabs[0].name,
    //     url:'',
    //     index:-1
    // })
  },
  methods: {
    // 添加选项卡
    addTab(tabObj, nameArr, isRefresh) {
      const indexVal = tabObj.id
      const openTab = this.editableTabs.find(item => item.id === indexVal)
      // 新开选项卡
      if (!openTab) {
        // eslint-disable-next-line
        const targetComponent = require(`@/views/pages/page_${tabObj.part_id}`);
        this.editableTabs.push({
          ...tabObj,
          ...{
            breadData: nameArr,
            content: targetComponent.default
          }
        })
      }
      // 刷新当前tab项
      if (isRefresh) {
        openTab.content = ''
        this.$nextTick(() => {
          // eslint-disable-next-line
          const targetComponent = require(`@/views/pages/page_${openTab.part_id}`);
          openTab.content = targetComponent.default
        })
      }
      this.editableTabsValue = indexVal
    },
    // 删除选项卡
    removeTab(targetName) {
      console.log('删除选项卡', targetName)
      const tabsArr = this.editableTabs
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabsArr.forEach((tab, index) => {
          if (tab.id === targetName) {
            const nextTab = tabsArr[index + 1] || tabsArr[index - 1]
            if (nextTab) {
              activeName = nextTab.id
            }
          }
        })
      }
      this.editableTabsValue = activeName
      this.editableTabs = tabsArr.filter(tab => tab.id !== targetName)
    }
  }
}
</script>
<style>
.main_tab_container{width:100%;height:100%;}
.main_tab_container .el-tabs{display:flex;flex-direction: column;}
.main_tab_container .el-tabs__content{flex:1;width:100%;position: relative;}
.main_tab_container .el-tabs--top .el-tabs__header{
  margin:0px;
  padding-right:250px; /* NOTE: 考虑去掉 */
  border-bottom:none;
}
.main_tab_container .admin_pane{position: relative;width:100%;height:100%;display: flex;flex-direction:column;}
.main_tab_container .main_iframe{width:100%;height:100%;
overflow: auto;}
</style>
