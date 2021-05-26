<template>
  <el-input-number
    v-model.trim="value"
    :placeholder="_placeholder"
    :required="!!required"
    :disabled="!!disabled"
    :min="_minlength"
    :max="_maxlength"
    :step="step"
    :size="size"
    :controls="controls"
    :controls-position="controlsPosition"
    @focus="handleFocus"
    @blur="handleBlur"
    @change="handleChange"
  />
</template>

<script>
export default {
  name: 'UiInputNumber',
  componentName: 'UiInputNumber',
  props: {
    label: {
      type: String,
      default: ''
    },
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
      type: [String, Number],
      default: ''
    },
    max: {
      type: [String, Number],
      default: ''
    },
    step: {
      type: [String, Number],
      default: 1
    },
    size: {
      type: String,
      default: 'small'
    },
    controls: {
      type: Boolean,
      default: true
    },
    controlsPosition: {
      type: String,
      default: ''
    },
    conf: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    // eslint-disable-next-line no-underscore-dangle
    _placeholder() {
      console.log(2121, this)
      // const { placeholder, label } = this
      // if (placeholder === false) {
      //   return ''
      // }
      return this.placeholder || `请输入${this.label}`
    },
    // eslint-disable-next-line no-underscore-dangle
    _minlength() {
      const { conf } = this
      const min = Number(conf.min)
      return min
    },
    // eslint-disable-next-line no-underscore-dangle
    _maxlength() {
      const { conf } = this
      const max = Number(conf.max)
      return max
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
    handleFocus(...arg) {
      this.$emit('handleFocus', ...arg)
    },
    handleBlur(...arg) {
      this.$emit('handleBlur', ...arg)
    },
    handleChange(...arg) {
      this.$emit('handleChange', ...arg)
    }
  }
}
</script>
