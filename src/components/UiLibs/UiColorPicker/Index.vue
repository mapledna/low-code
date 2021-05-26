<template>
  <el-color-picker
    v-model.trim="value"
    :required="!!required"
    :disabled="!!disabled"
    :size="size"
    :show-alpha="showAlpha"
    @change="handleChange"
  />
</template>

<script>
export default {
  name: 'UiColorPicker',
  componentName: 'UiColorPicker',
  props: {
    value: {
      type: [String, Number],
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
    size: {
      type: String,
      default: 'medium'
    },
    showAlpha: {
      type: Boolean,
      default: true
    },
    conf: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
  },
  methods: {
    handleChange(...arg) {
      this.$emit('handleChange', ...arg)
    }
  }
}
</script>
