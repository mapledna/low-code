/**
 * 设计器
 */
import base from './base' // 404 和 错误页面
// import flow from './flow' // 事务流
// import workflow from './workflow' // 工作流

export default [
  ...base,
  // ...flow,
  // ...workflow,
  {
    path: '/',
    name: 'designer',
    component: () => import(
      /* webpackChunkName: "module-designer" */ '@/views/designer/Home.vue'
    )
  },
  // {
  //   path: '/parser',
  //   name: 'parser',
  //   component: () => import('@/components/parser/example/Index.vue')
  // },
  {
    path: '/show',
    name: 'show',
    component: () => import(
      /* webpackChunkName: "module-show" */ '@/views/designer/ShowTemplate.vue'
    )
  }
]
