<template>
  <div class="comboTree">
    <el-popover
      v-model="popoverVisible"
      placement="top-start"
      transition="fade-in-linear"
      :trigger="triggerType"
      @show="popoverShow"
      @hide="popoverHide"
    >
      <el-tree
        ref="nticombotree"
        :node-key="nodeKey"
        :props="{ label: labelKey, children: childrenKey }"
        :data="treeData"
        :accordion="accordion"
        :draggable="draggable"
        :show-checkbox="showCheckbox"
        :default-expand-all="defaultExpandAll"
        :default-expanded-keys="[value]"
        :highlight-current="highlightCurrent"
        @node-click="handleNodeClick"
      >
        <span slot-scope="{ node, data }"
              :title="data[labelKey]"
              :class="{
                'is-disabled': data[disabledKey]
              }"
        >
          <i v-if="data[iconKey]" :class="data[iconKey]" />
          {{ data[labelKey] }}
        </span>
      </el-tree>
      <el-input
        v-if="displayType === 'input'"
        slot="reference"
        :value="treeLabel"
        :size="size"
        :style="{ width: width }"
        :placeholder="placeholder"
        clearable
        :suffix-icon="suffixIcon"
        @focus="inputFocus"
        @blur="inputBlur"
        @clear="inputClear"
      />
      <div
        v-else
        slot="reference"
        :style="{ width: width, display: 'flex', 'align-items': 'center' }"
        @focus="inputFocus"
      >
        <label>{{ treeLabel || placeholder || '--' }}</label>
        <i :class="suffixIcon" :style="{ margin: '0 8px 0 auto' }" />
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'ComboTree',
  props: {
    value: { // 树形单选下拉框的初始值
      type: [String, Number],
      default: ''
    },
    data: { // 传入的数据 默认是一维数组  也可以是树状结构（树状结构则将isTransferData传入false）
      type: Array,
      default() {
        return []
      }
    },
    isTransferData: { // 是否转换传入的数据  将一维数组转为树状结构
      type: Boolean,
      default: true
    },
    width: { // 宽度
      type: String,
      default: '100%'
    },
    parentKey: { // 父结点id对应的值
      type: String,
      default: 'pid'
    },
    nodeKey: { // 结点id对应的值
      type: String,
      default: 'id'
    },
    labelKey: { // label对应的值
      type: String,
      default: 'label'
    },
    valueKey: { // 选中后返回的值
      type: String,
      default: 'id'
    },
    childrenKey: { // children对应的值
      type: String,
      default: 'children'
    },
    disClickKey: { // 不响应点击事件对应的值，为真值时不响应。不影响展示。
      type: String,
      default: 'disClick'
    },
    disabledKey: { // 禁用项对应的值，为真值时禁用。展示为灰色，且不响应点击事件。
      type: String,
      default: 'disabled'
    },
    iconKey: { // 字体图标对应的值
      type: String,
      default: 'icon'
    },
    showCheckbox: { // 是否显示Checkbox
      type: Boolean,
      default: false
    },
    defaultExpandAll: { // 是否默认展开全部
      type: Boolean,
      default: false
    },
    highlightCurrent: { // 当前行高亮
      type: Boolean,
      default: false
    },
    accordion: { // 是否每次只打开一个同级树节点展开
      type: Boolean,
      default: true
    },
    draggable: { // 可拖拽
      type: Boolean,
      default: false
    },
    displayType: { // 展示方式。'input'编辑框|'label'文本
      type: String,
      default: 'input'
    },
    triggerType: { // 触发下拉的行为。'click'|'hover'|'focus'
      type: String,
      default: 'click'
    },
    placeholder: { // 默认文本
      type: String,
      default: '请选择'
    },
    size: { // 尺寸大小
      type: String,
      default: 'small'
    },
    showRoot: { // 显示根节点
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      suffixIcon: 'el-icon-arrow-down',
      treeLabel: '',
      popoverVisible: false // 点击树下拉的节点隐藏树下拉
    }
  },
  computed: {
    treeData() {
      if (this.isTransferData) {
        return this.arrayToTree(this.data, this.parentKey, this.nodeKey, this.childrenKey, this.showRoot)
      }
      return this.data
    }
  },
  watch: {
    value: {
      handler(val) {
        this.getLabelByKey()
      }
    },
    treeData: {
      handler(val) {
        this.getLabelByKey()
      }
    }
  },
  mounted() {
    this.getLabelByKey()
  },
  methods: {

    getNodeKeyByValue(value) {
      const { valueKey, nodeKey } = this
      if (valueKey === nodeKey) {
        return value
      }
      const node = this.data.find(item => item[valueKey] === value)
      return node ? node[nodeKey] : ''
    },

    // 通过el-tree控件内置的方法用id获取label
    getLabelByKey() {
      if (this.data.length === 0) {
        this.treeLabel = ''
      } else {
        this.$nextTick(() => {
          this.$refs.nticombotree.setCurrentKey(this.getNodeKeyByValue(this.value))

          if (!this.value && this.value !== 0) {
            this.treeLabel = ''
          } else {
            const curNode = this.$refs.nticombotree.getCurrentNode()
            this.treeLabel = curNode ? curNode[this.labelKey] || this.value : this.value
          }
        })
      }
    },
    // 节点点击事件
    handleNodeClick(data) {
      if (data[this.disClickKey] || data[this.disabledKey]) { return }
      const label = data[this.labelKey]
      const value = data[this.valueKey]
      this.popoverVisible = false
      this.treeLabel = label || ''
      this.$emit('input', value)
      this.$emit('node-click', data, value)
    },
    // 弹出层显示
    popoverShow() {
      this.suffixIcon = 'el-icon-arrow-up'
    },
    popoverHide() {
      this.suffixIcon = 'el-icon-arrow-down'
    },
    inputFocus() {
      this.suffixIcon = 'el-icon-arrow-up'
    },
    inputBlur() {
      // this.popoverVisible = false
      // this.suffixIcon='el-icon-arrow-down'
    },
    inputClear() {
      this.popoverVisible = false
      this.treeLabel = ''
      this.$emit('input', '')
      this.$emit('node-click', {}, undefined)
    },
    // 将一维数组转化为树形结构
    arrayToTree(array, pid = 'pid', id = 'id', childrenKey = 'children', showRoot) {
      array = JSON.parse(JSON.stringify(array))
      if (!showRoot) {
        const arrayArr = (array || []).map(item => {
          if (item.pid === -1) return {}
          return item
        })
        array = arrayArr
      }
      array.splice(
        0,
        array.length,
        ...array.filter((item, i) => {
          const parent = array.find(compare => item[pid] === compare[id])
          if (parent) {
            if (!Array.isArray(parent[childrenKey])) {
              parent[childrenKey] = []
            }
            parent[childrenKey].push(item)
            return false
          }
          return true
        })
      )
      return array
    }
  }
}
</script>
<style>
.comboTree .el-input.is-disabled .el-input__inner {
  background-color: #ffffff;
  border-color: #e4e7ed;
  cursor: pointer;
}
.comboTree .el-input.is-disabled .el-input__icon {
  cursor: pointer;
}
</style>
