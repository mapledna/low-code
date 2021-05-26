export default [
  {
    path: '/flow',
    name: 'flow',
    component: () => import(/* webpackChunkName: "module-flow" */ '@/views/flow/FlowDialog.vue')
  }]
