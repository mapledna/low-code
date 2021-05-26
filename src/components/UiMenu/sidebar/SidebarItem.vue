<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <!-- <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)"> -->
      <el-menu-item :index="resolvePath(onlyOneChild.id)" :class="{'submenu-title-noDropdown':!isNest}">
        <!-- <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="generateTitle(onlyOneChild.meta.title)" /> -->
        <!-- <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" /> -->
        <!-- <i :class="'icon '+onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" /> -->

        <svg-icon :icon-class="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" />
        <span slot="title">{{ onlyOneChild.meta.title }}</span>
      </el-menu-item>
      <!-- </app-link> -->
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.id)" popper-append-to-body>
      <template slot="title">
        <!-- <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="generateTitle(item.meta.title)" /> -->
        <!-- <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" /> -->
        <!-- <i :class="'icon '+(item.meta&&item.meta.icon)" /> -->

        <svg-icon :icon-class="item.meta?item.meta.icon:''" />
        <span slot="title">{{ item.meta.title }}</span>
      </template>
      <sidebar-item
        v-for="(child,idx) in item.children"
        :key="child.path+'_'+idx"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
// import { generateTitle } from '@/utils/i18n'
// import { isExternal } from '@/utils/validate'
// import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: {
    // Item,
    AppLink
  },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    this.onlyOneChild = null
    return {}
  },
  methods: {
    // 这里判断是否只有一个子节点且该子节点没有需要显示的下级 如果是 则子节点替代父节点 （因为默认父节点是不能点击，从而替换掉了）
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        }
        // Temp set(will be used if only has one showing child)
        this.onlyOneChild = item
        return true
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      // if (isExternal(routePath)) {
      //   return routePath
      // }
      // if (isExternal(this.basePath)) {
      //   return this.basePath
      // }
      // // console.log('path.resolve')
      // return `${parseInt(Math.random() * 10000, 10)}1`
      // return path.resolve(this.basePath, routePath)

      return `${routePath}`
    }

    // generateTitle
  }
}
</script>
