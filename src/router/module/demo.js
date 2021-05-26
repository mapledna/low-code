export default [
  {
    path: '/map',
    name: 'map',
    component: () => import(/* webpackChunkName: "module-map" */ '@/views/map/Index.vue')
  }
]
