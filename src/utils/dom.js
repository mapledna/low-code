export const getElHeight = (
  el,
  containArr = [
    'height',
    'padding-top',
    'padding-bottom',
    'margin-top',
    'margin-bottom'
  ]
) => {
  if (!el) return 0
  if (typeof containArr === 'string') {
    containArr = containArr.split(',')
  }
  const style = document.defaultView.getComputedStyle(el, null)
  const hasHeight = containArr.indexOf('height') > -1
  return (
    (hasHeight ? el.offsetHeight : 0)
    + (containArr.indexOf('padding-top') > -1 === hasHeight
      ? 0
      : (style['padding-top'] || '').replace(/px/, '') * 1)
    + (containArr.indexOf('padding-bottom') > -1 === hasHeight
      ? 0
      : (style['padding-bottom'] || '').replace(/px/, '') * 1)
    + (containArr.indexOf('margin-top') > -1
      ? (style['margin-top'] || '').replace(/px/, '') * 1
      : 0)
    + (containArr.indexOf('margin-bottom') > -1
      ? (style['margin-bottom'] || '').replace(/px/, '') * 1
      : 0)
  )
}

export const getClosestDom = (el, selector) => {
  const matchesSelector = el.matches
    || el.webkitMatchesSelector
    || el.mozMatchesSelector
    || el.msMatchesSelector
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el
    }
    el = el.parentElement
  }
  return null
}

export const getContentMaxHeigh = (pane, el, otherH = 0) => {
  const win = document.documentElement || document.body
  const tab = document.querySelector('.ui-main__tabs')
  const contentWarp = pane
    ? pane.querySelector('.ui-main__content__warp')
    : null
  const winH = win.clientHeight
  const { top } = el.getBoundingClientRect()
  const h = winH - (top > winH ? 0 : top) - otherH
    - getElHeight(tab, 'padding-bottom,margin-bottom')
    - (el === contentWarp ? getElHeight(contentWarp, 'margin-bottom') : getElHeight(contentWarp, 'padding-bottom,margin-bottom')) // NOTE: contentWarp是border-box，计算自身高度不考虑padding
  return h
}

export const getTableMaxHeight = (pane, table, tableConf, buildType) => {
  const { pagination: paginationConf, summaryArr } = tableConf
  const header = table.querySelector('.el-table__header-wrapper')
  const footer = table.querySelector('.el-table__footer-wrapper')

  const headerH = header ? header.offsetHeight : 0
  const footerH = footer ? footer.offsetHeight : 0

  const ROW_H = 36
  const MIN_H = headerH + footerH + 3 * ROW_H
  const MAX_H = headerH + footerH
    + (paginationConf ? paginationConf.pageSize : 30) * ROW_H

  const pagination = paginationConf
    ? table.parentElement.querySelector('.el-pagination')
    : null
  const paginationH = pagination ? getElHeight(pagination) : 0
  const summary = summaryArr
    ? table.parentElement.querySelector('.summaryTable')
    : null
  const summaryH = summary ? getElHeight(summary) : 0
  const height = getContentMaxHeigh(pane, table, paginationH + summaryH + (buildType ? 43 : 0))
  // eslint-disable-next-line no-nested-ternary
  return height < MIN_H
    ? MIN_H
    : (height > MAX_H ? MAX_H : height)
}

export const getCurrentTabPane = () => {
  const pane = document.querySelectorAll('.ui-main__tab-pane')
  let currentPane = null
  for (let i = 0, len = pane.length; i < len; i++) {
    if (pane[i].offsetParent) {
      currentPane = pane[i]
      break
    }
  }
  return currentPane || document
}

export default {
  getElHeight,
  getClosestDom,
  getContentMaxHeigh,
  getTableMaxHeight,
  getCurrentTabPane
}
