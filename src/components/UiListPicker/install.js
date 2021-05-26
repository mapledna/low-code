import component from './index'

const obj = {
  install(Vue) {
    Vue.component('UiListPicker', component)
  }
}

export default obj
