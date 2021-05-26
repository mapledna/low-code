export default [
  {
    path: '/workflow',
    name: 'workflow',
    component: () => import(
      /* webpackChunkName: "module-workflow" */ '@/views/workFlow/Index.vue'
    )
  },
  {
    path: '/workflow/form',
    name: 'workflowForm',
    component: () => import(
      /* webpackChunkName: "module-workflow" */ '@/views/workFlow/UserForm.vue'
    )
  },
  {
    path: '/workflow/detail',
    name: 'detail',
    component: () => import(
      /* webpackChunkName: "module-workflow" */ '@/views/approval/Index.vue'
    )
  }
]
