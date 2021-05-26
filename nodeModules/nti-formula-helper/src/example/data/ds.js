// data.formula = `${getDefaultFormula(data)}`
// import { getDefaultFormula } from '../../../utils/datasource'
const dsTreeProps = {
  key: '_id',
  label: '_label',
  children: 'resultVOList',
  type: '_type',
  iconClass: 'iconClass',
  formula: '_formula',
}

const dsTree = [{
  _id: '0001',
  _label: '分组文件',
  _type: 'ds',
  iconClass: '',
  resultVOList: [{
    _id: '0001_1',
    _label: '插入公式1',
    _type: 'result',
    _formula: 'result_1',
    iconClass: '',
    resultVOList: []
  }, {
    _id: '0001_2',
    _label: '插入公式2',
    _type: 'result',
    _formula: 'result_2',
    iconClass: '',
    resultVOList: []
  }]
}]

export {
  dsTree,
  dsTreeProps
}
