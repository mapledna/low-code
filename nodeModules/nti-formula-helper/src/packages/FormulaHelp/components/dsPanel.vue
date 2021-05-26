<template>
  <div class="full-panel">
    <div class="full-panel_head">数据源</div>
    <topTool @filter="handleInputFilter" />
    <el-tree
      class="full-panel_body"
      ref="tree"
      :props="treeProps"
      :node-key="treeNodeKey"
      :data="treeData"
      highlight-current
      :filter-node-method="handleTreeFilter"
      auto-expand-parent
      :default-expand-all="false"
      @node-click="handleInsert"
    >
      <span slot-scope="{ node, data }">
        <span :title="data[treeLabelKey]">
          <el-tooltip
            :open-delay="500"
            v-if="data[typeKey] === 'result'"
            content="插入数据信息"
          >
            <el-button
              type="text"
              size="mini"
              @click.stop="() => handleInsert(data, node)"
              style="margin-right: 5px"
            >
              <i class="el-icon el-icon-plus" />
            </el-button>
          </el-tooltip>
          <i v-else :class="data[treeIconKey]" />
          &nbsp;{{ data[treeLabelKey] }}
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import topTool from './topTool.vue'

export default {
  components: {
    topTool,
  },

  props: {
    treeData: {
      type: Array,
      default: () => [],
    },
    treeProps: {
      type: Object,
      default: () => Object.freeze({
        key: 'id',
        label: 'label',
        children: 'children',
        type: 'type', // NOTE: type==='result' 的数据才允许被选中
        iconClass: 'iconClass',
        formula: 'id',
      }),
    },
  },

  data() {
    return {
      filterText: '',
    }
  },

  computed: {
    treeNodeKey() {
      return this.treeProps.key
    },
    treeLabelKey() {
      return this.treeProps.label
    },
    typeKey() {
      return this.treeProps.type
    },
    formulaKey() {
      return this.treeProps.formula
    },
    treeIconKey() {
      return this.treeProps.iconClass
    },
  },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },

  methods: {
    handleInputFilter(name) {
      this.filterText = name
    },

    handleTreeFilter(value, data) {
      if (!value) return true
      const upperValue = value.toUpperCase()
      return (
        data[this.treeLabelKey].toUpperCase().indexOf(upperValue) !== -1
      )
    },

    handleInsert(data, node) {
      if (data[this.typeKey] === 'result') {
        this.$emit('insert', data[this.formulaKey] || data[this.treeNodeKey])
      }
    },
  },
}
</script>
