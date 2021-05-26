/* 插入接口服务表

API地址：api/build/database/generator/designData
参数：{"sourceId":【数据源ID】,"sourceType":【数据源类型】}

 */

export const parameter = { sourceId: '1251047719744778243', sourceType: 'data' }

export const result = {
  code: 0,
  data: {
    filter: {
      return_type: {
        sqlId: '1257968258652504065',
        format_type: 'dict',
        parameters: {
          p_id: '1261170088084930561'
        }
      },
      media_type: {
        sqlId: '1257968258652504065',
        format_type: 'dict',
        parameters: {
          p_id: '1261169218253389825'
        }
      },
      request_mode: {
        sqlId: '1257968258652504065',
        format_type: 'dict',
        parameters: {
          p_id: '1261169630276648961'
        }
      }
    },
    search: [
      {
        widgettype: 1,
        is_required: 1,
        valid_rule: null,
        param_max: 64,
        paramvalue: null,
        label: '接口名称',
        param_min: null,
        value: 'interface_name'
      },
      {
        widgettype: 1,
        is_required: 1,
        valid_rule: 1,
        param_max: 32,
        paramvalue: null,
        label: '接口代码',
        param_min: null,
        value: 'interface_code'
      },
      {
        widgettype: 10,
        is_required: 1,
        valid_rule: null,
        param_max: null,
        paramvalue: "GetDictionary('1261169218253389825')",
        label: '媒体类型',
        param_min: null,
        value: 'media_type'
      },
      {
        widgettype: 10,
        is_required: 1,
        valid_rule: null,
        param_max: null,
        paramvalue: "GetDictionary('1261169630276648961')",
        label: '请求方式',
        param_min: null,
        value: 'request_mode'
      },
      {
        widgettype: 10,
        is_required: 1,
        valid_rule: null,
        param_max: null,
        paramvalue: "GetDictionary('1261170088084930561')",
        label: '返回值类型',
        param_min: null,
        value: 'return_type'
      },
      {
        widgettype: 5,
        is_required: 1,
        valid_rule: null,
        param_max: 256,
        paramvalue: null,
        label: '接口地址',
        param_min: null,
        value: 'interface_url'
      },
      {
        widgettype: 5,
        is_required: 0,
        valid_rule: null,
        param_max: 256,
        paramvalue: null,
        label: '接口描述',
        param_min: null,
        value: 'description'
      },
      {
        widgettype: 0,
        is_required: 0,
        valid_rule: null,
        param_max: null,
        paramvalue: null,
        label: '产品ID',
        param_min: null,
        value: 'product_id'
      }
    ]
  },
  message: 'success'
}

export default result
