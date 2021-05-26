<template>
  <div class="ui-main__container">
    <MainAside>
      <p slot="logo" class="ui-main__logo">
        <img
          :src="logoIcon"
          class="ui-main__logo--icon"
          :class="{ 'with-title': asideTitle }"
        >
        <span
          v-if="asideTitle"
          class="ui-main__logo--title"
          :class="{ 'with-icon': logoIcon }"
        >{{ asideTitle }}</span>
      </p>
      <component
        :is="menuType"
        slot="menu"
        :data="menuData"
        :is-collapse="isCollapse"
        @handle-menu-select="clickMenu"
      />
      <!-- <ui-bac-menu
        slot="menu"
        :data="menuData"
        :is-collapse="isCollapse"
        @handle-menu-select="clickMenu"
      /> -->
    </MainAside>
    <MainHeader :system-type="systemType" :header-title="headerTitle" />
    <main class="ui-main">
      <MainTabs ref="mainTab" :home-page="homePage" />
    </main>
  </div>
</template>

<script>
import UiMenu from '@/components/UiMenu/Index.vue'
import UiBacMenu from '@/components/UiBacMenu/Index.vue'
import MainAside from './component/MainAside.vue'
import MainHeader from './component/MainHeader.vue'
import MainTabs from './component/MainTabs.vue'
// import MainFooter from '@/component/Footer.vue'
export default {
  name: 'UiMain',
  components: {
    MainAside,
    UiMenu,
    UiBacMenu,
    MainHeader,
    MainTabs
    // MainFooter,
  },
  props: {
    headerTitle: {
      type: String,
      default: ''
    },
    asideTitle: {
      type: String,
      default: ''
    },
    logoIcon: {
      type: String,
      default: ''
    },
    // 默认显示的首页id
    homePage: {
      type: String,
      default: ''
    },
    menuType: {
      type: String,
      default: 'UiMenu'
    },
    // 菜单树数据
    menuData: {
      type: Array,
      default: () => ([])
    },
    // 默认选中的菜单值
    menuId: {
      type: [String, Number],
      default: ''
    },
    // 自定义菜单样式
    variables: {
      type: Object,
      default: () => ({})
    },
    // 是否折叠收起菜单
    isCollapse: {
      type: Boolean,
      default: true
    },
    // 系统类型
    systemType: {
      type: String,
      default: 'product'
    }
  },
  mounted() {
    document.title = this.asideTitle ? this.asideTitle : this.headerTitle
    this.bindEventBus()
  },

  beforeDestroy() {
    this.unBindEventBus()
  },

  methods: {
    bindEventBus() {
      this.$EventBus.$on('main.clickMenu', this.clickMenu)
    },
    unBindEventBus() {
      this.$EventBus.$off('main.clickMenu', this.clickMenu)
    },

    // 菜单点击事件
    // NOTE: menu 参数数据类型不统一
    // NOTE: 原本的 @click-menu 事件改为用 eventBus 传播
    clickMenu(menu, isPassive) {
      console.log('clickMenu', menu, isPassive)
      if (isPassive) {
        const target = this.menuData.find(item => item.id === menu)
        const isRefresh = true // 默认已打开则刷新
        this.$refs.mainTab.addTab(
          target,
          this.getParentNames(target.pid, [target.label]),
          isRefresh
        )
      } else if (menu.part_id) {
        this.$refs.mainTab.addTab(
          menu,
          this.getParentNames(menu.pid, [menu.label])
        )
      } else if (menu.menu_href) {
        this.$router.push({
          path: menu.menu_href,
          query: {
            ...this.$route.query
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
    }
  }
}
</script>
