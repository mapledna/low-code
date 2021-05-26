// 默认配置
import { formConf } from '@/components/generator/config'
import server from '@/assets/js/api'
import defaultFormContainer from '@/components/generator/config/layout/formContainer'
import defaultElTable, {
  defaultTableRowBtn,
  defaultTableTopBtn
} from '@/components/generator/config/basic/el-table'
// 自动生成配置
import configOperator from '@/components/generator/configOperator'
import { setDataSource, getCategoryIdMatchStr } from './methods'
import { fetchTableOperateDatasource } from './methods-table'
// 自动生成 vue 文件
import beautifier from 'js-beautify'
import { beautifierConf } from '@/utils/index'
import {
  makeUpHtml,
  vueTemplate,
  vueScript,
  cssStyle
} from '@/components/generator/html'
import { makeUpJs } from '@/components/generator/js'
import { makeUpCss } from '@/components/generator/css'

// 数据源类型字段映射
const actionToDataSourceType = {
  1: 'url', // 数据源
  2: 'flow' // 事务流
}
const actionToBtnType = {
  1: 'dataSource', // 数据源
  2: 'flow' // 事务流
}

/**
 * 根据“菜单管理”页面行数据生成表单配置
 */
export const getFormContainer = async ({
  sqlId,
  actionType,
  operateType,
  initDataId
}, refreshId = true) => {
  if (refreshId) {
    configOperator.resetAutoId()
  }

  const dataSourceType = actionToDataSourceType[actionType]
  if (!dataSourceType) return null
  // 基础配置
  let formContainerConf = configOperator.addComponent(
    [],
    defaultFormContainer,
    {
      formConf
    }
  )
  // 数据源相关配置
  const newData = await setDataSource(
    { ...formContainerConf },
    sqlId,
    dataSourceType,
    { operateType, initDataId }
  )
  // 合并数据
  formContainerConf = {
    ...formContainerConf,
    ...newData
  }
  return configOperator.assembleConf({
    confTree: [formContainerConf]
  })
}

export const addFormPart = async ({
  sqlId,
  initDataId,
  operateType,
  sourceType = 'data'
}) => {
  const partJson = await getFormContainer({
    sqlId,
    actionType: sourceType === 'data' ? 1 : 2,
    operateType,
    initDataId
  })
  const partVue = getVueStr(partJson)
  const res = await server.addPart({
    sourceId: sqlId,
    sourceType,
    partJson,
    partVue
  })
  return { partJson, partVue, ...res }
}

export const addTablePart = async ({
  sqlId,
  topBtn,
  rowBtn,
  sourceType = 'data'
}) => {
  const partJson = await getTableContainer({ sqlId, topBtn, rowBtn })
  const partVue = getVueStr(partJson)
  const res = await server.addPart({
    sourceId: sqlId,
    sourceType,
    partJson,
    partVue
  })
  return { partJson, partVue, ...res }
}

/**
 * 根据“菜单管理”页面生成表格配置
 */
export const getTableContainer = async ({ sqlId, topBtn, rowBtn }, refreshId = true) => {
  if (refreshId) {
    configOperator.resetAutoId()
  }
  // 基础配置
  let elTableConf = configOperator.addComponent([], defaultElTable, {
    formConf
  })
  // 数据源相关配置
  const newData = await setDataSource({ ...elTableConf }, sqlId, 'url')
  // 按钮
  let { topEdit, editRow } = elTableConf
  topEdit = {
    ...topEdit,
    show: topBtn.length > 0,
    options: topBtn.map(item => getBtnConf(item))
  }
  editRow = {
    ...editRow,
    show: rowBtn.length > 0,
    options: rowBtn.map(item => getBtnConf(item))
  }
  console.log('最终btn配置：', topEdit, editRow)
  // 合并数据
  elTableConf = {
    ...elTableConf,
    ...newData,
    topEdit,
    editRow
  }
  console.log('[elTableConf]', elTableConf, JSON.stringify(elTableConf))
  return configOperator.assembleConf({
    confTree: [elTableConf]
  })
}

const getBtnParams = async (sourceId, dataSourceType) => {
  if (!sourceId) { return '' }
  let serveOpts = null
  if (dataSourceType === 'url') {
    serveOpts = {
      sourceId: 6,
      params: {
        sqlId: sourceId
      }
    }
  } else if (dataSourceType === 'flow') {
    serveOpts = {
      sourceId: '1269170765151240193',
      params: {
        transflow_id: sourceId
      }
    }
  }
  const paramArr = serveOpts ? await server.executeSqls(serveOpts.sourceId, serveOpts.params) : []
  const paramStr = `{ ${paramArr.map(item => `${item.value}: row.${item.value}`).join(', ')} }`
  return paramStr
}
/**
 * 根据“菜单管理”页面行数据生成按钮配置
 */
export const getBtnConf = row => {
  const action = row.buttonPage ? 'openPage' : actionToBtnType[row.actionType] // 按钮操作类型。'openPage'打开页面|'dataSource'关联数据源|'flow'事务流|'methods'自定义方法
  const sourceId = row.buttonAction
  console.log('getBtnConf row', row, action, sourceId)

  const defaultConf = row.buttonPosition === 'topBtn'
    ? {
      ...defaultTableTopBtn,
      topbtn: row.buttonCode
    }
    : {
      ...defaultTableRowBtn,
      rowbtn: row.buttonCode
    }

  return {
    ...defaultConf,
    label: row.btnLabel,
    action, // 'openPage'打开页面|'dataSource'关联数据源|'methods'自定义方法
    pageId: `${row.buttonPage}`, // (打开页面-选择页面id_code)内部链接页面id_code
    categoryId: (action === 'dataSource' || action === 'flow') ? getCategoryIdMatchStr(
      sourceId,
      actionToDataSourceType[action]
    ) : '',
    listId: action === 'dataSource' ? sourceId : '',
    flowId: action === 'flow' ? sourceId : '',
    operatNum: row.operatNum || (row.buttonName === 'create' ? 'none' : 'single'), // 操作数量.buttonName 相关代码为兼容 menu 页面旧数据
    params: row.paramStr || defaultConf.params,
    $click: row.buttonPage ? 'handleOpenPage' : 'doApiAction' // 方法名
  }
}

/**
 * 根据配置返回vue文件内容
 */
export const getVueStr = json => {
  const generateType = 'file'
  const script = vueScript(makeUpJs(json, generateType, 'prod'))
  const html = vueTemplate(makeUpHtml(json, generateType, 'prod'))
  const css = cssStyle(makeUpCss(json, generateType, 'prod'))
  return beautifier.html(html + script + css, beautifierConf.html)
}

// tableName => executeSqls
// (createId => designData => 表单配置和vue文件 => addPart)
// deleteId
// (editId => designData => 表单配置和vue文件 => addPart)
// queryId
// listId
// => (designData => 表格配置和vue文件 => addPart)
export const addTableAndFormPart = async tableName => {
  const res = await fetchTableOperateDatasource(tableName)
  const {
    create, edit, delt, query, list
  } = res
  const [createPart = {}, editPart = {}] = await Promise.all([
    addFormPart({
      sqlId: create.id_code,
      operateType: 'create',
      sourceType: 'data'
    }),
    addFormPart({
      sqlId: edit.id_code,
      initDataId: query.id_code,
      operateType: 'edit',
      sourceType: 'data'
    })
  ])

  const { idCode: createPartId } = createPart
  const { idCode: editPartId } = editPart
  const topBtn = [{
    buttonPosition: 'topBtn',
    operatNum: 'none',
    buttonCode: 'topbtn_create',
    btnLabel: '创建',
    buttonPage: createPartId,
    paramStr: await getBtnParams(create.id_code, 'url')
  }]
  const rowBtn = [{
    buttonPosition: 'rowBtn',
    operatNum: 'single',
    buttonCode: 'rowbtn_update',
    btnLabel: '编辑',
    buttonPage: editPartId,
    paramStr: await getBtnParams(edit.id_code, 'url')
  }, {
    buttonPosition: 'rowBtn',
    operatNum: 'single',
    buttonCode: 'rowbtn_delete',
    btnLabel: '删除',
    actionType: 1,
    buttonAction: delt.id_code,
    paramStr: await getBtnParams(delt.id_code, 'url')
  }]
  const { idCode: tablePartId } = await addTablePart({
    sqlId: list.id_code,
    topBtn,
    rowBtn
  })

  return {
    createPartId,
    editPartId,
    tablePartId
  }
}

