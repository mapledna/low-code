<template>
  <el-switch
    v-model.trim="value"
    :required="!!required"
    :disabled="!!disabled"
    @change="handleChange"
  />
</template>

<script>
export default {
  name: 'UiSwitch',
  componentName: 'UiSwitch',
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
    conf: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
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
