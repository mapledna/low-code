/* eslint-disable camelcase */
import server from '@/assets/js/api'
import { defaultColOption } from '@/components/generator/config/basic/el-table'
import {
  getInitDsParams,
  getDsFromFilterItem,
  getKeyConditionFromFilterItem
} from '@/components/generator/autoGenerate/methods'

/**
 * 获取表格搜索条件相关的选项和请求数据
 * @return Object
 */
function getTableSearchOption(search, formatMap) {
  const searchOption = {}
  search.forEach(searchItem => {
    const key = searchItem.value
    const formatItem = formatMap[key]
    if (formatItem) {
      const { data } = formatItem
      const keyCondition = getKeyConditionFromFilterItem(formatItem)
      const {
        parentKey,
        valueKey,
        labelKey
      } = keyCondition
      searchOption[key] = {
        data,
        // WARN: 为什么跟表单不一样？？
        pid: parentKey,
        value: valueKey,
        label: labelKey
      }
    }
  })
  return searchOption
}

/**
 * 获取表格列相关的格式化信息和请求数据
 * @return Array
 */
function getTableColOption(column, formatMap) {
  const colOptionArr = column.map(item => {
    const widgetCode = item.widgetCode ?? item.widget_type ?? item.widgettype ?? '' // 统一数据
    const formatItem = formatMap[item.value]
    let formatter
    let formatterDs
    if (formatItem) {
      const { data } = formatItem
      const keyCondition = getKeyConditionFromFilterItem(formatItem)
      const dsInfo = getDsFromFilterItem(formatItem) || {}
      formatterDs = {
        ...dsInfo,
        // WARN:TODO: 常规数据源、表格查询、表格列数据源字段不统一
        dsType: dsInfo.type,
        sqlId: dsInfo.listId
      }
      formatter = {
        data,
        ...keyCondition
      }
    }
    return {
      ...defaultColOption,
      ...item,
      invisible: item.is_display === 0,
      widgetCode,
      editable: !!widgetCode,
      formatter,
      formatterDs
    }
  })
  return colOptionArr
}

/**
 * 获取表格数据，并格式化处理。用于设计器展示
 */
async function getTableDemoData(sqlId, pagination, colOptionArr, type) {
  let pageServerName = ''; let nopageServerName = ''
  if (type === 'url') {
    pageServerName = 'selectDataPage'
    nopageServerName = 'executeSqls'
  } else if (type === 'microservice') {
    pageServerName = 'selectMicroDataPage'
    nopageServerName = 'executeMicro'
  }
  const resData = pagination.show
    ? await server[pageServerName](
      sqlId,
      pagination.currentPage,
      pagination.pageSize
    )
    : await server[nopageServerName](sqlId, {})

  // 在设计器页面将表格行数据中对应需要重新匹配的数据直接转换
  const tableData = Array.isArray(resData) ? resData : resData.page.rows
  const tableDemoData = tableData.map(row => {
    colOptionArr.forEach(colOption => {
      const { value, formatter } = colOption
      row[value]
        && formatter
        && (row[value] = formatCell(row[value], formatter))
    })
    return row
  })
  return tableDemoData
}

/**
 * 格式化单元格数据
 */
function formatCell(cellData, format) {
  const { data = [], value, label } = format
  const index = data.findIndex(item => cellData.toString() === item[value])
  return index > -1 ? data[index][label] : cellData
}


/**
 * 获取表格增删改数据源
 * @params tableName 表名
 */
export async function fetchTableOperateDatasource(tableName) {
  const resArr = await server.executeSqls('1282931184747601922', { tableName })
  const typeMap = {
    1: 'create', // 插入
    2: 'edit', // 编辑
    3: 'delt', // 删除
    4: 'list', // 分页查询
    5: 'query' // 获取单条数据
  }
  const resObj = {}
  resArr.forEach(item => {
    const key = typeMap[item.sql_type]
    resObj[key] = item
  })
  return resObj
}


export async function getTableConf({
  sourceId,
  search,
  result,
  filterMap,
  pagination,
  type
}) {
  // NOTE: 表格暂不支持选择事务流，不做判断// TODO: 事务流只需要请求格式化数据？？

  // 表格搜索条件相关的选项和请求数据
  const searchOption = getTableSearchOption(search, filterMap)
  // 表格列相关的格式化数据
  const options = getTableColOption(result, filterMap)
  let tableDemoData = []
  try {
    // 表格示例数据
    tableDemoData = await getTableDemoData(
      sourceId,
      pagination,
      options,
      type
    )
  } catch (err) {
    console.error('[getTableConf] err', sourceId,
      search,
      result,
      filterMap,
      pagination)
  }
  // await promise.then(res=>{}).catch(err=>{})

  return {
    searchOption,
    options,
    defaultValue: tableDemoData
  }
}

/**
 * 根据表格数据源，获取导出按钮数据源相关数据
 * @param {Object} activeData 表格配置数据
 * @param {Array} searchParamList 表格数据源搜索参数
 */
export function getTableExportBtnDs(tableActiveData, searchParamList) {
  const {
    searchData,
    initDataOptions
  } = getInitDsParams(tableActiveData, searchParamList)
  return {
    dataType: tableActiveData.dataType,
    dataSource: {
      ...tableActiveData.dataSource,
      optionParams: {}
    },
    searchData,
    initDataOptions: (initDataOptions || []).map(item => ({
      ...item,
      inputVal: `formData.${tableActiveData.vModel}Table.search.${item.value}`
    }))
  }
}


export function getTableSetColBtn(tableActiveData, colList) {
  return {
    options: colList
  }
}

