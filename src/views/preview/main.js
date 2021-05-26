import Vue from 'vue'
import '@/utils/entryImport'
import '@/utils/entryImport/extend'
// import { setNowPageName } from '@router/tool'
import { loadScriptQueue } from '@/utils/loadAssets'
import utilsTheme from '@/utils/theme'
// import * as Babel from 'babel-standalone'

utilsTheme.change(utilsTheme.getThemeName())

// setNowPageName('PREVIEW')

const $previewApp = document.getElementById('previewApp')
const childAttrs = {
  file: '',
  dialog: ' width="600px" class="dialog-width" v-if="visible" :visible.sync="visible" append-to-body'
}

window.addEventListener('message', init, false)

// 初始化页面
function init(event) {
  if (event.data.type !== 'refreshFrame') { return }
  const code = event.data.data
  // console.log('refreshFrame ====', code)

  const links = (code.links || []).map(url => `<link href="${url}" rel="stylesheet">`).join('')
  // 添加样式style。并创建一个id为app的div，用于newVue替换赋值
  $previewApp.innerHTML = `${links}<style>${code.css}</style><div id="app"></div>`

  const attrs = childAttrs[code.generateConf.type]
  if (Array.isArray(code.scripts) && code.scripts.length > 0) {
    loadScriptQueue(JSON.parse(JSON.stringify(code.scripts)), () => {
      loadDialogContent(code.importList)
      newVue(attrs, code.js, code.html)
    })
  } else {
    loadDialogContent(code.importList)
    newVue(attrs, code.js, code.html)
  }
}

// 动态加载弹框中的内容
function loadDialogContent(importList) {
  importList.forEach(list => {
    // 全局注册
    Vue.component(`${list.exportName}`, { template: `<p>${list.exportName}</p>` })
  })
}


// 实例化Vue
function newVue(attrs, script, html) {
  try {
    const main = eval(`(${script})`)
    const vm = new Vue({
      el: '#app',
      components: {
        child: {
          ...main,
          template: html
        }
      },
      data() {
        return {
          visible: true
        }
      },
      template: `<child ${attrs}/>`
    })
    vm.$mount('#app')
  } catch (err) {
    console.error('转换失败，语法有误:', err)
  }
}
