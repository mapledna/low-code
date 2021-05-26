import { copyConf, defaultDataSource, defaultRelate } from '../utils.js'
import elTable from '../basic/el-table.js'
import rowFormItem from './rowFormItem.js'
// import tabContainer from './tabContainer.js'
import tabContainer, { tabContainerRow } from './tabContainer.js'

/**
 * 结构：
 * |-（主从表控件）
 *     |- 表格
 *     |- （选项卡）
 *         |- 空行
 *             |- 表格
 */

export default Object.freeze({
  label: '主从表控件',
  tagIcon: 'tableContainer',
  layout: 'tableContainer',
  type: 'default',
  justify: 'start',
  align: 'top',
  layoutTree: true,
  options: [], // 编辑页面的初始赋值字段
  span: 24,
  gutter: undefined,
  document: 'https://element.eleme.cn/#/zh-CN/component/container',
  children: [
    {
      ...elTable,
      height: 250
    },
    {
      ...tabContainer,
      childType: 'table', // 选项卡子级需要自动填充的组件类别
      children: [{
        ...tabContainerRow,
        children: [{
          ...elTable,
          height: 250
        }]
      }]
    }
  ]
})
