import { copyConf, defaultDataSource, defaultRelate } from '../utils.js'

export default Object.freeze({
  label: '树形选择',
  tag: 'el-tree',
  tagIcon: 'tree',
  layout: 'colFormItem',
  defaultValue: [],
  data: [
    {
      id: 1,
      value: 1,
      label: '选项1',
      children: [
        {
          id: 2,
          value: 2,
          label: '选项1-1'
        }
      ]
    },
    {
      id: 3,
      value: 3,
      label: '选项2',
      children: [
        {
          id: 4,
          value: 4,
          label: '选项2-1'
        }
      ]
    }
  ],
  dataType: 'dynamic',
  dataSource: copyConf(defaultDataSource),
  relate: copyConf(defaultRelate),
  // "initDataOptions": [], // NOTE: 代码会添加这个属性
  searchData: [], // 记录被动控件中关联上级的字段
  labelKey: 'label',
  valueKey: 'value',
  childrenKey: 'children',
  span: 24,
  showRoot: true, // 是否显示最外层的根节点，默认显示
  showLabel: false,
  labelWidth: null,
  'show-checkbox': false,
  'default-expand-all': false,
  defaultCheckedKeys: [], // 默认选中数组
  'highlight-current': true,
  accordion: false,
  $callback: '', // 单击树状菜单的回调事件
  draggable: false
})
