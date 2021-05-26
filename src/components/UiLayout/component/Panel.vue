<template>
  <section
    :class="{
      'ui-layout_panel': true,
      [`ui-layout--${name}`]: true,
      collapsed: collapsed,
    }"
    :style="_style"
  >
    <slot />
  </section>
</template>

<script>
export default {
  name: 'UiLayoutPanel',
  components: {},
  props: {
    name: {
      type: [String],
      required: true
    },
    collapsed: {
      type: [Boolean],
      default: false
    },
    size: {
      type: Number,
      default: null
    },
    padding: {
      type: Number,
      default: 0
    },
    top: {
      type: Number,
      default: null
    },
    bottom: {
      type: Number,
      default: null
    },
    left: {
      type: Number,
      default: null
    },
    right: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      layout: {},
      isInited: false
    }
  },
  computed: {
    _style() {
      const { name, size, padding } = this
      const sizeKey = name === 'left' || name === 'right' ? 'width' : 'height'
      const margin = ['top', 'bottom', 'left', 'right'].reduce((prev, cur) => {
        const value = this[cur]
        if (value || value === 0) {
          prev[cur] = `${value + padding}px`
        }
        return prev
      }, {})
      return {
        [sizeKey]: `${size}px`,
        ...margin
      }
    }
  },
  created() {},
  methods: {}
}
</script>
