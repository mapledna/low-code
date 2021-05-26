/* 表格分页查询

API地址：api/build/database/selectDataPage
参数：{"sqlId": 【SQL ID】,"pager":{"rows":10,"page":1},"parameters": 【表格查询参数】}

*/

const parameter = {
  sqlId: '1251048221643583490',
  pager: { rows: 10, page: 1 },
  parameters: {
    interface_name: '',
    interface_code: '',
    interface_url: '',
    audit_status: []
  }
}

const result = {
  code: 0,
  data: {
    page: {
      currentPage: 1,
      pageSize: 10,
      rows: [
        {
          id: '1288305633230163970',
          interface_name: '删除文件',
          interface_code: 'delete_file',
          media_type: 1,
          request_mode: 2,
          return_type: 1,
          interface_url: 'http://10.1.20.254:13000/file/deleteFile',
          description: '删除文件',
          audit_status: 1,
          audit_date: '2020-07-31 13:56:31',
          created_date: '2020-07-29 18:49:33',
          created_by: '叶吓云',
          audit_user: '陈光鸿'
        },
        {
          id: '1285871450215321602',
          interface_name: '组件版本变化重新刷菜单字段按钮',
          interface_code: 'part_change_refresh_button_field',
          media_type: 1,
          request_mode: 2,
          return_type: 1,
          interface_url:
            'http://10.1.20.254:13000/part/updateMenuButtonAndFiled',
          description: '组件版本变化重新刷菜单字段按钮',
          audit_status: 1,
          audit_date: '2020-07-31 13:56:31',
          created_date: '2020-07-23 01:35:31',
          created_by: '刘方平22',
          audit_user: '陈光鸿'
        },
        {
          id: '1285397452721381378',
          interface_name: '初始化登录页/主页',
          interface_code: 'init_page_home',
          media_type: 1,
          request_mode: 2,
          return_type: 1,
          interface_url: 'http://10.1.20.254:13000/part/copyTemplatePart',
          description: '创建产品用于初始化产品首页和登录页',
          audit_status: 1,
          audit_date: '2020-07-31 13:56:31',
          created_date: '2020-07-21 18:12:03',
          created_by: '刘方平22',
          audit_user: '陈光鸿'
        },
        {
          id: '1282877175546392578',
          interface_name: '删除组件版本文件',
          interface_code: 'delete_part_file',
          media_type: 1,
          request_mode: 2,
          return_type: 1,
          interface_url: 'http://10.1.20.254:13000/part/deletePartVersionFile',
          description: '删除组件版本文件包含html和json文件',
          audit_status: 1,
          audit_date: '2020-07-31 13:56:31',
          created_date: '2020-07-14 19:17:29',
          created_by: '刘方平22',
          audit_user: '陈光鸿'
        },
        {
          id: '1274936535720648710',
          interface_name: '获取序列号',
          interface_code: 'get_sequence_no',
          media_type: 1,
          request_mode: 2,
          return_type: 1,
          interface_url: 'http://10.1.20.254:13000/sequence/getSequenceNo',
          description: '获取序列号',
          audit_status: 1,
          audit_date: '2020-07-31 13:56:31',
          created_date: '2020-06-22 21:19:37',
          created_by: '叶吓云',
          audit_user: '陈光鸿'
        },
        {
          id: '1274936535720648709',
          interface_name: '获取雪花算法的ID',
          interface_code: 'get_snowflake_id',
          media_type: 1,
          request_mode: 2,
          return_type: 1,
          interface_url: 'http://10.1.20.254:13000/sequence/getSnowflakeNo',
          description: '获取雪花算法的ID',
          audit_status: 1,
          audit_date: '2020-07-31 13:56:31',
          created_date: '2020-06-22 21:19:37',
          created_by: '叶吓云',
          audit_user: '陈光鸿'
        },
        {
          id: '1274936535720648708',
          interface_name: '删除用户角色缓存',
          interface_code: 'delete_user_role_cache',
          media_type: 1,
          request_mode: 2,
          return_type: 1,
          interface_url: 'http://10.1.20.254:13000/cache/delete',
          description: '删除SQL缓存',
          audit_status: 1,
          audit_date: '2020-07-31 13:56:31',
          created_date: '2020-06-22 21:19:37',
          created_by: '叶吓云',
          audit_user: '陈光鸿'
        },
        {
          id: '1274936535720648707',
          interface_name: '删除角色缓存',
          interface_code: 'delete_role_cache',
          media_type: 1,
          request_mode: 2,
          return_type: 1,
          interface_url: 'http://10.1.20.254:13000/cache/delete',
          description: '删除SQL缓存',
          audit_status: 1,
          audit_date: '2020-07-31 13:56:31',
          created_date: '2020-06-22 21:19:37',
          created_by: '叶吓云',
          audit_user: '陈光鸿'
        },
        {
          id: '1274936535720648706',
          interface_name: '删除SQL缓存',
          interface_code: 'delete_sql_cache',
          media_type: 1,
          request_mode: 2,
          return_type: 1,
          interface_url: 'http://10.1.20.254:13000/cache/delete',
          description: '删除SQL缓存',
          audit_status: 1,
          audit_date: '2020-07-31 13:56:31',
          created_date: '2020-06-22 21:19:37',
          created_by: '叶吓云',
          audit_user: '陈光鸿'
        },
        {
          id: 2,
          interface_name: '企查查模糊查询',
          interface_code: 'qichacha_Search',
          media_type: 1,
          request_mode: 1,
          return_type: 1,
          interface_url: 'http://api.qichacha.com/ECIV4/Search',
          description: null,
          audit_status: 1,
          audit_user: null,
          audit_date: null,
          created_by: null,
          created_date: null
        }
      ],
      totalCount: 10,
      totalPage: 1
    }
  },
  message: 'success'
}

export default result
