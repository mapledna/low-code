<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!-- <el-scrollbar wrap-class="scrollbar-wrapper"> -->
    <el-menu
      :default-active="defaultValue"
      :collapse="isCollapse"
      :text-color="variables.menuText"
      :background-color="variables.menuBg"
      :unique-opened="true"
      :active-text-color="variables.menuActiveText"
      :collapse-transition="false"
      :mode="model"
      @select="$emit('doSelect',$event)"
    >
      <sidebar-item v-for="(route,idx) in menuData" :key="route.path+'_'+idx" :item="route" :base-path="route.path" />
    </el-menu>
    <!-- </el-scrollbar> -->
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
  }
}
</script>
<style scoped>
</style>
