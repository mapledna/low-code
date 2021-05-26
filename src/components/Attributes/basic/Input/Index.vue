<template>
  <div>
    <el-input
      v-model="value"
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
      @blur="
        () => {
          value = value.trim();
          event.onBlur&&event.onBlur(value);
        }
      "
      @focus="
        () => {
          value = value.trim();
          event.onFocus&&event.onFocus(value);
        }
      "
      @clear="
        () => {
          value = value.trim();
          event.onClear&&event.onClear(value);
        }
      "
      @change="
        () => {
          value = value.trim();
          event.onChange&&event.onChange(value);
        }
      "
      @input="
        () => {
          value = value.trim();
          event.onInput&&event.onInput(value);
        }
      "
    >
      <template v-if="prepend" slot="prepend">
        {{ prepend }}
      </template>
      <template v-if="append" slot="append">
        {{ append }}
      </template>
    </el-input>
  </div>
</template>

<script>
/* eslint-disable no-underscore-dangle */

export default {
  name: 'UiInput',
  props: {
    value: {
      tyle: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    event: { // 自定义事件
      type: Object,
      default: () => ({
        onBlur: '',
        onFocus: '',
        onClear: '',
        onChange: '',
        onInput: ''
      })
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
      tyle: [String, Number],
      default: ''
    },
    maxlength: {
      tyle: [String, Number],
      default: ''
    },
    showWordLimit: {
      type: Boolean,
      default: true
    },
    prepend: {
      tyle: [String, Number],
      default: ''
    },
    append: {
      tyle: [String, Number],
      default: ''
    },
    prefixIcon: {
      tyle: String,
      default: ''
    },
    suffixIcon: {
      tyle: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    }
  },
  computed: {
    _placeholder() {
      const { placeholder, label } = this
      if (placeholder === false) {
        return ''
      }
      return placeholder || `请输入${label}`
    },
    _minlength() {
      const { conf } = this
      const minlength = Number(conf.minlength)
      return Number.isNaN(minlength) ? '' : minlength.toString()
    },
    _maxlength() {
      const { conf } = this
      const maxlength = Number(conf.maxlength)
      return Number.isNaN(maxlength) ? '' : maxlength.toString()
    },
    _showWordLimit() {
      const { conf, maxlength } = this
      const { showWordLimit } = conf
      return !!(maxlength && showWordLimit !== false)
    }
  }
}
</script>
