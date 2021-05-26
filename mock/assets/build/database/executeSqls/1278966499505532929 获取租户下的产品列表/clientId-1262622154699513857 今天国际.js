/* 获取租户下的产品列表【登录后第四个】
特征：页面右上角可以切换租户

API地址：api/build/database/executeSqls
参数：{"executeSqlList":[{"sqlId":"1278966499505532929","parameters":{"clientId":"1262622154699513857"}}]}

*/

const parameter = {
  executeSqlList:
  [{
    sqlId: '1278966499505532929',
    parameters: { clientId: '1262622154699513857' }
  }]
}

const result = {
  code: 0,
  data: {
    table_0: [
      {
        id: '1272364623519444993',
        pid: 0,
        label: '物流管控平台',
        product_code: 'lmcp',
        product_color: '#C92323',
        product_icon: 'mdi mdi-cassette'
      },
      {
        id: '1292690347256836097',
        pid: 0,
        label: '客户关系管理系统',
        product_code: 'crm',
        product_color: '#3D2C2C',
        product_icon: 'mdi mdi-flask-empty-outline'
      }
    ]
  },
  message: 'success'
}

export default result
