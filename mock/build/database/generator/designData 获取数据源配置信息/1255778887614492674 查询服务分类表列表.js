/* 查询服务分类表列表

API地址：api/build/database/generator/designData
参数：{"sourceId":【数据源ID】,"sourceType":【数据源类型】}

 */

const parameter = { sourceId: '1255778887614492674', sourceType: 'data' }

const result = {
  code: 0,
  data: {
    result: [
      {
        result_type: 2,
        is_required: 1,
        is_pid: 0,
        result_format: '',
        label: '分类ID',
        is_label: 0,
        value: 'id',
        is_id: 1,
        widget_type: null,
        is_display: 0
      },
      {
        result_type: 2,
        is_required: 1,
        is_pid: 1,
        result_format: "GetData('4','label')",
        label: '父ID',
        is_label: 0,
        value: 'p_id',
        is_id: 0,
        widget_type: null,
        is_display: 1
      },
      {
        result_type: 1,
        is_required: 1,
        is_pid: 0,
        result_format: '',
        label: '分类名称',
        is_label: 0,
        value: 'service_category_name',
        is_id: 0,
        widget_type: null,
        is_display: 1
      },
      {
        result_type: 1,
        is_required: 1,
        is_pid: 0,
        result_format: '',
        label: '分类编码',
        is_label: 0,
        value: 'service_category_code',
        is_id: 0,
        widget_type: null,
        is_display: 1
      },
      {
        result_type: 1,
        is_required: 1,
        is_pid: 0,
        result_format: '',
        label: '分类描述',
        is_label: 0,
        value: 'description',
        is_id: 0,
        widget_type: null,
        is_display: 1
      },
      {
        result_type: 2,
        is_required: 1,
        is_pid: 0,
        result_format: '',
        label: '创建人',
        is_label: 0,
        value: 'created_by',
        is_id: 0,
        widget_type: null,
        is_display: 1
      },
      {
        result_type: 4,
        is_required: 1,
        is_pid: 0,
        result_format: '',
        label: '创建时间',
        is_label: 0,
        value: 'created_date',
        is_id: 0,
        widget_type: null,
        is_display: 1
      },
      {
        result_type: 2,
        is_required: 1,
        is_pid: 0,
        result_format: '',
        label: '排序',
        is_label: 0,
        value: 'sort_no',
        is_id: 0,
        widget_type: null,
        is_display: 1
      },
      {
        result_type: 1,
        is_required: 0,
        is_pid: 0,
        result_format: '',
        label: '分类图标',
        is_label: 0,
        value: 'service_category_icon',
        is_id: 0,
        widget_type: null,
        is_display: 1
      }
    ],
    filter: {
      p_id: {
        sqlId: '4',
        format_type: 'data',
        key_condition: {
          pid: 'pid',
          id: 'id',
          label: 'label'
        },
        parameters: {
          service_type: ''
        }
      }
    },
    search: [
      {
        widgettype: 1,
        is_required: 0,
        valid_rule: null,
        param_max: null,
        paramvalue: '',
        label: '分类名称',
        param_min: null,
        value: 'service_category_name'
      },
      {
        widgettype: 1,
        is_required: 0,
        valid_rule: null,
        param_max: null,
        paramvalue: '',
        label: '分类编码',
        param_min: null,
        value: 'service_category_code'
      },
      {
        widgettype: 0,
        is_required: 0,
        valid_rule: null,
        param_max: null,
        paramvalue: '',
        label: '服务类型',
        param_min: null,
        value: 'service_type'
      },
      {
        widgettype: 0,
        is_required: 0,
        valid_rule: null,
        param_max: null,
        paramvalue: '',
        label: 'p_id',
        param_min: null,
        value: 'p_id'
      }
    ]
  },
  message: 'success'
}

export default result
