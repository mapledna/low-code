import { copyConf, defaultDataSource, defaultRelate } from '../utils.js'
import elButton from '../basic/el-button.js'
import rowFormItem from './rowFormItem.js'

/**
 * 结构：
 * |- （表单）
 *     |- 空行
 *         |- （自动渲染的表单组件）
 *     |- 保存按钮
 *     |- 保存并关闭按钮
 *     |- 取消
 */

export default Object.freeze({
  isNewId: true,
  label: '表单控件',
  // layout: 'formContainer' 的特殊性：
  // 1. 用于判断是否展示表单数据源。
  // 2. js中直接通过initData取值。常规逻辑：`${activeData.vModel}.initData`
  // 3. js中直接通过initDataId作为初始数据源id。常规逻辑：activeData.dataSource.listId
  layout: 'formContainer',
  tagIcon: 'formContainer',
  type: 'default',
  justify: 'start',
  align: 'top',
  layoutTree: true,
  document: 'https://element.eleme.cn/#/zh-CN/component/container',
  span: 24,
  gutter: undefined,
  relate: copyConf(defaultRelate),
  dataSource: copyConf(defaultDataSource),
  dataType: 'dynamic',
  searchData: [],
  // "initDataOptions": [], // NOTE: 代码会添加这个属性
  createDataId: '',
  createData: [],
  editDataId: '',
  editData: [],
  initDataId: '',
  children: [
    {
      ...rowFormItem,
      _key: 'formItemRow',
      span: 24
    },
    {
      ...elButton,
      style: {
        ...elButton.width,
        width: '150px'
      },
      _key: 'saveFormBtn',
      span: 6,
      type: 'primary',
      'prefix-icon': 'el-icon el-icon-finished',
      defaultValue: '保存',
      $click: 'saveForm',
      nativeType: 'submit'
    },
    {
      ...elButton,
      style: {
        ...elButton.width,
        width: '150px'
      },
      _key: 'saveAndCloseFormBtn',
      span: 6,
      type: 'primary',
      'prefix-icon': 'el-icon el-icon-bottom-right',
      defaultValue: '保存并关闭',
      $click: 'saveAndCloseForm'
    },
    {
      ...elButton,
      style: {
        ...elButton.width,
        width: '150px'
      },
      _key: 'cancelFormBtn',
      span: 6,
      type: 'info',
      'prefix-icon': 'el-icon el-icon-back',
      defaultValue: '取消',
      $click: 'cancelForm'
    }
  ]
})
