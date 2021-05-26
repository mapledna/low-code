<template>
  <el-input
    v-model.trim="value"
    :type="type"
    :placeholder="_placeholder"
    :readonly="!!readonly"
    :required="!!required"
    :disabled="!!disabled"
    :clearable="!!clearable"
    :minlength="_minlength"
    :maxlength="_maxlength"
    :show-word-limit="_showWordLimit"
    :prefix-icon="prefixIcon"
    :suffix-icon="suffixIcon"
    :size="size"
    :rows="conf.rows"
    @compositionstart="handleCompositionStart"
    @compositionupdate="handleCompositionUpdate"
    @compositionend="handleCompositionEnd"
    @input="handleInput"
    @focus="handleFocus"
    @blur="handleBlur"
    @change="handleChange"
  >
    <template v-if="prepend" slot="prepend">
      {{ prepend }}
    </template>
    <template v-if="append" slot="append">
      {{ append }}
    </template>
  </el-input>
</template>

<script>
export default {
  name: 'UiInput',
  componentName: 'UiInput',
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
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    minlength: {
      type: [String, Number],
      default: ''
    },
    maxlength: {
      type: [String, Number],
      default: ''
    },
    showWordLimit: {
      type: Boolean,
      default: true
    },
    prepend: {
      type: [String, Number],
      default: ''
    },
    append: {
      type: [String, Number],
      default: ''
    },
    prefixIcon: {
      type: String,
      default: ''
    },
    suffixIcon: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    rows: {
      type: Number,
      default: 3
    },
    conf: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    // eslint-disable-next-line no-underscore-dangle
    // _type() {
    //   // const { type } = this.conf
    //   return this.conf.type || this.type
    // },
    // eslint-disable-next-line no-underscore-dangle
    _placeholder() {
      console.log(2121 + this.label, this)
      // const { placeholder, label } = this.conf
      // if (placeholder === false) {
      //   return ''
      // }
      return this.placeholder || `请输入${this.label}`
    },
    // eslint-disable-next-line no-underscore-dangle
    _minlength() {
      const { conf } = this
      const minlength = Number(conf.minlength)
      return Number.isNaN(minlength) ? '' : minlength.toString()
    },
    // eslint-disable-next-line no-underscore-dangle
    _maxlength() {
      const { conf } = this
      const maxlength = Number(conf.maxlength)
      return Number.isNaN(maxlength) ? '' : maxlength.toString()
    },
    // eslint-disable-next-line no-underscore-dangle
    _showWordLimit() {
      const { conf, maxlength } = this
      const { showWordLimit } = conf
      return !!(maxlength && showWordLimit !== false)
    }
  },
  watch: {
    value: {
      handler(val) {
        console.log(555, this.keyValue, val)
        this.$emit('changeData', { key: this.keyValue, value: val })
      }
    }
  },
  methods: {
    handleCompositionStart(...arg) {
      this.$emit('handleCompositionStart', ...arg)
    },
    handleCompositionUpdate(...arg) {
      this.$emit('handleCompositionUpdate', ...arg)
    },
    handleCompositionEnd(...arg) {
      this.$emit('handleCompositionEnd', ...arg)
    },
    handleInput(...arg) {
      this.$emit('handleInput', ...arg)
    },
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
