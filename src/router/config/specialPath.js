import pageMap from './page'

/**
 * TODO: 有影响的页面：
 * 构建工具-页面管理：partVersionId=1282886063842795521
 * 组件管理-组件管理：partVersionId=1277418218933608449
 * 开发工具-事务流管理：partVersionId=1302886643406057473
 * eg. window.open(this.$getSpecialPath('DESIGNER') + "?sessionKey=" + this.$server.getSessionKey() + "&partVersionId=" + arg.id)
 */

export default {
  LOGIN: `${pageMap.INDEX}#/login`, // 项目登录
  CLOUD_LOGIN: `${pageMap.INDEX}#/CloudLogin`, // 云平台登录
  DESK: `${pageMap.INDEX}#/Desk`, // 云平台
  REGISTER: `${pageMap.INDEX}#/register`,
  ERROR: `${pageMap.INDEX}#/error`,
  PREVIEW: `${pageMap.PREVIEW}#/`, // 设计器页面预览
  // DESIGNER: `${pageMap.INDEX}#/designer`, // 设计器
  DESIGNER: `${pageMap.DESIGNER}#/`, // 设计器
  FLOW: `${pageMap.DESIGNER}#/flow`, // 事务流
  WORKFLOW: `${pageMap.DESIGNER}#/workflow`, // 工作流
  SHOW: `${pageMap.DESIGNER}#/show` // 设计器页面预览
}
