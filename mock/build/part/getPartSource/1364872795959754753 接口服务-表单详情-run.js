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

//  NOTE: 数据源本身缺少 filter 数据，所以没有请求数据字典。
const parameter = {
  executeSqlList: [
    { sqlId: '1251047719744778242', parameters: { id: '1274936535720648709' } }
  ]
}

const result = {
  code: 0,
  data: {
    table_0: [
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
    ]
  },
  message: 'success'
}

export default result
