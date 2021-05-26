/* 查询服务分类表列表

API地址：api/build/database/executeSqls
参数：{"executeSqlList":[{"sqlId":"1282980172343468034","parameters":{}}]}
*/

export const parameter = {
  executeSqlList: [{
    sqlId: '1255778887614492674',
    parameters: {
      service_category_name: '', service_category_code: '', service_type: '', p_id: ''
    }
  }]
}

export const result = {
  code: 0,
  data: {
    table_0: [
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
      },
      {
        id: '1300973974897930242',
        p_id: 0,
        service_category_name: '资产管理类',
        service_category_code: 'assets',
        service_category_icon: null,
        sort_no: 3,
        description: '资产管理类',
        created_by: '1181875516249083904',
        created_date: '2020-09-02 22:49:01'
      },
      {
        id: '1257900029842190338',
        p_id: 0,
        service_category_name: '构建工具',
        service_category_code: 'build_tools',
        service_category_icon: null,
        sort_no: 4,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:04:20'
      },
      {
        id: '1289116916900798466',
        p_id: 0,
        service_category_name: '研发设计',
        service_category_code: 'design',
        service_category_icon: null,
        sort_no: 4,
        description: '研发设计',
        created_by: '1130769536862261248',
        created_date: '2020-08-01 05:33:18'
      },
      {
        id: '1300974134449254402',
        p_id: 0,
        service_category_name: '商务采购类',
        service_category_code: 'purchase',
        service_category_icon: null,
        sort_no: 4,
        description: '商务采购类',
        created_by: '1181875516249083904',
        created_date: '2020-09-02 22:49:39'
      },
      {
        id: '1257900113233342466',
        p_id: 0,
        service_category_name: '产品管理',
        service_category_code: 'product',
        service_category_icon: null,
        sort_no: 5,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:04:40'
      },
      {
        id: '1300974313579589633',
        p_id: 0,
        service_category_name: '财务管理类',
        service_category_code: 'finance',
        service_category_icon: null,
        sort_no: 5,
        description: '财务管理类',
        created_by: '1181875516249083904',
        created_date: '2020-09-02 22:50:21'
      },
      {
        id: '1300735269306216450',
        p_id: 0,
        service_category_name: '流程审批',
        service_category_code: 'flow_approval',
        service_category_icon: null,
        sort_no: 7,
        description: '流程审批',
        created_by: '1181875516249083904',
        created_date: '2020-09-02 07:00:29'
      },
      {
        id: '1303956527594450945',
        p_id: 0,
        service_category_name: '统计报表',
        service_category_code: 'report',
        service_category_icon: null,
        sort_no: 8,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-09-11 04:20:37'
      },
      {
        id: '1257892401657311233',
        p_id: 1,
        service_category_name: '租户管理',
        service_category_code: 'client',
        service_category_icon: null,
        sort_no: 1,
        description: '租户管理',
        created_by: '1181875516249083904',
        created_date: '2020-05-07 01:34:02'
      },
      {
        id: '1257902927749738497',
        p_id: 1,
        service_category_name: '组织机构管理',
        service_category_code: 'org',
        service_category_icon: null,
        sort_no: 2,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:15:51'
      },
      {
        id: '1257903032259211266',
        p_id: 1,
        service_category_name: '用户管理',
        service_category_code: 'user',
        service_category_icon: null,
        sort_no: 3,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:16:16'
      },
      {
        id: '1257903117231616002',
        p_id: 1,
        service_category_name: '角色管理',
        service_category_code: 'role',
        service_category_icon: null,
        sort_no: 4,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:16:36'
      },
      {
        id: '1257903242607751170',
        p_id: 1,
        service_category_name: '字典管理',
        service_category_code: 'dict',
        service_category_icon: null,
        sort_no: 5,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:17:06'
      },
      {
        id: '1257903304859611137',
        p_id: 1,
        service_category_name: '图标管理',
        service_category_code: 'icon',
        service_category_icon: null,
        sort_no: 6,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:17:21'
      },
      {
        id: '1257903380797485058',
        p_id: 1,
        service_category_name: '工单管理',
        service_category_code: 'ticket',
        service_category_icon: null,
        sort_no: 7,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:17:39'
      },
      {
        id: '1270655288464564226',
        p_id: 1,
        service_category_name: '日志管理',
        service_category_code: 'log',
        service_category_icon: null,
        sort_no: 8,
        description: null,
        created_by: '1104285763501186592',
        created_date: '2020-06-11 06:52:37'
      },
      {
        id: '1286105391241302018',
        p_id: 1,
        service_category_name: '帮助文档',
        service_category_code: 'help_doc',
        service_category_icon: null,
        sort_no: 9,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-07-23 22:05:07'
      },
      {
        id: '1257903494026915842',
        p_id: '1247370196019499010',
        service_category_name: '分类管理',
        service_category_code: 'tool_category',
        service_category_icon: null,
        sort_no: 1,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:18:06'
      },
      {
        id: '1257903548724834305',
        p_id: '1247370196019499010',
        service_category_name: 'SQL管理',
        service_category_code: 'sql',
        service_category_icon: null,
        sort_no: 2,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:18:19'
      },
      {
        id: '1257903657239867394',
        p_id: '1247370196019499010',
        service_category_name: '事务流管理',
        service_category_code: 'trunsflow',
        service_category_icon: null,
        sort_no: 3,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:18:45'
      },
      {
        id: '1257904096383496193',
        p_id: '1247370196019499010',
        service_category_name: '流水号管理',
        service_category_code: 'seq',
        service_category_icon: null,
        sort_no: 4,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:20:29'
      },
      {
        id: '1257904171998408706',
        p_id: '1247370196019499010',
        service_category_name: '文件管理',
        service_category_code: 'file',
        service_category_icon: null,
        sort_no: 5,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:20:47'
      },
      {
        id: '1257904396855046146',
        p_id: '1247370196019499010',
        service_category_name: '接口管理',
        service_category_code: 'interface',
        service_category_icon: null,
        sort_no: 6,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:21:41'
      },
      {
        id: '1257904458834276353',
        p_id: '1247370196019499010',
        service_category_name: '定时任务',
        service_category_code: 'task',
        service_category_icon: null,
        sort_no: 7,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:21:56'
      },
      {
        id: '1263733767506685954',
        p_id: '1247370196019499010',
        service_category_name: '数据库管理',
        service_category_code: 'database_manager',
        service_category_icon: null,
        sort_no: 8,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-22 20:29:16'
      },
      {
        id: '1263746316268662785',
        p_id: '1247370196019499010',
        service_category_name: '数据审核管理',
        service_category_code: 'table_audit_list',
        service_category_icon: null,
        sort_no: 9,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-22 21:19:08'
      },
      {
        id: '1265177265887948801',
        p_id: '1247370196019499010',
        service_category_name: '数据表管理',
        service_category_code: 'table_manager',
        service_category_icon: null,
        sort_no: 10,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-26 20:05:09'
      },
      {
        id: '1306840407443849217',
        p_id: '1247370196019499010',
        service_category_name: '工具主键',
        service_category_code: 'tool_primary_key',
        service_category_icon: null,
        sort_no: 11,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-09-19 03:20:07'
      },
      {
        id: '1331829853746372609',
        p_id: '1247370196019499010',
        service_category_name: '外部接口',
        service_category_code: 'micro_interface',
        service_category_icon: null,
        sort_no: 12,
        description: null,
        created_by: '6664338819619360768',
        created_date: '2020-11-27 03:19:15'
      },
      {
        id: '1257913569479127042',
        p_id: '1247370494951739393',
        service_category_name: '组件管理',
        service_category_code: 'part',
        service_category_icon: null,
        sort_no: 1,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:58:08'
      },
      {
        id: '1257913644418756610',
        p_id: '1247370494951739393',
        service_category_name: '组件版本',
        service_category_code: 'part_version',
        service_category_icon: null,
        sort_no: 2,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:58:26'
      },
      {
        id: '1278201259201294337',
        p_id: '1247370494951739393',
        service_category_name: '组件分类',
        service_category_code: 'part_class',
        service_category_icon: null,
        sort_no: 3,
        description: '组件分类',
        created_by: '1130769536862261248',
        created_date: '2020-07-02 02:37:16'
      },
      {
        id: '1263047944293560322',
        p_id: '1257900029842190338',
        service_category_name: '页面管理',
        service_category_code: 'pageManger',
        service_category_icon: null,
        sort_no: 1,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-20 23:04:05'
      },
      {
        id: '1257904956974985218',
        p_id: '1257900029842190338',
        service_category_name: '菜单管理',
        service_category_code: 'menu',
        service_category_icon: null,
        sort_no: 1,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:23:55'
      },
      {
        id: '1257904894664404994',
        p_id: '1257900029842190338',
        service_category_name: '页面配置',
        service_category_code: 'page',
        service_category_icon: null,
        sort_no: 2,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:23:40'
      },
      {
        id: '1274890507556126721',
        p_id: '1257900029842190338',
        service_category_name: '主页管理',
        service_category_code: 'homepage',
        service_category_icon: null,
        sort_no: 4,
        description: '主页管理',
        created_by: '6664338819619360768',
        created_date: '2020-06-22 23:21:41'
      },
      {
        id: '1275023459246043137',
        p_id: '1257900029842190338',
        service_category_name: '首页管理',
        service_category_code: 'init_code',
        service_category_icon: null,
        sort_no: 5,
        description: '首页管理',
        created_by: '6664338819619360768',
        created_date: '2020-06-23 08:09:58'
      },
      {
        id: '1275315241238265857',
        p_id: '1257900029842190338',
        service_category_name: '登录页管理',
        service_category_code: 'login_manage',
        service_category_icon: null,
        sort_no: 6,
        description: '登录页管理',
        created_by: '6664338819619360768',
        created_date: '2020-06-24 03:29:24'
      },
      {
        id: '1294187728766869506',
        p_id: '1257900029842190338',
        service_category_name: 'BI数据集',
        service_category_code: 'bi_dataset',
        service_category_icon: null,
        sort_no: 7,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-08-15 05:22:54'
      },
      {
        id: '1293728776733515778',
        p_id: '1257900029842190338',
        service_category_name: 'BI报表',
        service_category_code: 'bi_report',
        service_category_icon: null,
        sort_no: 8,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-08-13 22:57:22'
      },
      {
        id: '1257905047102189569',
        p_id: '1257900113233342466',
        service_category_name: '产品分类',
        service_category_code: 'product_category',
        service_category_icon: null,
        sort_no: 1,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:24:16'
      },
      {
        id: '1257905164647559170',
        p_id: '1257900113233342466',
        service_category_name: '产品管理',
        service_category_code: 'product',
        service_category_icon: null,
        sort_no: 2,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:24:44'
      },
      {
        id: '1257905543917498370',
        p_id: '1257900113233342466',
        service_category_name: '产品团队',
        service_category_code: 'product_term',
        service_category_icon: null,
        sort_no: 3,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:26:14'
      },
      {
        id: '1257905693935169538',
        p_id: '1257900113233342466',
        service_category_name: '产品模块',
        service_category_code: 'product_module',
        service_category_icon: null,
        sort_no: 4,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:26:50'
      },
      {
        id: '1257905788848074754',
        p_id: '1257900113233342466',
        service_category_name: '产品版本',
        service_category_code: 'product_version',
        service_category_icon: null,
        sort_no: 5,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:27:13'
      },
      {
        id: '1257905882901147650',
        p_id: '1257900113233342466',
        service_category_name: '产品发布',
        service_category_code: 'product_publish',
        service_category_icon: null,
        sort_no: 6,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-07 02:27:35'
      },
      {
        id: '1293100077439606786',
        p_id: '1257900113233342466',
        service_category_name: '产品解决方案管理',
        service_category_code: 'product_solve_plan',
        service_category_icon: null,
        sort_no: 6,
        description: '产品解决方案管理',
        created_by: '6664338819619360768',
        created_date: '2020-08-12 05:20:57'
      },
      {
        id: '1274971089329876994',
        p_id: '1257903548724834305',
        service_category_name: 'SQL参数',
        service_category_code: 'sql_param',
        service_category_icon: null,
        sort_no: 1,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-06-23 04:41:53'
      },
      {
        id: '1274971162986049538',
        p_id: '1257903548724834305',
        service_category_name: 'SQL结果',
        service_category_code: 'sql_result',
        service_category_icon: null,
        sort_no: 2,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-06-23 04:42:10'
      },
      {
        id: '1261184198231097345',
        p_id: '1257903657239867394',
        service_category_name: '事务流参数',
        service_category_code: 'transflow_param',
        service_category_icon: null,
        sort_no: 1,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-15 19:38:18'
      },
      {
        id: '1261184326274809857',
        p_id: '1257904396855046146',
        service_category_name: '接口参数',
        service_category_code: 'interface_param',
        service_category_icon: null,
        sort_no: 1,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-15 19:38:48'
      },
      {
        id: '1261184408546082817',
        p_id: '1257904458834276353',
        service_category_name: '定时任务参数',
        service_category_code: 'task_param',
        service_category_icon: null,
        sort_no: 1,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-15 19:39:08'
      },
      {
        id: '1263733964408287234',
        p_id: '1263733767506685954',
        service_category_name: '数据库实例',
        service_category_code: 'database_inst',
        service_category_icon: null,
        sort_no: 1,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-05-22 20:30:03'
      },
      {
        id: '1267994047598190593',
        p_id: '1267985560797339649',
        service_category_name: '弹窗功能',
        service_category_code: 'popup_window',
        service_category_icon: null,
        sort_no: 1,
        description: null,
        created_by: '1181875516249083904',
        created_date: '2020-06-03 22:37:55'
      },
      {
        id: '1292704157287964673',
        p_id: '1267985560797339649',
        service_category_name: '事务流',
        service_category_code: 'trf',
        service_category_icon: null,
        sort_no: 1,
        description: '事务流',
        created_by: '1130769536862261248',
        created_date: '2020-08-11 03:07:43'
      },
      {
        id: '1278935483508256770',
        p_id: '1278233163644526593',
        service_category_name: '登录',
        service_category_code: 'login',
        service_category_icon: null,
        sort_no: 1,
        description: '登录',
        created_by: '1130769536862261248',
        created_date: '2020-07-04 03:14:47'
      },
      {
        id: '1278233734325723137',
        p_id: '1278233163644526593',
        service_category_name: '联动',
        service_category_code: 'link_action',
        service_category_icon: null,
        sort_no: 1,
        description: '联动',
        created_by: '1130769536862261248',
        created_date: '2020-07-02 04:46:19'
      },
      {
        id: '1278234179282657281',
        p_id: '1278233163644526593',
        service_category_name: '表单',
        service_category_code: 'form',
        service_category_icon: null,
        sort_no: 2,
        description: '表单',
        created_by: '1130769536862261248',
        created_date: '2020-07-02 04:48:05'
      },
      {
        id: '1278234274455609345',
        p_id: '1278233163644526593',
        service_category_name: '表格',
        service_category_code: 'table',
        service_category_icon: null,
        sort_no: 3,
        description: '表格',
        created_by: '1130769536862261248',
        created_date: '2020-07-02 04:48:28'
      },
      {
        id: '1283581630881374209',
        p_id: '1278233347195658242',
        service_category_name: 'test02',
        service_category_code: 'dd',
        service_category_icon: 'dd',
        sort_no: 1,
        description: 'ddd',
        created_by: '1130769536862261248',
        created_date: '2020-07-16 22:56:42'
      },
      {
        id: '1300735432447864833',
        p_id: '1300735269306216450',
        service_category_name: '流程分类',
        service_category_code: 'flow_category',
        service_category_icon: null,
        sort_no: 1,
        description: '流程分类',
        created_by: '1181875516249083904',
        created_date: '2020-09-02 07:01:08'
      },
      {
        id: '1300735571614871553',
        p_id: '1300735269306216450',
        service_category_name: '流程管理',
        service_category_code: 'flow_manager',
        service_category_icon: null,
        sort_no: 2,
        description: '流程管理',
        created_by: '1181875516249083904',
        created_date: '2020-09-02 07:01:41'
      },
      {
        id: '1300735682008952833',
        p_id: '1300735269306216450',
        service_category_name: '审批管理',
        service_category_code: 'approval_manager',
        service_category_icon: null,
        sort_no: 3,
        description: '审批管理',
        created_by: '1181875516249083904',
        created_date: '2020-09-02 07:02:07'
      },
      {
        id: '1331830101797511169',
        p_id: '1331829853746372609',
        service_category_name: '外部接口参数',
        service_category_code: 'micro_interface_param',
        service_category_icon: null,
        sort_no: 1,
        description: null,
        created_by: '6664338819619360768',
        created_date: '2020-11-27 03:20:15'
      }
    ]
  },
  message: 'success'
}

export default result
