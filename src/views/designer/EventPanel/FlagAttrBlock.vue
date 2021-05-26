<template>
  <el-form-item :label="label">
    <UiFormItemTips
      v-if="tips"
      slot="label"
      :content="tips"
    >
      {{ label }}
    </UiFormItemTips>
    <!-- 是否启用选项卡 -->
    <template v-if="useTab">
      <el-radio-group
        v-model="_value"
        size="medium"
      >
        <el-radio-button label="true">
          是
        </el-radio-button>
        <el-radio-button label="false">
          否
        </el-radio-button>
        <el-radio-button v-if="useSelect||useCustom" label="fn">
          自定义
        </el-radio-button>
      </el-radio-group>
      <br>
    </template>
    <template v-if="allowFn">
      <!-- 选择已有函数 -->
      <el-select
        v-if="useSelect"
        v-model="_fnName"
        filterable
        clearable
        placeholder="请选择事件"
        :class="{ 'form-item-mg-top': useTab }"
      >
        <el-option-group
          v-for="(groupItem, groupIndex) in eventList"
          :key="groupIndex"
          :label="groupItem.label"
        >
          <el-option
            v-for="(item,index) in groupItem.list"
            :key="index"
            :label="item.label || item"
            :value="item.value || item"
          />
        </el-option-group>
      </el-select>

      <!-- 编写自定义函数 -->
      <template v-if="_fnName === '$customFn'">
        <el-button
          type="text"
          icon="el-icon-edit-outline"
          @click="()=>{ dialogVisible = true}"
        >
          编辑自定义函数
        </el-button>
        <el-input
          :value="fullFnBody"
          type="textarea"
          disabled
          :rows="2"
          placeholder="请点击按钮进行编辑"
        />
        <!-- TODO: 弹窗统一写到顶层 -->
        <ntiFormulaHelper
          :visible.sync="dialogVisible"
          :formula.sync="_fnBody"
          :pre-str="fnPreStr"
          :after-str="fnAfterStr"
          :title="`代码编辑：${label}`"
        >
          <div
            v-if="fnTips"
            class="formula-info"
            v-html="fnTips"
          />
        </ntiFormulaHelper>
      </template>
    </template>
  </el-form-item>
</template>

<script>
import ntiFormulaHelper from 'nti-formula-helper'
import { builderComputedMap } from '@utils/vue'

const propsMap = {
  useTab: { // 允许展示是否启用开关
    type: Boolean,
    default: true
  },
  useSelect: { // 允许直接选择已有函数
    type: Boolean,
    default: true
  },
  useCustom: { // 允许编写自定义函数
    type: Boolean,
    default: true
  },
  label: {
    type: String,
    default: ''
  },
  value: {
    type: String,
    default: '',
    autoUpdate: true
  },
  tips: {
    type: String,
    default: ''
  },
  fnTips: {
    type: String,
    default: ''
  },
  fnName: {
    type: String,
    default: ''
  },
  fnBody: {
    type: String,
    default: '',
    autoUpdate: true
  },
  fnPreStr: {
    type: String,
    default: ''
  },
  fnAfterStr: {
    type: String,
    default: ''
  },
  customJsList: { // 自定义事件列表
    type: Array,
    default: () => ([])
  },
  innerJsList: { // 内置事件
    type: Array,
    default: () => ([])
  }
}

export default {
  name: 'EventBlock',
  components: {
    ntiFormulaHelper
  },
  inheritAttrs: false,
  props: propsMap,
  data() {
    return {
      dialogVisible: false
    }
  },
  computed: {
    ...builderComputedMap(propsMap),
    eventList() {
      const {
        useSelect,
        useCustom,
        customJsList,
        innerJsList
      } = this
      if (!useSelect) {
        return []
      }

      const list = []
      if (useCustom) {
        list.push({
          _type: 'group',
          label: '',
          list: [{
            label: '编写自定义函数',
            value: '$customFn'
          }]
        })
      }
      if (customJsList.length > 0) {
        list.push({
          _type: 'group',
          label: '页面JS自定义事件',
          list: customJsList
        })
      }
      if (innerJsList.length > 0) {
        list.push({
          _type: 'group',
          label: '系统内置事件',
          list: innerJsList
        })
      }
      return list
    },
    fullFnBody() {
      const {
        fnPreStr,
        fnAfterStr,
        fnBody
      } = this
      return `${fnPreStr || ''}${fnBody}${fnAfterStr || ''}`
    },
    allowFn: {
      get() {
        return this.useTab ? this.value === 'fn' : true
      }
    },
    _fnName: {
      get() {
        return (this.useSelect && this.fnName) ? this.fnName : '$customFn'
      },
      set(fnName) {
        this.$emit('update:fnName', fnName)
        this.$emit('updateParentData', 'fnName', fnName)
      }
    }
  },
  methods: {}
}
</script>
