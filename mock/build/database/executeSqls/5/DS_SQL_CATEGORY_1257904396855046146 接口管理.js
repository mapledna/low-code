/* 根据数据分组获取SQL列表：开发工具-接口管理

API地址：api/build/database/executeSqls
参数：{"executeSqlList":[{"sqlId":"5","parameters":{"category_id": 【分类ID】}}]}

 */

// 固定参数
const parameter = {
  executeSqlList: [
    { sqlId: '5', parameters: { category_id: '1257904396855046146' } }
  ]
}

const result = {
  code: 0,
  data: {
    table_0: [
      {
        id: '1251047719744778245',
        sql_name: '删除接口服务表',
        sql_code: 'delete_rd_t_interface',
        id_code: '1251047719744778245'
      },
      {
        id: '1251047719744778242',
        sql_name: '获取接口服务表',
        sql_code: 'get_rd_t_interface',
        id_code: '1251047719744778242'
      },
      {
        id: '1251047719744778243',
        sql_name: '插入接口服务表',
        sql_code: 'insert_rd_t_interface',
        id_code: '1251047719744778243'
      },
      {
        id: '1258688116855865345',
        sql_name: '查询可用接口服务列表',
        sql_code: 'select_can_use_interface',
        id_code: '1258688116855865345'
      },
      {
        id: '1251048221643583490',
        sql_name: '查询接口服务表列表',
        sql_code: 'select_rd_t_interface',
        id_code: '1251048221643583490'
      },
      {
        id: '1275377330300518404',
        sql_name: '编辑接口服务取消审核',
        sql_code: 'update_interface_audit0',
        id_code: '1275377330300518404'
      },
      {
        id: '1251063388007772164',
        sql_name: '编辑接口服务审核通过',
        sql_code: 'update_interface_audit1',
        id_code: '1251063388007772164'
      },
      {
        id: '1251065911397527556',
        sql_name: '编辑接口服务过期',
        sql_code: 'update_interface_audit3',
        id_code: '1251065911397527556'
      },
      {
        id: '1251047719744778244',
        sql_name: '编辑接口服务表',
        sql_code: 'update_rd_t_interface',
        id_code: '1251047719744778244'
      }
    ]
  },
  message: 'success'
}

export default result
