import { copyConf, defaultDataSource, defaultRelate } from '../utils.js'
import iframe from '../basic/iframe.js'
import rowContainer, { leftChildRow, centerChildRow } from './rowContainer.js'
import ntiMenu from '../basic/menu.js'
import tabContainer, { tabContainerRow } from './tabContainer.js'

/**
 * 结构：
 * |- （布局容器）
 *     |- （header）
 *     |- （aside）
 *     |- （main）
 *         |- 空行（leftChild）
 *             |- 菜单
 *         |- 空行（centerChild）
 *             |- 选项卡
 *                 |- 空行
 *                     |- iframe
 *     |- （footer）
 */

export default Object.freeze({
  ...rowContainer,
  label: '菜单+选项卡',
  layout: 'menuAndTab',
  tagIcon: 'menuAndTab',
  children: [{
    ...leftChildRow,
    children: [
      {
        ...ntiMenu
      }
    ]
  },
  {
    ...centerChildRow,
    children: [
      {
        ...tabContainer,
        childType: 'table', // 选项卡子级需要自动填充的组件类别
        children: [{
          ...tabContainerRow,
          children: [iframe]
        }]
      }
    ]
  }]
})
