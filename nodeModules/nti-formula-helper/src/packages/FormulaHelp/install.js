import plugin from './index.vue'

plugin.install = function (Vue) {
  Vue.component(plugin.name, plugin)
}

export default plugin
