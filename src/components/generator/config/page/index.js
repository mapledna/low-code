import { copyConf, defaultDataSource } from '../utils.js'

const defautlMain = {
  tagType: 'templatePage', // 标签类型
  projectName: 'XXXXX', // 系统名称
  // eslint-disable-next-line global-require
  fileSize: 2,
  sizeUnit: 'MB',
  logoIcon: 'img/nti/logo-icon.png', // 系统logo
  variables: {
    // 菜单样式
    menuBg: '',
    menuText: '',
    menuActiveText: ''
  },
  isCollapse: false, // 是否水平折叠收起菜单
  homePage: {}, // 首页对应的id 如果没选 则默认为DashBoard
  systemType: 'product', // 系统类型  项目project、产品product、无
  id: '1', // 默认选中的菜单值
  data: [], // 菜单树数据
  dataSource: copyConf(defaultDataSource),
  justify: 'start',
  align: 'top',
  layoutTree: false,
  options: [], // 编辑页面的初始赋值字段
  children: [], // 子级内容
  document: 'https://element.eleme.cn/#/zh-CN/component/container'
}

export default {
  uiMainV1: {
    ...defautlMain,
    label: '主页模板1',
    layout: 'uiMainV1',
    tagIcon: 'uiMainV1',
    componentName: 'uiMainV1'
  },
  uiMainV2: {
    ...defautlMain,
    label: '主页模板2',
    layout: 'uiMainV2',
    tagIcon: 'uiMainV2',
    componentName: 'uiMainV2'
  }
}
