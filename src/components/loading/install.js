import UiLoading from './Index'

export default {
  install(Vue, options = {}) {
    // 注册组件
    Vue.component(UiLoading.name, UiLoading)

    // 创建一个 Vue 子类
    const Component = Vue.extend(UiLoading)

    // 创建组件实例
    const vm = new Component()
    // console.log(222, vm, options)
    // 将 UiLoading 的默认 options 与 自定义的 options 合并
    options = Object.assign(vm.$props.options || {}, options)
    // 合并新的props
    vm.$propsData = options
    // 手动挂载
    // console.log('UiLoading', vm)
    vm.$mount()
    // 如果是服务端渲染则不继续执行
    if (!vm.$isServer) {
      document.body.appendChild(vm.$el)
    }

    const ntiLoading = {
      show() {
        if (Vue.$isServer) return
        vm.show = true
      },
      hide() {
        vm.show = false
      }
    }

    // 最后挂在到全局
    Vue.prototype.$ntiLoading = ntiLoading
  }
}
