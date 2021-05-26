import Vue from 'vue'
// import 'babel-polyfill'

// 组件
import ElementUI from 'element-ui'

// 方法
import server from '@/assets/js/api'
import tool from '@/utils/tool'
import dom from '@/utils/dom'
import Sortable from 'sortablejs'
import EventBus from '@utils/eventBus'

import Global from '@/utils/db/global'
// 指令
// import perfectScrollbar from '@/directives/scrollbar'
import permission from '@/directives/permission'
import { record } from '@/directives/record'

import { getSpecialPath } from '@router/tool'

// 样式
import '@/styles/index.scss'
import '@/assets/lib/iconfont/iconfont.css'
import '@/assets/lib/MaterialDesign-Webfont-master/css/materialdesignicons.min.css'
import '@/icons'
import utilsTheme from '@/utils/theme'

const theme = utilsTheme.getThemeName()
utilsTheme.change(theme)

Vue.use(ElementUI)

Vue.prototype.$server = server
Vue.prototype.$tool = tool
Vue.prototype.$dom = dom
Vue.prototype.$sort = Sortable
Vue.prototype.$getSpecialPath = getSpecialPath
Vue.prototype.$EventBus = EventBus

Vue.prototype.$Global = Global

Vue.config.productionTip = false

// 自定义滚动条的Vue指令,指令名scrollBar
// Vue.directive('scrollBar', perfectScrollbar)
// 自定义权限校验指令,指令名allow
Vue.directive('allow', permission)
// 自定义前端埋点指令,指令名record
Vue.directive('record', record)


/**
 * mock
 */
const { mockXHR } = require('../../../mock')

mockXHR()
