/* 获取流水号

API地址：api/build/database/executeSqls
参数：{"executeSqlList":[{"sqlId":"1270224820225093633"}]}

 */

// 固定参数
export const parameter = { executeSqlList: [{ sqlId: '1270224820225093633' }] }

export const result = {
  code: 0,
  data: {
    table_0: [
      {
        id: '1249543630291902466',
        seq_name: '工单编号',
        seq_code: 'WO_CODE'
      }
    ]
  },
  message: 'success'
}
