<script>
import tableDatasource from '@/components/Attributes/collapse/Datasource/tableDatasource'
import {
  getChildIndex
} from '@/components/generator/configOperator'

export default {
  name: 'ListPickerDatasource',
  extends: tableDatasource,
  watch: {
    'activeData.searchData': {
      deep: true,
      handler(searchData) {
        const tableIndex = 0
        this.$set(this.activeData.children[tableIndex], 'searchData', searchData)
      }
    },
    'activeData.searchOption': {
      deep: true,
      handler(searchOption) {
        const tableIndex = 0
        this.$set(this.activeData.children[tableIndex], 'searchOption', searchOption)
      }
    },
    'activeData.options': {
      deep: true,
      handler(options) {
        const tableIndex = 0
        this.$set(this.activeData.children[tableIndex], 'options', options)
      }
    },


    // WARN: 缺少组件对应的属性模块。下面数据其实不应该不在数据源中维护。
    'activeData.pagination': {
      deep: true,
      handler(pagination) {
        const tableIndex = 0
        this.$set(this.activeData.children[tableIndex], 'pagination', pagination)
      }
    },
    'activeData.resetBtn_allow': {
      // eslint-disable-next-line camelcase
      handler(resetBtn_allow) {
        const tableIndex = 0
        // eslint-disable-next-line camelcase
        this.$set(this.activeData.children[tableIndex], 'resetBtn_allow', !!resetBtn_allow)
      }
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
        this.setSpecialTable()
      }
    },

    handleClear() {
      this.setTableConf()
      this.setSpecialTable()
    },

    setSpecialTable() {
      const {
        activeData
      } = this
      const {
        vModel,
        dataSource,
        defaultValue
      } = activeData
      const tableIndex = 0
      this.$set(activeData.children, tableIndex, {
        ...activeData.children[tableIndex],
        _parentFieldId: vModel,
        dataSource,
        defaultValue
      })
      this.$delete(activeData, 'defaultValue')
    }
  }
}
</script>
