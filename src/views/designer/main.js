import Vue from 'vue'
import '@/utils/entryImport'
import '@/utils/entryImport/extend'

import App from '@views/App.vue'
// 路由
import VueRouter from 'vue-router'
import { setNowPageName } from '@router/tool'
import designerRouter from '@router/module/designer' // 设计器
import baseRouter from '@router/module/base'

import { saveUserAction } from '@/directives/record'

Vue.use(VueRouter)
setNowPageName('DESIGNER')
const router = new VueRouter({
  routes: [...designerRouter, ...baseRouter]
})

router.beforeEach((to, from, next) => {
  saveUserAction({
    point_type: 1,
    point_name: '页面跳转',
    point_data: `from:${from.fullPath}——to:${to.fullPath}`,
    pv_id: 0
  })
  next()
})


let beginTime = 0// 执行onbeforeunload的开始时间
let differTime = 0// 时间差
let auth = '' // 提前记录鉴权

// 刷新或者关闭浏览器的提交
window.addEventListener('unload', () => {
  differTime = new Date().getTime() - beginTime
  let actStr = ''
  if (differTime <= 5) {
    // console.log('浏览器关闭')
    actStr = '页面关闭'
    saveUserAction({
      point_type: 4,
      point_name: actStr,
      point_data: `当前页面：${window.location.href}`,
      pv_id: 0
    }, 'close', auth)
  } else {
    // console.log('浏览器刷新')
    actStr = '页面刷新'
    saveUserAction({
      point_type: 4,
      point_name: actStr,
      point_data: `当前页面：${window.location.href}`,
      pv_id: 0
    })
  }
})

window.addEventListener('beforeunload', () => {
  beginTime = new Date().getTime()
  auth = sessionStorage.getItem('Authorization')
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

