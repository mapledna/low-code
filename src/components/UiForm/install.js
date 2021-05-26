// import UiForm from './Index.vue'
import plugin from './index.js'
import UiFormItemTips from './UiFormItemTips'
import UiFormItemText from './UiFormItemText'

plugin.install = Vue => {
  Vue.component('UiFormItemTips', UiFormItemTips)
  Vue.component('UiFormItemText', UiFormItemText)
  Vue.component(plugin.name, plugin)
}

export default plugin
