/* 获取接口服务表

API地址：api/build/database/generator/designData
参数：{"sourceId":【数据源ID】,"sourceType":【数据源类型】}

 */

const parameter = { sourceId: '1251047719744778242', sourceType: 'data' }

const result = {
  code: 0,
  data: {
    result: [
      {
        result_type: 2,
        is_required: 1,
        is_pid: 0,
        result_format: null,
        label: '接口ID',
        is_label: 0,
        value: 'id',
        is_id: 1,
        widget_type: null,
        is_display: 0
      },
      {
        result_type: 2,
        is_required: 1,
        is_pid: 0,
        result_format: null,
        label: '产品ID',
        is_label: 0,
        value: 'product_id',
        is_id: 0,
        widget_type: null,
        is_display: 1
      },
      {
        result_type: 1,
        is_required: 1,
        is_pid: 0,
        result_format: null,
        label: '接口名称',
        is_label: 0,
        value: 'interface_name',
        is_id: 0,
        widget_type: null,
        is_display: 1
      },
      {
        result_type: 1,
        is_required: 1,
        is_pid: 0,
        result_format: null,
        label: '接口代码',
        is_label: 0,
        value: 'interface_code',
        is_id: 0,
        widget_type: null,
        is_display: 1
      },
      {
        result_type: 2,
        is_required: 1,
        is_pid: 0,
        result_format: null,
        label: '媒体类型1=json2=form',
        is_label: 0,
        value: 'media_type',
        is_id: 0,
        widget_type: null,
        is_display: 1
      },
      {
        result_type: 2,
        is_required: 1,
        is_pid: 0,
        result_format: null,
        label: '请求方式 1=get2=post3=put4=head5=delete',
        is_label: 0,
        value: 'request_mode',
        is_id: 0,
        widget_type: null,
        is_display: 1
      },
      {
        result_type: 2,
        is_required: 1,
        is_pid: 0,
        result_format: null,
        label: '返回值类型 1=json2=字符串',
        is_label: 0,
        value: 'return_type',
        is_id: 0,
        widget_type: null,
        is_display: 1
      },
      {
        result_type: 1,
        is_required: 1,
        is_pid: 0,
        result_format: null,
        label: '接口地址',
        is_label: 0,
        value: 'interface_url',
        is_id: 0,
        widget_type: null,
        is_display: 1
      },
      {
        result_type: 1,
        is_required: 1,
        is_pid: 0,
        result_format: null,
        label: '接口描述',
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
        result_format: null,
        label: '审核人',
        is_label: 0,
        value: 'audit_user',
        is_id: 0,
        widget_type: null,
        is_display: 1
      },
      {
        result_type: 2,
        is_required: 1,
        is_pid: 0,
        result_format: null,
        label: '审核状态 0=待审批1=审批通过2.审批拒绝3.已过期',
        is_label: 0,
        value: 'audit_status',
        is_id: 0,
        widget_type: null,
        is_display: 1
      },
      {
        result_type: 4,
        is_required: 1,
        is_pid: 0,
        result_format: null,
        label: '审批时间',
        is_label: 0,
        value: 'audit_date',
        is_id: 0,
        widget_type: null,
        is_display: 1
      },
      {
        result_type: 1,
        is_required: 1,
        is_pid: 0,
        result_format: null,
        label: '审核意见',
        is_label: 0,
        value: 'audit_opinion',
        is_id: 0,
        widget_type: null,
        is_display: 1
      },
      {
        result_type: 2,
        is_required: 1,
        is_pid: 0,
        result_format: null,
        label: '过期人',
        is_label: 0,
        value: 'expired_user',
        is_id: 0,
        widget_type: null,
        is_display: 1
      },
      {
        result_type: 1,
        is_required: 1,
        is_pid: 0,
        result_format: null,
        label: '过期原因',
        is_label: 0,
        value: 'expired_reason',
        is_id: 0,
        widget_type: null,
        is_display: 1
      },
      {
        result_type: 4,
        is_required: 1,
        is_pid: 0,
        result_format: null,
        label: '过期时间',
        is_label: 0,
        value: 'expired_date',
        is_id: 0,
        widget_type: null,
        is_display: 1
      },
      {
        result_type: 2,
        is_required: 1,
        is_pid: 0,
        result_format: null,
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
        result_format: null,
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
        result_format: null,
        label: '更新人',
        is_label: 0,
        value: 'updated_by',
        is_id: 0,
        widget_type: null,
        is_display: 1
      },
      {
        result_type: 4,
        is_required: 1,
        is_pid: 0,
        result_format: null,
        label: '更新时间',
        is_label: 0,
        value: 'updated_date',
        is_id: 0,
        widget_type: null,
        is_display: 1
      }
    ],
    search: [
      {
        widgettype: 2,
        is_required: 1,
        valid_rule: null,
        param_max: null,
        paramvalue: null,
        label: '接口ID',
        param_min: null,
        value: 'id'
      }
    ]
  },
  message: 'success'
}

export default result
