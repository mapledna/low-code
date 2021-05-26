<template>
  <el-drawer
    class="code-editor-drawer"
    v-bind="$attrs"
    @opened="onOpen"
    @close="onClose"
  >
    <CodeEditor
      v-model="code"
      :language="language"
      @onChage="onChage"
      @onInstance="bindSaveKey"
    />
  </el-drawer>
</template>

<script>
import CodeEditor from '@/components/CodeEditor'

export default {
  name: 'CodeEditorDialog',
  components: {
    CodeEditor
  },
  props: {
    code: {
      type: [String],
      default: ''
    },
    language: {
      language: [String],
      default: ''
    }
  },
  data() {
    return {
      editor: undefined
    }
  },

  methods: {
    onOpen() {
      this.editor?.layout()
    },
    onClose() {
      this.$emit('update:visible', false)
    },
    bindSaveKey(editor) {
      this.editor = editor
      editor.onKeyDown(e => {
        if (e.keyCode === 49 && (e.metaKey || e.ctrlKey)) {
          this.onSave(editor.getValue())
        }
      })
    },
    onChage(content, e, editor) {
      this.$emit('onChage', content, e, editor)
    },
    onSave(content) {
      this.$emit('update:code', content)
      this.$message({
        showClose: true,
        message: `${this.$attrs?.title || ''}代码保存成功！`,
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.code-editor-drawer ::v-deep {
  .el-drawer {
    min-height: 250px;
    max-height: 600px;
    height: 70% !important;
  }
  .el-drawer__body {
    padding: 0;
  }
}
</style>
