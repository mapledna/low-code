/* 获取租户下的产品列表【登录后第四个】
特征：页面右上角可以切换租户

API地址：api/build/database/executeSqls
参数：{"executeSqlList":[{"sqlId":"1278966499505532929","parameters":{"clientId":"1"}}]}

*/

const parameter = {
  executeSqlList:
  [{
    sqlId: '1278966499505532929',
    parameters: { clientId: '1' }
  }]
}

const result = {
  code: 0,
  data: {
    table_0: [
      {
        id: 1,
        pid: 0,
        label: '配置平台',
        product_code: 'prod',
        product_color: '#61625A',
        product_icon: 'mdi mdi-wrench'
      },
      {
        id: 2,
        pid: 0,
        label: '系统管理',
        product_code: 'ui-system',
        product_color: '#EBE008',
        product_icon: 'mdi mdi-account'
      }
    ]
  },
  message: 'success'
}

export default result
