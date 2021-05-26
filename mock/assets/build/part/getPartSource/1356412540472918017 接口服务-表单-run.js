/* 页面运行请求：接口服务表单

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
    // 字典：媒体类型
    {
      sqlId: '1257968258652504065',
      parameters: { p_id: '1261170088084930561' }
    },
    // 字典：请求方式
    {
      sqlId: '1257968258652504065',
      parameters: { p_id: '1261169218253389825' }
    },
    // 字典：返回值类型
    {
      sqlId: '1257968258652504065',
      parameters: { p_id: '1261169630276648961' }
    },
    // 表单数据
    { sqlId: '1251047719744778242', parameters: { id: '1274936535720648709' } }
  ]
}

const result = {
  code: 0,
  data: {
    table_1: [
      {
        id: '1',
        label: 'JSON',
        selected: 0
      },
      {
        id: '2',
        label: '表单',
        selected: 0
      }
    ],
    table_2: [
      {
        id: '1',
        label: 'GET请求',
        selected: 0
      },
      {
        id: '2',
        label: 'POST请求',
        selected: 0
      }
    ],
    table_3: [
      {
        id: '1274936535720648709',
        product_id: 1,
        interface_name: '获取雪花算法的ID',
        interface_code: 'get_snowflake_id',
        media_type: 1,
        request_mode: 2,
        return_type: 1,
        interface_url: 'http://10.1.20.254:13000/sequence/getSnowflakeNo',
        description: '获取雪花算法的ID',
        audit_status: 1,
        audit_date: '2020-07-31 13:56:31',
        audit_opinion: '通过',
        expired_user: null,
        expired_reason: null,
        expired_date: null,
        created_date: '2020-06-22 21:19:37',
        updated_date: '2020-07-31 13:56:00',
        created_by: '叶吓云',
        updated_by: '陈光鸿',
        audit_user: '陈光鸿'
      }
    ],
    table_0: [
      {
        id: '1',
        label: 'JSON',
        selected: 0
      },
      {
        id: '2',
        label: '字符串',
        selected: 0
      }
    ]
  },
  message: 'success'
}

export default result
