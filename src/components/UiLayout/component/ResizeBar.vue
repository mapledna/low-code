<template>
  <div
    :class="{
      'ui-layout_resize-bar': true,
      [`ui-layout--${name}`]: true,
      active: onMove,
    }"
    :style="style"
    @mousedown="drag"
  />
</template>

<script>
export default {
  name: 'UiLayoutResizeBar',
  components: {},
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 5
    },
    position: {
      type: Number,
      required: true
    },
    limit: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      onMove: false,
      posX: 0,
      posY: 0,
      moveX: 0,
      moveY: 0,
      limitTop: 0,
      limitBottom: 0,
      limitLeft: 0,
      limitRight: 0
    }
  },
  computed: {
    moveType() {
      const { name } = this
      return ['left', 'right'].indexOf(name) > -1 ? 'horizontal' : 'vertical'
    },
    style() {
      const { name, size, position } = this
      let style = {}
      if (['header', 'top'].indexOf(name) > -1) {
        style = {
          height: `${size}px`,
          top: `${position}px`,
          bottom: 'auto'
        }
      } else if (['bottom', 'footer'].indexOf(name) > -1) {
        style = {
          height: `${size}px`,
          bottom: `${position}px`,
          top: 'auto'
        }
      } else if (['left'].indexOf(name) > -1) {
        style = {
          width: `${size}px`,
          left: `${position}px`,
          right: 'auto'
        }
      } else if (['right'].indexOf(name) > -1) {
        style = {
          width: `${size}px`,
          right: `${position}px`,
          left: 'auto'
        }
      }
      return style
    }
  },
  watch: {},
  created() {},
  methods: {
    drag(e) {
      const { moveType, size, limit } = this
      const {
        top: limitTop = 0,
        bottom: limitBottom = 0,
        left: limitLeft = 0,
        right: limitRight = 0
      } = limit
      this.onMove = true
      this.moveX = 0
      this.moveY = 0
      const tgtDom = e.target
      const warpDom = tgtDom.offsetParent
      const warpWidth = warpDom.clientWidth
      const warpHeight = warpDom.clientHeight
      const sLeft = tgtDom.offsetLeft
      const sTop = tgtDom.offsetTop
      // 算出鼠标相对元素的位置
      const disX = e.clientX - sLeft
      const disY = e.clientY - sTop
      if (moveType === 'horizontal') {
        this.posX = sLeft
      } else if (moveType === 'vertical') {
        this.posY = sTop
      }
      this.$emit('dragstart', {
        name: this.name,
        moveType,
        posY: this.posY,
        posX: this.posX,
        moveX: this.moveX,
        moveY: this.moveY
      })

      const _vm = this
      // eslint-disable-next-line no-shadow
      function handleMouseMove(e) {
        if (moveType === 'horizontal') {
          // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          // 计算移动的距离
          const left = e.clientX - disX
          if (limitLeft < left && warpWidth - limitRight > left) {
            // 绑定元素位置到posX和posY上面
            _vm.moveX = left - sLeft
            _vm.posX = left
            // 移动当前元素
            tgtDom.style.left = `${left}px`
          }
        } else if (moveType === 'vertical') {
          const top = e.clientY - disY
          if (limitTop < top && warpHeight - limitBottom > top) {
            _vm.moveY = top - sTop
            _vm.posY = top
            tgtDom.style.top = `${top}px`
          }
        }
        _vm.$emit('drag', {
          name: _vm.name,
          moveType,
          posY: _vm.posY,
          posX: _vm.posX,
          moveX: _vm.moveX,
          moveY: _vm.moveY
        })
      }
      // eslint-disable-next-line no-shadow
      function handleMouseUp(e) {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        _vm.onMove = false
        _vm.$emit('dragend', {
          name: _vm.name,
          moveType,
          posY: _vm.posY,
          posX: _vm.posX,
          moveX: _vm.moveX,
          moveY: _vm.moveY
        })
      }
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      // return false不加的话可能导致黏连，就是拖到一个地方时div粘在鼠标上不下来，相当于onmouseup失效
      return false
    }
  }
}
</script>
