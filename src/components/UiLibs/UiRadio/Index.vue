<template>
  <el-radio-group
    v-model.trim="value"
    :required="!!required"
    :disabled="!!disabled"
    :size="size"
    @change="handleChange"
  >
    <template v-if="type==='button'">
      <el-radio-button v-for="(item, index) in options" :key="index" :label="item.value" :disabled="item.disabled" :border="border">
        {{ item.label }}
      </el-radio-button>
    </template>
    <template v-else>
      <el-radio v-for="(item, index) in options" :key="index" :label="item.value" :disabled="item.disabled" :border="border">
        {{ item.label }}
      </el-radio>
    </template>
  </el-radio-group>
</template>

<script>
export default {
  name: 'UiRadio',
  componentName: 'UiRadio',
  props: {
    keyValue: {
      type: String,
      default: ''
    },
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
    type: {
      type: String,
      default: ''
    },
    conf: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
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
