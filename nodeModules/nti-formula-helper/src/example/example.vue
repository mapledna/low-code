<template>
  <div id="app">
    <el-button @click="show">打开公式编辑助手</el-button>
    公式：{{formula}}
    <FormulaHelp
      v-if="isShow"
      :visible.sync="isShow"
      :formula.sync="formula"
      :language="language"
      :title="title"
      :preStr="preStr"
      :afterStr="afterStr"
      :formulaList="formulaList"
      :dsTree="dsTree"
      :dsTreeProps="dsTreeProps"
      @afterSumbit="afterSumbit"
    />
  </div>
</template>

<script>
import FormulaHelp from '../packages/FormulaHelp'
import { formulaList } from './data/formula'
import {
  dsTree,
  dsTreeProps
} from './data/ds'

export default {
  name: 'App',
  components: {
    FormulaHelp
  },
  data() {
    return {
      isShow: false,
      formula: 'init value',
      title: '公式编辑助手',
      language: 'javascript',
      preStr: '(val, row, col)=>{',
      afterStr: '}',
      formulaList: formulaList,
      dsTree: dsTree,
      dsTreeProps: dsTreeProps
    }
  },
  methods: {
    show() {
      this.isShow = true
    },
    afterSumbit(formula) {
      console.log('afterSumbit:', formula)
    }
  },
}
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
