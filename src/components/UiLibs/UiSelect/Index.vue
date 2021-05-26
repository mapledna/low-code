<template>
  <el-select
    v-model.trim="value"
    :type="type"
    :placeholder="_placeholder"
    :filterable="filterable"
    :multiple="multiple"
    :readonly="!!readonly"
    :required="!!required"
    :disabled="!!disabled"
    :clearable="!!clearable"
    :allow-create="allowCreate"
    :size="size"
    @focus="handleFocus"
    @blur="handleBlur"
    @change="handleChange"
  >
    <template v-if="type==='default'">
      <el-option
        v-for="item in tagList"
        :key="item.value"
        :label="item.label"
        :value="item.tagIcon"
      />
    </template>
    <template v-if="type==='group'">
      <el-option-group v-for="group in tagList" :key="group.label" :label="group.label">
        <el-option
          v-for="item in group.options"
          :key="item.value"
          :label="item.label"
          :value="item.tagIcon"
        >
          <svg-icon class="node-icon" :icon-class="item.tagIcon" />
          <span> {{ item.label }}</span>
        </el-option>
      </el-option-group>
    </template>
  </el-select>
</template>

<script>
export default {
  name: 'UiSelect',
  componentName: 'UiSelect',
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
      default: 'default'
    },
    filterable: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
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
    allowCreate: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium'
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
    // eslint-disable-next-line no-underscore-dangle
    _placeholder() {
      // console.log(2121, this)
      // const { placeholder, label } = this.conf
      // if (placeholder === false) {
      //   return ''
      // }
      return this.placeholder || `请选择${this.label}`
    },
    tagList() {
      if (this.type === 'default') {
        return this.options
      }
      return [
        {
          label: '基础组件',
          options: this.options
        }
      ]
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
