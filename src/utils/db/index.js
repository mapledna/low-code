import api from '@/assets/js/api'

const DRAWING_ITEMS = 'drawingItems'
const DRAWING_ITEMS_VERSION = '1.0'
const DRAWING_ITEMS_VERSION_KEY = 'DRAWING_ITEMS_VERSION'
const DRAWING_ID = 'idGlobal'
const TREE_NODE_ID = 'treeNodeId'
const FORM_CONF = 'formConf'

const STORE_KEY_MAP = {
  sqlCategory: 'DS_SQL_CATEGORY_LIST', // SQL分组
  flowCategory: 'DS_FLOW_CATEGORY_LIST', // 事务流分组
  dictList: 'DS_DICT_LIST', // 数据字典分组和字典
  pageList: 'DS_PAGE_LIST' // 系统内置页面页面和字典
}
export function saveToStore(list, type) {
  if (!STORE_KEY_MAP[type]) {
    return
  }
  localStorage.setItem(STORE_KEY_MAP[type], JSON.stringify(list))
}
export function getFromStore(type) {
  if (!STORE_KEY_MAP[type]) {
    return undefined
  }
  const str = localStorage.getItem(STORE_KEY_MAP[type])
  if (!str) {
    return undefined
  }
  return JSON.parse(str)
}
export function refreshStore(type) {
  if (!STORE_KEY_MAP[type]) {
    return
  }
  switch (type) {
    case 'sqlCategory':
      refreshSqlCategory()
      break
    case 'flowCategory':
      refreshFlowCategory()
      break
    case 'dictList':
      refreshDictList()
      break
    case 'pageList':
      refreshPageList()
      break
    default:
  }
}
// 获取SQL分组
export function refreshSqlCategory() {
  api.executeSqls(4, {
    service_type: 6
  })
    .then(res => {
      saveToStore(res, 'sqlCategory')
    })
    .catch(err => {
      saveToStore([], 'sqlCategory')
    })
}
// 获取事务流分组
export function refreshFlowCategory() {
  api.executeSqls('1265130884821331975')
    .then(res => {
      saveToStore(res, 'flowCategory')
    })
    .catch(err => {
      saveToStore([], 'flowCategory')
    })
}
// 获取数据字典分组和字典
export function refreshDictList() {
  api.executeSqls('1255702349277270017')
    .then(res => {
      const dictList = (res || []).map(item => ({
        ...item,
        icon:
          item.is_part === 0
            ? 'el-icon el-icon-folder'
            : '',
        disClick: item.is_part === 0 // 分组不响应点击事件
      }))
      saveToStore(dictList, 'dictList')
    })
    .catch(err => {
      saveToStore([], 'dictList')
    })
}
// 获取内部页面分组和页面
export function refreshPageList() {
  api.executeSqls('1264753294889603073', {})
    .then(res => {
      const pageList = (res || []).map(item => ({
        ...item,
        icon:
          item.is_part === 0
            ? 'el-icon el-icon-folder'
            : 'el-icon el-icon-document',
        disClick: item.is_part === 0 // 分组不响应点击事件
      }))
      saveToStore(pageList, 'pageList')
    })
    .catch(err => {
      saveToStore([], 'pageList')
    })
}

// 获取字段列表fields对应的存储数据
export function getDrawingList() {
  // 加入缓存版本的概念，保证缓存数据与程序匹配
  const version = localStorage.getItem(DRAWING_ITEMS_VERSION_KEY)
  if (version !== DRAWING_ITEMS_VERSION) {
    localStorage.setItem(DRAWING_ITEMS_VERSION_KEY, DRAWING_ITEMS_VERSION)
    saveDrawingList([])
    return null
  }

  const str = localStorage.getItem(DRAWING_ITEMS)
  if (str) return JSON.parse(str)
  return null
}
// 本地存储fields对应的全部控件信息
export function saveDrawingList(list) {
  localStorage.setItem(DRAWING_ITEMS, JSON.stringify(list))
}

// export function getIdGlobal() {
//   const str = localStorage.getItem(DRAWING_ID)
//   if (str) return parseInt(str, 10)
//   return 100
// }

// // 本地存储已用控件的最大id
// export function saveIdGlobal(id) {
//   localStorage.setItem(DRAWING_ID, `${id}`)
// }

export function getTreeNodeId() {
  const str = localStorage.getItem(TREE_NODE_ID)
  if (str) return parseInt(str, 10)
  return 100
}

export function saveTreeNodeId(id) {
  localStorage.setItem(TREE_NODE_ID, `${id}`)
}
// 获取配置对象整体属性
export function getFormConf() {
  const str = localStorage.getItem(FORM_CONF)
  if (str) return JSON.parse(str)
  return null
}
// 本地存储页面整体属性  fields除外
export function saveFormConf(obj) {
  localStorage.setItem(FORM_CONF, JSON.stringify(obj))
}
