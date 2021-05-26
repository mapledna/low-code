/* 页面运行请求：表单详情页面

API地址：api/build/database/executeSqls
参数：{"executeSqlList":[
  {
    "sqlId":"1257968258652504065",
    "parameters":{"p_id": 【数据字典ID】}
  },
  {
    "sqlId":【数据源ID】,
    "parameters":【数据源参数】
  }
]}

 */

const parameter = {
  executeSqlList: [
    // 字典：是否必填
    {
      sqlId: '1257968258652504065',
      parameters: { p_id: '1255706920988938242' }
    },
    // 表单数据
    {
      sqlId: '1255044056670253058',
      parameters: { id: '1351831826339385348', sql_id: '1331832491661598722' }
    }
  ]
}

const result = {
  code: 0,
  data: {
    table_1: [
      {
        id: '1351831826339385348',
        sql_id: '1331832491661598722',
        sql_param_name: '参数代码',
        sql_param_code: 'param_code',
        sql_param_type: 1,
        value_defaults: '',
        is_required: 0,
        is_id: 0,
        valid_rule: 6,
        param_min_length: null,
        param_max_length: null,
        is_not_null: 0,
        sort_no: 3
      }
    ],
    table_0: [
      {
        id: '1',
        label: '是',
        selected: 0
      },
      {
        id: '0',
        label: '否',
        selected: 0
      }
    ]
  },
  message: 'success'
}

export default result
