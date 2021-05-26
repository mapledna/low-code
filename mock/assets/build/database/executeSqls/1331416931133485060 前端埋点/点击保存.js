/* 提交前端埋点记录：保存设计器

API地址：api/build/database/executeSqls
参数：{"executeSqlList":[{"sqlId":"1331416931133485060","parameters":{}}]}

*/

const parameter = {
  executeSqlList: [
    {
      sqlId: '1331416931133485060',
      parameters: {
        start_time: 1614246530,
        end_time: 0,
        duration_time: 0,
        point_type: 3,
        point_name: '点击',
        point_data: '点击保存',
        pv_id: 0
      }
    }
  ]
}
const result = {
  code: 0,
  data: {
    execute: [
      {
        code: 0,
        count: 1,
        dateTime: '2021-02-25 17:47:30',
        id: '1364874654678155266',
        msg: '创建成功',
        sqlId: '1331416931133485060'
      }
    ]
  },
  message: 'success'
}

export default result
