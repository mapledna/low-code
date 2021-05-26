<template>
  <div>
    <div style="position:fixed:left:0;right:0;top:0;bottom:0;">
      <el-row style="height:100%;overflow:auto">
        <el-col :md="24" :lg="24" class="right-preview">
          <iframe
            v-show="isIframeLoaded"
            ref="previewPage"
            class="result-wrapper"
            frameborder="0"
            :src="src"
            @load="iframeLoad"
          />
          <div v-show="!isIframeLoaded" v-loading="true" class="result-wrapper" />
        </el-col>
      </el-row>
    </div>
    <!-- <resource-dialog
      :visible.sync="resourceVisible"
      :origin-resource="resources"
      @save="setResource"
    /> -->
  </div>
</template>
<script>
import { parse } from '@babel/parser'
import beautifier from 'js-beautify'
import {
  makeUpHtml, vueTemplate, vueScript, cssStyle
} from '@/components/generator/html'
import { makeUpJs } from '@/components/generator/js'
import { makeUpCss } from '@/components/generator/css'
import { exportDefault, beautifierConf, titleCase } from '@/utils/index'
import window from '@/utils/polyfill'
import common from '@/utils/tool'

const editorObj = {
  html: null,
  js: null,
  css: null
}
const mode = {
  html: 'html',
  js: 'javascript',
  css: 'css'
}

export default {
  // components: { ResourceDialog },
  // props: ['formData', 'generateConf'],
  data() {
    return {
      activeTab: 'html',
      htmlCode: '',
      jsCode: '',
      cssCode: '',
      codeFrame: '',
      isIframeLoaded: false,
      resourceVisible: false,
      scripts: [],
      links: [],
      formData: [],
      generateConf: {
        type: 'file' // 当前显示类型  dialog file
      },
      src: `preview.html?${window.location.href.split('?')[1]}`
    }
  },
  computed: {
    resources() {
      return this.scripts.concat(this.links)
    }
  },
  watch: {},
  created() {},
  async mounted() {
    window.addEventListener('keydown', this.preventDefaultSave)
    // this.formData = {
    //   fields: getDrawingList(),
    //   ...getFormConf()
    // }


    // 从远程缓存中获取数据
    this.formData = await this.$server.getPartSource({
      partVersionId: common.getUrlParam('partVersionId')
    })

    const { type } = this.generateConf
    // console.log('this.generateConf', this.generateConf)
    this.htmlCode = makeUpHtml(this.formData, type)
    this.htmlCode = beautifier.html(this.htmlCode, beautifierConf.html)
    // console.log('this.htmlCode222', this.htmlCode)
    this.jsCode = makeUpJs(this.formData, type)
    this.jsCode = beautifier.js(this.jsCode, beautifierConf.js)
    // console.log('this.jsCode222', this.jsCode)
    this.cssCode = makeUpCss(this.formData)
    this.cssCode = beautifier.css(this.cssCode, beautifierConf.html)

    this.isIframeLoaded && this.runCode()
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.preventDefaultSave)
  },
  methods: {
    preventDefaultSave(e) {
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
      }
    },
    iframeLoad() {
      this.isIframeLoaded = true
      this.jsCode && this.runCode()
    },
    // 执行代码
    runCode() {
      try {
        const ast = parse(this.jsCode, { sourceType: 'module' })
        console.log('ast', ast)
        const astBody = ast.program.body
        // console.log(astBody)
        if (astBody.length > 1) {
          this.$confirm(
            'js格式不能识别，仅支持修改export default的对象内容',
            '提示',
            {
              type: 'warning'
            }
          )
          return
        }
        if (astBody[0].type === 'ExportDefaultDeclaration') {
          const postData = {
            type: 'refreshFrame',
            data: {
              generateConf: this.generateConf,
              html: this.htmlCode,
              js: this.jsCode.replace(exportDefault, ''),
              css: this.cssCode,
              scripts: this.scripts,
              links: this.links
            }
          }
          this.$refs.previewPage.contentWindow.postMessage(
            postData,
            location.origin
          )
        } else {
          this.$message({
            showClose: true,
            type: 'error',
            message: '请使用export default'
          })
        }
      } catch (err) {
        this.$message({
          showClose: true,
          type: 'error',
          message: `js错误：${err}`
        })
        console.log(err)
      }
    },
    showResource() {
      this.resourceVisible = true
    },
    setResource(arr) {
      const scripts = []; const
        links = []
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          if (item.endsWith('.css')) {
            links.push(item)
          } else {
            scripts.push(item)
          }
        })
        this.scripts = scripts
        this.links = links
      } else {
        this.scripts = []
        this.links = []
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/preview-drawer.scss';
</style>
