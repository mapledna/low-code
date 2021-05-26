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
export default {
  name: 'UiTree',
  componentName: 'UiTree',
  props: {
    // value: {
    //   tyle: [String, Number],
    //   default: ''
    // },
    treeData: {
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
    },
    conf: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {

    }
  },
  computed: {
  },
  methods: {
    /**
     * node 节点所对应的对象
     * parentNode 节点对应的 Node,包括父节点和当前节点
     */
    nodeClick(node, parentNode) {
      // console.log('nodeClick：', node)
      this.$emit('nodeClick', node, parentNode)
      // this.basicDataChange(node.value)
    },
    checkNode(value) {
      console.log('checkNode：', value)
      this.$emit('check', value)
    }
  }
}
</script>
