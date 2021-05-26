/*
选择初始数据源：获取接口服务表
请求初始数据源参数
api/build/database/executeSqls
{"executeSqlList":[{"sqlId":"6","parameters":{"sqlId":"1251047719744778242"}}]}
*/

const parameter = {
  executeSqlList: [
    { sqlId: '6', parameters: { sqlId: '1251047719744778242' } }
  ]
}

const result = {
  code: 0,
  data: {
    table_0: [
      {
        value: 'id',
        label: '接口ID',
        widgettype: 2,
        paramvalue: null,
        is_required: 1,
        valid_rule: null,
        param_min: null,
        param_max: null
      }
    ]
  },
  message: 'success'
}

export default result
