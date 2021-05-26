<template>
  <div
    :class="{
      'ui-layout_collapse-btn': true,
      [`ui-layout--${name}`]: true,
      collapsed: collapsed,
    }"
    :style="_style"
    @click="handleClick"
  >
    <span
      :class="{
        triangle: true,
        [`triangle-${name}`]: true,
      }"
      :style="{
        borderWidth: `${_height * 0.6}px`,
      }"
    />
  </div>
</template>

<script>
const MIN_HEIGHT = 5

export default {
  name: 'UiLayoutCollapseBtn',
  components: {},
  props: {
    name: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      default: 35
    },
    height: {
      type: Number,
      default: 7
    },
    position: {
      type: Number,
      required: true
    },
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    _height() {
      const { height } = this
      return height <= MIN_HEIGHT ? MIN_HEIGHT : height
    },
    _style() {
      const {
        name, width, _height, position, moveType
      } = this

      const isHorizontal = ['left', 'right'].indexOf(name) > -1

      let posObj = {}
      if (['header', 'top'].indexOf(name) > -1) {
        posObj = {
          top: `${position}px`,
          bottom: 'auto',
          left: 'translataX(50%)'
        }
      } else if (['bottom', 'footer'].indexOf(name) > -1) {
        posObj = {
          bottom: `${position}px`,
          top: 'auto',
          left: 'translataX(50%)'
        }
      } else if (['left'].indexOf(name) > -1) {
        posObj = {
          left: `${position}px`,
          right: 'auto',
          top: 'translataY(50%)'
        }
      } else if (['right'].indexOf(name) > -1) {
        posObj = {
          right: `${position}px`,
          left: 'auto',
          top: 'translataY(50%)'
        }
      }
      return {
        width: isHorizontal ? `${_height}px` : `${width}px`,
        height: isHorizontal ? `${width}px` : `${_height}px`,
        ...posObj
      }
    }
  },
  methods: {
    handleClick() {
      const { collapsed } = this
      this.$emit('update:collapsed', !collapsed)
    }
  }
}
</script>
