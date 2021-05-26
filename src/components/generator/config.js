import {
  copyConf,
  defaultFormConf,
  defaultDataSource,
  defaultRelate,
  defaultLayoutConf
} from './config/utils.js'
import basicConf from './config/basic/index.js'
import layoutConf from './config/layout/index.js'
import pageConf from './config/page/index.js'

// 容器列表
export const containerList = [
  'rowFormItem',
  'rowContainer',
  'formDetail',
  'formContainer',
  'tabContainer',
  'tableContainer',
  'treeAndTable',
  'menuAndTab',
  'treeAndForm',
  'uiLoginPage',
  'uiLoginPageV2',
  'uiMainV1',
  'uiMainV2'
]

// 拥有选项的组件。
// 原先的逻辑：允许通过 initDataOptions 配置初始数据源字段
// 改为：允许展示数据源，并且允许请求exampleData。目前 exampleData 会存入options或data。
export const optionComponentList = [
  'listPicker',
  'formItemText',
  'el-select',
  'el-checkbox-group',
  'el-radio-group',
  'el-tree',
  'combo-tree',
  'ui-menu',
  'el-collapse',
  'el-breadcrumb',
  'el-carousel'
]

// 表单属性———页面属性
export const formConf = defaultFormConf

// 输入组件初始配置信息
export const basicComponents = [
  // ...Object.keys(basicConf).map(key => basicConf[key]),
  {
    ...basicConf['el-button']
  },
  {
    label: '单行文本',
    tag: 'el-input',
    layout: 'colFormItem',
    tagIcon: 'input',
    placeholder: '',
    defaultValue: undefined,
    span: 24,
    size: 'medium', // 尺寸
    serialNumber: '', // 流水号
    showLabel: true,
    labelWidth: null,
    style: { width: '100%' },
    clearable: true,
    prepend: '',
    append: '',
    'prefix-icon': '',
    'suffix-icon': '',
    maxlength: null,
    'show-word-limit': false,
    isDebounce: false, // 是否执行防抖函数
    readonly: false,
    disabled: false,
    required: true,
    regList: [],
    event: {
      onChange: '',
      onInput: '',
      onFocus: '',
      onClear: '',
      onBlur: ''
    }, // 事件
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/input'
  },
  {
    label: '多行文本',
    tag: 'el-input',
    layout: 'colFormItem',
    tagIcon: 'textarea',
    type: 'textarea',
    placeholder: '',
    defaultValue: undefined,
    span: 24,
    showLabel: true,
    labelWidth: null,
    autosize: {
      minRows: 4,
      maxRows: 4
    },
    style: { width: '100%' },
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false,
    required: true,
    regList: [],
    event: {
      onChange: '',
      onInput: '',
      onFocus: '',
      onClear: '',
      onBlur: ''
    }, // 事件
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/input'
  },
  {
    label: '密码',
    tag: 'el-input', // WARN: tag重复
    layout: 'colFormItem',
    tagIcon: 'password',
    placeholder: '',
    defaultValue: undefined,
    span: 24,
    'show-password': true,
    showLabel: true,
    labelWidth: null,
    style: { width: '100%' },
    clearable: true,
    prepend: '',
    append: '',
    'prefix-icon': '',
    'suffix-icon': '',
    maxlength: null,
    'show-word-limit': false,
    needEncrypt: true, // 是否需要加密
    readonly: false,
    disabled: false,
    required: true,
    regList: [],
    event: {
      onChange: '',
      onInput: '',
      onFocus: '',
      onClear: '',
      onBlur: ''
    }, // 事件
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/input'
  },
  {
    label: '计数器',
    tag: 'el-input-number',
    layout: 'colFormItem',
    tagIcon: 'number',
    placeholder: '',
    defaultValue: undefined,
    span: 24,
    showLabel: true,
    labelWidth: null,
    style: { width: '150px' },
    min: undefined,
    max: undefined,
    step: undefined,
    'step-strictly': false,
    precision: undefined,
    'controls-position': '',
    disabled: false,
    required: true,
    event: {
      onChange: '',
      onFocus: '',
      onBlur: ''
    }, // 事件
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/input-number'
  },
  // 表单详情项
  {
    ...basicConf.formItemText
  },
  {
    label: '文字',
    tag: 'p',
    layout: 'colFormItem',
    tagIcon: 'word',
    defaultValue: undefined,
    showLabel: true,
    labelWidth: null,
    style: {
      width: '100%',
      margin: 0,
      display: 'block',
      color: '',
      fontSize: '16px',
      textAlign: 'left',
      background: ''
    },
    regList: [],
    changeTag: true,
    document: ''
  },
  // 标题文字
  {
    ...basicConf.title
  },
  {
    label: '超链接',
    tag: 'el-link',
    layout: 'colFormItem',
    tagIcon: 'link',
    content: '超链接内容',
    type: 'primary',
    showLabel: true,
    labelWidth: null,
    style: {
      width: '100%',
      margin: 0,
      display: 'block',
      color: '',
      fontSize: '16px',
      textAlign: 'left',
      background: ''
    },
    underline: false, // 是否显示下划线
    disabled: false,
    href: '',
    regList: [],
    changeTag: true,
    document: ''
  },
  {
    ...basicConf.iframe
  },
  {
    label: '分割线',
    tag: 'el-divider',
    layout: 'colFormItem',
    tagIcon: 'divider',
    content: '分割线内容',
    showLabel: false,
    labelWidth: null,
    'content-position': 'left'
  },
  {
    label: '图标',
    tag: 'ui-icon',
    layout: 'colFormItem',
    tagIcon: 'icon',
    iconName: 'el-icon-sunny',
    style: {
      width: '100%',
      margin: 0,
      display: 'block',
      fontSize: '2em',
      textAlign: 'left',
      color: '',
      background: ''
    },
    showLabel: false,
    labelWidth: null,
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/icon'
  },
  {
    label: '图片',
    tag: 'el-image',
    layout: 'colFormItem',
    tagIcon: 'image',
    showLabel: true,
    labelWidth: null,
    // disabled: false,
    style: {
      width: '100%',
      height: '100%',
      display: 'block'
    },
    src:
        'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
    fit: 'fill',
    // limit: 1,
    fileSize: 2,
    sizeUnit: 'MB',
    alt: '图片',
    regList: [],
    changeTag: true,
    document: ''
  },
  {
    // 菜单栏
    ...basicConf['ui-menu']
  },
  {
    label: '单选下拉',
    tag: 'el-select',
    layout: 'colFormItem',
    tagIcon: 'select',
    placeholder: '',
    defaultValue: undefined,
    defaultValueType: '', // selectFirst为默认选择下拉框中第一项的值   TODO: 默认值的配置模块待重构 参考/config/utils中的defaultValue
    span: 24,
    showLabel: true,
    labelWidth: null,
    labelKey: 'label',
    valueKey: 'value',
    style: { width: '100%' },
    clearable: true,
    disabled: false,
    required: true,
    filterable: false,
    multiple: false,
    initDataOptions: [], // 记录页面的初始赋值字段
    options: [
      {
        label: '选项一',
        value: 1
      },
      {
        label: '选项二',
        value: 2
      }
    ],
    dataSource: copyConf(defaultDataSource),
    relate: copyConf(defaultRelate),
    event: {
      onChange: ''
    }, // 事件
    searchData: [], // 记录被动控件中关联上级的字段
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/select'
  },
  {
    label: '多选下拉',
    tag: 'el-select',
    layout: 'colFormItem',
    tagIcon: 'multipleSelect',
    placeholder: '',
    defaultValue: undefined,
    span: 24,
    showLabel: true,
    labelWidth: null,
    style: { width: '100%' },
    clearable: true,
    disabled: false,
    required: true,
    filterable: false,
    multiple: true,
    options: [
      {
        label: '选项一',
        value: 1
      },
      {
        label: '选项二',
        value: 2
      }
    ],
    dataSource: copyConf(defaultDataSource),
    relate: copyConf(defaultRelate),
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/select'
  },
  {
    label: '级联选择',
    tag: 'el-cascader',
    layout: 'colFormItem',
    tagIcon: 'cascader',
    placeholder: '',
    defaultValue: [],
    span: 24,
    showLabel: true,
    labelWidth: null,
    style: { width: '100%' },
    props: {
      multiple: false
    },
    'show-all-levels': true,
    disabled: false,
    clearable: true,
    filterable: false,
    required: true,
    options: [
      {
        id: 1,
        value: 1,
        label: '选项1',
        children: [
          {
            id: 2,
            value: 2,
            label: '选项1-1'
          }
        ]
      }
    ],
    dataType: 'dynamic',
    labelKey: 'label',
    valueKey: 'value',
    childrenKey: 'children',
    separator: '/',
    relate: copyConf(defaultRelate),
    dataSource: copyConf(defaultDataSource),
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/cascader'
  },
  {
    // 树形选择
    ...basicConf['el-tree']
  },
  {
    label: '树形下拉',
    tag: 'combo-tree',
    layout: 'colFormItem',
    tagIcon: 'comboTree',
    defaultValue: undefined,
    span: 24,
    placeholder: '',
    size: 'small', // 尺寸
    showRoot: true, // 是否显示最外层的根节点，默认显示
    showLabel: true,
    labelWidth: null,
    required: true,
    style: { width: '100%' },
    displayType: 'input', // 展示方式。'input'编辑框|'label'文本
    triggerType: 'click', // 触发下拉的行为。'click'|'hover'
    'show-checkbox': false,
    'default-expand-all': false,
    'highlight-current': false,
    accordion: true,
    draggable: false,
    changeTag: true,
    $click: '',
    data: [
      {
        id: 1,
        value: 1,
        label: '选项1',
        children: [
          {
            id: 2,
            value: 2,
            label: '选项1-1'
          }
        ]
      },
      {
        id: 3,
        value: 3,
        label: '选项2',
        children: [
          {
            id: 4,
            value: 4,
            label: '选项2-1'
          }
        ]
      }
    ],
    relate: copyConf(defaultRelate),
    dataSource: copyConf(defaultDataSource),
    dataType: 'dynamic',
    labelKey: 'label',
    valueKey: 'id',
    childrenKey: 'children'
  },
  {
    label: '单选框组',
    tag: 'el-radio-group',
    layout: 'colFormItem',
    tagIcon: 'radio',
    defaultValue: undefined,
    span: 24,
    showLabel: true,
    labelWidth: null,
    style: {},
    optionType: 'default', // 选项样式。default|button
    border: false,
    size: 'medium',
    disabled: false,
    required: true,
    options: [
      {
        label: '选项一',
        value: 1
      },
      {
        label: '选项二',
        value: 2
      }
    ],
    dataSource: copyConf(defaultDataSource),
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/radio'
  },
  {
    label: '多选框组',
    tag: 'el-checkbox-group',
    layout: 'colFormItem',
    tagIcon: 'checkbox',
    defaultValue: [],
    span: 24,
    showLabel: true,
    labelWidth: null,
    style: {},
    optionType: 'default', // 选项样式。default|button
    border: false,
    size: 'medium',
    disabled: false,
    required: true,
    options: [
      {
        label: '选项一',
        value: 1
      },
      {
        label: '选项二',
        value: 2
      }
    ],
    dataSource: copyConf(defaultDataSource),
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/checkbox'
  },
  {
    label: '开关',
    tag: 'el-switch',
    layout: 'colFormItem',
    tagIcon: 'switch',
    defaultValue: false,
    span: 24,
    showLabel: true,
    labelWidth: null,
    style: {},
    disabled: false,
    required: true,
    'active-text': '',
    'inactive-text': '',
    'active-color': null,
    'inactive-color': null,
    'active-value': true,
    'inactive-value': false,
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/switch'
  },
  {
    label: '时间选择',
    tag: 'el-time-picker',
    layout: 'colFormItem',
    tagIcon: 'time',
    placeholder: '',
    defaultValue: null,
    span: 24,
    showLabel: true,
    labelWidth: null,
    style: { width: '100%' },
    disabled: false,
    clearable: true,
    required: true,
    'picker-options': {
      selectableRange: '00:00:00-23:59:59'
    },
    format: 'HH:mm:ss',
    'value-format': 'HH:mm:ss',
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/time-picker'
  },
  // {
  //   label: '时间范围',
  //   tag: 'el-time-picker',
  //   layout: 'colFormItem',
  //   tagIcon: 'time-range',
  //   defaultValue: null,
  //   span: 24,
  //   showLabel: true,
  //   labelWidth: null,
  //   style: { width: '100%' },
  //   disabled: false,
  //   clearable: true,
  //   required: true,
  //   'is-range': true,
  //   'range-separator': '至',
  //   'start-placeholder': '开始时间',
  //   'end-placeholder': '结束时间',
  //   format: 'HH:mm:ss',
  //   'value-format': 'HH:mm:ss',
  //   regList: [],
  //   changeTag: true,
  //   document: 'https://element.eleme.cn/#/zh-CN/component/time-picker'
  // },
  {
    label: '日期选择',
    tag: 'el-date-picker',
    layout: 'colFormItem',
    tagIcon: 'date',
    placeholder: '',
    defaultValue: null,
    type: 'date',
    span: 24,
    showLabel: true,
    labelWidth: null,
    style: { width: '100%' },
    disabled: false,
    clearable: true,
    required: true,
    format: 'yyyy-MM-dd',
    'value-format': 'yyyy-MM-dd',
    readonly: false,
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/date-picker'
  },
  {
    label: '日期时间',
    tag: 'el-date-picker',
    layout: 'colFormItem',
    tagIcon: 'datetime',
    placeholder: '',
    defaultValue: null,
    type: 'datetime',
    span: 24,
    showLabel: true,
    labelWidth: null,
    style: { width: '100%' },
    disabled: false,
    clearable: true,
    required: true,
    format: 'yyyy-MM-dd HH:mm:ss',
    'value-format': 'yyyy-MM-dd HH:mm:ss',
    readonly: false,
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/date-picker'
  },
  {
    label: '日期范围',
    tag: 'el-date-picker',
    layout: 'colFormItem',
    tagIcon: 'date-range',
    defaultValue: null,
    span: 24,
    showLabel: true,
    labelWidth: null,
    style: { width: '100%' },
    type: 'daterange',
    'range-separator': '至',
    'start-placeholder': '开始日期',
    'end-placeholder': '结束日期',
    disabled: false,
    clearable: true,
    required: true,
    format: 'yyyy-MM-dd',
    'value-format': 'yyyy-MM-dd',
    readonly: false,
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/date-picker'
  },
  {
    label: '颜色选择',
    tag: 'el-color-picker',
    layout: 'colFormItem',
    tagIcon: 'color-picker',
    defaultValue: null,
    showLabel: true,
    labelWidth: null,
    'show-alpha': false,
    'color-format': '',
    disabled: false,
    required: true,
    size: 'medium',
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/color-picker'
  },
  {
    label: '图标选择',
    tag: 'ui-icon-picker',
    layout: 'colFormItem',
    tagIcon: 'icon-picker',
    defaultValue: null,
    iconName: 'el-icon-sunny',
    showLabel: true,
    labelWidth: null,
    disabled: false,
    required: false,
    size: 'medium',
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/icon',
    enableInput: false
  },
  {
    label: '上传',
    tag: 'el-upload',
    layout: 'colFormItem',
    tagIcon: 'upload',
    type: 'upload',
    // action: '',
    defaultValue: null,
    showLabel: true,
    labelWidth: null,
    disabled: false,
    required: true,
    // isImport: false, // 是否是导入，如果不是就是上传
    accept: '',
    // name: 'form',
    fileDir: '',
    fileName: '',
    'show-file-list': true,
    'auto-upload': true,
    showTip: false,
    // dataSource: copyConf(defaultDataSource),
    // relateData: '', // 需要导入或者导出哪一个控件的数据
    buttonText: '点击上传',
    fileSize: 2,
    sizeUnit: 'MB',
    'list-type': 'text',
    limit: 1,
    multiple: false,
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/upload'
  },
  {
    label: '导入',
    tag: 'el-upload',
    layout: 'colFormItem',
    tagIcon: 'ui-import',
    type: 'import',
    // action: '',
    defaultValue: null,
    showLabel: true,
    labelWidth: null,
    disabled: false,
    required: true,
    // isImport: false, // 是否是导入，如果不是就是上传
    accept: '',
    // name: 'form',
    fileDir: '',
    fileName: '',
    'show-file-list': false,
    'auto-upload': true,
    showTip: false,
    dataSource: copyConf(defaultDataSource),
    relateData: '', // 需要导入或者导出哪一个控件的数据
    buttonText: '点击导入',
    fileSize: 2,
    sizeUnit: 'MB',
    'list-type': 'text',
    limit: 1,
    multiple: false,
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/upload'
  },
  {
    // 数据表格
    ...basicConf.listPicker
  },
  {
    // 数据表格
    ...basicConf['el-table']
  }
  // {
  //   label: '代码编辑',
  //   tag: 'code-editor',
  //   layout: 'colFormItem',
  //   tagIcon: 'code',
  //   defaultValue: null,
  //   span: 24,
  //   showLabel: true,
  //   labelWidth: null,
  //   readonly: false,
  //   disabled: false,
  //   required: true,
  //   regList: [],
  //   changeTag: true,
  //   document: 'https://microsoft.github.io/monaco-editor/',
  //   language: '', // 语言类型。'javascript', 'css', 'html', 'sql', 'java', 'json', 'markdown'
  //   theme: 'vs', // 主题风格。'vs'白色|'vs-dark'黑色|'hc-black'高亮
  //   rows: 10 // 编辑器展示行数
  // },
  // {
  //   // 富文本
  //   ...basicConf['richtext-editor']
  // }
  // {
  //   label: '视频',
  //   tag: 'ui-video-player',
  //   layout: 'colFormItem',
  //   tagIcon: 'ui-video-player',
  //   defaultValue: null,
  //   showLabel: false,
  //   labelWidth: null,
  //   src: '',
  //   videoType: '',
  //   regList: [],
  //   changeTag: true,
  //   document: ''
  // },
  // {
  //   label: '视频监控',
  //   tag: 'ui-video-monitor',
  //   layout: 'colFormItem',
  //   tagIcon: 'ui-video-monitor',
  //   defaultValue: null,
  //   showLabel: false,
  //   labelWidth: null,
  //   regList: [],
  //   changeTag: true,
  //   document: ''
  // },
  // {
  //   label: '视频会议',
  //   tag: 'ui-video-live',
  //   layout: 'colFormItem',
  //   tagIcon: 'ui-video-live',
  //   defaultValue: null,
  //   showLabel: false,
  //   labelWidth: null,
  //   regList: [],
  //   changeTag: true,
  //   document: ''
  // }
]
// 布局组件初始配置信息

export const layoutComponents = [
  // ...Object.keys(layoutConf).map(key => layoutConf[key]),
  {
    // 行容器
    ...layoutConf.rowFormItem
  },
  {
    // 选项卡
    ...layoutConf.tabContainer
  },
  {
    // 布局容器
    ...layoutConf.rowContainer
  },
  {
    // 表单详情信息
    ...layoutConf.formDetail
  },
  {
    // 表单控件
    ...layoutConf.formContainer
  },
  {
    // 主从表
    ...layoutConf.tableContainer
  },
  {
    // 树+表格
    ...layoutConf.treeAndTable
  },
  {
    // 菜单+选项卡
    ...layoutConf.menuAndTab
  },
  {
    // 树+表单
    ...layoutConf.treeAndForm
  }
  // 主页模板
  // ...Object.keys(pageConf).map(key => pageConf[key])
]

// 容器布局列表
export const containerLayoutList = layoutComponents.map(item => item.layout)

/**
 * 组件校验规则配置
 * NOTE: 仅配置中存在的组件，会生成表单的 rules 规则
 */
export const ruleConf = {
  'el-input': { type: '', trigger: 'blur' },
  'el-input-number': { type: '', trigger: 'blur' },
  'el-select': { type: '', trigger: 'change' },
  'el-radio-group': { type: '', trigger: 'change' },
  'el-checkbox-group': { type: 'array', trigger: 'change' },
  'el-cascader': { type: 'array', trigger: 'change' },
  'el-time-picker': { type: '', trigger: 'change' },
  'el-date-picker': { type: '', trigger: 'change' },
  'el-rate': { type: '', trigger: 'change' },
  'combo-tree': { type: '', trigger: 'input' },
  listPicker: { type: '', trigger: 'change' }
}
