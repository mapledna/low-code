import { defaultDataSource } from '../utils.js'

export default Object.freeze({
  label: '富文本',
  tag: 'richtext-editor',
  layout: 'colFormItem',
  tagIcon: 'richtext-editor', // 该控件对应的图标
  showLabel: true,
  defaultValue: '<div><span style="color: #c0c4cc;">这里是设计器的示例文字，运行时不会显示</span></div>', // 默认值
  $click: '', // 点击事件
  height: 300,
  readonly: false,
  required: false,
  regList: [],
  changeTag: true,
  document: 'https://element.eleme.cn/#/zh-CN/component/button'
})
