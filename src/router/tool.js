import window from '@/utils/polyfill'
import routerConfig from '@router/config'
// import moduleRouter from './module'

const IS_HASH = true
const { pageMap, specialPathMap } = routerConfig

export function setNowPageName(pageKey = '') {
  sessionStorage.setItem('nowPageName', pageMap[pageKey] || '')
}

export function getNowPageName() {
  return sessionStorage.getItem('nowPageName')
}

// /**
//  * 获取 pageKey 对应页面的路由配置
//  */
// export function getRouterList(pageKey = '') {
//   setNowPageName(pageKey)
//   return moduleRouter[pageMap[pageKey]] || []
// }

function addHash() {
  return IS_HASH ? '#/' : '/'
}

/**
 * 获取根目录路径
 */
export function getRootPath() {
  const loc = window.location
  let path = `${loc.origin}${loc.pathname}`
  const nowPageName = getNowPageName()
  if (!nowPageName) {
    return path
  }
  // eslint-disable-next-line no-useless-escape
  const res = path.match(new RegExp(`\/${nowPageName}(\.[html|htm])?\/?$`))
  if (!res) {
    return path
  }
  path = `${path.slice(0, res.index)}/`
  return path
}

/**
 * 获取页面地址
 */
export function getSpecialPath(pathkey) {
  if (
    pathkey === 'LOGIN'
    && window.location.href.toLowerCase().indexOf('cloudlogin') > -1
  ) {
    return window.location.href
  }
  const path = specialPathMap[pathkey] || ''
  return path
}

/**
 * 切换页面地址
 */
export function changeHref(path) {
  // 相对路径
  if (path.indexOf('://') < 0) {
    if (/^\//.test(path)) {
      path = path.slice(1)
    }
    path = `${getRootPath()}${path}`
  }
  window.location.href = path
}

// 判断是否为移动端

export function judgeIsMobile() {
  const flag = navigator.userAgent.match(
    /(phone|pad|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows phone)/i
  )
  return flag
}
