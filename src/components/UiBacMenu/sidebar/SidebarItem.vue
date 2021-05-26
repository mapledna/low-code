<template>
  <div v-if="!item.hidden" class="menu-wrapper" :class="level>=3?'level_'+level +' moreMenu':'level_'+level" :level-li="level">
    <template v-if="!item.children">
      <el-menu-item :index="resolvePath(item.id)" :class="{'submenu-title-noDropdown':!isNest}">
        <i v-if="item.meta&&item.meta.icon.indexOf('mdi')>-1&&level<=1" :class="item.meta?item.meta.icon:''" class="leftIcon" />
        <svg-icon v-if="item.meta&&item.meta.icon.indexOf('mdi')===-1&&level<=1" :icon-class="item.meta.icon||(item.meta&&item.meta.icon)" />
        <i v-if="level===2" class="circle" :class="state.isOpen&&state.menuId===item.id?'fullCircle':'borderCircle'" />
        <span slot="title" :title="item.meta.title">{{ item.meta.title }}</span>
      </el-menu-item>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.id)" popper-append-to-body @mouseover.stop.native="level>=3?mouseenterEvent($event):''" @click.stop.native="level>=3?hiddenMenuEvent($event):''">
      <template slot="title">
        <i v-if="item.meta&&item.meta.icon.indexOf('mdi')>-1&&level<=1" :class="item.meta?item.meta.icon:''" class="leftIcon" />
        <svg-icon v-if="item.meta&&item.meta.icon.indexOf('mdi')===-1&&level<=1" :icon-class="item.meta?item.meta.icon:''" />
        <i v-if="level===2" class="circle" :class="state.isOpen&&state.menuId===item.id?'fullCircle':'borderCircle'" />
        <span slot="title" :title="item.meta.title" @mouseenter.native.prevent="selectHover(item.index)">{{ item.meta.title }}</span>
        <i class="icon-arrow" :class="level>=3?'el-icon-caret-right':''" />
        <i v-if="level>=3" class="icon-arrow-hover el-icon-caret-left" />
      </template>
      <sidebar-item
        v-for="(child,idx) in item.children"
        v-show="!item.isShow"
        :key="child.path+'_'+idx"
        :is-nest="true"
        :item="child"
        :level="item.level+1"
        :menu-state="state"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: {
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
    },
    level: {
      type: Number,
      default: () => 1
    },
    menuState: {
      type: Object,
      default() {
        return {
          isOpen: false, // 是否点击展开
          menuId: ''// 点击的是第几级的id
        }
      }
    }
  },
  data() {
    this.onlyOneChild = null
    return {
      state: {}
    }
  },
  watch: {
    menuState: {
      handler(val) {
        this.state = val
      },
      deep: true
    }
  },
  mounted() {
  },
  methods: {
    resolvePath(routePath) {
      return `${routePath}`
    },
    mouseenterEvent(arg) {
      const {
        target, showUl, curLevel, showArrow
      } = this.commonObj(arg)
      if (!showUl) return// 下级不存在
      const screenHeight = document.documentElement.clientHeight// 窗口高度
      const liTop = target.parentNode.parentNode.getBoundingClientRect()// 鼠标所在的li获取到窗口顶部等值的方法
      if (Number(curLevel) + 1 === 4) {
        showUl.style.left = `${liTop.left + 216}px`
      } else if (Number(curLevel) + 1 > 4) {
        showUl.style.left = `${liTop.left + 190}px`
        showArrow.style.right = '18px'
      }
      if (screenHeight - liTop.top > showUl.offsetHeight) {
        showUl.style.top = `${liTop.top}px`
        showUl.style.bottom = 'auto'
      } else {
        showUl.style.top = 'auto'
        showUl.style.bottom = 0
      }
    },
    hiddenMenuEvent(arg) {
      const {
        showUl
      } = this.commonObj(arg)
      showUl.style.display = 'none'
    },
    commonObj(arg) {
      const { target } = arg
      let showUl // 需要显示的下一级ul
      const curLevel = this.item.level// 当前是第几级
      let showArrow// 显示箭头
      // 由于将原生事件绑定到组件后，所有的子元素都加上了事件，所以不确定target是哪一个元素
      if (target.parentNode.parentNode.hasAttribute('level-li')) { //
        showUl = target.nextSibling
        // eslint-disable-next-line prefer-destructuring
        showArrow = target.childNodes[5]
      } else {
        showUl = target.parentNode.nextSibling
        // eslint-disable-next-line prefer-destructuring
        showArrow = target.parentNode.childNodes[5]
      }
      // eslint-disable-next-line consistent-return
      return {
        target, showUl, curLevel, showArrow
      }
    }
  }
}
</script>
