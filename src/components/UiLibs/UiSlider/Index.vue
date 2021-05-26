<template>
  <el-slider
    v-model.trim="value"
    :required="!!required"
    :disabled="!!disabled"
    :min="_minlength"
    :max="_maxlength"
    @change="handleChange"
  />
</template>

<script>
export default {
  name: 'UiSlider',
  componentName: 'UiSlider',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    keyValue: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 24
    },
    conf: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    // eslint-disable-next-line no-underscore-dangle
    _minlength() {
      const { conf } = this
      const min = Number(conf.min)
      return Number.isNaN(min) ? 1 : min
    },
    // eslint-disable-next-line no-underscore-dangle
    _maxlength() {
      const { conf } = this
      const max = Number(conf.max)
      return Number.isNaN(max) ? 24 : max
    }
  },
  watch: {
    value: {
      handler(val) {
        this.$emit('changeData', { key: this.keyValue, value: val })
      }
    }
  },
  methods: {
    handleChange(...arg) {
      this.$emit('handleChange', ...arg)
    }
  }
}
</script>
