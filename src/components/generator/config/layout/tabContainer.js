import { copyConf, defaultRelate } from '../utils.js'
import rowFormItem from './rowFormItem.js'

// WARN:TODO: fillContainer(val, null, val.options[0].value)
// 用 val.options[0].value 作为 tabValue

const tabOptions = [
  {
    label: '选项一',
    value: 1
  }
]

export const tabContainerRow = Object.freeze({
  ...rowFormItem,
  tabValue: tabOptions[0].value,
  span: 24
})

/**
 * 结构：
 * |- （选项卡）
 *     |- 空行
 */

export default Object.freeze({
  label: '选项卡',
  // tag: 'el-tabs',
  tagIcon: 'tabContainer',
  layout: 'tabContainer',
  justify: 'start',
  align: 'top',
  type: 'card',
  childType: '', // 选项卡子级需要自动填充的组件类别
  closable: false, // 是否可关闭
  tabPosition: 'top',
  activeName: '0', // 初始显示的tab项的index
  options: tabOptions,
  relate: copyConf(defaultRelate),
  searchData: [{ value: 'value' }], // 搜索条件对应的搜索框、被动控件的关联字段
  regList: [],
  document: '',
  span: 24,
  gutter: undefined,
  children: [tabContainerRow]
})
