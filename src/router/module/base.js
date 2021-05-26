export default [
  {
    path: '*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "module-base" */ '@/views/pages/404.vue')
  },
  {
    path: '/Error',
    name: 'Error',
    component: () => import(/* webpackChunkName: "module-base" */ '@/views/pages/500.vue')
  }
]
