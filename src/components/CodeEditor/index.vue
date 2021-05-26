<template>
  <div class="code-editor-warp" :style="{ height: editorHeight }">
    <div ref="editor" :style="{ height: editorHeight }" />
    <textarea :value="value" :name="name" style="display: none" />
  </div>
</template>

<script>
import { getRootPath } from '@router/tool'
import { loadScript } from '@/utils/loadAssets'

// import * as monaco from 'monaco-editor'
// import monaco from 'monaco'
let { monaco } = window // NOTE: 外部引入

export default {
  name: 'CodeEditor',

  model: {
    prop: 'value',
    event: 'input',
  },

  props: {
    name: {
      type: [String],
      default: '',
    },
    value: {
      type: [String],
      default: '',
    },
    language: {
      // 语言模式。'javascript', 'css', 'html', 'sql', 'java', 'json', 'markdown'
      type: [String],
      default: '',
    },
    theme: {
      // 主题风格。'vs'白色|'vs-dark'黑色|'hc-black'高亮
      type: [String],
      default: 'vs',
    },
    height: {
      // 编辑器展示高度。若同时设置 height 和 rows，rows 优先
      type: [String],
      default: '100%',
    },
    rows: {
      // 编辑器展示行数
      type: [Number, String],
      default: 0,
    },
    // 主要配置
    editorOptions: {
      type: Object,
      default() {
        return {
          cursorStyle: 'line', // 光标样式
          autoIndent: true,
          automaticLayout: true, // 自动布局
          // selectOnLineNumbers: true,
          // roundedSelection: false,
          // readOnly: this.readOnly, // 只读
          // useTabStops: false,
        }
      },
    },
  },

  data() {
    return {
      editorInstance: null,
      content: this.value,
    }
  },

  computed: {
    editorHeight() {
      const lineHeight = 19
      return this.rows ? `${(this.rows + 1) * lineHeight}px` : this.height
    },
  },

  watch: {
    value(newVal) {
      if (newVal !== this.getValue()) {
        this.setValue(newVal)
      }
    },
    language(language) {
      const { editorInstance } = this
      editorInstance &&
        monaco.editor.setModelLanguage(editorInstance.getModel(), language)
    },
    theme(theme) {
      const { editorInstance } = this
      editorInstance &&
        monaco.editor.setTheme(editorInstance.getModel(), theme)
    },
    editorOptions: {
      deep: true,
      handler(editorOptions) {
        if (this.editorInstance) {
          this.editorInstance.updateOptions(editorOptions)
        }
      },
    },
    editorHeight() {
      this.$nextTick(() => {
        if (this.editorInstance) {
          this.editorInstance.layout()
        }
      })
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },

  beforeDestroy() {
    this.destory()
  },

  methods: {
    setValue(value) {
      const { editorInstance } = this
      editorInstance ? editorInstance.setValue(value) : this.init()
    },

    getValue() {
      const { editorInstance } = this
      return editorInstance ? editorInstance.getValue() : ''
    },

    init() {
      const vm = this
      if (monaco) {
        vm.instanceEditor()
        return
      }
      loadScript('libs/monaco-editor/min/vs/loader.js', () => {
        window.require.config({
          paths: {
            vs: 'libs/monaco-editor/min/vs',
          },
        })
        const rootPath = getRootPath()
        window.MonacoEnvironment = {
          getWorkerUrl(workerId, label) {
            return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
            self.MonacoEnvironment = {
              baseUrl: '${rootPath}libs/monaco-editor/min/'
            };
            try{
              importScripts('${rootPath}libs/monaco-editor/min/vs/base/worker/workerMain.js');
            }catch(e){
              console.error('monaco import workerMain Error:', e)
            }
            `)}`
          },
        }
        window.require(['vs/editor/editor.main'], () => {
          monaco = window.monaco
          vm.instanceEditor()
        })
      })
    },

    instanceEditor() {
      const { editorInstance } = this
      if (editorInstance) {
        return
      }
      const { value, language, theme, editorOptions } = this
      this.editorInstance = monaco.editor.create(this.$refs.editor, {
        value,
        language,
        theme,
        ...editorOptions,
      })
      this.editorInstance.onDidChangeModelContent((e) => {
        const newContent = this.editorInstance.getValue()
        this.$emit('input', newContent)
        this.$emit('onChage', newContent, e, this.editorInstance)
      })
      this.$emit('onInstance', this.editorInstance)
    },
    destory() {
      let { editorInstance } = this
      if (!editorInstance) return
      const model = editorInstance.getModel()
      if (model) {
        model.dispose()
      }
      editorInstance.dispose()
      editorInstance = null
    },
  },
}
</script>

<style>
.code-editor-warp {
  overflow: hidden;
}
</style>
