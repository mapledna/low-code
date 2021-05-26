<template>
  <div>
    <el-drawer class="preview-drawer" v-bind="$attrs" append-to-body v-on="$listeners" @opened="onOpen">
      <div style="height:100%">
        <el-row style="height:100%;overflow:auto">
          <el-col :md="24" :lg="12" class="left-editor">
            <el-tabs v-model="activeTab" type="card" class="editor-tabs">
              <el-tab-pane name="html">
                <span slot="label">
                  <i :class="activeTab==='html' ? 'el-icon-edit' : 'el-icon-document'" />
                  template
                </span>
                <CodeEditor
                  v-model="totalCode.htmlCode"
                  language="html"
                  @onInstance="bindSaveKey"
                />
              </el-tab-pane>
              <el-tab-pane name="js">
                <span slot="label">
                  <i :class="activeTab==='js' ? 'el-icon-edit' : 'el-icon-document'" />
                  script
                </span>
                <CodeEditor
                  v-model="totalCode.jsCode"
                  language="javascript"
                  @onInstance="bindSaveKey"
                />
              </el-tab-pane>
              <el-tab-pane name="css">
                <span slot="label">
                  <i :class="activeTab==='css' ? 'el-icon-edit' : 'el-icon-document'" />
                  css
                </span>
                <CodeEditor
                  v-model="totalCode.cssCode"
                  language="css"
                  @onInstance="bindSaveKey"
                />
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :md="24" :lg="12" class="right-preview">
            <template-parser
              ref="templateParser"
              v-bind="$attrs"
              :code.sync="totalCode"
              :src="src"
              :has-tool="true"
              @close="closeDialog"
            />
          </el-col>
        </el-row>
      </div>
    </el-drawer>
    <input id="copyHidden" type="hidden">
  </div>
</template>
<script>
import CodeEditor from '@/components/CodeEditor'
import TemplateParser from '@/components/render/TemplateParser'

import window from '@/utils/polyfill'
import { getSpecialPath } from '@router/tool'

export default {
  components: {
    CodeEditor,
    TemplateParser
  },
  data() {
    return {
      activeTab: 'html',
      totalCode: {
        htmlCode: '',
        jsCode: '',
        cssCode: ''
      },
      src: ''
    }
  },
  mounted() {
    window.addEventListener('keydown', this.preventDefaultSave)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.preventDefaultSave)
  },
  methods: {
    // 点击关闭弹窗
    closeDialog() {
      this.$emit('update:visible', false)
    },
    preventDefaultSave(e) {
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
      }
    },
    bindSaveKey(editor) {
      editor.onKeyDown(e => {
        if (e.keyCode === 49 && (e.metaKey || e.ctrlKey)) {
          this.$refs.templateParser.runCode()
        }
      })
    },

    // 设置编辑器数据
    onOpen() {
      this.src = `${getSpecialPath('PREVIEW')}?sessionKey=${this.$server.getSessionKey()}`
      this.$refs.templateParser.parseFormData()
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/preview-drawer.scss';
</style>
