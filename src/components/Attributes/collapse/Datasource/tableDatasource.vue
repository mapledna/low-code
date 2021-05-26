<template>
  <baseDs :active-data="activeData" :exclude-type="['dict', 'data']" :show-param-list="false"
          @changeDataSource="handleChange" @clearDataSource="handleClear"
  />
</template>

<script>
import baseDs from '@/components/Attributes/collapse/Datasource/baseDs'
import {
  getTableConf,
  getTableExportBtnDs,
  getTableSetColBtn
} from '@/components/generator/autoGenerate/methods-table'
import {
  getFirstRow,
  getChildItem,
  getChildIndex
} from '@/components/generator/configOperator'

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
    async handleChange(type, dsId, dsOpts) {
      if (type === 'url' || type === 'microservice') {
        await this.setTableConf({
          sourceId: dsId,
          type,
          ...dsOpts
        })
        this.setExportBtn(dsOpts.search)
        this.setSetColBtn(dsOpts.result)
      }
    },

    handleClear() {
      this.setTableConf()
      this.setExportBtn()
      this.setSetColBtn()
    },

    /**
     * 修改数据后，设置表格组件配置
     * @param {Object} conf 包含数据 sourceId、search、result、filterMap、type
     * NOTE: 参考 src\components\generator\autoGenerate\methods.js 中的 setDataSource 方法
     */
    async setTableConf(conf) {
      const {
        activeData
      } = this
      const {
        searchOption = [],
        options = [],
        defaultValue = []
      } = conf ? await getTableConf({
        ...conf,
        pagination: activeData.pagination
      }) : {}
      // 表格搜索条件选项列表和数据条件
      this.$set(this.activeData, 'searchOption', searchOption)
      // 表格列相关的格式化数据
      this.$set(this.activeData, 'options', options)
      // 表格示例数据 // TODO: 1. 换一个字段 2. 控制数据量
      this.$set(this.activeData, 'defaultValue', defaultValue)
    },

    /**
     * 表格导出按钮
     */
    setExportBtn(searchParamList = []) {
      const {
        activeData
      } = this
      const topRow = getChildItem(activeData, 'topRow')
      // const topRow = getFirstRow(activeData)
      if (!topRow) {
        return
      }
      // NOTE: 不能用 setChildByKey 赋值。数据不能双向绑定。
      const btnIndex = getChildIndex(topRow, 'exportExcelBtn')
      if (btnIndex < 0) {
        return
      }
      const btnInfo = topRow.children[btnIndex]
      const dsInfo = getTableExportBtnDs(activeData, searchParamList)
      this.$set(topRow.children, btnIndex, {
        ...btnInfo,
        ...dsInfo,
        dataSource: {
          ...btnInfo.dataSource,
          ...dsInfo.dataSource
        }
      })
    },

    /**
     * 表格设置列按钮
     */
    setSetColBtn(colList = []) {}
  }
}
</script>
