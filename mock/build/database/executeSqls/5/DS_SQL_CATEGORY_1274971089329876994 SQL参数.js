/* 根据数据分组获取SQL列表：开发工具-SQL管理-SQL参数

API地址：api/build/database/executeSqls
参数：{"executeSqlList":[{"sqlId":"5","parameters":{"category_id":【分类ID】}}]}

 */

// 固定参数
const parameter = {
  executeSqlList: [
    { sqlId: '5', parameters: { category_id: '1274971089329876994' } }
  ]
}

const result = {
  code: 0,
  data: {
    table_0: [
      {
        id: '1245286443621953541',
        sql_name: '删除SQL服务参数表',
        sql_code: 'delete_rd_t_sql_param',
        id_code: '1245286443621953541'
      },
      {
        id: '1244895972495360002',
        sql_name: '删除SQL参数',
        sql_code: 'delete_sql_param',
        id_code: '1244895972495360002'
      },
      {
        id: '1255044056670253058',
        sql_name: '获取SQL服务参数表',
        sql_code: 'get_rd_t_sql_param',
        id_code: '1255044056670253058'
      },
      {
        id: '1255425547308883971',
        sql_name: '插入SQL服务参数表',
        sql_code: 'insert_rd_t_sql_param',
        id_code: '1255425547308883971'
      },
      {
        id: 6,
        sql_name: '根据sqlId获取参数列表',
        sql_code: 'param_list',
        id_code: '6'
      },
      {
        id: '1283661344547446786',
        sql_name: '根据Sql查询参数',
        sql_code: 'sql_param_field_list',
        id_code: '1283661344547446786'
      },
      {
        id: '1244869606408355842',
        sql_name: 'SQL参数查询',
        sql_code: 'sql_param_list',
        id_code: '1244869606408355842'
      },
      {
        id: '1255425547308883972',
        sql_name: '编辑SQL服务参数表',
        sql_code: 'update_rd_t_sql_param',
        id_code: '1255425547308883972'
      }
    ]
  },
  message: 'success'
}

export default result
