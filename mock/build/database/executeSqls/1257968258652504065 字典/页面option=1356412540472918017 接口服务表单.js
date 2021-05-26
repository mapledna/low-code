const parameter = {
  executeSqlList: [
    { // 字典：媒体类型
      sqlId: '1257968258652504065',
      parameters: { p_id: '1261170088084930561' }
    },
    { // 字典：请求方式
      sqlId: '1257968258652504065',
      parameters: { p_id: '1261169218253389825' }
    },
    { // 字典：返回值类型
      sqlId: '1257968258652504065',
      parameters: { p_id: '1261169630276648961' }
    }
  ]
}

const result = {
  code: 0,
  data: {
    table_1: [
      {
        id: '1',
        label: 'JSON',
        selected: 0
      },
      {
        id: '2',
        label: '表单',
        selected: 0
      }
    ],
    table_2: [
      {
        id: '1',
        label: 'GET请求',
        selected: 0
      },
      {
        id: '2',
        label: 'POST请求',
        selected: 0
      }
    ],
    table_0: [
      {
        id: '1',
        label: 'JSON',
        selected: 0
      },
      {
        id: '2',
        label: '字符串',
        selected: 0
      }
    ]
  },
  message: 'success'
}

export default result
