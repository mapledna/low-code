/**
 * 抽离PerfectScrollbar的指令注册方法
*/

// 滚动条插件的包
import PerfectScrollbar from 'perfect-scrollbar'
// 对应的css
import 'perfect-scrollbar/css/perfect-scrollbar.css'


/**
 * @description 自动判断更新PerfectScrollbar还是创建
 * @param {HTMLElement} el - 必填。dom元素
 */
const elScrollBar = el => {
  // eslint-disable-next-line no-underscore-dangle
  if (el._ps_ instanceof PerfectScrollbar) {
    // eslint-disable-next-line no-underscore-dangle
    el._ps_.update()
    // eslint-disable-next-line no-underscore-dangle
  } else {
    // eslint-disable-next-line no-underscore-dangle
    el._ps_ = new PerfectScrollbar(el, { suppressScrollX: true })
  }
}

const perfectScrollbar = {
  inserted(el) {
    const rules = ['fixed', 'absolute', 'relative']
    if (!rules.includes(window.getComputedStyle(el, null).position)) {
      console.error(`perfect-scrollbar所在的容器的position属性必须是以下之一：${rules.join('、')}`)
    }
    elScrollBar(el)
  },
  // 更新dom的时候
  componentUpdated(el, binding, vnode) {
    try {
      vnode.context.$nextTick(
        () => {
          elScrollBar(el)
        }
      )
    } catch (error) {
      console.error(error)
      elScrollBar(el)
    }
  }
}

export default perfectScrollbar
