<template>
  <baseDs :active-data="activeData" @changeDataSource="handleChange" @clearDataSource="handleClear" />
</template>

<script>
import baseDs from '@/components/Attributes/collapse/Datasource/baseDs'
import {
  addFormComponent
} from '@/components/generator/autoGenerate/methods-form'
import { getFirstRow } from '@/components/generator/configOperator'

export default {
  components: {
    baseDs
  },
  props: {
    activeData: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    handleChange(type, dsId, dsOpts) {
      const { activeData } = this
      const { result, filterMap } = dsOpts
      // 清空已渲染的表单组件
      this.clearFormItems()
      // 添加表单中的组件
      addFormComponent(result, filterMap, activeData, {
        readonly: true,
        errValue: activeData.errValue
      })
      this.setRelate(result)
    },

    handleClear(type) {
      // 清空已渲染的表单组件
      this.clearFormItems()
    },

    setRelate(result) {
      const { activeData } = this
      const thisId = activeData.componentName

      // 为当前组件添加表单信息
      const valueKeyMap = {}
      result.forEach(item => {
        valueKeyMap[item.value] = null
      })
      this.$set(activeData, 'formDetailData', valueKeyMap)

      // 为表单组件添加当前组件id
      const formFirstRow = getFirstRow(activeData)
      formFirstRow.children.forEach(resultComponent => {
        // eslint-disable-next-line no-underscore-dangle
        resultComponent._parentFieldId = thisId
      })
    },
    /**
     * 清空已渲染的表单组件
     */
    clearFormItems() {
      const { activeData } = this
      const formFirstRow = getFirstRow(activeData)
      if (formFirstRow) { formFirstRow.children = [] }
    }
  }
}
</script>
