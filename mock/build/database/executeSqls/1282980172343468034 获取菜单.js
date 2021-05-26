/* 获取菜单【登录后第二个】
特征：没有携带租户信息

API地址：api/build/database/executeSqls
参数：{"executeSqlList":[{"sqlId":"1282980172343468034","parameters":{}}]}
*/

const parameter = {
  executeSqlList: [
    { sqlId: '1282980172343468034', parameters: {} }
  ]
}


const result = {
  code: 0,
  data: {
    table_0: [
      {
        id: '1274984437844962221',
        pid: 0,
        label: '系统管理',
        menu_code: 'system',
        menu_icon: 'el-icon-s-opportunity',
        icon_color: '#0873D7',
        part_id: null,
        menu_href: null
      },
      {
        id: '1274984437844962225',
        pid: '1274989528165543938',
        label: '分类管理',
        menu_code: 'part_c',
        menu_icon: 'null',
        icon_color: null,
        part_id: '1278212112122277889',
        menu_href: null
      },
      {
        id: '1274999702091624449',
        pid: '1274989528165543937',
        label: '分类管理',
        menu_code: 'type_manage_code',
        menu_icon: null,
        icon_color: null,
        part_id: '1270889249505730562',
        menu_href: null
      },
      {
        id: '1275001903132340225',
        pid: '1275001762522492929',
        label: '页面管理',
        menu_code: 'homepage_code',
        menu_icon: 'el-icon-s-operation',
        icon_color: null,
        part_id: '1273893543540363266',
        menu_href: null
      },
      {
        id: '1300966816412184577',
        pid: '1300966222716841986',
        label: '流程分类',
        menu_code: 'flow_category',
        menu_icon: '',
        icon_color: null,
        part_id: '1300736397288779777',
        menu_href: null
      },
      {
        id: '1274984437844962224',
        pid: '1274989528165543938',
        label: '组件管理',
        menu_code: 'part_m',
        menu_icon: null,
        icon_color: null,
        part_id: '1277418077212270593',
        menu_href: null
      },
      {
        id: '1274989528165543937',
        pid: 0,
        label: '开发工具',
        menu_code: 'development_code',
        menu_icon: 'development_code',
        icon_color: null,
        part_id: null,
        menu_href: null
      },
      {
        id: '1274999878495662082',
        pid: '1274989528165543937',
        label: 'SQL管理',
        menu_code: 'sql_manage_code',
        menu_icon: null,
        icon_color: null,
        part_id: '1260809016110936065',
        menu_href: null
      },
      {
        id: '1275002020270862337',
        pid: '1275001762522492929',
        label: '菜单管理',
        menu_code: 'menu_manage_code',
        menu_icon: 'el-icon-s-grid',
        icon_color: null,
        part_id: '1274940874297868289',
        menu_href: null
      },
      {
        id: '1275002783000850434',
        pid: '1275002588955570177',
        label: '分类管理',
        menu_code: 'type_code',
        menu_icon: 'el-icon-s-fold',
        icon_color: null,
        part_id: '1264768518816419842',
        menu_href: null
      },
      {
        id: '1275002952694001666',
        pid: '1275002588955570177',
        label: '产品管理',
        menu_code: 'product_manage_code',
        menu_icon: null,
        icon_color: null,
        part_id: '1264799893292470273',
        menu_href: null
      },
      {
        id: '1301004951443582977',
        pid: '1300966222716841986',
        label: '流程管理',
        menu_code: 'flow_manager',
        menu_icon: '',
        icon_color: null,
        part_id: '1300990726394458113',
        menu_href: null
      },
      {
        id: '1274989528165543938',
        pid: 0,
        label: '组件管理',
        menu_code: 'part',
        menu_icon: 'part',
        icon_color: null,
        part_id: null,
        menu_href: null
      },
      {
        id: '1275000123879223297',
        pid: '1274989528165543937',
        label: '事务流管理',
        menu_code: 'transflow_code',
        menu_icon: null,
        icon_color: null,
        part_id: '1263405310230839298',
        menu_href: null
      },
      {
        id: '1275002160025071617',
        pid: '1275001762522492929',
        label: '首页管理',
        menu_code: 'init_page_code',
        menu_icon: 'el-icon-s-platform',
        icon_color: null,
        part_id: '1275023788356300801',
        menu_href: null
      },
      {
        id: '1275003065717911554',
        pid: '1275002588955570177',
        label: '产品信息',
        menu_code: 'product_info_code',
        menu_icon: null,
        icon_color: null,
        part_id: '1264807605594116098',
        menu_href: null
      },
      {
        id: '1305406933084147714',
        pid: '1300966222716841986',
        label: '审批列表',
        menu_code: 'to_flow_list',
        menu_icon: null,
        icon_color: null,
        part_id: '1305395324810956802',
        menu_href: null
      },
      {
        id: '1275000274542817281',
        pid: '1274989528165543937',
        label: '流水号管理',
        menu_code: 'squ_manage_code',
        menu_icon: null,
        icon_color: null,
        part_id: '1260515309631053825',
        menu_href: null
      },
      {
        id: '1275001762522492929',
        pid: 0,
        label: '构建工具',
        menu_code: 'build_tool_unit',
        menu_icon: 'build_tool_unit',
        icon_color: null,
        part_id: null,
        menu_href: null
      },
      {
        id: '1275002405995835394',
        pid: '1275001762522492929',
        label: '主页管理',
        menu_code: 'main_page_code',
        menu_icon: 'el-icon-platform-eleme',
        icon_color: null,
        part_id: '1274903100127608834',
        menu_href: null
      },
      {
        id: '1293099283977953281',
        pid: '1275002588955570177',
        label: '产品解决方案管理',
        menu_code: 'menu_solve_plan',
        menu_icon: null,
        icon_color: null,
        part_id: '1293107154438414338',
        menu_href: null
      },
      {
        id: '1305407116693999618',
        pid: '1300966222716841986',
        label: '我的审批',
        menu_code: 'my_instance',
        menu_icon: null,
        icon_color: null,
        part_id: '1305396309935525889',
        menu_href: null
      },
      {
        id: '1275000402401980417',
        pid: '1274989528165543937',
        label: '文件管理',
        menu_code: 'file_manage_code',
        menu_icon: null,
        icon_color: null,
        part_id: '1263708965244956673',
        menu_href: null
      },
      {
        id: '1275002275678810113',
        pid: '1275001762522492929',
        label: '登录页管理',
        menu_code: 'login_code',
        menu_icon: 'el-icon-user-solid',
        icon_color: null,
        part_id: '1275315508360904705',
        menu_href: null
      },
      {
        id: '1275002588955570177',
        pid: 0,
        label: '产品管理',
        menu_code: 'product_code',
        menu_icon: 'product_code',
        icon_color: null,
        part_id: null,
        menu_href: null
      },
      {
        id: '1305407349360431105',
        pid: '1300966222716841986',
        label: '待办审批',
        menu_code: 'approver_instance',
        menu_icon: null,
        icon_color: null,
        part_id: '1305397789350432770',
        menu_href: null
      },
      {
        id: '1275000690143817729',
        pid: '1274989528165543937',
        label: '接口管理',
        menu_code: 'inter_manage_code',
        menu_icon: null,
        icon_color: null,
        part_id: '1261174182606438402',
        menu_href: null
      },
      {
        id: '1300966222716841986',
        pid: 0,
        label: '流程审批',
        menu_code: 'flow_approval',
        menu_icon: 'mdi mdi-clipboard-flow',
        icon_color: null,
        part_id: null,
        menu_href: null
      },
      {
        id: '1305407746057703426',
        pid: '1300966222716841986',
        label: '已办审批',
        menu_code: 'hander_instance',
        menu_icon: null,
        icon_color: null,
        part_id: '1305402313595162626',
        menu_href: null
      },
      {
        id: '1331861594477436930',
        pid: '1274989528165543937',
        label: '微服务接口',
        menu_code: 'micro_interface',
        menu_icon: null,
        icon_color: null,
        part_id: '1331832902904717314',
        menu_href: null
      },
      {
        id: '1274987381298458626',
        pid: '1274984437844962221',
        label: '我的工单',
        menu_code: 'repair_customer_code',
        menu_icon: null,
        icon_color: null,
        part_id: '1263405040717447170',
        menu_href: null
      },
      {
        id: '1275000838441824258',
        pid: '1274989528165543937',
        label: '定时任务管理',
        menu_code: 'time_manage_code',
        menu_icon: null,
        icon_color: null,
        part_id: '1263731059911487490',
        menu_href: null
      },
      {
        id: '1274987677504401409',
        pid: '1274984437844962221',
        label: '工单管理',
        menu_code: 'repair_service_code',
        menu_icon: null,
        icon_color: null,
        part_id: '1263661135125999617',
        menu_href: null
      },
      {
        id: '1275001117388206081',
        pid: '1274989528165543937',
        label: '数据表管理',
        menu_code: 'table_manage_code',
        menu_icon: null,
        icon_color: null,
        part_id: '1265907043741896706',
        menu_href: null
      },
      {
        id: '1278266129905082369',
        pid: '1274984437844962221',
        label: '日志管理',
        menu_code: 'log_manage',
        menu_icon: 'null',
        icon_color: '#812B2B',
        part_id: '1270656217943302145',
        menu_href: null
      },
      {
        id: '1286121276731494401',
        pid: '1274984437844962221',
        label: '帮助文档',
        menu_code: 'help_doc',
        menu_icon: null,
        icon_color: null,
        part_id: '1286110095396507649',
        menu_href: null
      },
      {
        id: '1306863457543471105',
        pid: '1274989528165543937',
        label: '工具主键',
        menu_code: 'tool_primary_key',
        menu_icon: null,
        icon_color: null,
        part_id: '1306840795047870466',
        menu_href: null
      }
    ]
  },
  message: 'success'
}

export default result
