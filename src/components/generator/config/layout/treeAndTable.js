import { copyConf, defaultLayoutConf } from '../utils.js'
import rowContainer, { leftChildRow, centerChildRow } from './rowContainer.js'
import elTree from '../basic/el-tree.js'
import elTable from '../basic/el-table.js'
/**
 * 结构：
 * |- （布局容器）
 *     |- （header）
 *     |- （aside）
 *     |- （main）
 *         |- 空行（leftChild）
 *             |- 树
 *         |- 空行（centerChild）
 *             |- 表格
 *     |- （footer）
 */

export default Object.freeze({
  ...rowContainer,
  label: '树+表格',
  layout: 'treeAndTable',
  tagIcon: 'treeAndTable',
  children: [{
    ...leftChildRow,
    children: [
      {
        ...elTree
      }
    ]
  },
  {
    ...centerChildRow,
    children: [
      {
        ...elTable
      }
    ]
  }]
})
