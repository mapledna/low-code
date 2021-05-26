<template>
  <div>
    <ui-input
      v-model.trim="value"
      type="password"
    >
      <template v-if="prepend" slot="prepend">
        {{ prepend }}
      </template>
      <template v-if="append" slot="append">
        {{ append }}
      </template>
    </ui-input>
    </ui-input>
  </div>
</template>

<script>
/* eslint-disable no-underscore-dangle */

import UiInput from './UiInput/Index.vue'

export default {
  name: 'UiInputPassWord',
  components: {
    UiInput
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
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
    }
  },
  computed: {
    _placeholder() {
      const { placeholder, label } = this
      if (placeholder === false) { return '' }
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
      return !!((maxlength) && showWordLimit !== false)
    }
  }
}
</script>
