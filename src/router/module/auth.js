export default [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "module-auth" */ '@/views/pages/Login.vue')
    // component: () => import(/* webpackChunkName: "module-auth" */ '@/views/pages/LoginTemplate.vue')
  },
  {
    path: '/Register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "module-auth" */ '@/views/login/Register.vue')
  },
  {
    path: '/CloudLogin',
    name: 'CloudLogin',
    component: () => import(/* webpackChunkName: "module-auth" */ '@/views/login/Login.vue')
  },
  {
    path: '/FindPassword',
    name: 'FindPassword',
    component: () => import(/* webpackChunkName: "module-auth" */ '@/views/login/findPsw.vue')
  }
]
