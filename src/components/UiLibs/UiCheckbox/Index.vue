<template>
  <el-checkbox-group
    v-model.trim="value"
    :required="!!required"
    :disabled="!!disabled"
    :size="size"
    @change="handleChange"
  >
    <template v-if="type==='button'">
      <el-checkbox-button v-for="(item, index) in options" :key="index" :label="item.value" :disabled="item.disabled" :border="border">
        {{ item.label }}
      </el-checkbox-button>
    </template>
    <template v-else>
      <el-checkbox v-for="(item, index) in options" :key="index" :label="item.value" :disabled="item.disabled" :border="border">
        {{ item.label }}
      </el-checkbox>
    </template>
  </el-checkbox-group>
</template>

<script>
export default {
  name: 'UiCheckbox',
  componentName: 'UiCheckbox',
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
    border: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium'
    },
    type: {
      type: String,
      default: ''
    },
    conf: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      options: [
        {
          label: '选项一',
          value: 1
        },
        {
          label: '选项二',
          value: 2
        }
      ]
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
