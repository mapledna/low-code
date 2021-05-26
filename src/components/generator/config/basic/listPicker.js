import { copyConf, defaultDataSource, defaultRelate } from '../utils.js'
import elTable from './el-table.js'

export default Object.freeze({
  label: '列表弹窗选择',
  tag: 'listPicker',
  changeTag: true,
  layout: 'colFormItem',
  tagIcon: 'listPicker',
  span: 24,
  showLabel: true,
  labelWidth: null,
  required: true,
  labelKey: 'name',
  valueKey: 'id',
  style: { width: '100%' },
  pickerWidth: '700px',
  pickerHeight: '400px', // WARN: 目前并不是弹窗高度，直接用于设置表格高度。
  defaultValueType: '', // 默认值类型
  defaultValue: undefined,
  dataSource: copyConf(defaultDataSource),
  relate: copyConf(defaultRelate),
  searchData: [], // 记录被动控件中关联上级的字段
  // 拷贝到 listPickerTable
  pagination: {
    ...elTable.pagination,
    pageSize: 10,
    pageSizes: '5,10,15,20'
  },
  searchOption: [],
  options: [],
  children: [
    {
      ...elTable,
      _key: 'listPickerTable',
      _canCopy: false,
      _canDelt: false,
      _canClick: false,
      defaultValue: [],
      options: [],
      size: 'mini',
      resetBtn_allow: false,
      topEdit: {
        show: false
      },
      editRow: {
        show: false
      }
    }
  ]
})
