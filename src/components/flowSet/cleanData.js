const schemeData = {
  schemecode: '', // 流程编号
  schemename: '', // 流程名称
  projecttype: '', // 项目类别
  shareflow: false, // 分享
  remark: '' // 备注信息
}
const json2 = {
  Frm: {
    FrmId: '', // 表单id
    FrmDbId: '',
    FrmTable: '',
    FrmName: '', // 表单名
    FrmTableId: ''
  },
  Flow: {
    title: '', // 流程name
    nodes: [{
      type: 'start round mix',
      id: 'node1',
      name: '节点1',
      left: '20px',
      top: '30px',
      img: 'el-icon-video-play',
      show: true,

      setInfo: {
        NodeType: '', // 节点类型
        Description: '' // 备注
      }
    },
    {
      type: 'task',
      id: 'node2',
      name: '节点2',
      left: '70px',
      top: '60px',
      img: 'el-icon-video-play',
      show: true,

      setInfo: {
        NodeType: '', // 节点类型
        Description: '' // 备注
      }
    },
    {
      type: 'task',
      id: 'node3',
      name: '节点3',
      left: '100px',
      top: '100px',
      img: 'el-icon-video-play',
      show: true,

      setInfo: {
        NodeType: '', // 节点类型
        Description: '' // 备注
      }
    }
    ],
    lineList: [{
      id: 'line1',
      from: 'node1',
      to: 'node2',
      title: 'titless',
      propData: ''
    },
    {
      id: 'line2',
      from: 'node2',
      to: 'node3',
      title: 'titlexx',
      propData: ''
    }],
    // 节点连接线
    lineData: [{
      title: 'titless',
      propData: ''
    },
    {
      title: 'titlexx',
      propData: ''
    }]
  }
}
const nodeArr = {
  nodes: ['start', 'node7']
}
const json = {
  nodes: [
    // {
    //   name: '开始',
    //   id: 'node1',
    //   left: '20px',
    //   top: '30px',
    //   type: 'start round mix',
    //   img: 'el-icon-video-play',
    //   show: true,
    //   input: [{
    //     fldkey: 'id',
    //     fldname: 'ID',
    //     fldvalue: '',
    //     fldnode: '',
    //     fldmapping: ''
    //   }, {
    //     fldkey: 'categoryId',
    //     fldname: '分类ID',
    //     fldvalue: '',
    //     fldnode: '',
    //     fldmapping: ''
    //   }],
    //   output: [{
    //     fldkey: 'id',
    //     fldname: 'ID',
    //     fldvalue: ''
    //   }, {
    //     fldkey: 'categoryId',
    //     fldname: '分类ID',
    //     fldvalue: ''
    //   }],
    //   actionType: 'sqlId',
    //   actionId: '1253199186537873409'
    // },
    // {
    //   name: '创建',
    //   id: 'node2',
    //   left: '70px',
    //   top: '60px',
    //   type: 'task',
    //   img: 'el-icon-video-play',
    //   show: true,
    //   input: [{
    //     LAY_TABLE_INDEX: 0,
    //     fldkey: 'sql_code',
    //     fldname: 'SQL编码',
    //     fldnode: 'start',
    //     fldmapping: 'sqlCode'
    //   }],
    //   output: [{
    //     fldkey: 'ct',
    //     fldname: '数量',
    //     fldvalue: ''
    //   }],
    //   actionType: 'sqlId',
    //   actionId: '1253199186537873409'
    // }
  ],
  lines: [
    // {
    //   id: 'line1',
    //   type: 'sl',
    //   from: 'node1',
    //   to: 'node2',
    //   name: '条件1',
    //   dash: false,
    //   condition: [{
    //     property: 'id',
    //     term: '=',
    //     variable: '',
    //     compare: ''
    //   }]
    // }
  ]
}

export default {
  schemeData, json, json2
}
