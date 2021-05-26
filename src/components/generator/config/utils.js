/**
 * 框架、布局树默认配置
 */
export const copyConf = obj => JSON.parse(JSON.stringify(obj))

export const defaultLayoutConf = Object.freeze({
  asideStyle: {
    width: '200px', // themeStyle['aside-width'],
    background: '' // themeStyle['aside-bg-color']
  },
  headerStyle: {
    height: '60px', // themeStyle['header-height'],
    background: '' // themeStyle['header-bg-color']
  },
  mainStyle: {
    // background: '#E9EEF3'
    background: '' // themeStyle['color-white']
  }
})

// 表单属性———页面属性
export const defaultFormConf = {
  formRef: 'elForm',
  formModel: 'formData',
  size: 'medium',
  labelPosition: 'right',
  labelWidth: 120,
  formRules: 'rules',
  gutter: 15,
  disabled: false,
  enterToTab: false, // 键盘事件 enter键执行tab键的逻辑
  span: 24,
  formBtns: false, // 是否添加提交按钮
  pageJs: ' ', // js方法字符串
  hookFnType: '', // 钩子函数类型
  hookFn: ''// 钩子函数
}

/**
 * 数据源默认配置
 */
export const defaultDataSource = Object.freeze({
  type: 'url', // 数据源类型 url|flow|data|microservice
  // NOTE: 不需要把下拉选项作为配置保存。否则导致数据量巨大且不能获得最新数据。
  // categoryOption: [], // 数据分类选项
  // listOption: [], // 数据源选项
  // flowCategoryOption: [], // 事务流选项
  categoryId: '', // 数据分类id
  listId: '', // 数据源id_code
  flowId: '', // 事务流id_code
  staticData: '', // 静态数据。type 为 data 时使用
  optionParams: {}, // 当前控件下拉、多选等异步请求需要的参数
  paramType: '', // 自定义参数的类型。''默认 | $$_fn 自定义函数 | $$_json 自定义JSON
  param_fnBody: '', // 自定义参数的函数
  param_json: '', // 自定义参数的json
  isResoveFn: false, // 是否启用成功的回调函数
  resoveFn: ''// 成功的回调函数
})

/**
 * 选项数据条件默认值
 */
export const defaultKeyCondition = Object.freeze({
  labelKey: 'label',
  valueKey: 'id',
  parentKey: 'pid',
  nodeKey: 'id',
  childrenKey: 'children'
})

/**
 * 联动默认配置
 */
export const defaultRelate = Object.freeze({
  passiveOptions: [], // 主动控件中存储的被动控件Id、类型type
  activeId: '', // 被动控件中主动控件Id
  activeOptions: [], // 被动控件中主动控件的所有字段
  fieldOptions: [] // 被动控件中关联字段对应
})

/**
 * 默认值配置（实现方式两种：1、watch监听options变化，从而赋值；2、optionparams请求到数据之后赋值 ）
 *
 * "defaultValue":{"complexType":"linkage","options":[],"value":"","formula":{"data":{"conditions":[{},{}],"innerLinkageFieldId":"selectField_kkqky1yi","linkageProp":"defaultValue","deduplication":false},"event":null}}
 *
 *"defaultValue":{"complexType":"custom","options":[],"value":{"type":"i18n","use":null,"en_US":"","zh_CN":"1313213213"}}
 */
export const defaultValue = Object.freeze({
  type: '', // 默认值类型  无''、自定义输入custom、其他else（值转换方法）
  options: [], // 默认数组参数
  value: '' // 具体某个值
  // field: '' // 默认值对应的字段
})


/**
 * 表单控件类型
 * NOTE: type 对应组件配置中的 tagIcon
 * WARN: 但 code 为 16、17 的组件是之后增加的。组件库中没有对应的组件。
 */
export const widgetConfArr = [
  {
    code: '0',
    type: 'invisible',
    // tag: 'el-input',
    // trigger: 'blur'
    label: '隐藏文本'
  },
  {
    code: '1',
    type: 'input',
    // tag: 'el-input',
    // trigger: 'blur'
    label: '单行输入'
  },
  {
    code: '2',
    type: 'number',
    // tag: 'el-input-number',
    // trigger: 'blur'
    label: '数字输入'
  },
  {
    code: '3',
    type: 'password',
    label: '密码输入'
  },
  {
    code: '4',
    type: 'date',
    label: '日期选择'
  },
  {
    code: '5',
    type: 'textarea',
    label: '多行输入'
  },
  {
    code: '6',
    type: 'time',
    label: '时间选择'
  },
  {
    code: '7',
    type: 'datetime',
    label: '日期时间选择'
  },
  {
    code: '8',
    type: 'radio',
    label: '单选框'
  },
  {
    code: '9',
    type: 'checkbox',
    label: '多选框'
  },
  {
    code: '10',
    type: 'select',
    label: '单选下拉'
  },
  {
    code: '11',
    type: 'multipleSelect',
    label: '多选下拉'
  },
  {
    code: '12',
    type: 'comboTree',
    label: '树形下拉'
  },
  {
    code: '13',
    type: 'upload',
    label: '文件选择'
  },
  {
    code: '14',
    type: 'color-picker',
    label: '颜色选择',
    trigger: 'change'
  },
  {
    code: '15',
    type: 'icon-picker',
    label: '图标选择'
  },
  {
    code: '16',
    type: 'input-button',
    label: '输入框+按钮'
  },
  {
    code: '17',
    type: 'input-select',
    label: '可输入下拉'
  }
]
export const getWidgetConf = (val, key = 'code') => {
  if (val === undefined || val === null) {
    return undefined
  }
  // eslint-disable-next-line eqeqeq
  return widgetConfArr.find(item => item[key] == val)
}
