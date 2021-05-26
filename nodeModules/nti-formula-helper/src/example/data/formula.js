const formulaList = [
  {
    name: 'GET_SCOPE',
    title: '获取数据源结果集',
    desc: '可简写为 datasourceCode.resultName',
    expression: 'GET_SCOPE(datasourceCode, resultName)',
    demo: '',
    paramList: [
      {
        name: 'datasourceCode',
        isRequired: true,
        type: 'String',
        desc: '数据源编码'
      },
      {
        name: 'resultName',
        isRequired: true,
        type: 'String',
        desc: '数据结果名称'
      }
    ],
    return: {
      type: 'Array',
      desc: ''
    }
  },
  {
    name: 'GET_DIST_ITEM',
    title: '获取字典数据项',
    desc: '',
    expression: 'GET_DIST_ITEM(distId, filterVal[, filterKey])',
    demo: 'GET_DIST_ITEM(123456, id123)',
    paramList: [
      {
        name: 'distId',
        isRequired: true,
        type: 'String',
        desc: '字典ID'
      },
      {
        name: 'filterVal',
        isRequired: true,
        type: 'Any',
        desc: '查找值'
      },
      {
        name: 'filterKey',
        isRequired: false,
        type: 'String',
        desc: '查找键。默认为 value。'
      },
    ],
    return: {
      type: 'Object',
      desc: ''
    }
  },
]

export {
  formulaList,
}
