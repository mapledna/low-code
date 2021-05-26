<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-menu
      :default-active="defaultValue"
      :collapse="isHidden"
      :text-color="variables.menuText"
      :background-color="variables.menuBg"
      :unique-opened="true"
      :active-text-color="variables.menuActiveText"
      :collapse-transition="false"
      :mode="model"
      @select="$emit('doSelect', $event)"
      @open="menuOpen"
      @close="menuClose"
    >
      <sidebar-item v-for="(route,idx) in menuData" :key="route.path+'_'+idx" :item="route" :index="idx" :base-path="route.path" :menu-state="menuState" />
    </el-menu>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
// import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  props: ['defaultValue', 'variables', 'isCollapse', 'menuData', 'model'],
  data() {
    return {
      isHidden: false,
      menuState: {
        isOpen: false, // 是否点击展开
        menuLevel: ''// 点击的是第几级的id
      }
    }
  },
  computed: {
    // ...mapGetters([
    //   'permission_routes',
    //   'sidebar'
    // ]),
    // activeMenu() {
    //   const route = this.$route
    //   const { meta, path } = route
    //   // if set path, the sidebar will highlight the path you set
    //   if (meta.activeMenu) {
    //     return meta.activeMenu
    //   }
    //   return path
    // },
    showLogo() {
      return false
      // return this.$store.state.settings.sidebarLogo
    }
    // variables() {
    //   return variables
    // },
    // isCollapse() {
    //   return !this.sidebar.opened
    // }
  },
  methods: {
    showMenuClick() {
      this.isHidden = !this.isHidden
    },
    menuOpen(index, indexPath) {
      // console.log('open', index, indexPath)
      this.$set(this.menuState, 'isOpen', true)
      this.$set(this.menuState, 'menuId', index)
      // console.log('open', this.menuState)
    },
    menuClose(index, indexPath) {
      // console.log('close', index, indexPath)
      this.$set(this.menuState, 'isOpen', false)
      this.$set(this.menuState, 'menuId', index)
      // console.log('close', this.menuState)
    }
  }
}
</script>
<style scoped>
.el-menu{text-align:left;}
</style>
