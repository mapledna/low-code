import { copyConf, defaultDataSource, defaultRelate } from '../utils.js'

export default Object.freeze({
  label: '菜单栏',
  tag: 'ui-menu',
  layout: 'colFormItem',
  tagIcon: 'ui-menu',
  showLabel: false,
  span: 24,
  defaultValue: '1', // 当前激活菜单的 index
  menuType: 'default',
  model: 'vertical', // 默认为vertical 垂直模式  horizontal为水平模式
  style: {
    width: '100%',
    height: '100%'
  },
  data: [ // 菜单数据
    {
      pid: 0,
      id: 1,
      label: '菜单一',
      icon: 'button'
    },
    {
      pid: 1,
      id: 2,
      label: '子菜单一',
      icon: 'radio'
    },
    {
      pid: 1,
      id: 3,
      label: '子菜单二',
      icon: 'input'
    },
    {
      pid: 0,
      id: 4,
      label: '菜单二',
      icon: 'code'
    },
    {
      pid: 4,
      id: 5,
      label: '子菜单一',
      icon: ''
    }
  ],
  isCollapse: false, // 是否水平折叠收起菜单
  variables: {
    // 样式
    menuBg: '', // themeStyle['color-primary'],
    menuText: '', // themeStyle['color-white'],
    menuActiveText: '' // themeStyle['color-white']
  },
  dataType: 'dynamic',
  dataSource: copyConf(defaultDataSource),
  // initDataOptions: [], // NOTE: 代码会添加这个属性
  relate: copyConf(defaultRelate),
  document: ''
})
