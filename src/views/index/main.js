import Vue from 'vue'
import '@/utils/entryImport'
import '@/utils/entryImport/extend'

import { changeFavicon } from '@/utils/favicon'


import App from '@views/App.vue'
// 路由
import VueRouter from 'vue-router'
import { setNowPageName, judgeIsMobile } from '@router/tool'
import indexRouter from '@router/module/index'
// 存储
import store from '@store'

Vue.use(VueRouter)
setNowPageName('INDEX')
const router = new VueRouter({
  routes: [...indexRouter]
})

// 增加title属性 并兼容移动端路由
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = '低代码演示'
  }

  const websiteIco = window.localStorage.getItem('websiteIco')
  if (websiteIco) {
    changeFavicon(websiteIco)
  }


  // console.log('to', to)
  if (judgeIsMobile() && !to.path.match(/.*?ph$/i) && to.path.match(/info/i)) {
    next(`${to.path}ph`)
  } else if (!judgeIsMobile() && to.path.match(/.*?ph$/i) && to.path.match(/info/i)) {
    next(to.path.replace(/(.*)ph/i, '$1'))
  }
  next()
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

