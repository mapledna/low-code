import { copyConf, defaultDataSource, defaultRelate } from '../utils.js'
import rowFormItem from '../layout/rowFormItem'
import elButton from './el-button.js'

const innerBtn = {
  ...elButton,
  defaultValue: '',
  type: 'default',
  style: {
    ...elButton.style,
    display: 'inline-block',
    width: 'auto'
  },

  // TODO: 去除不必要的配置

  $click: 'handleOpenPage', // 方法名
  action: 'openPage', // 按钮操作类型。'openPage'打开页面|'dataSource'关联数据源|'flow'事务流|'methods'自定义方法
  // === 打开页面 action 为 openPage 时 ===
  openPageType: 'dialog', // 页面打开方式。'dialog'弹窗|'new'新页面|'self'当前页面
  dialogWidth: '100%', // 弹框宽度
  actionType: 'pageId', // 页面地址输入方式。'customUrl'用户输入|'pageId'选择页面id_code
  pageId: '', // (打开页面-选择页面id_code)内部链接页面id_code
  customUrl: '', // (打开页面-用户输入)用户输入的跳转地址
  // === 关联数据源 action 为 dataSource、flow 时 ===
  categoryId: '', // (关联数据源)分类id
  listId: '', // (关联数据源)列表id
  flowId: '', // (关联事务流)事务流id_code
  microserviceId: '' // (关联微服务)微服务id_code
}

const specialBtn = {
  ...elButton,
  defaultValue: '',
  type: 'primary',
  plain: true,
  style: {
    ...elButton.style,
    display: 'inline-block',
    width: 'auto'
  }
}

// 表格顶部操作按钮默认配置
export const defaultTableTopBtn = Object.freeze({
  ...copyConf(innerBtn),
  _key: 'topBtn', // NOTE: 特殊字段。用于关联父组件。
  label: '顶部按钮',
  topbtn: 'topbtn_', // 按钮唯一标识。NOTE: 行内按钮与顶部按钮键值不同
  operatNum: 'none' // 操作数量 'none'无|'single'单行|'multi'多行
})

// 表格行内操作按钮默认配置
export const defaultTableRowBtn = Object.freeze({
  ...copyConf(innerBtn),
  _key: 'rowBtn', // NOTE: 特殊字段。用于关联父组件。
  label: '行操作按钮',
  rowbtn: 'rowbtn_', // 按钮唯一标识。NOTE: 行内按钮与顶部按钮键值不同
  operatNum: 'single' // 操作数量 'none'无|'single'单行|'multi'多行
})

export const defaultTableExportBtn = Object.freeze({
  ...copyConf(specialBtn),
  dataSource: {
    ...copyConf(specialBtn.dataSource),
    origin: ''
  },
  'prefix-icon': 'el-icon el-icon-download',
  defaultValue: '导出',
  $click: 'exportExcel',
  _key: 'exportExcelBtn', // NOTE: 特殊字段。用于关联父组件。
  _canCopy: false,
  _canDelt: true,
  nonuse: false // NOTE: 是否不渲染。关联 exportExcelBtn_allow
})

export const defaultTableSetColBtn = Object.freeze({
  ...copyConf(specialBtn),
  'prefix-icon': 'el-icon el-icon-bottom-right',
  defaultValue: '设置列',
  $click: 'setTableCol',
  _key: 'setColBtn', // NOTE: 特殊字段。用于关联父组件。
  _canCopy: false,
  _canDelt: true,
  nonuse: false // NOTE: 是否不渲染。关联 setColBtn_allow
})

// 列数据默认配置
// 完整的列配置需要合并默认配置、格式化配置、列表数据。列表数据仅返回 label、value、data 字段。
export const defaultColOption = Object.freeze({
  label: '',
  value: '',
  width: 120,
  align: 'left',
  fixed: 'none',
  sortable: true, // 是否开启排序
  invisible: false, // 是否隐藏。NOTE: 原本为 is_display
  editable: false, // 是否编辑。NOTE: 原本为 isEdit
  widgetCode: '', // 编辑控件类型
  formatColFn: '', // 列自定义格式化方法
  // 仅在编辑控件为 select 时使用。TODO: 去除不必要的配置
  dataType: 'dict', // 数据类型
  sourceId: '', // 数据字典或者数据服务选择的id
  serviceId: '',
  // 仅在编辑控件为 input-button 时使用。TODO: 去除不必要的配置
  action: 'openPage',
  openPageType: 'dialog',
  dialogWidth: '80%', // 弹框宽度
  actionType: 'pageId',
  pageId: '',
  params: '{ }'
})

export default Object.freeze({
  label: '数据表格',
  tag: 'el-table',
  layout: 'colFormItem',
  tagIcon: 'table',
  showLabel: false,
  changeTag: false,
  defaultValue: [
    // 表格实例数据
    {
      date: '2016-05-02',
      name: '王小虎'
    },
    {
      date: '2016-05-04',
      name: '王小虎'
    }
  ],
  options: [
    {
      // 表格列配置
      ...defaultColOption,
      label: '列一',
      value: 'date'
    }
  ],
  dataType: 'dynamic',
  dataSource: copyConf(defaultDataSource),
  relate: copyConf(defaultRelate),
  // filterOption: {}, // 列字段 匹配数据的请求
  // "initDataOptions": [], // NOTE: 代码会添加这个属性
  searchData: [], // 搜索条件对应的搜索框、被动控件的关联字段
  searchOption: {}, // 搜索条件相关的下拉、多选等数据
  resetBtn_allow: true, // 搜索条件重置按钮
  topEdit: {
    // 启用顶部按钮
    show: true,
    toggleTopBtn_allow: true,
    exportExcelBtn_allow: false,
    setColBtn_allow: false,
    options: []
  },
  editRow: {
    // 行尾操作按钮
    show: false,
    title: '操作',
    width: 100,
    buttonType: 'text',
    fixed: 'right',
    options: []
  },
  bottomSummary: {
    showSummary: false,
    sumText: '合计',
    summaryOptions: [
      // 合计的选项
      {
        value: '1',
        label: '小计'
      },
      {
        value: '2',
        label: '合计'
      }
    ]
  },
  pagination: {
    // 分页
    show: true,
    pageSize: 10,
    total: 2,
    currentPage: 1,
    pageSizes: '10,20,30,40,50,100',
    layout: 'total, sizes, prev, pager, next, jumper',
    isShowGoto: true
  },
  rowSort: false, // 开启行排序
  sortId: 'id', // 行排序字段
  border: false, // 纵向边框
  stripe: true, // 斑马纹
  size: 'mini',
  fit: true,
  height: null,
  style: { width: '100%' },
  columnType: 'none', // 'none'无|'selection'多选|'index'序号|'expand'展开
  regList: [], //
  children: [
    {
      ...copyConf(rowFormItem),
      _key: 'topRow', // NOTE: 特殊字段。用于关联父组件。
      _canCopy: false,
      _canDelt: false,
      span: 24,
      children: [
        // {
        //   ...defaultTableExportBtn,
        //   nonuse: true
        // },
        // {
        //   ...defaultTableSetColBtn,
        //   nonuse: true
        // }
      ]
    }
  ],
  document: 'https://element.eleme.cn/#/zh-CN/component/table'
})
