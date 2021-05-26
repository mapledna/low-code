/* 用户所属的租户列表【登录后第三个】
特征：页面右上角可以切换租户

API地址：api/build/client/listClientUser
参数：无

后续请求：获取租户下的产品列表【登录后第四个】
api/build/database/executeSqls
{"executeSqlList":[{"sqlId":"1278966499505532929","parameters":{"clientId":"1"}}]}
*/

const parameter = null

const result = {
  code: 0,
  data: [
    {
      id: '1',
      label: '开发者配置化平台'
    },
    {
      id: '1262622154699513857',
      label: '租户NTI'
    }
  ],
  message: 'success'
}

export default result
