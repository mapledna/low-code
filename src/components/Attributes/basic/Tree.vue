<template>
  <el-tree
    :data="treeData"
    :show-checkbox="showCheckbox"
    node-key="id"
    :default-expand-all="defaultExpandAll"
    :default-expanded-keys="defaultExpandedKeys"
    :accordion="accordion"
    :draggable="draggable"
    @node-click="nodeClick"
    @check="checkNode"
  />
</template>

<script>
import BasicRelate from '../collapse/relate/BasicRelate'

export default {
  name: 'UiTree',
  extends: BasicRelate,
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    defaultExpandedKeys: {
      type: Array,
      default() {
        return []
      }
    },
    accordion: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeData: this.data
    }
  },
  watch: {
    data: {
      handler(val) {
        this.treeData = val
      }
    }
  },
  methods: {
    loadData(params) {
      console.log('loadData', params)
      this.treeData = [
        {
          id: 1,
          value: 1,
          label: '选项1',
          children: [{
            id: 2,
            value: 2,
            label: '选项1-1'
          }]
        },
        {
          id: 3,
          value: 3,
          label: '选项2',
          children: [{
            id: 4,
            value: 4,
            label: '选项2-1'
          }]
        }
      ]
    },
    nodeClick(node) {
      console.log('nodeClick：', node.value)
      this.$emit('mode-click', node.value)
      this.basicDataChange(node.value)
    },
    checkNode(value) {
      console.log('checkNode：', value)
      this.$emit('check', value)
    }
  }
}
</script>

<style>
</style>
