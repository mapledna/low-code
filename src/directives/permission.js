let rights = sessionStorage.getItem('permission') || '{}'
try {
  rights = JSON.parse(rights)
} catch (error) {
  rights = {}
}

const permission = {
  inserted: (el, binding) => {
    // console.log('inserted', el, el.parentNode, binding, vnode)
    if (!binding.arg || !binding.arg['tab-data']) {
      return
    }
    let forbiddenData = rights[binding.arg['tab-data'].menu_code]
    if (forbiddenData === undefined) { // 过滤未配置权限但是按钮等配置了v-allow的页面
      return
    }
    if (binding.modifiers.button) {
      forbiddenData = forbiddenData.button
    } else if (binding.modifiers.field) {
      forbiddenData = forbiddenData.field
    }
    if (forbiddenData.find(item => item === binding.value)) {
      el.parentNode.removeChild(el)
    }
  }

}

export default permission
