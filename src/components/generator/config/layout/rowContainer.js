import { copyConf, defaultLayoutConf } from '../utils.js'
import rowFormItem from './rowFormItem.js'

export const leftChildRow = Object.freeze({
  ...rowFormItem,
  tabValue: 'leftChild',
  span: 24
})
export const centerChildRow = Object.freeze({
  ...rowFormItem,
  tabValue: 'centerChild',
  span: 24
})

/**
 * 结构：
 * |- （布局容器）
 *     |- （header）
 *     |- （aside）
 *     |- （main）
 *         |- 空行（leftChild）
 *         |- 空行（centerChild）
 *     |- （footer）
 */

export default Object.freeze({
  label: '布局容器',
  layout: 'rowContainer',
  tagIcon: 'rowContainer',
  layoutTree: true, // 布局树
  mainStyle: copyConf(defaultLayoutConf.mainStyle),
  aside: true,
  asideStyle: copyConf(defaultLayoutConf.asideStyle),
  header: false,
  headerStyle: copyConf(defaultLayoutConf.headerStyle),
  footer: false,
  style: {
    height: '100%'
  },
  gutter: undefined,
  document: 'https://element.eleme.cn/#/zh-CN/component/container',
  children: [leftChildRow, centerChildRow]
})
