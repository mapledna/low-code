<template>
  <el-dialog
    top="10vh"
    width="800px"
    class="formula-help"
    append-to-body
    :close-on-click-modal="false"
    :visible.sync="visible"
    :before-close="doClose"
    @open="handleOpen"
  >
    <div slot="title">{{title}}</div>
    <slot></slot>
    <div :class="{ 'code-panel': preStr || afterStr }">
      <div class="form-item-text" v-if="preStr" v-html="preStr" />
      <CodeEditor
        class="border-all"
        v-model="editorVal"
        :language="language"
        style="height: 150px;"
      />
      <div class="form-item-text" v-if="afterStr" v-html="afterStr" />
    </div>
    <el-row class="code-bottom-panel" v-if="hasFomula || hasDs">
      <el-col
        v-if="hasFomula"
        class="border-all"
        :span="hasDs ? 16 : 24"
        style="height: 100%; overflow: auto; margin-right: -1px"
      >
        <formulaPanel :data="formulaList" @insert="handleInsert" />
      </el-col>
      <el-col
        v-if="hasDs"
        class="border-all"
        :span="hasFomula ? 8 : 24"
        style="height: 100%; overflow: auto"
      >
        <dsPanel :treeData="dsTree" :treeProps="dsTreeProps" @insert="handleInsert" />
      </el-col>
    </el-row>
    <div slot="footer">
      <el-button @click="doClose">取&nbsp;消</el-button>
      <el-button type="primary" native-type="submit" @click="handelSubmit">
        <i class="el-icon-success" />&nbsp;确&nbsp;定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import CodeEditor from '@components/CodeEditor'
import formulaPanel from './components/formulaPanel'
import dsPanel from './components/dsPanel'
import './style'

export default {
  name: 'FormulaHelp',
  components: {
    CodeEditor,
    formulaPanel,
    dsPanel,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    formula: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '公式编辑助手',
    },
    language: {
      type: String,
      default: 'javascript',
    },
    preStr: {
      type: String,
      default: ''
    },
    afterStr: {
      type: String,
      default: ''
    },
    formulaList: {
      type: Array,
      default: () => [],
    },
    dsTree: {
      type: Array,
      default: () => [],
    },
    dsTreeProps: {
      type: Object
    },
  },

  data() {
    return {
      editorVal: '',
    }
  },

  computed: {
    hasFomula() {
      return this.formulaList && this.formulaList.length > 0
    },
    hasDs() {
      return this.dsTree && this.dsTree.length > 0
    },
  },

  watch: {
    formula: {
      immediate: true,
      handler(formula) {
        this.editorVal = formula
      },
    },
  },

  created() {},
  mounted() {
    if (this.visible) {
      this.handleOpen()
    }
  },

  methods: {
    doClose() {
      this.$emit('update:visible', false)
    },

    handleOpen() {},

    async handelSubmit() {
      this.$emit('update:formula', this.editorVal)
      this.$emit('afterSumbit', this.editorVal)
      this.doClose()
    },

    handleInsert(...arg) {
      this.editorVal =
        (this.editorVal ? this.editorVal + '\n' : '') + arg.join('\n')
    },
  },
}
</script>
