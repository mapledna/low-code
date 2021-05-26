<template>
  <div class="ui-tabs-wrapper">
    <el-tabs
      ref="ui-tab"
      v-model="editableTabsValue"
      class="ui-main__tabs"
      type="card"
      @tab-click="resize"
      @tab-remove="removeTab"
    >
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.id"
        class="ui-main__tab-pane"
        :label="item.label"
        :name="item.id"
        :closable="item.id == 'home' ? null : 'closable'"
      >
        <bread-crumb :bread-data="item.breadData" />
        <div class="ui-main__content__warp">
          <component
            :is="item.content"
            :tab-data="item"
            class="ui-main__content"
            v-on="$listeners"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dropdown v-show="showHiddenTabs" @command="handleCommand">
      <span class="el-dropdown-link">
        <i class="el-icon-arrow-down el-icon--right" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="closeAll">
          关闭所有
        </el-dropdown-item>
        <el-dropdown-item
          v-for="tab in editableTabs"
          :key="tab.id"
          :command="tab.id"
        >
          {{ tab.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import Dashboard from '@/views/pages/Dashboard'
import BreadCrumb from './BreadCrumb'

import { throttle } from '@/utils/index'
import dom from '@/utils/dom'

export default {
  name: 'MainTabs',
  components: {
    Dashboard,
    BreadCrumb
  },
  props: {
    homePage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editableTabsValue: '', // 默认显示的标签对应的index值
      editableTabs: [],
      showHiddenTabs: false // 显示隐藏的tab项
    }
  },
  watch: {
    editableTabs: {
      handler(val) {
        this.$nextTick(() => {
          this.$refs['ui-tab'].$nextTick(() => {
            this.$refs['ui-tab'].$refs.nav.$nextTick(_ => {
              this.showHiddenTabs = !!this.$refs['ui-tab'].$refs.nav
                .scrollable
            })
          })
        })
      },
      deep: true
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
        targetComponent = require(`@/views/pages/page_${this.homePage.id}`);
      } catch (err) {
        // eslint-disable-next-line global-require
        targetComponent = require('@/views/pages/404')
      }
      defaultHomePage = {
        ...this.homePage,
        content: targetComponent.default,
        breadData: [this.homePage.label]
      }
    }
    this.editableTabsValue = defaultHomePage.id
    this.editableTabs.push(defaultHomePage)
    this.setContentHeight('home')

    this.bindEvent()
  },

  beforeDestroy() {
    this.unBindEvent()
  },

  methods: {
    bindEvent() {
      window.addEventListener('resize', this.resize)
    },

    unBindEvent() {
      window.removeEventListener('resize', this.resize)
    },

    // 全部关闭、显示隐藏
    handleCommand(command) {
      if (command === 'closeAll') {
        this.editableTabs = this.editableTabs.slice(0, 1)
        this.editableTabsValue = this.editableTabs[0].id
      } else {
        this.editableTabsValue = command
      }
    },
    // 添加选项卡
    addTab(tabObj, nameArr, isRefresh) {
      const indexVal = tabObj.id
      const openTab = this.editableTabs.find(item => item.id === indexVal)
      // 新开选项卡
      if (!openTab) {
        let targetComponent = {}
        try {
          // eslint-disable-next-line
          targetComponent = require(`@/views/pages/page_${tabObj.part_id}`);
        } catch (err) {
          // eslint-disable-next-line global-require
          targetComponent = require('@/views/pages/404')
        }
        this.editableTabs.push({
          ...tabObj,
          ...{
            breadData: nameArr,
            content: targetComponent.default
          }
        })
        // 内容容器高度计算
        this.setContentHeight(indexVal)
      }
      // 刷新当前tab项
      if (openTab && isRefresh) {
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
    },

    resize() {
      this.setContentHeight(this.editableTabsValue)
    },

    /**
     * 内容容器高度计算
     * NOTE: 不监听窗口变化
     */
    setContentHeight(tabVal) {
      this.$nextTick(() => {
        const id = `pane-${tabVal}`
        const pane = document.querySelector(`#pane-${tabVal}`)
        if (!pane) { return }
        const contentLayout = pane.querySelector('.content-layout')
        if (contentLayout) { // 特殊处理 rowContainer 组件
          const maxH = `${dom.getContentMaxHeigh(pane, contentLayout)}px`
          contentLayout.style.height = maxH
          // HACK: IE 兼容
          const contentLayoutLeft = contentLayout.querySelector('.content-layout__left')
          const contentLayoutMain = contentLayout.querySelector('.content-layout__main')
          let leftWidth = '0px'
          if (contentLayoutLeft) {
            contentLayoutLeft.style.height = maxH
            leftWidth = contentLayoutLeft.style.width
          }
          if (contentLayoutMain) {
            contentLayoutMain.style.width = `calc(100% - ${leftWidth})`
          }
        } else {
          const contentWarp = pane.querySelector('.ui-main__content__warp')
          if (contentWarp) {
            contentWarp.style.height = `${dom.getContentMaxHeigh(pane, contentWarp)}px`
          }
        }
      })
    }
  }
}


</script>
