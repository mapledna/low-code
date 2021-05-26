/* 表格分页查询：服务分类表列表

API地址：api/build/database/selectDataPage
参数：{"sqlId": 【SQL ID】,"pager":{"rows":10,"page":1},"parameters": 【表格查询参数】}

*/

const parameter = { sqlId: '1255778887614492674', pager: { rows: 10, page: 1 }, parameters: {} }

const result = {
  code: 0,
  data: {
    page: {
      currentPage: 1,
      pageSize: 10,
      rows: [
        {
          id: 1,
          p_id: 0,
          service_category_name: '系统管理',
          service_category_code: 'system',
          service_category_icon: 'null',
          sort_no: 1,
          description: '系统管理',
          created_by: null,
          created_date: null
        },
        {
          id: '1300972658238795777',
          p_id: 0,
          service_category_name: '人力资源类',
          service_category_code: 'human',
          service_category_icon: null,
          sort_no: 1,
          description: '人力资源类',
          created_by: '1181875516249083904',
          created_date: '2020-09-02 22:43:47'
        },
        {
          id: '1288037348119015426',
          p_id: 0,
          service_category_name: '配置平台',
          service_category_code: 'config_platform',
          service_category_icon: null,
          sort_no: 1,
          description: '配置平台',
          created_by: '1181875516249083904',
          created_date: '2020-07-29 06:03:29'
        },
        {
          id: '1278233163644526593',
          p_id: 0,
          service_category_name: '公有分类',
          service_category_code: 'part_public',
          service_category_icon: null,
          sort_no: 1,
          description: null,
          created_by: '1130769536862261248',
          created_date: '2020-07-02 04:44:03'
        },
        {
          id: '1247370196019499010',
          p_id: 0,
          service_category_name: '开发工具',
          service_category_code: 'tools',
          service_category_icon: null,
          sort_no: 2,
          description: '开发工具分类',
          created_by: '1181875516249083904',
          created_date: '2020-04-08 00:46:44'
        },
        {
          id: '1300973578838192129',
          p_id: 0,
          service_category_name: '行政管理类',
          service_category_code: 'administration',
          service_category_icon: null,
          sort_no: 2,
          description: '行政管理类',
          created_by: '1181875516249083904',
          created_date: '2020-09-02 22:47:26'
        },
        {
          id: '1278233347195658242',
          p_id: 0,
          service_category_name: '私有分类',
          service_category_code: 'part_private',
          service_category_icon: null,
          sort_no: 2,
          description: '私有分类',
          created_by: '1130769536862261248',
          created_date: '2020-07-02 04:44:46'
        },
        {
          id: '1263746316268662786',
          p_id: 0,
          service_category_name: '应用中心',
          service_category_code: 'warehousing_logistics',
          service_category_icon: null,
          sort_no: 2,
          description: '描述',
          created_by: '1181875516249083904',
          created_date: '2020-05-26 02:18:46'
        },
        {
          id: '1247370494951739393',
          p_id: 0,
          service_category_name: '组件管理',
          service_category_code: 'parts',
          service_category_icon: null,
          sort_no: 3,
          description: '组件管理分类',
          created_by: '1181875516249083904',
          created_date: '2020-04-08 00:47:55'
        },
        {
          id: '1289116461953032194',
          p_id: 0,
          service_category_name: '数据报表',
          service_category_code: 'data_report',
          service_category_icon: null,
          sort_no: 3,
          description: '数据报表',
          created_by: '1130769536862261248',
          created_date: '2020-08-01 05:31:29'
        }
      ],
      totalCount: 74,
      totalPage: 8
    }
  },
  message: 'success'
}

export default result
