/* 自定义参数 */
<template>
  <div>
    <el-form-item label="自定义参数">
      <el-switch
        v-model="_type"
        inactive-value=""
        active-value="$$_fn"
      />
      <br>
      <!-- <el-radio-group
        v-model="_type"
        size="medium"
      >
        <el-radio-button label="">
          不启用
        </el-radio-button>
        <el-radio-button label="$$_fn">
          函数
        </el-radio-button>
        <el-radio-button label="$$_json">
          JSON
        </el-radio-button>
      </el-radio-group> -->
      <template v-if="_type==='$$_fn'">
        <el-button
          icon="el-icon-edit-outline"
          type="text"
          @click="showCodeEditor('$$_fn')"
        >
          编辑函数
        </el-button>
        <el-input
          :value="_fnBody"
          type="textarea"
          disabled
          :rows="3"
          placeholder="请点击按钮进行编辑"
        />
      </template>
      <!-- <template v-else-if="_type==='$$_json'">
        <el-button
          icon="el-icon-edit-outline"
          type="text"
          @click="showCodeEditor('$$_json')"
        >
          编辑 JSON
        </el-button>
        <el-input
          v-model="_json"
          type="textarea"
          disabled
          :rows="2"
          placeholder="请点击按钮进行编辑"
        />
      </template> -->
    </el-form-item>

    <!-- TODO: 弹窗统一写到顶层 -->
    <ntiFormulaHelper
      :visible.sync="dialogVisible"
      :formula="_type==='$$_fn' ? _fnBody : _json"
      title="自定义参数"
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
  type: {
    type: String,
    default: '',
    autoUpdate: true
  },
  fnBody: {
    type: String,
    default: '',
    autoUpdate: true
  }
  // json: {
  //   type: String,
  //   default: '',
  //   autoUpdate: true
  // }
}

const fnTips = '自定义函数支持使用 this 对象调用页面中的所有函数和变量。'
const fnPreStr = `${'&ensp;'.repeat(6)}function(){<br>${'&ensp;'.repeat(9)}const { formData, page } = this`
const fnAfterStr = `${'&ensp;'.repeat(6)}}`

export default {
  name: 'CustomParam',
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
      if (type === '$$_fn') {
        this.fnTips = fnTips
        this.preStr = fnPreStr
        this.afterStr = fnAfterStr
        if (this._fnBody === '') {
          this._fnBody = 'return {}'
        }
      } else if (type === '$$_json') {
        this.fnTips = ''
        this.preStr = ''
        this.afterStr = ''
      }
    },
    handleAfterSumbit(val) {
      if (this._type === '$$_fn') {
        this._fnBody = val
      } else if (this._type === '$$_json') {
        this._json = val
      }
    }
  }
}
</script>
