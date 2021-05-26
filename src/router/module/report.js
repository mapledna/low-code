/**
 * 在线报表引擎
 */
export default rootPath => {
  if (rootPath === undefined) {
    rootPath = '/report'
  }
  return [
    {
      path: `${rootPath}`,
      name: 'reportManager',
      component: () => import(/* webpackChunkName: "module-report" */ '@views/report/manager'),
      meta: {
        title: '在线报表管理'
      }
    },
    // {
    //   path: `${rootPath}/desk`,
    //   name: 'reportManagerWarp',
    //   component: () => import(/* webpackChunkName: "module-report" */ '@views/report/managerWarp'),
    //   meta: {
    //     title: '在线报表管理平台'
    //   }
    // },
    {
      path: `${rootPath}/:reportId`,
      name: 'reportResult',
      component: () => import(/* webpackChunkName: "module-report" */ '@views/report/result'),
      meta: {
        title: '在线报表'
      }
    }
  ]
}
