<template>
  <el-select
    :value="value"
    :placeholder="placeholder"
    :filterable="filterable"
    :multiple="multiple"
    :style="domStyle"
    @change="handleSelectChange"
  >
    <el-option
      v-for="(item, index) in options"
      :key="index"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
import BasicRelate from '../collapse/relate/BasicRelate'

export default {
  name: 'UiSelect',
  extends: BasicRelate,
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    filterable: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    domStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    domOptions: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      options: this.domOptions
    }
  },
  watch: {
    domOptions: {
      handler(val) {
        console.log('watch', val)
        this.options = this.domOptions
      }
    }
  },
  methods: {
    loadData(params) {
      console.log('loadData', params)
      this.options = [
        { label: '值1', value: '1' },
        { label: '值2', value: '2' },
        { label: '值3', value: '3' },
        { label: '值4', value: '4' }
      ]
      // console.log('this.domOptions', this.domOptions)
    },
    handleSelectChange(value) {
      console.log('下拉值：', value)
      this.$emit('input', value)
      this.$emit('change', value)
      this.basicDataChange(value)
    }
  }
}
</script>

<style>
</style>
