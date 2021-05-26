import { copyConf, defaultDataSource, defaultRelate } from '../utils.js'

export default Object.freeze({
  label: '标题文字',
  tag: 'formItemText',
  tagIcon: 'title',
  layout: 'colFormItem',
  span: 24,
  modelValue: '',  //作为赋值属性
  defaultValue: '文字内容',
  showLabel: false,
  labelWidth: null,
  style: {
    width: '100%',
    margin: 0,
    display: 'block',
    color: '',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'left',
    background: ''
  },
  dataSource: copyConf(defaultDataSource),
  relate: copyConf(defaultRelate),
  changeTag: true
})
