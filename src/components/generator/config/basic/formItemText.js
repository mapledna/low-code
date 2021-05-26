import { copyConf, defaultDataSource, defaultRelate } from '../utils.js'

export default Object.freeze({
  label: '表单详情项',
  tag: 'formItemText',
  layout: 'colFormItem',
  tagIcon: 'formItemText',
  span: 24,
  showLabel: true,
  labelWidth: null,
  labelKey: 'label',
  valueKey: 'value',
  childrenKey: 'children',
  style: { width: '100%' },
  modelValue: '', // 数据值
  errValue: undefined, // 异常值
  options: [],
  dataSource: copyConf(defaultDataSource),
  relate: copyConf(defaultRelate),
  searchData: [], // 记录被动控件中关联上级的字段
  changeTag: true
})
