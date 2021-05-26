import elButton from './el-button.js'
import elTree from './el-tree.js'
import elTable from './el-table.js'
import listPicker from './listPicker'
import richtextEditor from './richtext-editor.js'
import menu from './menu.js'
import iframe from './iframe.js'
import formItemText from './formItemText'
import divider from './divider'
import title from './title'


// NOTE: 组件注册顺序影响页面展示顺序
export default {
  'el-button': elButton,
  'el-tree': elTree,
  'el-table': elTable,
  listPicker,
  'richtext-editor': richtextEditor,
  'ui-menu': menu,
  iframe,
  formItemText,
  divider,
  title
}
