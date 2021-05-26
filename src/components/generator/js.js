/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
/* eslint-disable no-template-curly-in-string */

import { exportDefault, getFunction, isEmpty } from '@/utils/index'
import { ruleConf, formConf } from './config'
import {
  getWidgetConf
} from '@/components/generator/config/utils'
import {
  getFieldId
} from '@/components/generator/methods-commom'

const units = {
  KB: '1024',
  MB: '1024 / 1024',
  GB: '1024 / 1024 / 1024'
}

const pageComponentPreName = 'page_' // 页面组件前缀。
const pageComponentPath = '@/views/pages/'

const inheritAttrs = {
  file: '',
  dialog: 'inheritAttrs: false,'
}

let hasRender = {} // 用于判断方法是否已经加载
let confGlobal = {}

export function getBuildOpts(conf, type, buildType) {
  hasRender = {}
  confGlobal = {}

  const buildOpts = {
    // import
    importList: [],
    // components
    componentsList: [],
    // data
    formDataList: [],
    formRulesList: [],
    extraDataList: [],
    extraDataObj: {
      loadingMap: {}, // 控制组件loading效果
      lockPageFieldIdArr: [] // 记录需要锁定页面的组件id，组件触发loading时锁定当前页面
    },
    // 计算监听
    computedList: [],
    watchObj: {},
    // 生命周期
    createdList: [],
    mountedList: [],
    destroyList: [],
    // methods
    methodsList: mixinMethod(type),
    customJsStr: getFunction(conf.pageJs).jsStr,
    vModelMethodsList: [],
    // 是预览还是生产环境
    buildType
  }

  confGlobal = conf
  // 工作流页面功能专用新增的类型
  if (confGlobal.pageType && confGlobal.pageType === 'workflow') {
    buildOpts.mountedList.push('window.postData=this.formData')
  }
  if (confGlobal.hookFnType === 'mounted') {
    buildOpts.mountedList.push(`this.${confGlobal.hookFn}()`)
  }

  buildLockPage(buildOpts)
  buildPageKeyEvent(conf, buildOpts)

  conf.fields.forEach(el => {
    buildAttributes(el, buildOpts)
  })

  return buildOpts
}


/**
 * 构建vue实例对象的js部分
 * @param {} conf
 * @param {} type 生成类型。页面或弹窗。
 * @param {String} buildType 'prod'|'preview' 运行或预览属于 preview，保存、下载、复制属于 prod
 */
export function makeUpJs(conf, type = 'file', buildType) {
  const confCopy = JSON.parse(JSON.stringify(conf))
  const buildOpts = getBuildOpts(confCopy, type, buildType)
  return getExportStr(
    confCopy,
    type,
    buildOpts,
    buildType
  )
}

// 模板页所需要的参数和数据 有：主页
function buildTemplatePage(el, { formDataList, extraDataList }) {
  if (['uiMainV1', 'uiMainV2', 'ntiMobileMain'].indexOf(el.layout) > -1) {
    extraDataList.push(`${el.componentName}Options:[],`)
    extraDataList.push(`${el.componentName}HomePage:${JSON.stringify(el.homePage)},`)
    extraDataList.push(`${el.componentName}variables:${JSON.stringify({
      menuBg: '',
      menuText: '',
      menuActiveText: ''
    })},`)
  }
}

// 根据组件属性分拆赋值给js页面对象
function buildAttributes(el, buildOpts) {
  const {
    componentsList,
    // data
    formDataList,
    formRulesList,
    propsList,
    extraDataList,
    extraDataObj,
    // 计算监听
    computedList,
    watchObj,
    // 生命周期
    createdList,
    mountedList,
    destroyList,
    // methods
    methodsList,
    buildType
  } = buildOpts

  buildFormDataList(el, buildOpts)
  buildFormRulesList(el, buildOpts)
  buildTemplatePage(el, buildOpts)

  // 默认值模块 目前增加defaultValueType 见config.js页面el-select中
  if (el.defaultValueType) {
    extraDataList.push(`${el.vModel}DefaultValue:{type:'${el.defaultValueType}',field:'${el.valueKey}',value:'${(el.defaultValue && el.defaultValue !== 'null' && el.defaultValueType === 'custom') ? el.defaultValue : ''}'},`)
    // 数据源为静态数据——默认第一项
    if (el.defaultValueType === 'selectFirst' && el.dataType === 'static' && el.dataSource.type === 'data') {
      createdList.push(`this.${confGlobal.formModel}.${el.vModel}=this.${el.vModel}Options[0].value.toString()`)
    }
  }


  // HACK: 解决defaultValue没有赋值，导致默认值无效的问题
  if (['ui-icon-picker', 'combo-tree', 'el-radio-group'].indexOf(el.tag) >= 0) {
    mountedList.push(`this.${confGlobal.formModel}.${el.vModel}='${(el.defaultValue && el.defaultValue !== 'null') ? el.defaultValue : ''}'`)
  }

  // 引入自定义组件ui-menu
  if (el.tag === 'ui-menu') {
    formDataList.push(`${el.vModel}Menu:${buildComponentParams(el, ['isCollapse', 'variables'])},`)
  }

  // 密码框
  if (el.tagIcon === 'password') {
    // 密码框加密
    if (el.needEncrypt !== false) {
      extraDataObj.needEncrypt = (extraDataObj.needEncrypt || []).concat(el.vModel)
    }
  }

  // 按钮
  if (el.tag === 'el-button') {
    buildExportExcel(el, buildOpts)
    buildExecuteServer(el, buildOpts)
    executeServerMethod(el, buildOpts)
    // 内置事件
    switch (el.action || el.$click) { // TODO: 统一使用 $click
      case 'openPage': // 打开页面
        buildUtilTools(el, buildOpts)
        buildHandleOpenPage(el, buildOpts)
        // 内置事件：打开页面-弹窗方式
        if (el.openPageType === 'dialog') {
          buildDialog(el, buildOpts)
        }
        break
      default:
        break
    }
  }

  if (el.tag === 'listPicker') {
    buildListPicker(el, buildOpts)
    const fieldId = getFieldId(el)
    // 设置默认值
    if (!isEmpty(el.modelValue)) {
      const initParameters = el?.dataSource?.optionParams
      // const initParameters = el?.dataSource?.optionParams?.[`${fieldId}.initData`]?.parameters
      if (initParameters) {
        // initParameters[el.valueKey] = el.modelValue
        initParameters[el.valueKey] = el.defaultValue
      }
    }
    // 保存脚本中需要使用到的配置信息
    extraDataObj[`${fieldId}_conf`] = {
      visible: false,
      valueKey: el.valueKey,
      required: el.required,
      listPickerTable_key: getFieldId(el.children[0]),
      relateActiveId: el.activeId
    }
  }

  // 表格
  if (el.tag === 'el-table' && el.dataSource) {
    const fieldId = getFieldId(el)

    const tablePropoty = {}
    tablePropoty.height = el.height

    // 特殊嵌套组件
    if (el._parentFieldId) {
      tablePropoty.parentFieldId = el._parentFieldId
    }
    if (el._key) {
      tablePropoty.keyType = el._key
    }

    // 表格多行折叠按钮展示
    tablePropoty.showToggleTopBtn = el.topEdit.toggleTopBtn_allow !== false
    tablePropoty.showMoreTopBtn = false

    // 分页&排序
    if (el.pagination && el.pagination.show) {
      tablePropoty.sortConf = { order: undefined, sort: undefined }
      el.pagination.pageSize = Number(el.pagination.pageSize || 0)
      const {
        currentPage, pageSize, pageSizes, total
      } = el.pagination
      tablePropoty.pagination = {
        currentPage, pageSize, pageSizes: pageSizes.split(',').map(item => Number(item)), total
      }
      if (el._key !== 'listPickerTable') {
        // 修改分页时自动计算表格高度
        // NOTE: 不再考虑原有的表格高度设置，不考虑主从表等特殊情况。一律自适应页面或分页数量。
        watchObj[`${confGlobal.formModel}.${fieldId}Table.pagination.pageSize`] = `function(){
          const tableConf = this.${confGlobal.formModel}.${fieldId}Table;
          if(!tableConf) return
          const tableWarp = document.querySelector('.table-warp[data-model="${fieldId}"]')
          if(!tableWarp) return
          const currentPane = this.$dom.getCurrentTabPane()
          const table = tableWarp.querySelector(".el-table");
          this.$set(tableConf, "height", this.$dom.getTableMaxHeight(currentPane, table, tableConf));
        }`
      }
    } else {
      tablePropoty.noPaging = true // 该表格为单列表 无分页
    }

    // 搜索框
    if (el.searchData.length !== 0) {
      const searchObj = {}
      el.searchData.forEach(item => {
        if (item.value) {
          searchObj[item.value] = item.inputVal
        }
      })
      tablePropoty.search = { ...searchObj }
    }

    // 搜索条件的下拉、多选数据
    if (el.searchOption && Object.keys(el.searchOption).length !== 0) {
      const searchOptions = {}
      Object.keys(el.searchOption).forEach(val => {
        searchOptions[val] = []
      })
      tablePropoty.searchOptions = { ...searchOptions }
    }

    // 多选
    if (el.columnType === 'selection') {
      buildTableSelection(el, buildOpts)
    }


    const filterOptions = {} // 列字段格式化
    const formatColFn = [] // 列字段格式化自定义方法
    const tableColumnArr = [] // 存储表头的列数据。用于可编辑的表格的数据提交
    const isCheckbox = {} // 是复选框的字段
    el.options.forEach(option => {
      // 列字段格式化
      if (option.formatter) {
        filterOptions[option.value] = []
      }
      // 列自定义格式化方法
      if (option.formatColFn) {
        formatColFn.push(`${option.value}:${option.formatColFn}`)
      }

      tableColumnArr.push({
        value: option.value,
        label: option.label,
        is_required: option.is_required,
        invisible: option.invisible,
        sortable: !!option.sortable
      })

      // 表头多选
      const { editable, widgetCode } = option
      const widgetType = editable
        ? (getWidgetConf(widgetCode) || {}).type || ''
        : ''
      if (widgetType === 'checkbox') {
        isCheckbox[option.value] = false
      }

      if (option.action === 'openPage') {
        buildUtilTools(el, buildOpts)
        buildHandleOpenPage(el, buildOpts)
        // 内置事件：打开页面-弹窗方式
        if (option.openPageType === 'dialog') {
          buildDialog(option, buildOpts)
        }
      }
    })

    if (JSON.stringify(filterOptions) !== '{}') {
      tablePropoty.filterOptions = { ...filterOptions }
    }

    tablePropoty.tableColumnArr = tableColumnArr
    if (Object.keys(isCheckbox).length > 0) {
      tablePropoty.isCheckbox = isCheckbox
      el.hasCheckbox = true
    }
    // 底部合计
    const { summaryOptions } = el.bottomSummary
    if (el.bottomSummary.showSummary && summaryOptions && summaryOptions.length > 0) {
      const summaryArr = []; const summaryField = {}
      for (let i = 0; i < summaryOptions.length; i++) {
        for (let j = 0; j < el.options.length; j++) {
          if (el.options[j].value !== 'id') {
            summaryField[el.options[j].value] = j === 1 ? summaryOptions[i].label : ''
          }
          summaryField.value = summaryOptions[i].value
        }
        summaryArr.push(JSON.parse(JSON.stringify(summaryField)))
      }
      tablePropoty.summaryArr = summaryArr
    }
    // 表格按钮：操作列
    const topOrRowButtonFn = []
    if (el.editRow && el.editRow.show && el.editRow.options.length !== 0) {
      el.editRow.options.forEach(btnEl => {
        // eslint-disable-next-line no-underscore-dangle
        btnEl._parentFieldId = el.vModel
        // 操作列按钮自定义方法
        if (btnEl.displayFn) {
          topOrRowButtonFn.push(`display_${btnEl.rowbtn}:${btnEl.displayFn}`)
        }
        if (btnEl.disabledFn) {
          topOrRowButtonFn.push(`disabled_${btnEl.rowbtn}:${btnEl.disabledFn}`)
        }
        if (btnEl.beforeClickFn) {
          topOrRowButtonFn.push(`beforeClick_${btnEl.rowbtn}:${btnEl.beforeClickFn}`)
        }
        buildAttributes(btnEl, buildOpts)
      })
      // 添加“删除行”方法
      methodsList.push(buildApiAction())
    }
    // 表格按钮：顶部操作
    if (el.topEdit && el.topEdit.show && el.topEdit.options.length !== 0) {
      el.topEdit.options.forEach(btnEl => {
        btnEl._parentFieldId = el.vModel
        // 顶部按钮自定义方法
        if (btnEl.displayFn) {
          topOrRowButtonFn.push(`display_${btnEl.topbtn}:${btnEl.displayFn}`)
        }
        if (btnEl.disabledFn) {
          topOrRowButtonFn.push(`disabled_${btnEl.topbtn}:${btnEl.disabledFn}`)
        }
        if (btnEl.beforeClickFn) {
          topOrRowButtonFn.push(`beforeClick_${btnEl.topbtn}:${btnEl.beforeClickFn}`)
        }
        buildAttributes(btnEl, buildOpts)
      })
      // 添加“删除行”方法
      methodsList.push(buildApiAction())
    }

    // 表格当前选中行
    tablePropoty.currentRow = null
    // 表格请求数据的sqlId
    tablePropoty.tableSqlId = el.dataSource.listId ? el.dataSource.listId.toString() : ''

    // 使用 slice 的原因：去掉 tablePropoty 转换为字符串后多出的大括号
    formDataList.push(`${el.vModel}Table:{
      ${JSON.stringify(tablePropoty).slice(1, -1)},
      formatColFnMap: {${formatColFn}},
      topOrRowButtonFnMap: {${topOrRowButtonFn}},
    },`)
    // 表格通用的方法
    buildTableMethod(el, buildOpts)
  }

  // 表格搜索初始值
  if (el.tag === 'el-table') {
    mountedList.push(`this.setTableSearchParams('${el.vModel}')`)
    if (el.rowSort) {
      mountedList.push(`this.rowSortableDrag('${el.vModel}')`)
    }
  }

  // 联动
  if (el.relate && el.relate.passiveOptions && el.relate.passiveOptions.length > 0) { // 有下级关联我
    // tablePropoty.passiveOptions = el.relate.passiveOptions
    extraDataList.push(`${el.vModel || el.componentName}PassiveOptions:${JSON.stringify(el.relate.passiveOptions)},`)
  }
  if (el.relate && el.relate.activeId && el.relate.fieldOptions.length > 0) { // 我关联上级
    // tablePropoty.relatedFieldOptions = el.relate.fieldOptions
    extraDataList.push(`${el.vModel || el.componentName}RelatedOptions:${JSON.stringify(el.relate.fieldOptions)},`)
  } else if (el.layout === 'formContainer') { // 表单不关联上级 则主动请求自身数据
  } else if (el.tag === 'el-table') {
    mountedList.push(`this.tableData('${el.vModel}')`)
  }

  // 表单控件
  if (el.layout === 'formContainer') {
    buildHandleOpenPage(el, buildOpts)
    buildFormMethod(el, buildOpts)
    extraDataList.push('isEditPage: false,') // 表单页面创建或编辑类型。默认为创建页面。
    extraDataList.push(`dataType: '${el.dataSource.type}',`) // 数据源类型
    extraDataList.push(`componentName: '${el.componentName}',`) // 数据源类型
    if (el.dataSource.type === 'flow' && el.dataSource.flowId) {
      extraDataList.push(`flowId: '${el.dataSource.flowId}',`)
    }
    if (el.dataSource.type === 'microservice' && el.dataSource.microserviceId) {
      extraDataList.push(`microserviceId: '${el.dataSource.microserviceId}',`)
    }
    if (el.createDataId) {
      extraDataList.push(`createDataId: '${el.createDataId}',`) // 页面创建数据源id_code
    }
    if (el.editDataId) {
      extraDataList.push(`editDataId: '${el.editDataId}',`) // 页面编辑数据源id_code
    }
  }

  // 数据源：自定义参数
  if (el.dataSource) {
    buildDataSource(el, buildOpts)
    buildResoveFn(el, buildOpts)
  }
  // TODO: 数据源：表格按钮自定义参数-顶部按钮
  // if (el.tag === 'el-table' && el.topEdit && el.topEdit.show && el.topEdit.options) {
  //   el.topEdit.options.forEach(item => {
  //     if(item.action === '')
  //     buildDataSource(el, buildOpts)
  //   })
  // }
  // if (el.tag === 'el-table' && el.editRow && el.editRow.show && el.editRow.options) {
  //   el.topEdit.options.forEach(item => {
  //     if(item.action === '')
  //     buildDataSource(el, buildOpts)
  //   })
  // }
  // 添加页面初始请求下拉、多选等的选择数据
  if (el.dataSource && el.dataSource.optionParams && Object.keys(el.dataSource.optionParams).length > 0) {
    // 找到并截取
    let prevOptionParams = ''
    for (let i = 0; i < extraDataList.length; i++) {
      if (extraDataList[i].indexOf('optionParams:') > -1) {
        prevOptionParams = extraDataList[i]
        extraDataList.splice(i, 1)
        break
      }
    }
    if (prevOptionParams) { // 当前页面已经有集合请求对象optionParams
      const oldOptionParams = JSON.parse(`{${prevOptionParams.replace(/,$/, '').replace('optionParams:', '"optionParams":')}}`)
      extraDataList.push(`optionParams:${JSON.stringify({
        ...oldOptionParams.optionParams,
        ...el.dataSource.optionParams
      })},`)
    } else {
      extraDataList.push(`optionParams:${JSON.stringify(el.dataSource.optionParams)},`)
      buildUtilTools(el, buildOpts)

      // 当表单作为被动控件时，表单中的下拉框等也需要初始就请求数据  仅排除请求表单的initData数据即可
      // TODO: 1、当表单作为被动控件且该页面为编辑页面时 initData应该也会被请求 2、考虑区分各种数据请求的类型
      mountedList.unshift('this.getOptionParams()') // 将请求字典数据的方法放前面 便于formatter格式化的使用
      buildFormParamsMethod(el, buildOpts)
    }

    if (el.layout === 'formContainer') {
      mountedList.unshift('this.judgeIsEdit()') // 判断当前页面是否为编辑页面 属于表单的私有方法
    }
  }
  // tabContainer容器处理
  if (el.layout === 'tabContainer' && el.childType === 'iframe') {
    extraDataList.push(`
    ${el.componentName}Options:[{label: '首页',id:'home_1'}],
    ${el.componentName}CurrentTabValue:'home_1',
    `)
    buildTabContainerMethod(el, buildOpts)
    if (el.childType === 'iframe') {
      iframeHeight(el, buildOpts)
      mountedList.push('this.getIframeHeight()')
    }
  }

  // 树形选择需要的数据要经过处理
  if (el.tag === 'el-tree') {
    computedList.push(`${el.vModel}Tree(){return this.arrayToTree(JSON.parse(JSON.stringify(this.${el.vModel}Options)),'pid','id','children',${el.showRoot})},`)
    if (el['show-checkbox']) {
      extraDataList.push(`${el.vModel}TreeIsChecked:true,${el.vModel}TreeCheckedKeys:[],`)
    }
    buildTreeTools(el, buildOpts)
  }
  // 单行文本
  if (el.tag === 'el-input' && el.serialNumber) {
    if (el.vModel === undefined) return
    formDataList.push(`${el.vModel}SequenceNo:'${el.serialNumber}',`)
    buildInputSequenceNo(el, buildOpts)
    mountedList.push('this.getSequenceNo()')
  }
  if (el.tag === 'el-input' && el.isDebounce) {
    mountedList.push(`window.${el.vModel}timeout=null`)
  }
  if (el.layout === 'formDetail') { // 表单详情
    if (el.componentName === undefined) return
    extraDataList.push(`formDetailData_${el.componentName}: ${JSON.stringify(el.formDetailData)},`)
  }

  // 下拉选项、单选多选框、表单等初始值
  if (el.layout === 'formContainer') { // 表单控件，设置默认数据
    extraDataList.push(`formContainerInitData: ${(el.dataSource.staticData || '{}').replace(/\n|\r\n|\s/g, '')},`)
  } else if (el.options || el.data || el?.dataSource?.type === 'data') { // 数据源类型为'data'，使用静态数据
    buildOptions(el, buildOpts)
  }

  // 级联选择el-cascader的属性
  if (el.props) {
    buildProps(el, buildOpts)
  }

  // 文件上传
  if (el.tag === 'el-upload') {
    extraDataList.push(
      `${el.vModel}UploadAction: '${el.action}',
      ${el.vModel}fileList: [],
      ${el.vModel}limit: ${el.limit},
      ${el.vModel}fileName: '${el.fileName}',
      ${el.vModel}fileDir: '${el.fileDir}',
      ${el.vModel}sizeUnit: '${el.sizeUnit}',
      ${el.vModel}fileSize: ${el.fileSize},
      ${el.vModel}accept: '${el.accept}',
      ${el.dataSource && el.dataSource.listId ? `${el.vModel}sqlId : '${el.dataSource.listId}',` : ''}
      ${el.type === 'import' ? `'${el.vModel}relateData':'${el.relateData}',` : ''}
      `
    )
    methodsList.push(buildOnExceed(el, buildOpts))
    methodsList.push(buildBeforeUpload(el, buildOpts))
    if (el.type === 'import') {
      methodsList.push(buildDoImport(el, buildOpts))
    } else {
      methodsList.push(buildDoUpload(el, buildOpts))
    }
    methodsList.push(buildOnUploadChange(el, buildOpts))
    methodsList.push(buildOnUploadRemove(el, buildOpts))
    methodsList.push(buildHandlePreview(el, buildOpts))
    methodsList.push(buildPreviewDialog(el, buildOpts))
    if (!el['auto-upload']) {
      methodsList.push(buildSubmitUpload(el))
    }
    if (el.accept === 'image/*') {
      extraDataList.push(
        `${el.vModel}base64: '',`
      )
    }
  }

  // 锁定页面
  if (el.isLockPage) {
    const fieldId = getFieldId(el)
    extraDataObj.lockPageFieldIdArr.push(fieldId)
  }

  if (el.children) {
    if (Array.isArray(el.children)) { // 数组
      el.children.forEach(el2 => {
        buildAttributes(el2, buildOpts)
      })
    } else { // 对象
      Object.keys(el.children).forEach(key => {
        buildAttributes(el.children[key], buildOpts)
      })
    }
  }
}

// 构建对应组件的参数对象
function buildComponentParams(data, arr) {
  let obj = {}
  if (arr) {
    arr.forEach(item => {
      if (item === 'data') {
        if (Object.keys(data.dataSource.optionParams).length > 0 && data.dataSource.listId) {
          obj[item] = []
        } else {
          obj[item] = data[item]
        }
      } else if (item === 'menuParams') {
        obj[item] = data.dataSource.optionParams
      } else {
        obj[item] = data[item]
      }
    })
  } else {
    obj = { ...data }
  }
  return JSON.stringify(obj)
}

// 混入methods方法
function mixinMethod(type) {
  // 默认confGlobal.formBtns为空 所以默认不加载这些方法
  const list = []
  const minxins = {
    file: confGlobal.formBtns ? { // 如果底部按钮存在
      submitForm: `submitForm() {
        this.$refs['${confGlobal.formRef}'].validate(valid => {
          if(!valid) return
          // TODO 提交表单
        })
      },`,
      resetForm: `resetForm() {
        this.$refs['${confGlobal.formRef}'].resetFields()
      },`
    } : null,
    dialog: {
      onOpen: 'onOpen() {},',
      onClose: `onClose() {
        this.$refs['${confGlobal.formRef}'].resetFields()
      },`,
      close: `close() {
        this.$emit('update:visible', false)
      },`,
      handelConfirm: `handelConfirm() {
        this.$refs['${confGlobal.formRef}'].validate(valid => {
          if(!valid) return
          this.close()
        })
      },`
    }
  }

  const methods = minxins[type]
  if (methods) {
    Object.keys(methods).forEach(key => {
      list.push(methods[key])
    })
  }
  return list
}

function buildFormDataList(conf, { formDataList }) {
  // 按钮的内容不需要作为data参数
  if (conf.vModel === undefined || conf.defaultValueType === 'selectedFirst' || ['button', 'iframe'].indexOf(conf.tagIcon) > -1) return

  // NOTE: conf.modelValue 作为默认值渲染到页面
  // let defaultValue = conf.modelValue ? `'${conf.modelValue}'` : 'null'
  let defaultValue = conf.defaultValue ? `'${conf.defaultValue}'` : 'null'
  if (Array.isArray(conf.defaultValue)) { // 预览的初始数据设置为空
    if (conf.tag === 'combo-tree') {
      // HACK: 兼容旧数据。现在已改为 undefined 或 ''。'combo-tree'在预览的时候，defaultValue作为data要求为数组，否则报错。但实际运行时要求的value是单个值，否则不能正确还原表单。
      // 表单中 combo-tree 的 defaultValue 在 Datasource\FormExtend.vue 中设置
      if (conf.defaultValue.length > 0) { [defaultValue] = conf.defaultValue }
    } else {
      defaultValue = '[]'
    }
  }
  formDataList.push(`${conf.vModel}: ${defaultValue},`)
}

// 添加页面的键盘事件 这里主要满足RF上enter改为tab的按键切换焦点功能
function buildPageKeyEvent(conf, options) {
  if (hasRender.buildPageKeyEvent) return
  hasRender.buildPageKeyEvent = true
  if (conf.enterToTab) {
    options.mountedList.push('this.$tool.addEnterListener(); ')
    options.destroyList.push('this.$tool.removeEnterListener(); ')
  }
}

function buildFormRulesList(conf, { formRulesList }) {
  if (conf.vModel === undefined) return
  const rule = ruleConf[conf.tag]
  if (!rule) { return }

  const rules = []
  const trigger = rule.trigger ? `trigger: '${rule.trigger}',` : ''
  // 必填校验
  if (conf.required) {
    const type = rule.type ? `type: '${rule.type}',` : ''
    const message = Array.isArray(conf.defaultValue)
      ? `请至少选择一个${conf.label}`
      : conf.placeholder || `${conf.label}不能为空`
    rules.push(`{ required: true, message: '${message}', ${type} ${trigger} }`)
  }
  // 正则校验
  if (conf.regList && Array.isArray(conf.regList)) {
    conf.regList.forEach(item => {
      if (item.pattern) {
        rules.push(`{ pattern: ${eval(item.pattern)}, message: '${item.message}', ${trigger} }`)
      }
    })
  }
  formRulesList.push(`${conf.vModel}: [${rules.join(',')}],`)
}

// 数据选项：下拉框、面包屑、折叠面板、轮播图等选项
function buildOptions(el, { extraDataList }) {
  if (el.vModel === undefined) return
  if (el.dataType === 'dynamic') { el.options = [] }

  if (el.dataSource && el.dataSource.type === 'data' && el.dataSource.staticData) { // 数据源类型为'data'，使用静态数据
    extraDataList.push(`${el.vModel}Options: ${el.dataSource.staticData.replace(/\n|\r\n|\s/g, '')},`)
  } else if (!el.dataSource && el.options) { // 没有数据源时，使用自定义选项
    extraDataList.push(`${el.vModel}Options: ${JSON.stringify(el.options)},`)
  } else {
    // 创建空对象，运行后通过接口注入数据
    extraDataList.push(`${el.vModel}Options:[],`)
  }
}

// 级联选择组件中配置字段映射关系的props对象
function buildProps(conf, { propsList }) {
  if (conf.dataType === 'dynamic') {
    conf.valueKey !== 'value' && (conf.props.props.value = conf.valueKey)
    conf.labelKey !== 'label' && (conf.props.props.label = conf.labelKey)
    conf.childrenKey !== 'children' && (conf.props.props.children = conf.childrenKey)
  }
  const str = `${conf.vModel}Props: ${JSON.stringify(conf.props.props)},`
  propsList.push(str)
}

/**
 * 实现把设计器生成的页面作为组件引入当前设计页面
 * @param {String} pageId 需要引入的页面id。
 * @param {Object} buildOpts { importList, componentsList }
 */
function importPageComponent(pageId, { importList, componentsList }) {
  if (!pageId) { return }
  if (importList.find(item => item.pageId === pageId)) { return }
  const pageName = `${pageComponentPreName}${pageId}`
  importList.push({
    pageId,
    exportName: pageName,
    src: `${pageComponentPath}${pageName}`
  })
  componentsList.push(`${pageName},`)
}

function buildComponentDialog(el, { extraDataList, methodsList }) {
  if (hasRender.buildComponentDialog) return
  hasRender.buildComponentDialog = true

  extraDataList.push(
    `componentDialogTitle: "",
    componentDialogPage: "",
    componentDialogOptions: "",
    isShowComponentDialog: false,
    dialogWidth:'',
    `
  )
  methodsList.push(
    `openComponentDialog(pageId, opts){
      this.componentDialogTitle = opts.title || ''
      this.dialogWidth = opts.dialogWidth || '100%'
      this.componentDialogPage = '${pageComponentPreName}' + pageId
      this.componentDialogOptions = opts
      this.isShowComponentDialog = true
    },`
  )
}
function buildPreviewDialog(el, { extraDataList, methodsList }) {
  if (hasRender.buildPreviewDialog) return
  hasRender.buildPreviewDialog = true
  extraDataList.push(
    `dialogImageUrl: "",
    isShowPreviewDialog: false,
    `
  )
}
function buildIframeDialog(el, { extraDataList, methodsList }) {
  if (hasRender.buildIframeDialog) return
  hasRender.buildIframeDialog = true
  extraDataList.push(
    `iframeDialogTitle: "",
    iframeDialogSrc: "",
    isShowIframeDialog: false,`
  )
  methodsList.push(
    `openIframeDialog(opts){
      this.iframeDialogTitle = opts.title || ''
      this.iframeDialogSrc = opts.src || ''
      this.isShowIframeDialog = true
    },`
  )
}
function buildDialog(el, buildOpts) {
  const { mountedList, methodsList } = buildOpts
  // NOTE: 弹窗全局唯一，参数不需要加特殊标识。弹窗相关配置只需要渲染一次。

  if (el.actionType === 'pageId') { // 选择内部页面
    importPageComponent(el.pageId, buildOpts)
    buildComponentDialog(el, buildOpts)
  } else {
    buildIframeDialog(el, buildOpts)
  }

  if (hasRender.buildDialog) return
  hasRender.buildDialog = true

  mountedList.push(`
    // 添加 postMessage 的监听
    window.addEventListener('message', this.handleMessage)
  `)

  methodsList.push(`
    handleMessage ({data}) {
      const {type = '', params} = data || {}
      if(!type) return
      if(type.indexOf('webpack') >= 0) return // webpack 自带消息。不作处理，避免报错提示。
      const tableId = params ? params.tableId : ''
      const relateActiveId = params ? params.relateActiveId : ''
      switch(type){
        case 'closeIframeDialog': // 关闭弹窗
          this.isShowIframeDialog = false
          break;
        case 'refreshTable': // 刷新表格数据
          if(relateActiveId && this.tableData)
            this.tableData(relateActiveId)
          if(tableId && this.tableData)
            this.tableData(tableId)
          break;
        case 'refreshInitData': // 刷新初始数据
          this.getOptionParams()
          break;
        case 'editDataSource':
          this.isShowIframeDialog = false
          const index = params ? params.index : ''
          this.${confGlobal.formModel}[tableId][index][params.buttonValue]=params.value
          break;
        case 'openMenu': // 打开新tab页面。生成SQL页面中使用
          // parentPage.postMessage( {type: 'openMenu', params: {menuId:"1274999878495662082"} });
          this.isShowIframeDialog = false;
          const menuId = params ? params.menuId : '';
          // this.$emit('click-menu', menuId, true);
          this.$EventBus && this.$EventBus.$emit('main.clickMenu', menuId, true)
          break;
        case 'refreshFrame':
          break;
        default:
          console.error('handleMessage[消息类型错误]', data)
      }
    },
    closeComponentDialog(params){
      this.isShowComponentDialog = false
    },
    closeIframeDialog(params){
      this.isShowIframeDialog = false
    },
    refreshTable(params){
      const tableId = params ? params.tableId : ''
      const relateActiveId = params ? params.relateActiveId : ''
      if(relateActiveId && this.tableData)
        this.tableData(relateActiveId)
      if(tableId && this.tableData)
        this.tableData(tableId)
    },
    refreshInitData(params){
      this.getOptionParams()
    },
    // 仅用于可编辑表格。TODO: 改为类似 afterDialogClose 的通用方法
    editDataSource(params){
      this.isShowIframeDialog = false
      const tableId = params ? params.tableId : ''
      const index = params ? params.index : ''
      if(params.type==='table'){
        this.${confGlobal.formModel}[tableId][index][params.buttonValue]=params.value
      }else if(params.type==='form'){
        this.${confGlobal.formModel}[params.buttonValue]=params.value
      }
    },`)
}

function buildLockPage({ computedList }) {
  if (hasRender.buildLockPage) return
  hasRender.buildLockPage = true
  const str = `isLockPage(){
    const { loadingMap = {}, lockPageFieldIdArr = [] } = this
    return !!lockPageFieldIdArr.find(id => {
      return loadingMap[id] === true
    })
  },`
  computedList.push(str)
}

function buildListPicker(conf, { methodsList }) {
  if (hasRender.buildListPicker) return
  hasRender.buildListPicker = true

  const str = `
  getListPickerConf({fieldId, tableId, tableObj}){
    const listPickerConf = this[fieldId + '_conf']
    if(!tableId){
      tableId = listPickerConf ? listPickerConf.listPickerTable_key : ''
    }
    if(!tableObj){
      tableObj = this.${confGlobal.formModel}[tableId+'Table']
    }
    return {fieldId, listPickerConf, tableId, tableObj}
  },

  /* 列表选择弹窗：组件查询 */
  queryListPicker(conf, queryObj){
    const {
      fieldId,
      listPickerConf,
      tableId, 
      tableObj = {}
    } = this.getListPickerConf(conf)
    // 根据主动控件更新列表查询条件
    const searchConf = this.optionParams[fieldId+'.initData']
    // TODO: 参考原有联动逻辑：若没有查询条件则不修改查询条件，不请求数据。
    if(!queryObj || !Object.keys(queryObj).length) {
      // 清空列表
      this[fieldId + 'Options'] = []
      this.${confGlobal.formModel}[tableId] = []
      // 清空选中
      this.clearListPicker(conf)
      
      return
    }
    // TODO: 参考表格检索功能：直接合并查询参数。是否需要清空旧值？
    this.$set(tableObj, 'search', { ...tableObj.search, ...queryObj})
    this.$set(searchConf, 'parameters', { ...searchConf.parameters, ...queryObj})
    // 更新列表，满足条件时自动选中
    this.getOptionParams(fieldId, (res)=>{
      const list = (res && Array.isArray(res.table_0)) ? res.table_0 : []
      console.log('列表选择弹窗：组件查询 after getOptionParams ===', list)
      this[fieldId + 'Options'] = list
      // 若组件必填，则自动选中
      const val = listPickerConf.required && list[0] 
        ?  list[0][listPickerConf.valueKey] : null
      this.changeListPicker(conf, val)
    })
    this.tableData(tableId, queryObj)
  },
  
  /* 列表选择弹窗：修改组件数据 
   * @param conf {Object}
   * @param val {Object|String|Number}
   */
  changeListPicker(conf, val){
    const {
      fieldId,
      listPickerConf, 
    } = this.getListPickerConf(conf)
    this.${confGlobal.formModel}[fieldId] = val
    this.getSubComponentsData(
      (val || val === 0) ? { [listPickerConf.valueKey]: val } : null, 
      fieldId
    )
  },

  /* 列表选择弹窗：根据列表当前行修改组件数据 */
  changeListPickerByCurrent(conf, autoClose = true){
    const {
      fieldId,
      listPickerConf, 
      tableObj = {}
    } = this.getListPickerConf(conf)
    if(!listPickerConf) return;
    const { valueKey } = listPickerConf
    const selectedObj = tableObj.currentRow;
    const selectedVal = selectedObj ? selectedObj[valueKey] : null;
    const isFind = (this[fieldId + 'Options']||[]).find(item => item[valueKey] === selectedVal)
    if(!isFind){
      this[fieldId + 'Options'].push(selectedObj)
    }
    this.changeListPicker(conf, selectedVal)
    if(autoClose){
      this.$set(listPickerConf, 'visible', false)
    }
  },

  /* 列表选择弹窗：取消 */
  cancelListPicker(conf){
    const {
      tableId, 
      tableObj = {}
    } = this.getListPickerConf(conf)
    tableObj.currentRow = null;
    this.$refs[tableId + 'Table'].setCurrentRow(null);
  },

  /* 列表选择弹窗：清空 */
  clearListPicker(conf){
    // const { fieldId } = conf
    // this[fieldId + 'Options'] = []
    this.cancelListPicker(conf);
    this.changeListPicker(conf, null)
  },

  /* 列表选择弹窗：设置弹窗内的表格高度 */
  setListPickerTableHeight(conf){
    const {
      tableId, 
      tableObj
    } = this.getListPickerConf(conf)
    if(!tableObj) return
    const tableWarp = document.querySelector(".table-warp[data-model=" + tableId + "]")
    if(!tableWarp) return
    const pickerWarp = this.$dom.getClosestDom(tableWarp, ".ui-list-picker--list-warp")
    const tableH = this.$dom.getElHeight(pickerWarp,["height"]) 
      - this.$dom.getElHeight(tableWarp.querySelector(".table-search-form")) 
      - this.$dom.getElHeight(tableWarp.querySelector(".el-pagination"))
    this.$set(tableObj, "height", tableH);
  },
  `
  methodsList.push(str)
}


// 导出
function buildExportExcel(conf, { methodsList }) {
  if (hasRender.buildExportExcel) return
  hasRender.buildExportExcel = true

  const exportExcelStr = `
  exportExcel(event, fieldId){
    console.log('exportExcel', event, fieldId)

    const dataSource = this[fieldId + '_dataSource']
    if(!this[fieldId + '_dataSource']){
      console.warn('缺少数据源相关配置', fieldId)
      return
    }
    const {type, listId, origin} = dataSource
    if(type !== 'url' || !listId){
      console.warn('导出数据源配置有误', fieldId)
      return
    }
    const paramList = {}
    if(dataSource.paramList){
      dataSource.paramList.forEach(item => {
        paramList[item.value] = this.getVueData(item.inputVal)
      })
    }
    this.$set(this.loadingMap, fieldId, true)
    this.$server.exportExcel(listId, paramList, origin).then(res => {
      window.location.href = res.filePath
    }).catch(err => {
      console.warn("[exportExcel]", fieldId, dataSource)
    }).finally(res => {
      this.$set(this.loadingMap, fieldId, false)
    })
  },
  `
  methodsList.push(exportExcelStr)
}

// 按钮执行服务 包括sql、事务流、微服务等
function buildExecuteServer(conf, buildOpts) {
  if (hasRender.buildExecuteServer) return
  hasRender.buildExecuteServer = true

  const { methodsList } = buildOpts
  executeServerMethod(conf, buildOpts)

  const str = `
    btn_executeServer(event, vModel){
      this.executeServer(vModel)
    },

    executeServer(fieldId, opts={}){
      if(!this[fieldId + '_dataSource']){
        console.warn('缺少数据源相关配置', fieldId)
        return
      }
      const serverInfo = opts.serverInfo || this.getServerInfo(this[fieldId + '_dataSource'], fieldId)
      this.executeServerMethod(serverInfo, {
        lockFieldId: fieldId,
        ...opts,
        serverInfo: undefined,
      })
    },
  `
  methodsList.push(str)
}

// 执行数据源请求
function executeServerMethod(conf, buildOpts) {
  if (hasRender.executeServerMethod) return
  hasRender.executeServerMethod = true

  buildNonsense(conf, buildOpts) // 防重复提交
  buildExecutCustomFn(conf, buildOpts)

  const str = `
    // HACK: 兼容表单数据源。
    // TODO: 修改表单数据源实现，统一实现方式
    getFormServerInfo(){
      return this.getServerInfo({
        type: this.dataType,
        listId: this.isEditPage ? this.editDataId : this.createDataId,
        flowId: this.flowId,
        microserviceId: this.microserviceId
      }, this.componentName)
    },

    /**
     * 获取数据请求信息
     * @param dsConf {Object}
     *    type {String} 'url'|'dataSource'|'flow'|'microservice'
     *    listId, flowId, microserviceId,
     *    param {Object} 数据源参数。如果有自定义参数，会覆盖该值。
     * @param fieldId {String} 数据源信息对应的组件名。用于获取自定义参数
     */
    getServerInfo(dsConf, fieldId){
      if(!dsConf){
        return {};
      }
      const serverType = dsConf.type
      let serverId, serverName, paramType
      switch(serverType){
        case 'url': // 数据源
        case 'dataSource': // 表格顶部按钮、行按钮数据源
          serverId = dsConf.listId
          serverName = 'executeSqls'
          paramType = 'data'
          break;
        case 'flow': // 事务流
          serverId = dsConf.flowId
          serverName = 'runTransflow'
          paramType = true
          break;
        case 'microservice': // 微服务
          serverId = dsConf.microserviceId
          serverName = 'executeMicro'
          paramType = ''
          break;
        default:
          return {};
      }

      // 获取参数
      let serverParam = dsConf.param
      if(fieldId && this[fieldId + '_$$param_fn']){ // 获取自定义参数
        serverParam = this.executCustomFn(this, undefined, this[fieldId + '_$$param_fn'])
      }
      if(serverParam === undefined){
        // 获取页面默认表单参数
        serverParam = {...this.${confGlobal.formModel}}
        Object.keys(serverParam).forEach(key=>{ // 删除表格配置数据
          if(key.indexOf('Table')>-1){
            delete serverParam[key]
          }
        })
      }
      // 参数加密
      const { needEncrypt = [] } = this
      if(needEncrypt.length > 0){
        needEncrypt.forEach(name => {
          if(serverParam[name]){
            serverParam[name] = this.$tool.Encrypt(serverParam[name])
          }
        })
      }

      return {
        fieldId,
        serverType,
        serverName,
        serverId,
        paramType,
        serverParam
      }
    },

    /**
     * 发送数据请求
     * @param serverInfo {Object}
     *    serverName, serverId, paramType, serverParam
     * @param opts {Object}
     *    lockFieldId,
     *    resoveFn, errorFn, finallyFn 请求回调方法。可接收 请求返回信息res 和 请求参数formData 两个参数。
     */
    async executeServerMethod(serverInfo, opts = {}){
      const {
        serverName, serverId, paramType, serverParam
      } = serverInfo
      const {
        lockFieldId, resoveFn, errorFn, finallyFn
      } = opts
      if (!serverName || !serverId) {
        console.warn('[executeServerMethod]缺少提交数据源配置！');
        typeof errorFn === 'function' && errorFn()
        typeof finallyFn === 'function' && finallyFn()
        return undefined;
      }
      // 发送请求
      if(lockFieldId){
        this.$set(this.loadingMap, lockFieldId, true)
      }
      const res = await this.$server[serverName](
          serverId, serverParam, paramType, this.getNonsense(serverParam, serverName+serverId)
        ).then(res => {
          // console.log('then res', res)
          this.$message({
            type:'success',
            message:'执行成功！'
          })
          // 更新防重复提交字段
          this.nonsensePre = this.$server.generateNonsensePre()
          typeof resoveFn === 'function' && resoveFn(res, serverParam)
        }).catch(err => {
          console.warn("[executeServerMethod]", serverName, serverId, serverParam, paramType, opts, err)
          typeof errorFn === 'function' && errorFn(res, serverParam)
        }).finally(res => {
          // console.log('finally res', res)
          if(lockFieldId){
            this.$set(this.loadingMap, lockFieldId, false)
          }
          typeof finallyFn === 'function' && finallyFn(res, serverParam)
        })
      // console.log('await res', res)
      return res
    },
  `
  buildOpts.methodsList.push(str)
}

function buildDataSource(conf, { extraDataObj, methodsList }) {
  const { dataSource } = conf
  if (!dataSource
    || !dataSource.type
    || (dataSource.type === 'url' && !dataSource.listId)) {
    return
  }
  const { paramType, param_json, param_fnBody } = dataSource
  const fieldId = getFieldId(conf)

  // 添加数据源配置
  const dsCopy = { ...dataSource }
  // 删除数据源自定义请求参数。这部分数据会写入到 $$param_fn 中，这里不需要提供
  delete dsCopy.optionParams
  delete dsCopy.paramType
  delete dsCopy.param_json
  delete dsCopy.param_fnBody
  // 添加数据源自带的请求参数
  if (!paramType && conf.tag === 'el-button') { // NOTE: 暂时限制组件类型，避免与 optionParams 数据重复。
    dsCopy.paramList = (conf.initDataOptions || []).map(item => {
      const itemCopy = { ...item }
      delete itemCopy.label
      return itemCopy
    })
  }
  extraDataObj[`${fieldId}_dataSource`] = dsCopy

  // 添加获取自定义参数方法
  let fnBody = ''
  if (paramType === '$$_json') {
    if (!param_json) { return }
    fnBody = `return ${param_json}`
  } else if (paramType === '$$_fn') {
    if (!param_fnBody) { return }
    fnBody = param_fnBody
  } else {
    return
  }
  const fnName = `${fieldId}_$$param_fn`
  const fnStr = `
    ${fnName}(){
      try {
        return (function(){
          const { formData, page } = this
          ${fnBody}
        }).call(this)
      } catch (e) {
        console.error('[${fnName} error]');
        return undefined;
      }
    },
  `
  methodsList.push(fnStr)
}
function buildResoveFn(conf, { methodsList }) {
  const { dataSource } = conf
  if (!dataSource
    || !dataSource.isResoveFn) {
    return
  }
  const {
    isResoveFn, resoveFn
  } = dataSource
  const fieldId = getFieldId(conf)
  // 添加成功的返回函数方法
  let resoveFnBody = ''
  if (isResoveFn && resoveFn) {
    resoveFnBody = resoveFn
  } else {
    return
  }
  const resoveFnName = `${fieldId}_$$resove_fn`
  const resoveFnStr = `
    ${resoveFnName}(res,serverParam){
      try {
        return (function(res,serverParam){
          const { formData, page } = this
          ${resoveFnBody}
        }).call(this,res,serverParam)
      } catch (e) {
        console.error('[${resoveFnName} error]');
        return undefined;
      }
    },
  `
  methodsList.push(resoveFnStr)
}

function buildExecutCustomFn(conf, { methodsList }) {
  const fnStr = `
    executCustomFn(context, errReturn, fn, ...arg){
      if(!fn || typeof fn !== 'function')
        return errReturn
      try{
        return fn.call(context, ...arg)
      }
      catch(err){
        console.warn('自定义方法执行失败', fn, err)
        return errReturn
      }
    },
    `
  methodsList.push(fnStr)
}

// 上传之前
function buildBeforeUpload(conf, { methodsList }) {
  if (hasRender.buildBeforeUpload) return
  hasRender.buildBeforeUpload = true
  const str = `beforeUpload(arg,vModel) {
    let file=arg[0]
    const units = {
      KB: 1024,
      MB: 1024 * 1024,
      GB: 1024 * 1024 * 1024
    }
    const unitNum = units[this[vModel+'sizeUnit']];
    let isRightSize,isAccept
    if(this[vModel+'fileSize']){
      isRightSize = file.size / unitNum < this[vModel + 'fileSize']
      if (!isRightSize) {
        this.$message({
          showClose: true,
          type: 'error',
          message: '文件大小不能超过 '+this[vModel+'fileSize']+this[vModel+'sizeUnit']
        })
        return false
      }
    }
    if (this[vModel+'accept']) {
      isAccept = new RegExp(this[vModel + 'accept']).test(file.type)
      if(!isAccept){
        this.$message({
          showClose: true,
          type: 'error',
          message: '应该选择'+this[vModel+'accept']+'类型的文件'
        })
        return false
      }
    }
    return isRightSize && isAccept
  },`
  // return returnList.length ? str : ''
  methodsList.push(str)
}

function buildOnExceed(conf, { methodsList }) {
  if (hasRender.buildOnExceed) return
  hasRender.buildOnExceed = true
  const str = `onExceed([files, fileList],vModel) {
    this.$message({
      showClose: true,
      type: 'warning',
      message: '最多允许选择 '+this[vModel+'limit']+' 个文件！'
    })
  },`
  methodsList.push(str)
}

// NOTE: 暂不考虑多文件
function buildDoUpload(conf, { methodsList }) {
  if (hasRender.buildDoUpload) return
  hasRender.buildDoUpload = true
  const str = `doUpload(params,vModel) {
    // 根据后台需求数据格式
    const formDataObj = new FormData();
    const {file, onProgress, onSuccess, onError} = params[0];
    const {name} = file;
    // 文件对象
    formDataObj.append('form', file);
    // 添加其他属性

    let fileName = name;
    if(this[vModel+'fileName']){
      const fileType = name.substring(name.lastIndexOf('.'), name.length);
      const index = this[vModel+'fileList'].length
      fileName = this[vModel+'fileName'] === fileType
        ? this[vModel+'fileName']
        : this[vModel+'fileName'] + (index ? index : '') + fileType
    }
    formDataObj.append('fileDir',  this[vModel+'fileDir'] || '');
    formDataObj.append('fileName', fileName);
    if(this[vModel+'accept']==='image/*'){
      const self = this
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload  = function(){
        let img_base64 = this.result
        self[vModel+'base64']=img_base64.replace("data:image/jpg;base64,","").replace("data:image/jpeg;base64,","").replace("data:image/png;base64,","")
      }
    }
    this.$server.upload(formDataObj).then(res => {
      onSuccess()
      this.${confGlobal.formModel}[vModel] = res
    }).catch(() => {
      onError()
    });
  },`
  methodsList.push(str)
}
function buildHandlePreview(conf, { methodsList }) {
  if (hasRender.buildHandlePreview) return
  hasRender.buildHandlePreview = true
  const str = `handlePreview(params,vModel) {
    const {name}=params[0]
    this.isShowPreviewDialog=true
    this.dialogImageUrl='http://10.1.21.3:8050/file/prod/'+name
  },`
  // return str
  methodsList.push(str)
}
function buildDoImport(conf, { methodsList }) {
  if (hasRender.buildDoImport) return
  hasRender.buildDoImport = true
  const str = `doUpload(params,vModel) {
    // 根据后台需求数据格式
    const formDataObj = new FormData();
    const {file, onProgress, onSuccess, onError} = params[0];
    const {name} = file;
    // 文件对象
    formDataObj.append('form', file);
    formDataObj.append('sqlId', this[vModel+'sqlId']);
    this.$server.importExcel(formDataObj).then(res => {
      onSuccess()
      this.$message({
        type: 'success',
        message: res
      })
      this[vModel+'fileList'] = []
      this.tableData(this[vModel+'relateData'])
    }).catch(() => {
      onError()
    });
  },`
  methodsList.push(str)
}

function buildOnUploadChange(conf, { methodsList }) {
  if (hasRender.buildOnUploadChange) return
  hasRender.buildOnUploadChange = true
  const str = `onUploadChange([files, fileList],vModel) {
    this[vModel+'fileList'] = fileList
  },`
  methodsList.push(str)
}

// NOTE: 暂不考虑多文件
function buildOnUploadRemove(conf, { methodsList }) {
  if (hasRender.buildOnUploadRemove) return
  hasRender.buildOnUploadRemove = true
  const str = `onUploadRemove([files, fileList],vModel) {
    this[vModel+'fileList'] = fileList
    this.${confGlobal.formModel}[vModel] = ''
  },`
  methodsList.push(str)
}

// 执行上传操作
function buildSubmitUpload(conf) {
  const str = `submitUpload() {
    this.$refs['${conf.vModel}'].submit()
  },`
  return str
}

// 动态操作选项卡的方法
function buildTabContainerMethod(el, { methodsList }) {
  const str = `
  //添加选项卡
  addTab(tabObj,comId){
    const indexVal=tabObj.id
    let existBool=false
    let tabsArr=this[comId+'Options']
    //查找已展开的tab项
    for(let i=0;i<tabsArr.length;i++){
      if(tabsArr[i].id==indexVal){
        existBool=true;
        break;
      }
    }
    if(existBool){
      this[comId+'CurrentTabValue'] = indexVal
      return false;
    }

    //根据href的值动态处理
    let hrefStr=''
    if (baseUrl.toLocaleLowerCase().startsWith('http')) {
      hrefStr = baseUrl + '?sessionKey=' + this.getUrlParam('sessionKey') + '&partVersionId=' + tabObj.menu_href
    }else {
      hrefStr = baseUrl + tabObj.menu_href + '.html'
    }

    this[comId+'Options'].push({...tabObj,...{menu_href:hrefStr}})
    this[comId+'CurrentTabValue'] = indexVal
  },
  //删除选项卡
  removeTab(targetName,comId){
    let tabsArr=this[comId+'Options']
    let activeName = this[comId+'CurrentTabValue'];
    if (activeName === targetName) {
      tabsArr.forEach((tab, index) => {
        if (tab.id === targetName) {
          const nextTab = tabsArr[index + 1] || tabsArr[index - 1];
          if (nextTab) {
            activeName = nextTab.id;
          }
        }
      })
    }
    this[comId+'CurrentTabValue'] = activeName
    this[comId+'Options'] = tabsArr.filter(tab => tab.id !== targetName)
  },
  `
  methodsList.push(str)
}

// 表单、其他控件页面 请求数据方法
function buildOtherParamsMethod(el, { methodsList }) {
  const str = `
  //请求页面对应的下拉、多选等选择数据
  getOptionParams(comId, callback){
    if(!this.optionParams){return false}
    let keyArr=Object.keys(this.optionParams)

    // 创建页面不请求 initData
    if(!this.isEditPage)
      keyArr=keyArr.filter(key=>key!=='initData')

    //加入表单作为被动控件的逻辑
    if(comId==='onlyInitData'){  //仅请求表单的初始数据
      keyArr=['initData']
    }else if(comId){ //只请求当前项
      // keyArr=keyArr.filter(key=>key.indexOf('initData')===-1||key===comId+'.initData') //表单控件的写法
      keyArr=keyArr.filter(key=>key===comId+'.initData')
    }else{
      // keyArr=keyArr.filter(item=>!this[item.split('.')[0]+'RelatedOptions'])  //过滤掉作为被动控件
      // 过滤掉的话从表的数据字典数据无法获取，暂时先不过滤
    }
    if(keyArr.length===0){return false}

    //将动态参数page.xxx转为页面变量
    let paramsArr = keyArr.map(key=>{
      const { sqlId, parameters={}} = this.optionParams[key]
      const pageParams = {}
      Object.keys(parameters).forEach(item => {
        let val = parameters[item]
        if(val && val.toString().match(${/^page\./})){
          pageParams[item] = this.getVueData(val) || ''
        }
      })
      return {
        sqlId,
        parameters: {
          ...parameters,
          ...pageParams
        }
      }
    })

    //执行初始所有请求
    this.$server.allExecuteSqls(paramsArr).then(result=>{
      let searchSelectedTableArr=[]  //将搜索条件中含有默认选中项的表格添加到数组中
      keyArr.forEach((key,index)=>{
        const fieldArr=key.split('.')
        const mainFieldId=fieldArr[0]
        const resultArr=result['table_'+index]
        if(key==='initData'){  //给表单页面控件赋初始值
          const initObj=resultArr[0]
          if(!initObj){  //请求到的数据为空
            this.$refs['elForm'].resetFields()
            this.assignParams()
            return false;
          }
          this.$nextTick(()=>{
            Object.keys(this.${confGlobal.formModel}).forEach(field=>{
              if(initObj[field]!==undefined&&initObj[field]!==null){
                this.${confGlobal.formModel}[field]=initObj[field].toString()
              }
            })
          })
        }else if(key.indexOf('.initData')>-1){  //其他单个控件请求数据
          const fieldStr=mainFieldId+'Options'
          const formDetailFieldId='formDetailData_'+mainFieldId // 表单详情数据
          if(this[formDetailFieldId]){
            this[formDetailFieldId]= resultArr ? resultArr[0] : undefined
          }
          else if(this[fieldStr]){
            this[fieldStr]=JSON.parse(JSON.stringify(resultArr))
            const defaultValueStr=mainFieldId+'DefaultValue'
            if(this[fieldStr].length>0&&this[defaultValueStr]&&this[defaultValueStr].type==='selectFirst'){  //默认值赋值第一项
              this.${confGlobal.formModel}[mainFieldId]=this[fieldStr][0][this[defaultValueStr].field]
            }
          }
          if(this[mainFieldId+'TreeIsChecked']){  //树形选择 默认勾选
            this.getDefaultCheckedKeys(resultArr,mainFieldId)
          }

          if(!resultArr.length){  //当请求的返回值为空 需要清空联动下级
            this.getSubComponentsData(null,mainFieldId)
            return false
          }

          // if(fieldArr.length===2){ //其他控件
          //TODO：目前需要判断 是否给主动控件加默认数据项  可以考虑在配置项中加个是否默认赋动态值（如默认赋第一项的值）

          let passiveOptions=this[mainFieldId+'PassiveOptions']
          if(passiveOptions){ //有关联下级 才考虑下级赋初始值
            let targetData=null
            if(['select','comboTree','listPicker'].indexOf(passiveOptions[0].selfType)>-1){ //自身为下拉框、树形下拉默认值处理
              const defaultValueStr=mainFieldId+'DefaultValue'
              if(!this[defaultValueStr]||(this[defaultValueStr].type!=='selectFirst'&&!this[defaultValueStr].value)){
                this.${confGlobal.formModel}[mainFieldId]=null
              }
            }else{
              this.${confGlobal.formModel}[mainFieldId]=this[fieldStr][0]  //树形选择、主从表默认值为数组中第一项
              targetData=this[fieldStr][0]
            }
            this.getSubComponentsData(targetData,mainFieldId)
          }

        }else{ // filter、search
          const optionArr=resultArr.map(sub => {
            sub.value = sub.id
            if (sub.selected&&fieldArr[1]!='filter') { //默认选择的项  过滤没有
              if(fieldArr.length===1){ //表单
                this.${confGlobal.formModel}[key] = sub.id
              }
              // else if(fieldArr.length===3){ //表格
              //   searchSelectedTableArr.push(mainFieldId)
              //   let attrKey=this.${confGlobal.formModel}[mainFieldId + 'Table'][fieldArr[1]][fieldArr[2]]
              //   if(typeof attrKey ==='object'){  //如果是多选框 则添加到选中数组中
              //     if(!attrKey.find(id=>id===sub.id)){
              //       attrKey.push(sub.id)
              //     }
              //   }else {
              //     this.${confGlobal.formModel}[mainFieldId + 'Table'][fieldArr[1]][fieldArr[2]] = sub.id
              //   }
              // }
            }
            return sub
          })
          if(fieldArr.length===1){ //表单
            this[key+'Options']=optionArr
          }else if(fieldArr.length===3){ //表格
            this.${confGlobal.formModel}[mainFieldId+'Table'][fieldArr[1]+'Options'][fieldArr[2]] = optionArr
          }
        }
      })
      //考虑表格搜索条件中有默认选中的情况 有则刷新表格数据
      searchSelectedTableArr.forEach(tableName=>{
        this.tableData(tableName)
      })

      if(callback && typeof callback === 'function'){
        callback(result)
      }
    })
  },
  `
  methodsList.push(str)
}

// 表单控件 添加方法  请求页面对应的下拉、多选等选择数据
function buildFormParamsMethod(el, buildOpts) {
  if (hasRender.buildFormParamsMethod) return
  hasRender.buildFormParamsMethod = true

  buildUtilTools(el, buildOpts)
  const {
    methodsList
  } = buildOpts


  const str = `
  /**
   * 判断当前页面是否为编辑
   * 判断规则：初始数据参数有赋值，且数据类型为事务流或有配置编辑数据源
   * 判断当前页面是否需要初始数据 optionparams中有initData，且页面所有需要的参数都传了并且配置了编辑数据源
   */
  judgeIsEdit(){
    if(!this.optionParams.initData || !this.optionParams.initData.parameters){
      console.info('[judgeIsEdit]不存在初始请求参数，页面类型为创建。')
      return
    }
    const initParams=this.optionParams.initData.parameters
    const formModelKeys = Object.keys(this.${confGlobal.formModel})
    const initParamsKeys = Object.keys(initParams)
    const isEditPage= initParamsKeys.every(key=>{ //判断、同时赋值
      let val = initParams[key]
      if(val && val.toString().match(${/^page\./})){
        val = this.getVueData(val) || ''
      }
      if(val){ //需要修改页面的初始数据的参数
        initParams[key]=val //NOTE: 修改了原配置，之后初始值不会再跟随URL参数改变
        if(formModelKeys.indexOf(key) >= 0){
          this.${confGlobal.formModel}[key]=val
        }
      }
      return !!val
    })
    console.log('isEditPage', isEditPage, 'editDataId', this.editDataId)
    this.isEditPage= !!(isEditPage&&(this.dataType === 'flow'||this.dataType === 'microservice' || this.editDataId))
  },
  `
  methodsList.push(str)
  buildOtherParamsMethod(el, buildOpts)
}
// 页面复用的一些方法 获取页面url中的参数
function buildUtilTools(el, { extraDataList, methodsList }) {
  if (hasRender.buildUtilTools) return
  hasRender.buildUtilTools = true

  extraDataList.push(`page: {
    ...this.getUrlParam(),
    ...(this.pageParams ? {
      ...this.pageParams,
      ...this.pageParams.params,
    } : {})},
    `)

  const str = `
    // 其他控件的数据选择事件
    handlerDataChange(val, comId,callback){
      if(this.${confGlobal.formModel}[comId]){
        this.${confGlobal.formModel}[comId] = val
      }
      //回调函数
      if(callback){
        this[callback](val)
      }
      this.getSubComponentsData(val, comId)
    },
    /**
     * 遍历并获取关联的被动控件的数据
     * @param {Object} val 主动控件触发被动 传递的数据对象
     * @param {String} comId 主动控件的组件id
     * TODO: 合并表单、表格和其他控件的获取下级数据的方法
     */
    getSubComponentsData(val,comId){
      const passiveOptions=this[comId+'PassiveOptions']
      if(!passiveOptions) return
      console.log('主动控件变化==', val, comId, '被动控件列表==',passiveOptions)
      passiveOptions.forEach(option=>{
        const {id, type} = option
        // 查询条件。TODO: 删除联动条件时，也应该更新条件。但目前无法区分初始化时的空数据和删除联动条件的场景
        let queryObj
        if((val || val === 0) && this[id+'RelatedOptions']){
          queryObj = {}
          const isObjectVal = val && typeof val === 'object'
          this[id+'RelatedOptions'].forEach(item=>{
            queryObj[item.subField] = isObjectVal ? val[item.mainField] : val
          })
        }

        if(type === 'listPicker'){ //列表弹窗选择
          this.queryListPicker({ fieldId: id }, queryObj)
        }else if(type === 'table'){
            if(val){
              this.tableData(option.id, val)
            }else{
              this.${confGlobal.formModel}[option.id]=[]
              const tableObj = this.${confGlobal.formModel}[id+'Table'] || {}
              tableObj.currentRow = null
              this.getSubComponentsData(null,option.id)
            }
          }else if(option.type==='tabContainer'){ //选项卡
            this.addTab(val,option.id)
          }else if(option.type==='select'){ //下级为select
            this.${confGlobal.formModel}[option.id]=null
            if(val){
              if(this[option.id+'RelatedOptions'][0].subField){
                this.optionParams[option.id+'.initData'].parameters[this[option.id+'RelatedOptions'][0].subField]=this.${confGlobal.formModel}[comId]
              }
              this.getOptionParams(option.id)
            }else{
              this.getSubComponentsData(null,option.id)
            }
          }else if(option.type==='formContainer'){ //下级为表单
            this[option.id+'RelatedOptions'].forEach(item=>{
              this.optionParams.initData.parameters[item.subField]=val[item.mainField]
            })
            this.getOptionParams('onlyInitData')
          }else if(option.type==='tree'){ //下级为树形选择
            this[option.id + 'RelatedOptions'].forEach(item => {
              this.optionParams[option.id + '.initData'].parameters[item.subField] = val[item.mainField]
            })
            this.getOptionParams(option.id)
          }
        })
    },

    // 获取页面 url 参数
    getUrlParam(name, href) {
      const paramsObj = this.$tool.getUrlParam(name, href)
      console.log('getUrlParam paramsObj:', paramsObj)
      return paramsObj
    },

    /**
     * 获取数据
     * expamle: getVueData('a.b.c') => this.a.b.c，失败返回 undefined
     */
    getVueData(keyStr, obj = this) {
      if (!keyStr){
        console.error('[getVueData() error]no keyStr');
        return undefined;
      }
      try {
        return keyStr.split('.').reduce(function (o, s) {
          return o[s];
        }, obj);
      } catch (e) {
        console.error('[getVueData() error]keyStr: ', keyStr);
        return undefined;
      }
    },

    /**
     * 在iframe弹窗页面中关闭弹窗
     * NOTE: 函数名不规范。该方法的作用的关闭弹窗。
     */
    doCloseForm(){
      this.$emit('closeIframeDialog')
      this.$emit('closeComponentDialog')
    },
    // 需要给父页面可编辑的表格中的某一列赋值的保存方法
    saveFormDataToParent(selectRows, btnOpts, params, tableId, scope){
      this.$refs.${confGlobal.formRef}.validate((valid) => {
        if (!valid) {
          console.warn('valid error!!');
          return false;
        }
        if (this.page && this.page.tableId){
          let columnValue='',typeStr='form'
          if(selectRows){
            typeStr='table'
            let selectArr=Array.isArray(selectRows)?selectRows[0]:selectRows
            Object.keys(selectArr).forEach(key=>{
              if(key===this.page.columnValue){
                columnValue=selectRows[key]
              }
            })
          }else{
            typeStr='form'
            columnValue=this.${confGlobal.formModel}[this.page.columnValue]
          }
          this.$emit('editDataSource', {
            index: this.page.tableIndex,
            tableId: this.page.tableId,
            buttonValue: this.page.columnValue,//点击的是哪一列
            value:columnValue, //点击保存要回传给父页面的数据,
            type:typeStr //赋值给表格还是赋值给表单
          })
        }
      })
    },
    `
  methodsList.push(str)
}
// 将一维数组转化为树形结构
function buildTreeTools(el, { methodsList }) {
  if (hasRender.buildTreeTools) return
  hasRender.buildTreeTools = true
  const str = `
  // 将一维数组转化为树形结构
  arrayToTree(array, pid, id, childrensKey,showRoot) {
    if(!showRoot){
      const arrayArr = (array || []).map(item => {
        if (item.pid === -1) return {}
        return item
      })
      array=arrayArr
    }
    if (typeof childrensKey === 'undefined') childrensKey = 'children'
    array.splice(0, array.length, ...array.filter((item, i) => {
      const parent = array.find(compare => item[pid] === compare[id])
      if (parent) {
        if (!Array.isArray(parent[childrensKey])) {
          parent[childrensKey] = []
        }
        parent[childrensKey].push(item)
        return false
      }
      return true
    }))
    return array
  },
  //树中默认选择的keys
  getDefaultCheckedKeys(data,comId){
    const defaultCheckedKeys=[]
    data.forEach(item => {
      if (item.selected === 1) {
        defaultCheckedKeys.push(item.id)
      }
    })
    this[comId+'TreeCheckedKeys']=defaultCheckedKeys
    this.$refs[comId+'Tree'].setCheckedKeys(defaultCheckedKeys)
  },
  // 复选框的选择事件
  checkNode(currentNodes,checkedObj,comId){
    this[comId + 'TreeCheckedKeys'] = checkedObj.checkedKeys
  },
  /**
   * 获取树中所有选中的节点
   * @param leafOnly 是否只包含叶子节点。默认为 false。
   */
  getTreeCheckedKeys(treeId, leafOnly = false){
    const treeObj = this.$refs[treeId]
    if(!treeObj){
      console.warn('找不到 treeId')
    }
    const keys = treeObj.getCheckedKeys()
    if(leafOnly)
      return keys
    const halfKeys = treeObj.getHalfCheckedKeys()
    return keys.concat(halfKeys)
  },
  `
  methodsList.push(str)
}

// 获取iframe高度
function iframeHeight(el, { methodsList }) {
  const getIframeHeight = `getIframeHeight(){
    const oIframe = document.getElementsByClassName('nti_iframe')[0]
    const deviceHeight = document.documentElement.clientHeight
    oIframe.style.height = (Number(deviceHeight)-56) + 'px'
  },
  `
  methodsList.push(getIframeHeight)
}
// 单行文本的流水号
function buildInputSequenceNo(el, { methodsList }) {
  const sequenceNo = `getSequenceNo(){
    this.$server.getSequenceNo(['${el.serialNumber}']).then(res => {
      this.${confGlobal.formModel}.${el.vModel} = res['${el.serialNumber}'][0]
    })
  },
  `
  methodsList.push(sequenceNo)
}
// 表格、分页的事件
function buildTableMethod(el, buildOpts) {
  if (hasRender.buildTableMethod) return
  hasRender.buildTableMethod = true

  buildUtilTools(el, buildOpts)
  buildExecutCustomFn(el, buildOpts)

  const {
    methodsList,
    mountedList,
    buildType
  } = buildOpts

  let str = `
  // 表格搜索默认参数。已通过 search记录关联数据
  setTableSearchParams(tableId){
    const tableObj=this.${confGlobal.formModel}[tableId+'Table']
    if(!tableObj || !tableObj.search) return
    Object.keys(tableObj.search).forEach(key => {
      let val = tableObj.search[key]
      if(val && typeof val!=='object' && val.toString().match(${/^page\./})){
        val = this.getVueData(val)
        // 避免把“page.XXX”这样的配置渲染到页面
        tableObj.search[key] = val || ''
      }
    })
  },

  //表格搜索表单重置
  resetTableForm(tableId){
    const tableObj=this.${confGlobal.formModel}[tableId+'Table']
    if(tableObj.search){
      Object.keys(tableObj.search).forEach(key => {
        tableObj.search[key] = ''
      })
    }
  },

  toggleTableTopBtn(tableId){
    const tableObj=this.${confGlobal.formModel}[tableId+'Table']
    this.$set(tableObj, 'showMoreTopBtn', !tableObj.showMoreTopBtn)
  },

  //表格获取数据
  tableData(tableId, activeObj) {
    if(!this[tableId + '_dataSource']){
      console.warn('缺少数据源相关配置', tableId)
      return
    }
    const tableObj=this.${confGlobal.formModel}[tableId+'Table']
    const {type,listId,microserviceId}=this[tableId + '_dataSource']
    if(!listId&&!microserviceId){
      return false
    }
    let relatedObj={}
    if(activeObj!==undefined&&this[tableId+'RelatedOptions']){ //关联上级
      this[tableId+'RelatedOptions'].forEach(item=>{
        relatedObj[item.subField]=activeObj[item.mainField]!==undefined?activeObj[item.mainField]:activeObj
      })
    }
    let paramObj={}
    if(tableObj.search){
      tableObj.search = {...tableObj.search, ...relatedObj}
      paramObj={...tableObj.search}
    }

    const lockFieldId = tableId + '_search'
    this.$set(this.loadingMap, tableId, true)
    this.$set(this.loadingMap, lockFieldId, true)
    let pageServerName= '',nopageServerName='',tableSqlId
    if(type==='url'){
      pageServerName='selectDataPage'
      nopageServerName='executeSqls'
      tableSqlId=listId
    }else if(type==='microservice'){
      pageServerName='selectMicroDataPage'
      nopageServerName='executeMicro'
      tableSqlId=microserviceId
    }
    if(tableObj.noPaging){
      this.$server[nopageServerName](tableSqlId, paramObj).then(res => {
        this.afterFetchTable(tableId, res)
      }).catch(err => {
        console.warn("[tableData]", tableSqlId, paramObj, err)
      }).finally(res => {
        this.$set(this.loadingMap, tableId, false)
        this.$set(this.loadingMap, lockFieldId, false)
      })
    }else{
      const { pagination, sortConf } = tableObj
      this.$server[pageServerName](
        tableSqlId,
        pagination.currentPage,
        pagination.pageSize,
        paramObj,
        sortConf
      ).then(res => {
        const pageData = res.page || {}
        tableObj.pagination.total = pageData.totalCount
        this.afterFetchTable(tableId, pageData.rows)
      }).catch(err => {
        console.warn("[tableData]", tableSqlId, paramObj, pagination, err)
      }).finally(res => {
        this.$set(this.loadingMap, tableId, false)
        this.$set(this.loadingMap, lockFieldId, false)
      })
    }
  },

  afterFetchTable(tableId, data=[]){
    const tableObj=this.${confGlobal.formModel}[tableId+'Table']
    if(!tableObj) return
    this.$set(tableObj, 'selectRowArr', []) // 清除选中
    this.${confGlobal.formModel}[tableId] = this.rowCompareColumn(data, tableId)

    const {length} = data
    const currentRow = data.length > 0 ? data[0]  : null
    tableObj.currentRow = currentRow
    
    if(!currentRow){
      this.getSubComponentsData(null, tableId)
    }else{
      // this.$nextTick(() => {
      //   this.$refs[tableId + 'Table'].setCurrentRow(currentRow);
      //   ${el.bottomSummary.showSummary ? 'this.$refs[tableId+\'Table\'].doLayout()' : ''}
      // })
    }
  },

  //表格的行数据和列数据进行比对，给行数据加上列数据有的字段
  rowCompareColumn(rowArr,tableId){
    if(rowArr.length===0){
      return []
    }
    let tableColumnArr = this.${confGlobal.formModel}[tableId+'Table'].tableColumnArr
    let otherObj={}
    tableColumnArr.forEach(item=>{
      otherObj[item.value] = ''
    })
    return rowArr.map(rowItem=>({...otherObj, ...rowItem}))
  },

  // 表格排序
  // NOTE: 不支持多列排序。SQL中可能已存在默认排序，默认排序作为第一顺序。
  handleSortChange({ column, prop, order }, tableId){
    const tableObj=this.${confGlobal.formModel}[tableId+'Table']
    this.$set(tableObj, 'sortConf', order ? {
      sort: prop,
      order: order === 'ascending' ? 'asc' : 'desc'
    } : {})
    this.tableData(tableId)
  },

  //表格行选中事件
  handleCurrentChange(val,tableId){
    console.log('表格选中行变化',val,tableId)
    if(!val){return}
    const tableObj=this.${confGlobal.formModel}[tableId+'Table']
    tableObj.currentRow=val
    this.getSubComponentsData(val,tableId)
  },

  //数据格式转换
  formatterFn(scope, field, tableId, label, value){
    const cellData = scope.row[field]
    const tableObj = this.${confGlobal.formModel}[tableId+'Table']
    const filterOption = tableObj.filterOptions ? tableObj.filterOptions[field]||[] : []
    const filterItem = filterOption.find(item => item[value]+'' === cellData+'')
    const formatStr = filterItem ? filterItem[label] : cellData
    const fn = tableObj.formatColFnMap && tableObj.formatColFnMap[field]
    const defStr = formatStr === undefined || formatStr === null ? '' : formatStr
    return this.executCustomFn(this, defStr, fn, cellData, formatStr, scope)
  },

  // 按钮自定义显示/隐藏方法
  displayFn(scope, field, tableId){
    const tableObj = this.${confGlobal.formModel}[tableId+'Table']
    const fn = tableObj.topOrRowButtonFnMap && tableObj.topOrRowButtonFnMap['display_'+field]
    return this.executCustomFn(this, true, fn, scope, field, tableId)
  },

  // 按钮自定义禁用/启用方法
  disabledFn(scope, field, tableId){
    const tableObj = this.${confGlobal.formModel}[tableId+'Table']
    const fn = tableObj.topOrRowButtonFnMap && tableObj.topOrRowButtonFnMap['disabled_'+field]
    return this.executCustomFn(this, true, fn, scope, field, tableId)
  },

  // 按钮点击前事件
  beforeClickFn(scope, field, tableId){
    const tableObj = this.${confGlobal.formModel}[tableId+'Table']
    const fn = tableObj.topOrRowButtonFnMap && tableObj.topOrRowButtonFnMap['beforeClick_'+field]
    return this.executCustomFn(this, true, fn, scope, field, tableId)
  },

  // 可编辑的表格的保存方法 WARN: 调用了特殊的接口，不应该写在公共方法中
  saveEditTableData(){
    this.$refs.${confGlobal.formRef}.validate((valid) => {
      if (!valid) {
        console.warn('可编辑表格校验失败', valid);
        return false;
      }
      let formData=JSON.parse(JSON.stringify(this.${confGlobal.formModel}))
      Object.keys(formData).forEach(key=>{
        if(key.indexOf('Table')>-1){
          delete formData[key]
        }
      })
      this.$server.generateSql(formData).then(res=>{
        this.$message({
          showClose: true,
          type: 'success',
          message: res
        })
        this.doCloseForm()
      })
    })
  },
  `
  if (el.hasCheckbox) {
    str += `
    //可编辑表格表头的全选
    checkAllClick(val,scope,value,tableId){
      if(val){
        this.${confGlobal.formModel}[tableId].forEach(item => {
          item[value] = '1'
        })
      }else{
        this.${confGlobal.formModel}[tableId].forEach(item => {
          item[value] = '0'
        })
      }
    },
    //行数据的复选框的勾选
    tableCheckboxChange(val,scope,value,tableId){
      // let isNotCheck=this.${confGlobal.formModel}[tableId].find(item => item[value] === '0')
      let isAllTrue = this.${confGlobal.formModel}[tableId].every(
        item => item[value] === '1'
      );
      let isAllFalse = this.${confGlobal.formModel}[tableId].every(
        item => item[value] === '0'
      );
      if (isAllTrue) {
        this.${confGlobal.formModel}[tableId+'Table'].isCheckbox[value]=true
      } else if (isAllFalse) {
        this.${confGlobal.formModel}[tableId+'Table'].isCheckbox[value]=false
      } else {
        this.${confGlobal.formModel}[tableId+'Table'].isCheckbox[value]=false
      }
      // if(isNotCheck){
      //   this.${confGlobal.formModel}[tableId+'Table'].isCheckbox[value]=false
      // }
    },
    `
  }


  str += `
    /**
     * 获取转换后的表格数据。支持'page','row'和'scope'参数
     * @param {String} paramsStr 转换参数。形式为类似 JSON 的字符串。
     * @param {Object|Array} rows 需要操作的数据。可以为空。
     * @param {Object|null} scope 当前行数据。仅在列操作按钮中存在。仅用于 paramsStr 取值。
     * @return params
     */
    getOperatParams(paramsStr, rows, scope){
      paramsStr || (paramsStr = '{}')
      const { page, formData } = this
      if(!Array.isArray(rows)){
        let row = rows || {}
        try{
          return eval('(' + paramsStr + ')')
        }
        catch(err){
          console.warn('[getOperatParams]数据解析失败！', paramsStr, rows, row, scope, err)
          return 'error'
        }
      }
      let params = {}
      rows.forEach(row => {
        let param
        try{
          param = eval('(' + paramsStr + ')')
        }
        catch(err){
          console.warn('[getOperatParams]数据解析失败！', paramsStr, rows, row, scope, err)
          return 'error'
        }
        Object.keys(param).forEach(key => {
          params[key] || (params[key] = [])
          params[key].push(param[key])
        })
      })
      return params
    },

    /**
     * 点击表格顶部按钮或操作列按钮
     * @param {String} tableId 表格组件字段名
     * @param {Object} buildOpts 按钮配置
     * @param {Object} scope={row, $index, column} 按钮所在行列相关数据。仅操作列按钮存在这个数据
     */
    handleTableBtnClick(tableId, btnOpts, scope){
      const fn = this[btnOpts.$click]
      if(!fn || typeof fn !== 'function'){
        console.warn('[handleTableBtnClick]执行方法不存在。', tableId, btnOpts, scope)
        return
      }
      // 校验操作数量，并设置操作行数据
      const selectRows = this.getOperatRows(tableId, btnOpts, scope ? scope.row : undefined)
      // 校验失败
      if(selectRows === false){
        console.warn('[handleTableBtnClick]按钮选中行不符合要求。', selectRows, tableId, btnOpts, scope)
        return
      }
      let params
      try{
        // 设置操作参数
        params = this.getOperatParams(btnOpts.params, selectRows, scope)
        console.log('handleTableBtnClick', selectRows, params, tableId, btnOpts, scope)
        if(params === 'error'){
          return
        }
        // 调用设置的方法
        fn(selectRows, btnOpts, params, tableId, scope)
      }
      catch(err){
        console.warn('[handleTableBtnClick]执行失败', err)
        console.error('[handleTableBtnClick]', tableId, btnOpts, scope, selectRows, params)
      }
    },

    /**
     * 校验操作数量，并设置操作行数据
     * @return rows|false 如果校验失败，返回false。
     * NOTE: rows 有可能为 undefined
     */
    getOperatRows(tableId, btnOpts, btnRow){
      const tableObj=this.${confGlobal.formModel}[tableId+'Table']
      const selectRowArr = tableObj.selectRowArr || []
      const { operatNum } = btnOpts
      if(btnRow){ // 若点击操作列中的按钮，则只操作当前行数据
        return btnRow
      }

      if(operatNum === 'none' || operatNum === 0){ // 不操作数据
        return undefined
      }
      else if(operatNum === 'single' || operatNum === 1){ // 操作单行数据
        // if(btnRow){
        //   rows = btnRow
        // }
        // else{
          if(selectRowArr.length > 1){
            this.$message({
              type:'error',
              message:'请选择单行数据进行操作!'
            })
            return false
          }
          // NOTE: 如果允许多选，selectRowArr 的最后一个值即为 currentRow
          const rows = tableObj.currentRow
        // }
        if(!rows){
          this.$message({
            type:'error',
            message:'请选择一行数据进行操作!'
          })
          return false
        }
        return rows
      }
      else{ // 操作多行（包括1行）或指定数量的数据
        if(operatNum && operatNum !== 'multi' && selectRowArr.length != operatNum){
          this.$message({
            type:'error',
            message: '请选择' + operatNum + '行数据进行操作!'
          })
          return false
        }
        else if(operatNum === 'multi' && selectRowArr.length === 0){
          this.$message({
            type:'error',
            message: '请至少选择一行数据进行操作!'
          })
          return false
        }
        // HACK: 兼容没有 operatNum 缺失的情况
        return selectRowArr.length > 0 ? selectRowArr : tableObj.currentRow
      }
    },
  `

  if (el.topEdit.show || el.editRow.show) {
    str += `

    doValidateCol(tableId, colKey, rule, callback){
      const isValid = (this.${confGlobal.formModel}[tableId]||[]).every(item => {
        if(['0','null','undefined'].indexOf(item[colKey]) > -1 )
          return false
        return !!item[colKey]
      })
      if(isValid)
        callback();
      else
        callback(new Error(rule.message));
    },

    /**
     * 校验表格行
     * NOTE: 不会校验复选、单选框的必填信息
     * @param tableId 表格vModal。若不传则校验所有的表格
     * @param index 行号。从0开始计数。若不传则校验整个表格的所有行
     * @return {undefined|Array} errMsg 所有错误信息
     */
    validateRow(tableId, index){
      let errMsg = undefined;
      for (let item of this.$refs['${confGlobal.formRef}'].fields) {
        if(item.prop.indexOf(tableId+'.') < 0)
          continue;
        if((!index && index !== 0) || item.prop.split('.')[1] === index+''){
          this.$refs['${confGlobal.formRef}'].validateField(item.prop, (error)=>{
            if(error){
              errMsg || (errMsg = []);
              errMsg.push(error)
            }
          });
        }
      }
      return errMsg;
    },

    //可以编辑的表格的添加行数据和删除行数据
    addRowBtn(selectRows, btnOpts, params, tableId, scope){
      const errMsg = this.validateRow(tableId)
      if(errMsg){
        this.$message({
          type:'error',
          message: '请先完善其他行数据！'
        })
        return
      }
      let newObj={},columnObj={}
      this.${confGlobal.formModel}[tableId+'Table']['tableColumnArr'].forEach(item=>{
        this.$set(columnObj,item.value,'')
      })
      const dataObj=this.${confGlobal.formModel}[tableId].length>0?this.${confGlobal.formModel}[tableId][0]:columnObj
      Object.keys(dataObj).forEach(key=>{
        this.$set(newObj,key,'')
      })
      if(scope){
        this.${confGlobal.formModel}[tableId].splice(scope.$index+1, 0, newObj)
      }else{
        this.${confGlobal.formModel}[tableId].push(newObj)
      }
    },
    deleteRowBtn(selectRows, btnOpts, params, tableId, scope){
      this.${confGlobal.formModel}[tableId].splice(scope.$index,1)
    }
    ,
    `
  }

  if (el.pagination.show) {
    str += `
    sizeChange(val,tableId){ // 表格当前页变化
      const tableObj=this.${confGlobal.formModel}[tableId+'Table']
      if(!tableObj.noPaging){
        tableObj.pagination.pageSize=val
        this.tableData(tableId)
      }
    },`
  }
  if (el.rowSort) {
    str += `
    // 表格行的排序
    rowSortableDrag(tableId){
      const tbody = document.querySelector('.'+tableId+'Table .el-table__body-wrapper tbody')
      const _this = this
      this.$sort.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.${confGlobal.formModel}[tableId].splice(oldIndex, 1)[0]
          _this.${confGlobal.formModel}[tableId].splice(newIndex, 0, currRow)
        }
      })
    },`
  }

  mountedList.push('console.log("更新测试====");this.initTableBox()')
  str += `
  initTableBox(){
    this.$nextTick(() => {
      const currentPane =  this.$dom.getCurrentTabPane()
      const tableWarpArr = currentPane.querySelectorAll(".table-warp")
      let countTable = 0
      let lastTableWarp = null
      console.log("initTableBox", currentPane, tableWarpArr);
      tableWarpArr.forEach(tableWarp => {
        const tableId = tableWarp.getAttribute("data-model");
        const tableConf = this.${confGlobal.formModel}[tableId + "Table"];
        // 设置表格顶部“展开收起”按钮
        if(tableConf.showToggleTopBtn){
          this.setTableShowToggleTopBtn(tableWarp, tableConf)
        }
        // 排除弹窗中的表格
        const pickerWarp = this.$dom.getClosestDom(tableWarp, ".ui-list-picker--list-warp")
        const dialogWarp = this.$dom.getClosestDom(tableWarp, ".el-dialog__body")
        if(!pickerWarp && !dialogWarp){
          countTable++
          lastTableWarp = tableWarp
        }
      })
      // 设置表格高度。NOTE: 不处理主从表、tab页多表格等复杂情况。
      if (lastTableWarp && countTable === 1){
        this.$nextTick(() => {
          const tableId = lastTableWarp.getAttribute("data-model");
          let table = lastTableWarp.querySelector(".el-table");
          if (!table) return
          const tableConf = this.${confGlobal.formModel}[tableId + "Table"];
          if(!tableConf) return
          if (!tableConf.height) {
            this.$set(tableConf, "height", this.$dom.getTableMaxHeight(currentPane, table, tableConf));
          }
        });
      }
    })
  },

  // 设置表格顶部“展开收起”按钮
  setTableShowToggleTopBtn(tableWarp, tableConf){
    if(!tableWarp) return
    const COMMOM_BTN_HEIGHT = 50; // 为适应各主题，不超过两行高度即可
    if(!tableConf){
      tableConf = this.${confGlobal.formModel}[tableWarp.getAttribute("data-model") + "Table"];
    }
    if(!tableConf) return
    const topWarp = tableWarp.querySelector(".table-top-btn-warp")
    const topWarpH = this.$dom.getElHeight(topWarp, "height")
    this.$set(tableConf, 'showToggleTopBtn', topWarpH > COMMOM_BTN_HEIGHT)
    console.log("展开收起按钮",topWarp,topWarpH, topWarpH > COMMOM_BTN_HEIGHT)
  },
  `
  methodsList.push(str)
}


// 表格行多选
function buildTableSelection(el, { methodsList }) {
  if (hasRender.buildTableSelection) return
  hasRender.buildTableSelection = true

  const str = `
  handleSelectionChange(selectRowArr, tableId){
    const tableObj=this.${confGlobal.formModel}[tableId+'Table']
    this.$set(this.${confGlobal.formModel}[tableId+'Table'], 'selectRowArr', selectRowArr)
    this.handleCurrentChange(selectRowArr[selectRowArr.length - 1], tableId)
  },
  `
  methodsList.push(str)
}

// 添加页面跳转方法
function buildHandleOpenPage(el, { methodsList }) {
  if (hasRender.buildHandleOpenPage) return
  hasRender.buildHandleOpenPage = true

  const str = `
  // 页面跳转方法
  handleOpenPage(row, option, params, tableId, scope){
    console.log('handleOpenPage:', row, option, params, tableId, baseUrl, scope)
    const {
        pageId,
        relateActiveId
    } = option

    if(option.actionType === 'pageId' && option.openPageType === 'dialog'){ // 选择内部页面，打开弹窗
      if(!pageId)
        return
      this.openComponentDialog(pageId, {
        title: option.label,
        dialogWidth:option.dialogWidth,
        pageId,
        tableId,
        relateActiveId,
        params,
      })
      return
    }

    const tableIdStr = tableId ? ('tableId=' + tableId) : ''
    const paramsStr = tableIdStr + Object.keys(params || {}).reduce((prev, cur) =>
        prev + '&' + cur + '=' + params[cur], '')
    let hrefStr = ''
    if(option.actionType === 'pageId'){ // 选择内部页面
      if(!pageId)
        return
      if (baseUrl.toLocaleLowerCase().startsWith('http')) {
        hrefStr = baseUrl + '?sessionKey=' + sessionStorage.getItem("Authorization") + '&partVersionId=' + pageId + '&' + paramsStr
      }else{
        hrefStr = baseUrl + pageId + '.html?' + paramsStr
      }
    }
    else if(option.actionType === 'customUrl'){ // 用户输入的跳转地址
      const {customUrl} = option
      if(!customUrl)
        return
      if(!customUrl.toLocaleLowerCase().startsWith('http'))
        return
      hrefStr = customUrl + (customUrl.indexOf('?') >= 0 ? '&' : '?') + paramsStr
    }
    switch(option.openPageType){
      case 'dialog':
        this.openIframeDialog({
          title: option.label,
          src: hrefStr
        })
        break;
      case 'self':
        location.href = hrefStr
        break;
      default:
        window.open(hrefStr);
    }
  },`
  methodsList.push(str)
}

// 表格关联数据源、关联事务流
function buildApiAction() {
  if (hasRender.buildApiAction) return ''
  hasRender.buildApiAction = true

  const str = `
  // 表格执行数据源
  doApiAction(row, option, params, tableId){
    console.log('表格执行数据源 doApiAction', row, option, params, tableId)
    const { operatNum } = option
    let mes=''
    if(operatNum === 'multi'){
      mes='是否'+option.label+row.length+'条数据?'
    }else if(operatNum === 'single'){
      mes='是否'+option.label+'1条数据?'
    }else{
      mes='是否执行'+option.label+'?'
    }
    this.$confirm(mes, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const serverInfo = this.getServerInfo({
        type: option.action,
        listId: option.listId,
        flowId: option.flowId,
        microserviceId: option.microserviceId,
        param: params
      }, option.vModel)
      const resoveFn = (res) => {
        this.$message({
          type: 'success',
          message: option.label + '成功!'
        })
        if(params.refreshInitData){ // 刷新初始数据
          this.getOptionParams()
          return
        }
        // 刷新表格数据
        const tableObj = this.${confGlobal.formModel}[tableId+'Table']
        if(!tableObj.noPaging){
          tableObj.pagination.currentPage = 1
        }
        this.tableData(tableId)
      }
      // NOTE: 逻辑同设计器中的 getFieldId 方法。
      const lockFieldId = option._parentFieldId
        ? (option._parentFieldId + '_' + (option.topbtn || option.rowbtn))
        : option.vModel
      console.log('请求参数', serverInfo)
      this.executeServerMethod(serverInfo, {
        lockFieldId,
        resoveFn
      })
    }).catch((err) => {
      this.$message({
        type: 'info',
        message: '已取消'
      });
      if(err){ console.warn('[doApiAction]', row, option, params, tableId, err) }
    });
  },
  // HACK: 兼容旧的关联数据源配置
  doDeleteAct(...arg){
    this.doApiAction(...arg)
  },
  `
  return str
}

function buildNonsense(el, { extraDataList, methodsList }) {
  if (hasRender.buildNonsense) return
  hasRender.buildNonsense = true
  extraDataList.push('nonsensePre: this.$server.generateNonsensePre(),')
  const str = `
    getNonsense(params, serverStr){
      return this.$server.generateNonsense(this.nonsensePre + serverStr, params)
    },
  `
  methodsList.push(str)
}

// 添加表单控件的保存和取消方法
function buildFormMethod(el, buildOpts) {
  if (hasRender.buildFormMethod) return
  hasRender.buildFormMethod = true

  buildUtilTools(el, buildOpts)
  buildNonsense(el, buildOpts)

  const {
    extraDataList,
    mountedList,
    methodsList
  } = buildOpts

  const str = `
  doSaveForm(resoveFn, { lockFieldId }){
    this.$refs.${confGlobal.formRef}.validate((valid) => {
      if (!valid) {
        this.$message({
          type:'error',
          message:'表单校验失败!'
        })
        console.warn('表单校验失败!', valid);
        return false;
      }
      const serverInfo = this.getFormServerInfo()
      this.executeServerMethod(serverInfo, { lockFieldId, resoveFn })
    });
  },

  doRefreshParent(){
    if (!this.page)
      return
    if(this.page.refreshInitData){ // 刷新父页面初始数据
      this.$emit('refreshInitData')
    }
    else if (this.page.tableId){ // 刷新父页表格数据
      this.$emit('refreshTable', { tableId: this.page.tableId,relateActiveId:this.page.relateActiveId })
    }
  },

  doResetForm(){ // 重置表单
    this.$refs['${confGlobal.formRef}'].resetFields()
    this.assignParams()
    this.getOptionParams()
    this.getSequenceNo&&this.getSequenceNo()
  },

  saveForm(event, btnFieldId){ // 保存
    const resoveFn = (res, serverParam) => {
      this.doResetForm()
      this.doRefreshParent()
      this.executCustomFn(this, undefined, this[this.componentName + '_$$resove_fn'],res, serverParam)
    }
    this.doSaveForm(resoveFn, { lockFieldId: btnFieldId })
  },

  saveAndCloseForm(event, btnFieldId){ // 保存并关闭
    const resoveFn = (res, serverParam) => {
      this.doCloseForm()
      this.doRefreshParent()
      this.executCustomFn(this, undefined, this[this.componentName + '_$$resove_fn'],res, serverParam)
    }
    this.doSaveForm(resoveFn, { lockFieldId: btnFieldId })
  },

  cancelForm(){ // 取消
    this.doCloseForm()
  },

  //给页面的控件赋值
  assignParams(param){
    // 从页面url获取参数并赋值
    // HACK: 兼容旧配置
    const urlData = {}
    Object.keys(this.${confGlobal.formModel}).forEach(key=>{
      const urlVal=this.getUrlParam(key)
      if(urlVal){
        urlData[key]=urlVal
      }
    })

    // 根据参数字段设置默认值
    const formContainerInitData = {}
    Object.keys(this.formContainerInitData).forEach(key => {
      let val = this.formContainerInitData[key]
      if(val && val.match(${/^page\./})){
        val = this.getVueData(val)
        // 避免把“page.XXX”这样的配置渲染到页面
        formContainerInitData[key] = val || ''
      }
      else if(val)// 剔除没有设置的默认值的字段，避免覆盖表单原本默认值的逻辑
      formContainerInitData[key] = val
    })
    this.${confGlobal.formModel} = {
      ...this.${confGlobal.formModel},
      ...urlData,
      ...formContainerInitData,
    }

    console.log('页面参数赋值：', this.${confGlobal.formModel}, urlData, formContainerInitData)
  },
  `

  methodsList.push(str)
  mountedList.unshift('this.assignParams()')
}


/**
 * 对外输出的js字符串
 * @param {} conf
 * @param {String} type 生成类型。页面或弹窗。
 * @param {} buildOpts
 * @param {String} buildType 'prod'|'preview' 运行或预览属于 preview，保存、下载、复制属于 prod。为 preview 时，不渲染 importList 和 componentsList。
 */
function getExportStr(conf, type = 'file', buildOpts, buildType) {
  const {
    importList,
    componentsList,
    // data
    formDataList,
    formRulesList,
    propsList,
    extraDataList,
    extraDataObj,
    // 计算监听
    computedList,
    watchObj,
    // 生命周期
    createdList,
    mountedList,
    destroyList,
    // methods
    methodsList,
    customJsStr,
    vModelMethodsList
  } = buildOpts

  const importStr = buildType === 'prod'
    ? importList.map(item => `import ${item.exportName ? `${item.exportName} from ` : ''}"${item.src}"`).join('\n')
    : ''
  const extraDataObjStr = JSON.stringify(extraDataObj)
  const extraDataStr = `${extraDataList.join('\n')}${extraDataObjStr.slice(1, extraDataObjStr.length - 1)}\n`

  const str = `
  ${importStr}
  ${exportDefault}{
    ${inheritAttrs[type]}
    props: {
      pageParams: {
        type: Object,
        default: undefined
      }
    },
    data () {
      return {
        ${conf.formModel}: {
          ${formDataList.join('\n')}
        },
        ${conf.formRules}: {
          ${formRulesList.join('\n')}
        },
        ${(propsList || []).join('\n')}
        ${extraDataStr}
      }
    },
    components:{
      ${buildType === 'prod' ? componentsList.join('\n') : ''}
    },
    computed: {
      ${computedList.join('\n')}
    },
    watch: {
      ${Object.keys(watchObj).map(key => `'${key}': ${watchObj[key]},`).join('\n')}
    },
    created () {
      ${createdList.join('\n')}
    },
    mounted () {
      ${mountedList.join('\n')}
    },
    methods: {
      ${methodsList.join('\n')}
      // 页面自定义脚本
      ${customJsStr.replace(/\s/g, '') !== '' ? `\n${customJsStr},\n` : ''}
      // 自动生成事件
      ${vModelMethodsList.join('\n')}
    },
    destroy () {
      ${destroyList.join('\n')}
    }
  }`
  return str
}
