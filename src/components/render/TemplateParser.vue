<template>
  <div class="parser-wrapper">
    <div v-show="hasTool" class="action-bar" :style="{'text-align': 'left'}">
      <el-button icon="el-icon-refresh" type="text" :disabled="!isIframeLoaded" @click="runCode">
        刷新
      </el-button>
      <el-button icon="el-icon-download" type="text" @click="exportFile">
        导出vue文件
      </el-button>
      <el-button icon="el-icon-document-copy" type="text" @click="copy">
        复制代码
      </el-button>
      <!-- <el-button class="delete-btn" icon="el-icon-circle-close" type="text" @click="$emit('update:visible', false)"> -->
      <el-button class="delete-btn" icon="el-icon-circle-close" type="text" @click="$emit('close')">
        关闭
      </el-button>
    </div>
    <div class="result-wrapper">
      <iframe
        ref="previewPage"
        frameborder="0"
        :src="src"
        @load="iframeLoad"
      />
      <div v-show="!isIframeLoaded" v-loading="true" class="result-loading-warp" />
    </div>
  </div>
</template>
<script>

import { parse } from '@babel/parser'
import { saveAs } from 'file-saver'
import {
  makeUpHtml, vueTemplate, vueScript, cssStyle
} from '@/components/generator/html'
import { makeUpJs, getBuildOpts } from '@/components/generator/js'
import { makeUpCss } from '@/components/generator/css'
import { exportDefault, beautifierConf } from '@/utils/index'
import bindCopy from '@/utils/copy'
import beautifier from 'js-beautify'

export default {
  props: {
    formData: { // config数据
      type: Object,
      default: () => ({})
    },
    generateConf: { // 显示页面的打开方式弹窗dialog   页面file
      type: Object,
      default: () => ({
        type: 'file'
      })
    },
    code: {
      type: Object,
      default: () => ({})
    },
    src: {
      type: String,
      default: ''
    },
    hasTool: { // 是否需要头部工具栏
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      htmlCode: '',
      jsCode: '',
      cssCode: '',
      isIframeLoaded: false,
      scripts: [],
      links: []
    }
  },
  watch: {
    code: {
      handler(val) {
        this.htmlCode = val.htmlCode
        this.jsCode = val.jsCode
        this.cssCode = val.cssCode
      },
      deep: true
    }
  },
  methods: {
    // 设置编辑器数据
    parseFormData() {
      this.$nextTick(() => {
        // console.log('this.generateConf', this.generateConf, 'this.formData', this.formData, 'beautifierConf.js', beautifierConf.js)
        const { type } = this.generateConf
        this.htmlCode = beautifier.html(makeUpHtml(this.formData, type, 'preview'), beautifierConf.html)
        this.jsCode = beautifier.js(makeUpJs(this.formData, type, 'preview'), beautifierConf.js)
        this.cssCode = beautifier.css(makeUpCss(this.formData, type, 'preview'), beautifierConf.html)
        // setTimeout(() => {
        // this.isIframeLoaded && this.runCode()
        // })
        const codeObj = { htmlCode: this.htmlCode, jsCode: this.jsCode, cssCode: this.cssCode }
        this.$emit('update:code', codeObj)
      })
    },
    iframeLoad() {
      this.isIframeLoaded = true
      this.runCode()
    },
    // 执行代码
    runCode() {
      // console.log(666666, this.jsCode, this.htmlCode)
      if (!this.jsCode || !this.htmlCode) {
        // this.$message({
        //   showClose: true,
        //   type: 'error',
        //   message: '请输入代码后运行！'
        // })
        return
      }
      try {
        const ast = parse(this.jsCode, { sourceType: 'module' })
        const astBody = ast.program.body
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
          const { type } = this.generateConf
          const { importList } = getBuildOpts(this.formData, type, 'preview')
          const postData = {
            type: 'refreshFrame',
            data: {
              generateConf: this.generateConf,
              html: this.htmlCode,
              js: this.jsCode.replace(exportDefault, ''),
              css: this.cssCode,
              scripts: this.scripts,
              links: this.links,
              importList
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
        console.error(err)
      }
    },
    generateCode() {
      const html = vueTemplate(this.htmlCode)
      const script = vueScript(this.jsCode)
      const css = cssStyle(this.cssCode)
      return beautifier.html(html + script + css, beautifierConf.html)
    },
    exportFile() {
      this.$prompt('文件名:', '导出文件', {
        inputValue: `${+new Date()}.vue`,
        inputPlaceholder: '请输入文件名'
      }).then(({ value }) => {
        if (!value) value = `${+new Date()}.vue`
        const codeStr = this.generateCode()
        const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' })
        saveAs(blob, value)
      })
    },
    copy() {
      bindCopy('#copyHidden', () => {
        const codeStr = this.generateCode()
        this.$notify({
          title: '成功',
          message: '代码已复制到剪切板，可粘贴。',
          type: 'success'
        })
        return codeStr
      }, e => {
        this.$message({
          showClose: true,
          type: 'error',
          message: '代码复制失败'
        })
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/preview-drawer.scss';
</style>
