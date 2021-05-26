/* 回调函数 */
<template>
  <div>
    <el-form-item label="成功回调函数">
      <el-switch
        v-model="_isResoveFn"
      />
      <br>
      <template v-if="_isResoveFn">
        <el-button
          icon="el-icon-edit-outline"
          type="text"
          @click="showCodeEditor('$$_fn')"
        >
          编辑函数
        </el-button>
        <el-input
          :value="_resoveFn"
          type="textarea"
          disabled
          :rows="3"
          placeholder="请点击按钮进行编辑"
        />
      </template>
    </el-form-item>

    <!-- TODO: 弹窗统一写到顶层 -->
    <ntiFormulaHelper
      :visible.sync="dialogVisible"
      :formula="_resoveFn"
      title="回调函数"
      :pre-str="preStr"
      :after-str="afterStr"
      @afterSumbit="handleAfterSumbit"
    >
      <div
        v-if="fnTips"
        class="formula-info"
        v-html="fnTips"
      />
    </ntiFormulaHelper>
  </div>
</template>

<script>
/* eslint-disable no-underscore-dangle */
import ntiFormulaHelper from 'nti-formula-helper'
import {
  builderComputedMap
} from '@utils/vue'

const propsMap = {
  resoveFn: {
    type: String,
    default: '',
    autoUpdate: true
  },
  isResoveFn: {
    type: Number,
    default: false,
    autoUpdate: true
  }
  // json: {
  //   type: String,
  //   default: '',
  //   autoUpdate: true
  // }
}
const fnTips = '支持使用 this 对象调用页面中的所有函数和变量。res为接口执行成功后返回的数据,serverParam为参数'
const fnPreStr = `${'&ensp;'.repeat(6)}function(res,serverParam){<br>${'&ensp;'.repeat(9)}const { formData, page } = this`
const fnAfterStr = `${'&ensp;'.repeat(6)}}`

export default {
  name: 'CallBack',
  components: {
    ntiFormulaHelper
  },
  inheritAttrs: false,
  props: propsMap,
  data() {
    return {
      dialogVisible: false,
      fnTips: '',
      preStr: '',
      afterStr: ''
    }
  },
  computed: {
    ...builderComputedMap(propsMap)
    // fullFnBody() {
    //   const {
    //     fnBody
    //   } = this
    //   return `${fnPreStr}\n${fnBody}\n${fnAfterStr}`
    //     .replaceAll('&ensp;', '').replaceAll('<br>', '\n')
    // }
  },
  methods: {
    showCodeEditor(type) {
      this.dialogVisible = true
      this.language = type
      // if (type === '$$_fn') {
      this.fnTips = fnTips
      this.preStr = fnPreStr
      this.afterStr = fnAfterStr
      // if (this._resoveFn === '') {
      //   this._resoveFn = 'return {}'
      // }
      // } else if (type === '$$_json') {
      //   this.fnTips = ''
      //   this.preStr = ''
      //   this.afterStr = ''
      // }
    },
    handleAfterSumbit(val) {
      // if (this._type === '$$_fn') {
      this._resoveFn = val
      // } else if (this._type === '$$_json') {
      //   this._json = val
      // }
    },
    isResoveFnChange(val) {
      console.log(val)
      if (!val) {
        this._resoveFn = ''
      }
    }
  }
}
</script>
