import pageMap from '@router/config/page'

// import demo from './demo'
import designer from './designer' // 设计器
import base from './base' // 404 和 错误页面
// import auth from './auth'
// import info from './info'
// import report from './report' // 在线报表引擎

export default [
  // ...demo,
  ...designer,
  ...base,
  // ...auth,
  // ...info,
  // ...report(),
  {
    path: '/',
    name: 'main',
    component: () => import(
      /* webpackChunkName: "module-index" */ '@/views/pages/Index.vue'
    )
  }
]
