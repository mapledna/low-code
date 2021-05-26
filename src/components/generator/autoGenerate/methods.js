/* eslint-disable camelcase */
import server from '@/assets/js/api'
import { arrayToTree, isEmpty } from '@/utils/index'
import { optionComponentList } from '@/components/generator/config'
import { defaultKeyCondition } from '@/components/generator/config/utils.js'

import { getTableConf } from './methods-table'
import { setForm } from './methods-form'

// 数据源类型转换，接口所需的类型与设计器定义的不同
const dataSourceTypeMap = {
  url: 'data',
  flow: 'flow',
  microservice: 'microservice',
  dict: 'dict',
  data: ''
}

/**
 * 由于缺少数据分类ID，提供通过特殊字符串供后端查找替换
 */
export function getCategoryIdMatchStr(sourceId, dataSourceType) {
  return `#categoryId|${dataSourceTypeMap[dataSourceType]}|${sourceId}#`
}

/**
 * 请求数据源相关的具体信息
 * @param sourceId 数据源或事务流id
 * @param dataSourceType 数据源类型，url 数据源 | flow 事务流。相当于 activeData.dataSource.type
 * @return {Object} 包括 search, result, filter, filterMap
 */
export async function getSqlOpts(sourceId, dataSourceType) {
  const sourceType = dataSourceTypeMap[dataSourceType]
  let resObj = {}
  switch (sourceType) {
    case 'microservice':
      resObj = await server.listMicroParamByMicroId({
        microId: sourceId
      })
      break
    case 'dict':
      break
    default:
      resObj = await server.designData({
        sourceId,
        sourceType
      })
      break
  }
  const {
    search = [], // 组件初始数据条件，表格搜索、格式化条件|表单组件数据。executeSqls(6, { sqlId })
    result = [], // 表格列数据|(表单没有这个数据)。executeSqls(7, { sqlId })
    filter = {} // search和result相关的选项请求信息和格式化信息。buildParams，之后需要执行 allExecuteSqls(paramArr) 获取具体数据
  } = resObj
  const filterMap = (await getFilterMap(filter)) || {}
  return {
    search,
    result,
    filter,
    filterMap
  }
}

/**
 * 请求选项、格式化信息
 * @param paramMap 请求参数信息，paramItem 包括 sqlId和parameters
 * @return filterMap
 * 包括 paramItem 中的全部信息，以及根据 paramItem 请求到的选项数据 data
 */
// paramMap 数据格式：
// {
//   "audit_status":{
//     "sqlId":"1257968258652504065", // 查询数据字典对应的SQL
//     "format_type":"dict",
//     "parameters":{
//       "p_id":"1255708444251099138" // 数据字典ID
//     }
//   }
// }
async function getFilterMap(paramMap) {
  if (!paramMap) {
    return undefined
  }
  const keyArr = Object.keys(paramMap)
  const paramArr = keyArr.map(key => {
    const { sqlId, parameters } = paramMap[key]
    return {
      sqlId,
      parameters
    }
  })
  const resultArr = await server.allExecuteSqls(paramArr)
  // 数组转对象
  const filterMap = {}
  keyArr.forEach((key, index) => {
    filterMap[key] = {
      ...paramMap[key],
      data: resultArr[`table_${index}`] // TODO: 仅作为设计器示例数据，不保存到后台
    }
  })
  return filterMap
}

/**
 * 从result数组中获取key条件
 */
export function getKeyConditionFromResult(arr = []) {
  const labelObj = arr.find(item => item.is_label === 1)
  const valueObj = arr.find(item => item.is_id === 1)
  const parentObj = arr.find(item => item.is_pid === 1)
  const labelKey = labelObj ? labelObj.value : defaultKeyCondition.labelKey
  const valueKey = valueObj ? valueObj.value : defaultKeyCondition.valueKey
  const parentKey = parentObj ? parentObj.value : defaultKeyCondition.parentKey
  return {
    ...defaultKeyCondition,
    labelKey,
    valueKey,
    parentKey
  }
}

/**
 * 从filterMap项中获取key条件
 */
export function getKeyConditionFromFilterItem(filterItem) {
  if (!filterItem) { return undefined }
  const {
    key_condition = {}
  } = filterItem
  const {
    pid: parentKey = defaultKeyCondition.parentKey,
    id: valueKey = defaultKeyCondition.valueKey,
    label: labelKey = defaultKeyCondition.labelKey
  } = key_condition
  return {
    ...defaultKeyCondition,
    parentKey,
    valueKey,
    labelKey
  }
}

/**
 * 获取选项、格式化信息中的数据源配置
 */
export function getDsFromFilterItem(filterItem) {
  if (!filterItem) { return undefined }
  const {
    format_type, sqlId, parameters
  } = filterItem
  const dsInfo = format_type === 'dict'
    ? {
      dictId: parameters ? parameters.p_id : ''
    }
    : {
      // WARN:TODO: 常规数据源、表格查询、表格列数据源字段不统一
      listId: sqlId,
      sqlParams: parameters
    }
  const dsConf = {
    type: format_type,
    ...dsInfo
  }
  return dsConf
}

/**
 * 返回 dataSource.optionParams 数据，用于初始数据请求
 *
 * @param {Object} activeData
 *  activeData.tag 不必须。
 *  activeData.vModel 不必须。仅表格需要
 * @param {Object} dsOptions
 *  dsOptions.filterMap 必须。
 *  dsOptions.search 不必须。仅表格需要
 *  dsOptions.result 不必须。仅表格需要
 */
export function getDsOptionParams(
  { tag, vModel } = {},
  { filterMap, search, result } = {}
) {
  if (!filterMap) {
    return undefined
  }
  if (tag === 'el-button') {
    // 按钮参数作为提交数据。不需要初始渲染
    // TODO: 只有表格、表单和 optionComponentList 需要？？
    return undefined
  }
  if (tag === 'el-table') {
    // 表格区分search和filter。
    // search 代表查询参数，用于渲染查询表单。filter 代表结果参数，用于表格渲染列。
    return {
      ..._getOptionParams(filterMap, search, `${vModel}.search`),
      ..._getOptionParams(filterMap, result, `${vModel}.filter`)
    }
  }
  return _getOptionParams(filterMap)
}

/**
 * 根据选项生成的 dataSource.optionParams 数据，用于初始数据请求
 * @param formatMap 选项数据
 * @param data 限定数据范围
 * @param preStr optionParams 数据 key 的前缀
 */
// eslint-disable-next-line no-underscore-dangle
function _getOptionParams(formatMap, data, preStr) {
  const optionParams = {}
  Object.keys(formatMap || {}).forEach(key => {
    const isFind = data ? data.find(item => item.value === key) : true
    if (isFind) {
      const { sqlId, parameters } = formatMap[key]
      optionParams[preStr ? `${preStr}.${key}` : key] = { sqlId, parameters }
    }
  })
  return optionParams
}

/**
 * 初始数据条件
 * WARN: 目前布局容器没有tag字段，通过 tag 判断是否加 page 前缀。以后需要通过 layout 是否为 colFormItem 判断
 */
export function getInitDataOptions(search, tag) {
  return search.map(item => ({
    label: item.label,
    value: item.value,
    inputVal: !tag ? `page.${item.value}` : ''
  }))
}


/**
 * 获取初始请求参数
 * @param activeData
 * @param paramsList 通常为 activeData.initDataOptions
 * @return {Object} { initFetchKey, initFetchParam }
 *
 * NOTE: 构建运行页面上数据源请求参数对象KEY最终格式：
 * 表单\主页：initData
 * 表格区分过滤、筛选：vModel.search.XXX, vModel.filter.XXX
 * 普通控件：vModel.initData。如：fieldxxx.initData。
 * 布局组件：componentName.initData。如：rowxxx.initData。
 */
export function getInitParams(activeData, paramsList) {
  // 1. 表格加载格式化数据时不再需要加载表格的所有数据，所以不需要将表格的初始数据加上来
  // 2. 按钮不需要初始数据。按钮数据源作为提交数据。
  if (activeData.tag === 'el-table' || activeData.tag === 'el-button') {
    return undefined
  }
  const { dataSource } = activeData
  if (!dataSource) {
    return undefined
  }

  const isForm = ['formContainer'].indexOf(activeData.layout) > -1

  let initFetchParam
  switch (dataSource.type) {
    case 'dict':
      initFetchParam = {
        sqlId: '1257968258652504065', // 查询数据字典对应的 SQL ID
        parameters: {
          p_id: dataSource.dictId // 数据字典ID
        }
      }
      break

      // TODO: 微服务和事务流

    default:
      // eslint-disable-next-line no-case-declarations
      const parameters = {}
      if (paramsList?.length > 0) {
        paramsList.forEach(option => {
          parameters[option.value] = option.inputVal
        })
      }
      // eslint-disable-next-line no-case-declarations
      const sqlId = isForm
        ? activeData.initDataId
        : dataSource.listId
      initFetchParam = isEmpty(sqlId)
        ? {}
        : {
          sqlId: sqlId.toString(),
          parameters
        }
      break
  }
  return {
    initFetchKey: isForm
      ? 'initData'
      : `${activeData.vModel || activeData.componentName}.initData`,
    // parameters,
    initFetchParam
  }
}

/**
 * 返回初始请求参数相关数据
 */
export function getInitDsParams(activeData = {}, initData = []) {
  const { tag, dataSource } = activeData
  // HACK:
  delete dataSource?.optionParams?.initData

  const initDataOptions = getInitDataOptions(initData, tag)
  return {
    // NOTE: searchData 用于联动。不论组件类型 searchData 字段。
    // NOTE: searchData 也作为表格查询表单展示。TODO: 可否整合到 initDataOptions、dataSource.optionParams.initData？？？
    searchData: initData.map(item => {
      // 统一数据
      if (!isEmpty(item.widget_type)) {
        item.widgetCode = item.widget_type
        delete item.widget_type
      }
      if (!isEmpty(item.widgettype)) {
        item.widgetCode = item.widgettype
        delete item.widgettype
      }
      return { ...item }
    }),
    // 数据条件，即数据源请求参数。不一定用于初始请求，如按钮提交中。
    initDataOptions,
    // 初始数据请求信息。请求初始数据或关联的下拉框选项等。
    // 方法内判断并排除表格、按钮。
    ...getInitParams(activeData, initDataOptions)
  }
}

/**
 * 同数据源中的 getDatasourceReasult 方法
 * @param {Array} initData 通常使用 getSqlOpts方法中返回的 search
 */
export async function getExampleData(
  sqlId,
  initData = [],
  {
    tag, labelKey, valueKey, showRoot
  }
) {
  // 构建请求中的parameters对象
  const parameters = {}
  initData.forEach(item => {
    // NOTE: param 是为数据字典场景特殊增加的字段
    parameters[item.value] = item.param || ''
  })
  const requestArr = [{ sqlId, parameters }] // 请求下拉框的数据
  const res = await server.allExecuteSqls(requestArr)
  const dropData = (res.table_0 || []).map(item => {
    item.label = item[labelKey]
    item.value = item[valueKey]
    if (!showRoot && item.pid === -1) return {}
    return item
  })
  return tag === 'el-tree'
    ? arrayToTree(dropData, 'pid', 'id') // TODO: childrenKey、parentKey 相关的格式化配置
    : dropData
}

/**
 * 通过初始数据源获取表单初始参数
 */
export async function getFormInitDataOptions(initDataId) {
  const resData = server.executeSqls(6, { sqlId: initDataId })
  return resData
}

/**
 * @param activeData
 * @param sourceId 数据源id|事务流id
 * @param dataSourceType 数据源类型。url|flow
 * @param opts
 * @param   opts.operateType 表单数据源类型。create|edit
 * @param   opts.initDataId 表单初始数据源id。
 */
export async function setDataSource(
  activeData,
  sourceId,
  dataSourceType,
  { operateType, initDataId } = {}
) {
  const { search, result, filterMap } = await getSqlOpts(
    sourceId,
    dataSourceType
  )
  const { tag, layout } = activeData

  let newActiveData = {}
  let initData = search
  if (tag === 'el-table') {
    // 表格
    const tableConf = await getTableConf({
      sourceId,
      search,
      result,
      filterMap,
      pagination: activeData.pagination
    })
    newActiveData = {
      ...activeData,
      ...tableConf
    }
  } else if (layout === 'formContainer') {
    // 表单
    // NOTE: 目前自动生成配置时，不存在同时选中创建和编辑的情况。因此省略了这部分逻辑
    const formConf = setForm({
      sourceId,
      operateType,
      search,
      filterMap,
      activeData
    })
    initData = initDataId ? await getFormInitDataOptions(initDataId) : []
    newActiveData = {
      ...activeData,
      ...formConf,
      [`${operateType}DataId`]: sourceId, // TODO: 事务流可以不需要这个配置？？？
      [`${operateType}Data`]: search, // 记录 以便对比 // TODO: 事务流可以不需要这个配置？？？
      initDataId
    }
  } else if (optionComponentList.indexOf(tag) > -1) {
    // 设置数据Key条件
    const { labelKey, valueKey } = getKeyConditionFromResult(result)
    // 设置设计器展示数据
    // TODO: exampleData 不要存入后台数据
    const exampleData = await getExampleData(sourceId, search, {
      tag,
      labelKey,
      valueKey
    })

    newActiveData = {
      ...activeData,
      labelKey,
      valueKey,
      [['el-select'].indexOf(tag) >= 0 ? 'options' : 'data']: exampleData
    }
  }

  // 初始数据请求配置
  const dataSourceOptionParams = getDsOptionParams(
    { tag, vModel: activeData.vModel },
    { filterMap, search, result }
  )
  const {
    searchData,
    initDataOptions,
    initFetchKey,
    initFetchParam
  } = getInitDsParams(activeData, initData)

  newActiveData = {
    ...newActiveData,
    // 设置联动相关数据
    searchData,
    // 设置初始数据条件
    initDataOptions,
    dataSource: {
      ...newActiveData.dataSource,
      type: dataSourceType,
      categoryId: getCategoryIdMatchStr(sourceId, dataSourceType),
      listId:
      dataSourceType !== 'flow' && layout !== 'formContainer' ? sourceId : '',
      flowId: dataSourceType === 'flow' ? sourceId : '',
      optionParams: {
        ...activeData.dataSource.optionParams,
        ...dataSourceOptionParams,
        // 将初始查询条件到 optionParams 中
        ...(initFetchKey ? { [initFetchKey]: initFetchParam } : undefined)
      }
    }
  }
  // console.log('[newActiveData]', searchData, initDataOptions, dataSource)
  return newActiveData
}
