/* 根据数据分组获取SQL列表：开发工具-分类管理

API地址：api/build/database/executeSqls
参数：{"executeSqlList":[{"sqlId":"5","parameters":{"category_id": 【分类ID】}}]}

 */

// 固定参数
const parameter = {
  executeSqlList: [
    { sqlId: '5', parameters: { category_id: '1257903494026915842' } }
  ]
}

const result = {
  code: 0,
  data: {
    table_0: [
      {
        id: '1281136178856603649',
        sql_name: '统计子节点',
        sql_code: 'c_count_leaf',
        id_code: '1281136178856603649'
      },
      {
        id: '1285033241868664838',
        sql_name: '删除分类',
        sql_code: 'delete_category_by_id',
        id_code: '1285033241868664838'
      },
      {
        id: '1257880139060113413',
        sql_name: '删除服务分类表',
        sql_code: 'delete_rd_t_service_category',
        id_code: '1257880139060113413'
      },
      {
        id: '1257880139060113410',
        sql_name: '获取服务分类表',
        sql_code: 'get_rd_t_service_category',
        id_code: '1257880139060113410'
      },
      {
        id: '1257880139060113411',
        sql_name: '插入服务分类表',
        sql_code: 'insert_rd_t_service_category',
        id_code: '1257880139060113411'
      },
      {
        id: '1300985592247595009',
        sql_name: '查询流程分类',
        sql_code: 'select_flow_category',
        id_code: '1300985592247595009'
      },
      {
        id: '1306788190959517697',
        sql_name: '根据父类获取最大的排序号',
        sql_code: 'select_max_sort_no',
        id_code: '1306788190959517697'
      },
      {
        id: '1255778887614492674',
        sql_name: '查询服务分类表列表',
        sql_code: 'select_rd_t_service_category',
        id_code: '1255778887614492674'
      },
      {
        id: 4,
        sql_name: '获取服务类型树',
        sql_code: 'service_type_tree',
        id_code: '4'
      },
      {
        id: '1257880139060113412',
        sql_name: '编辑服务分类表',
        sql_code: 'update_rd_t_service_category',
        id_code: '1257880139060113412'
      }
    ]
  },
  message: 'success'
}

export default result
