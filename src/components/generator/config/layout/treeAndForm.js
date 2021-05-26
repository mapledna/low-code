import { copyConf, defaultLayoutConf } from '../utils.js'
import rowContainer, { leftChildRow, centerChildRow } from './rowContainer.js'
import formContainer from './formContainer.js'
import elTree from '../basic/el-tree.js'
/**
 * 结构：
 * |- （布局容器）
 *     |- （header）
 *     |- （aside）
 *     |- （main）
 *         |- 空行（leftChild）
 *             |- 树
 *         |- 表单（centerChild）
 *     |- （footer）
 */

export default Object.freeze({
  ...rowContainer,
  label: '树+表单',
  layout: 'treeAndForm',
  tagIcon: 'treeAndForm',
  children: [
    {
      ...leftChildRow,
      children: [
        {
          ...elTree
        }
      ]
    },
    {
      ...centerChildRow,
      ...formContainer
    }
  ]
})
