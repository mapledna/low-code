/* 可视化编辑静态数据 */
<template>
  <div>
    <el-form-item label="">
      <el-tree
        draggable
        :data="staticData"
        node-key="id"
        :expand-on-click-node="false"
        :render-content="renderContent"
      />
      <div style="margin-left: 20px">
        <el-button
          style="padding-bottom: 0"
          icon="el-icon-circle-plus-outline"
          type="text"
          @click="showTreeDialog()"
        >
          添加
        </el-button>
      </div>
    </el-form-item>

    <treeNode-dialog
      :visible.sync="dialogVisible"
      title="添加选项"
      @commit="addStaticItem"
    />
  </div>
</template>

<script>
import TreeNodeDialog from '@/views/designer/TreeNodeDialog'

export default {
  name: 'EditJsonData',
  components: {
    TreeNodeDialog
  },
  props: {
    activeData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {},
  methods: {
    // TODO: 有bug，数据结构还需要整理
    renderContent(h, { node, data, store }) {
      return (
        <div class="custom-tree-node">
          <span>{node.label}</span>
          <span class="node-operation">
            <i
              on-click={() => this.showTreeDialog(data)}
              class="el-icon-plus"
              title="添加"
            ></i>
            <i
              on-click={() => this.removeStaticItem(node, data)}
              class="el-icon-delete"
              title="删除"
            ></i>
          </span>
        </div>
      )
    },
    showTreeDialog(parentItem) {
      if (parentItem) {
        !parentItem.children && this.$set(parentItem, 'children', [])
        this.currentStaticItem = parentItem.children
      } else {
        this.currentStaticItem = this.staticData
      }
      this.dialogVisible = true
    },
    removeStaticItem(node, data) {
      const { parent } = node
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    addStaticItem(data) {
      this.currentStaticItem.push(data)
    }
  }
}
</script>
