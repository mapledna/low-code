import { copyConf, defaultDataSource, defaultRelate } from '../utils.js'
import title from '../basic/title.js'
import divider from '../basic/divider.js'
import rowFormItem from './rowFormItem.js'

/**
 * 结构：
 */

export default Object.freeze({
  label: '详情信息', // 组件名
  layout: 'formDetail',
  tagIcon: 'formDetail',
  type: 'default',
  justify: 'start',
  align: 'top',
  layoutTree: true,
  document: 'https://element.eleme.cn/#/zh-CN/component/container',
  span: 24,
  gutter: undefined,
  errValue: '（无数据）', // 异常信息。TODO: 向下注入。目前只在选中数据源时有效，自动注入子组件。之后修改无效。
  relate: copyConf(defaultRelate),
  dataSource: copyConf(defaultDataSource),
  dataType: 'dynamic',
  searchData: [],
  // "initDataOptions": [], // NOTE: 代码会添加这个属性
  initDataId: '',
  children: [
    {
      ...title,
      modelValue: '详情信息' // 标题
    },
    {
      ...divider,
      content: '' // 分割线标题
    },
    {
      ...rowFormItem,
      span: 24
    }
  ]
})
