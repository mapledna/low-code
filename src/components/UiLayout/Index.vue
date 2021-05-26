<template>
  <div
    class="ui-layout_container"
    :style="{ minHeight: `${minHeight}px`, minWidth: `${minWidth}px` }"
  >
    <UiLayoutPanel
      name="body"
      :top="getPanelPos('header')"
      :bottom="getPanelPos('footer')"
      :padding="padding"
    >
      <UiLayoutPanel
        name="center"
        :left="getPanelPos('left')"
        :right="getPanelPos('right')"
        :padding="padding"
      >
        <template v-if="layoutConf.top">
          <UiLayoutPanel
            name="top"
            :collapsed="layoutConf.top.collapsed"
            :size="layoutConf.top.size"
          >
            <slot name="top" />
          </UiLayoutPanel>
          <UiLayoutResizeBar
            v-if="layoutConf.top.resizable"
            name="top"
            :size="layoutConf.top.padding"
            :position="getToolPos('top')"
            :limit="{
              top: layoutConf.top.minH + layoutConf.top.padding,
              bottom:
                layoutConf.main.minH +
                (layoutConf.bottom
                  ? getPanelPos('bottom') + layoutConf.bottom.padding
                  : 0),
            }"
            :style="{ display: layoutConf.top.collapsed ? 'none' : 'inherit' }"
            @dragend="handleResizeEnd"
          />
          <UiLayoutCollapseBtn
            v-if="layoutConf.top.collapsible"
            name="top"
            :width="layoutConf.top.collapseBtnWidth"
            :height="layoutConf.top.collapseBtnHeight"
            :collapsed.sync="layoutConf.top.collapsed"
            :position="getToolPos('top')"
          />
        </template>
        <UiLayoutPanel
          name="main"
          :top="getPanelPos('top')"
          :bottom="getPanelPos('bottom')"
          :padding="padding"
        >
          <slot />
        </UiLayoutPanel>
        <template v-if="layoutConf.bottom">
          <UiLayoutPanel
            name="bottom"
            :collapsed="layoutConf.bottom.collapsed"
            :resizable="layoutConf.bottom.resizable"
            :size="layoutConf.bottom.size"
            @dragend="handleResizeEnd"
          >
            <slot name="bottom" />
          </UiLayoutPanel>
          <UiLayoutResizeBar
            v-if="layoutConf.bottom.resizable"
            name="bottom"
            :size="layoutConf.bottom.padding"
            :position="getToolPos('bottom')"
            :limit="{
              top:
                (layoutConf.top
                  ? getPanelPos('top') + layoutConf.top.padding
                  : 0) + layoutConf.main.minH,
              bottom: layoutConf.bottom.minH + layoutConf.bottom.padding,
            }"
            :style="{
              display: layoutConf.bottom.collapsed ? 'none' : 'inherit',
            }"
            @dragend="handleResizeEnd"
          />
          <UiLayoutCollapseBtn
            v-if="layoutConf.bottom.collapsible"
            name="bottom"
            :width="layoutConf.bottom.collapseBtnWidth"
            :height="layoutConf.bottom.collapseBtnHeight"
            :collapsed.sync="layoutConf.bottom.collapsed"
            :position="getToolPos('bottom')"
          />
        </template>
      </UiLayoutPanel>
      <template v-if="layoutConf.left">
        <UiLayoutPanel
          name="left"
          :collapsed="layoutConf.left.collapsed"
          :size="layoutConf.left.size"
        >
          <slot name="left" />
        </UiLayoutPanel>
        <UiLayoutResizeBar
          v-if="layoutConf.left.resizable"
          name="left"
          :size="layoutConf.left.padding"
          :position="getToolPos('left')"
          :limit="{
            left: layoutConf.left.minW + layoutConf.left.padding,
            right:
              layoutConf.main.minW +
              (layoutConf.right
                ? getPanelPos('right') + layoutConf.right.padding
                : 0),
          }"
          :style="{ display: layoutConf.left.collapsed ? 'none' : 'inherit' }"
          @dragend="handleResizeEnd"
        />
        <UiLayoutCollapseBtn
          v-if="layoutConf.left.collapsible"
          name="left"
          :width="layoutConf.left.collapseBtnWidth"
          :height="layoutConf.left.collapseBtnHeight"
          :collapsed.sync="layoutConf.left.collapsed"
          :position="getToolPos('left')"
        />
      </template>
      <template v-if="layoutConf.right">
        <UiLayoutPanel
          name="right"
          :collapsed="layoutConf.right.collapsed"
          :size="layoutConf.right.size"
        >
          <slot name="right" />
        </UiLayoutPanel>
        <UiLayoutResizeBar
          v-if="layoutConf.right.resizable"
          name="right"
          :size="layoutConf.right.padding"
          :position="getToolPos('right')"
          :limit="{
            left:
              (layoutConf.left
                ? getPanelPos('left') + layoutConf.left.padding
                : 0) + layoutConf.main.minW,
            right: layoutConf.right.minW + layoutConf.right.padding,
          }"
          :style="{ display: layoutConf.right.collapsed ? 'none' : 'inherit' }"
          @dragend="handleResizeEnd"
        />
        <UiLayoutCollapseBtn
          v-if="layoutConf.right.collapsible"
          name="right"
          :width="layoutConf.right.collapseBtnWidth"
          :height="layoutConf.right.collapseBtnHeight"
          :collapsed.sync="layoutConf.right.collapsed"
          :position="getToolPos('right')"
        />
      </template>
    </UiLayoutPanel>
    <template v-if="layoutConf.header">
      <UiLayoutPanel
        name="header"
        :collapsed="layoutConf.header.collapsed"
        :size="layoutConf.header.size"
      >
        <slot name="header" />
      </UiLayoutPanel>
      <UiLayoutResizeBar
        v-if="layoutConf.header.resizable"
        name="header"
        :size="layoutConf.header.padding"
        :position="getToolPos('header')"
        :limit="{
          top: layoutConf.header.minH + layoutConf.header.padding,
          bottom:
            (layoutConf.top ? getPanelPos('top') + layoutConf.top.padding : 0) +
            layoutConf.main.minH +
            (layoutConf.bottom
              ? getPanelPos('bottom') + layoutConf.bottom.padding
              : 0) +
            (layoutConf.footer
              ? getPanelPos('footer') + layoutConf.footer.padding
              : 0),
        }"
        :style="{ display: layoutConf.header.collapsed ? 'none' : 'inherit' }"
        @dragend="handleResizeEnd"
      />
      <UiLayoutCollapseBtn
        v-if="layoutConf.header.collapsible"
        name="header"
        :width="layoutConf.header.collapseBtnWidth"
        :height="layoutConf.header.collapseBtnHeight"
        :collapsed.sync="layoutConf.header.collapsed"
        :position="getToolPos('header')"
      />
    </template>
    <template v-if="layoutConf.footer">
      <UiLayoutPanel
        name="footer"
        :collapsed="layoutConf.footer.collapsed"
        :size="layoutConf.footer.size"
      >
        <slot name="footer" />
      </UiLayoutPanel>
      <UiLayoutResizeBar
        v-if="layoutConf.footer.resizable"
        name="footer"
        :size="layoutConf.footer.padding"
        :position="getToolPos('footer')"
        :limit="{
          top:
            (layoutConf.header
              ? getPanelPos('header') + layoutConf.header.padding
              : 0) +
            (layoutConf.top ? getPanelPos('top') + layoutConf.top.padding : 0) +
            layoutConf.main.minH +
            (layoutConf.bottom
              ? getPanelPos('bottom') + layoutConf.bottom.padding
              : 0),
          bottom: layoutConf.footer.minH + layoutConf.footer.padding,
        }"
        :style="{ display: layoutConf.footer.collapsed ? 'none' : 'inherit' }"
        @dragend="handleResizeEnd"
      />
      <UiLayoutCollapseBtn
        v-if="layoutConf.footer.collapsible"
        name="footer"
        :width="layoutConf.footer.collapseBtnWidth"
        :height="layoutConf.footer.collapseBtnHeight"
        :collapsed.sync="layoutConf.footer.collapsed"
        :position="getToolPos('footer')"
      />
    </template>
  </div>
</template>

<script>
/* eslint-disable no-underscore-dangle */

/** TODO:
 * 优化 limit 参数计算；
 * 折叠bottom后拖拽footer，再展开bottom可能导致bottom面板超出
 * 增加 watch
 */

// import LayoutPanel from './component/Panel/index.vue'

import UiLayoutPanel from './component/Panel.vue'
import UiLayoutResizeBar from './component/ResizeBar.vue'
import UiLayoutCollapseBtn from './component/CollapseBtn.vue'

export default {
  name: 'UiLayout',
  components: {
    // LayoutPanel,
    UiLayoutPanel,
    UiLayoutResizeBar,
    UiLayoutCollapseBtn
  },

  model: {
    prop: 'layout',
    event: 'update:layout'
  },
  props: {
    size: {
      type: Number,
      default: 50
    },
    minW: {
      type: Number,
      default: 50
    },
    minH: {
      type: Number,
      default: 50
    },
    padding: {
      type: Number,
      default: 5
    },
    collapsible: {
      type: Boolean,
      default: true
    },
    collapseBtnWidth: {
      type: Number,
      default: undefined
    },
    collapseBtnHeight: {
      type: Number,
      default: undefined
    },
    resizable: {
      type: Boolean,
      default: true
    },
    layout: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      layoutConf: {},
      minHeight: 0,
      minWidth: 0,
      isInited: false
    }
  },

  computed: {
    defaultPanelOpts() {
      const {
        size,
        minH,
        minW,
        padding,
        collapsible,
        collapseBtnWidth,
        collapseBtnHeight,
        resizable
      } = this
      return Object.freeze({
        size,
        minH,
        minW,
        padding,
        collapsible,
        collapsed: false,
        collapseBtnWidth,
        collapseBtnHeight,
        resizable
      })
    }
  },

  watch: {
    layout: {
      immediate: true,
      deep: true,
      handler(layout) {
        // TODO: 深度对比
        if (JSON.stringify(layout) !== JSON.stringify(this.layoutConf)) {
          this.initSlot()
        }
      }
    },
    layoutConf: {
      deep: true,
      handler(layoutConf) {
        this.$emit(
          'update:layout',
          JSON.parse(JSON.stringify(this.layoutConf))
        )
      }
    }
  },

  created() {},

  methods: {
    getToolPos(name) {
      const { layoutConf } = this
      return layoutConf[name] && layoutConf[name].collapsed
        ? 0
        : layoutConf[name].size
    },

    getPanelPos(name) {
      const { layoutConf } = this
      return layoutConf[name] && !layoutConf[name].collapsed
        ? layoutConf[name].size
        : null
    },

    initSlot() {
      const { layout, defaultPanelOpts } = this
      const newLayout = {
        main: {}
      }
      let minHeight = 0
      let minWidth = 0
      if (this.$slots) {
        Object.keys(this.$slots).forEach(key => {
          if (key === 'default') {
            key = 'main'
          }
          newLayout[key] = {
            ...defaultPanelOpts,
            ...layout[key]
          }
          newLayout[key].size = +newLayout[key].size
          newLayout[key].padding = +newLayout[key].padding
          newLayout[key].collapseBtnHeight = +(
            newLayout[key].collapseBtnHeight || newLayout[key].padding + 2
          )

          if (key === 'main') {
            newLayout[key].collapsible = false
            newLayout[key].resizable = false
            newLayout[key].padding = 0
            minHeight += newLayout.main.size || 0
            minWidth += newLayout.main.size || 0
          } else if (['header', 'top', 'bottom', 'footer'].indexOf(key) > -1) {
            minHeight += (newLayout[key].size || 0) + newLayout[key].padding
          } else if (['left', 'right'].indexOf(key) > -1) {
            minWidth += (newLayout[key].size || 0) + newLayout[key].padding
          }
          console.log('layout', key, newLayout[key])
        })
        this.$set(this, 'minHeight', minHeight)
        this.$set(this, 'minWidth', minWidth)
        this.$set(this, 'layoutConf', newLayout)
        console.log(
          'layoutConf===',
          this.layoutConf,
          this.minHeight,
          this.minWidth
        )
      }
    },

    handleResizeEnd({
      // moveType, posX, posY,
      name,
      moveX,
      moveY
    }) {
      let { size } = this.layoutConf[name]
      if (['header', 'top'].indexOf(name) > -1) {
        size += moveY
      } else if (['bottom', 'footer'].indexOf(name) > -1) {
        size -= moveY
      } else if (['left'].indexOf(name) > -1) {
        size += moveX
      } else if (['right'].indexOf(name) > -1) {
        size -= moveX
      }
      this.$set(this.layoutConf[name], 'size', size)
    }

    // updateConf() {
    //   // TODO: 深度合并
    //   this.layoutConf = {
    //     ...this.layoutConf,
    //     ...this.newConf,
    //   }
    //   console.log('updateConf', this.layoutConf)
    // },
  }
}
</script>

<style lang="scss">
@import "@style/theme-base/utils";
@import "./style";
</style>
