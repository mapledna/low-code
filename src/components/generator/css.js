const globalStyles = `
/* 限制树形下拉组件弹出层的高度 */
.el-popper .el-tree{
  max-height: 300px;
  overflow-y: auto;
}
`
/* 页面对应的属性 */
const page = `
body{position: fixed;left: 0px;right: 0px;bottom: 0px;top: 0px;margin: 0px;padding:0px;}
.el-form{height: 100%;position: absolute;width: 100%;overflow-y: auto;}
#ui-content{width:100%;height:100%;position:relative;}
`
const styles = {
  'el-rate': '.el-rate{display: inline-block; vertical-align: text-top;}',
  'el-upload': '.el-upload__tip{line-height: 1.2;margin-left: .5em;}'
}

function addCss(cssList, el) {
  const css = styles[el.tag]
  css && cssList.indexOf(css) === -1 && cssList.push(css)

  if (el.children) {
    if (Array.isArray(el.children)) { // 数组
      el.children.forEach(el2 => addCss(cssList, el2))
    } else { // 对象
      Object.keys(el.children).forEach(key => addCss(cssList, el.children[key]))
    }
  }
}

export function makeUpCss(conf) {
  // const cssList = [globalStyles, page]
  const cssList = [globalStyles]
  conf.fields.forEach(el => addCss(cssList, el))
  return cssList.join('\n')
}
