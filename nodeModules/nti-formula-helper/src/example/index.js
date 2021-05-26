import Vue from 'vue'
import example from './example.vue'

import '@utils/element-ui'
import '@style/theme-base/index.scss'

new Vue({
  render: (h) => h(example),
}).$mount('#app')
