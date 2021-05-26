import { defaultDataSource } from '../utils.js'

export default Object.freeze({
  label: '按钮',
  tagIcon: 'button', // 该控件对应的图标
  tag: 'el-button',
  layout: 'colFormItem',
  showLabel: false,
  changeTag: false,
  document: 'https://element.eleme.cn/#/zh-CN/component/button',
  defaultValue: '按钮', // 默认值
  nativeType: 'button', // 按钮原生类型 'button'|'submit'|'reset'
  dataSource: defaultDataSource,
  // === 样式相关 ===
  type: 'primary', // 颜色类型
  enterClick: false, // enter键触发按钮事件
  plain: false, // 整体按钮类型 朴素
  round: false, // 整体按钮类型 圆角
  size: 'medium', // 尺寸
  style: { width: '100px', display: 'inline-block' }, // 样式
  'prefix-icon': '', // 前图标
  'suffix-icon': '', // 后图标
  isLockPage: false, // 请求时是否锁定整个页面

  // === 可用性相关 ===
  invisible: false,
  invisible_fnBody: '',
  disabled: false,
  disabled_fnBody: '',
  disabled_fnName: '',

  visible_allow: false,
  visible_fn: '', // 显示/隐藏的方法 NOTE: 原名 displayFn。保持原逻辑，返回 true 时展示，注意与 invisible 取反。

  available_allow: false,
  available_fn: '', // 禁用/启用方法 NOTE: 原名 disabledFn

  // === 事件、联动 ===
  relateData: '', // 需要上传或者下载哪一个控件的数据
  $click: '', // 点击事件
  beforeClickFn: '' // 按钮点击前事件 NOTE: 原名 beforeClickFn
})
