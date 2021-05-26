<template>
  <el-drawer
    :title="title"
    :visible.sync="visible"
    class="attr-edit-drawer"
    size="350px"
    :modal="false"
    :close-on-click-modal="false"
    append-to-body
    @open="onOpen"
    @close="onClose"
  >
    <el-form
      ref="elForm"
      size="small"
      label-width="110px"
    >
      <el-form-item label="按钮名称">
        <ui-form-item-text :model-value="dialogObj.label" />
      </el-form-item>
      <el-form-item label="前图标">
        <el-input
          v-model="dialogObj['prefix-icon']"
          placeholder="请输入前图标名称"
          clearable
        >
          <el-button
            slot="append"
            icon="el-icon-thumb"
            @click="openIconsDialog('prefix-icon')"
          >
            选择
          </el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="后图标">
        <el-input
          v-model="dialogObj['suffix-icon']"
          placeholder="请输入后图标名称"
          clearable
        >
          <el-button
            slot="append"
            icon="el-icon-thumb"
            @click="openIconsDialog('suffix-icon')"
          >
            选择
          </el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="按钮风格">
        <el-select
          v-model="dialogObj.type"
          placeholder="请选择展示类型"
          :style="{ width: '100%' }"
        >
          <el-option
            label="文本"
            value="text"
          />
          <el-option
            label="基础"
            value="default"
          />
          <el-option
            label="主要"
            value="primary"
          />
          <el-option
            label="次要"
            value="info"
          />
          <el-option
            label="成功"
            value="success"
          />
          <el-option
            label="警告"
            value="warning"
          />
          <el-option
            label="危险"
            value="danger"
          />
        </el-select>
      </el-form-item>

      <!-- HACK: 避免把 style 配置渲染成组件样式 -->
      <!-- <DisplayEventPanel
          :style="null"
          v-bind="dialogObj"
          @updateParentData="updateParentData"
        /> -->
      <FlagAttrBlock
        label="隐藏"
        :value.sync="dialogObj.invisible"
        :fn-body.sync="dialogObj.invisible_fnBody"
        :use-select="false"
        fn-tips="自定义函数返回真值时隐藏，否则显示。<br>可以通过 this.formData.[组件字段名] 获取数据。"
        fn-pre-str="function(){"
        fn-after-str="}"
      />
      <FlagAttrBlock
        label="禁用"
        :value.sync="dialogObj.disabled"
        :fn-body.sync="dialogObj.disabled_fnBody"
        :use-select="false"
        fn-tips="自定义函数返回真值时禁用，否则可用。<br>可以通过 this.formData.[组件字段名] 获取数据。"
        fn-pre-str="function(){"
        fn-after-str="}"
      />

      <!-- TODO:  widgetType === 'input-button'" 同按钮操作-->
      <EventBlock
        label="按钮操作"
        :use-toggle="false"
        :fn-name.sync="dialogObj.click_fn"
        :use-custom="false"
        :custom-js-list="customJsList"
        :inner-js-list="innerJsList"
      />

      <!-- 打开页面配置
      TODO:  v-if="dialogObj.action === 'openPage'" -->
      <!-- :style="null" v-bind="dialogObj" -->
      <OpenPageEventPanel
        v-if="dialogObj.click_fn === 'handleOpenPage'"
        :open-page-type.sync="dialogObj.openPageType"
        :action-type.sync="dialogObj.actionType"
        :page-id.sync="dialogObj.pageId"
        :custom-url.sync="dialogObj.customUrl"
        :dialog-width.sync="dialogObj.dialogWidth"
        @updateParentData="updateParentData"
      />

      <!-- TODO: 改为数据源组件。注意兼容数据。 -->
      <attr-datasource
        v-show="allowDs"
        :allow-type="allowDsType"
        :active-data="dialogObj"
        :label="dialogObj.label"
        :tag="dialogObj.tag"
        :layout="dialogObj.layout"
      />
      <el-form-item
        v-if="dialogObj._key === 'topBtn'"
        label="操作数量"
      >
        <el-radio-group
          v-model="dialogObj.operatNum"
          size="medium"
        >
          <el-radio-button label="none">
            无
          </el-radio-button>
          <el-radio-button label="single">
            单条
          </el-radio-button>
          <el-radio-button
            label="multi"
            :disabled="!activeData || activeData.columnType !== 'selection'"
          >
            多条
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <!-- TODO: 改用 CustomParam -->
      <el-form-item>
        <UiFormItemTips
          slot="label"
          content="【参数】支持 page、row、scope、formData。操作多条时也支持 rows。<br>【注意】不支持使用 this，否则发布后执行失败。<br>【示例】{id: row.id}"
        >
          参数对象
        </UiFormItemTips>
        <el-input
          v-model="dialogObj.params"
          type="textarea"
          rows="5"
          placeholder="请输入参数对象。"
        />
      </el-form-item>

      <!-- 按钮点击前事件 -->
      <EventBlock
        label="点击前事件"
        tips="【参数】<br>scope {Object} 可获取到 row。<br>field {String} 按钮鉴权值。<br>tableId {String} 表格字段名。<br>【返回】<br>{Boolean} 返回真值执行后续动作，返回假值停止后续动作。"
        :allow-fn.sync="dialogObj.useBeforeClickFn"
        :use-select="false"
        fn-pre-str="function(scope, field, tableId){<br>const { row } = scope"
        fn-after-str="}"
        :fn-body.sync="dialogObj.beforeClickFn"
        :active-data="activeData"
        :custom-js-list="customJsList"
        :inner-js-list="innerJsList"
      />
    </el-form>
    <icon-picker-dialog
      v-if="iconsVisible"
      :visible.sync="iconsVisible"
      :current="dialogObj[currentIconModel]"
      @chooseMdiIcon="selectIcon"
    />
  </el-drawer>
</template>

<script>
import ComboTree from '@/components/ComboTree/index'
import IconPickerDialog from '@/components/IconPickerDialog/Index'
import OpenPageEventPanel from '../EventPanel/OpenPageEventPanel'
import FlagAttrBlock from '../EventPanel/FlagAttrBlock'
import EventBlock from '../EventPanel/EventBlock'
import DisplayEventPanel from '../EventPanel/DisplayEventPanel'

import {
  widgetConfArr,
  getWidgetConf
} from '@/components/generator/config/utils'

export default {
  name: 'EditTableBtnDialog',
  components: {
    ComboTree,
    IconPickerDialog,
    OpenPageEventPanel,
    FlagAttrBlock,
    EventBlock,
    DisplayEventPanel
  },
  inheritAttrs: false,
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    dialogObj: {
      type: Object,
      default: () => ({})
    },
    activeData: {
      type: Object,
      default: () => ({})
    },
    customJsList: {
      type: Array,
      default: () => ([])
    },
    innerJsList: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      isShow: 1, // 是否显示该列
      isValidate: true, // 是否校验通过
      // 表格相关
      widgetConfArr,
      isUseFormatColFn: false,
      // 数据源相关
      dictOption: [], // 数据字典
      serviceOption: [], // 数据服务id的下拉数据
      categoryOption: [], // 页面数据源请求的分类数据
      flowCategoryOption: [], // 事务流分类数据
      listOption: [], // SQL数组
      microOption: [], // 微服务数组
      // 图标弹窗
      iconsVisible: false,
      currentIconModel: null
    }
  },
  computed: {
    widgetType() {
      const {
        dialogObj
      } = this
      if (!dialogObj || !dialogObj.editable) {
        return ''
      }
      const code = dialogObj.widgetCode
      console.log('computed widgetType', widgetConf, code)
      const widgetConf = getWidgetConf(code)
      return widgetConf ? widgetConf.type : ''
    }
  },
  watch: {
    dialogObj: {
      deep: true,
      handler(dialogObj) {
        console.log('TableBtnDialog watch dialogObj ===', dialogObj)

        // TODO: 自动渲染数据参数
        // // 选择SQL\事务流
        // this.dialogObj.params = `{ ${res.map(item => `${item.value}: row.${item.value}`).join(', ')} }`
        // // 选择微服务
        // this.dialogObj.params = `{ ${res.search.map(item => `${item.value}: row.${item.value}`).join(', ')} }`

        // this.$emit('update:dialogObj', dialogObj)
      }
    }
  },
  mounted() { },
  methods: {
    updateParentData(key, value) {
      this.$set(this.dialogObj, key, value)
    },
    hackBtnData() {
      const {
        dialogObj
      } = this
      // HACK: 按钮自定义展示
      if (dialogObj.available_allow === undefined) {
        const displayFn = dialogObj.displayFn && dialogObj.displayFn.trim()
        this.$set(this.dialogObj, 'available_allow', !!displayFn)
        this.$set(this.dialogObj, 'displayFn', displayFn || '')
      }
      // HACK: 按钮自定义禁用
      if (dialogObj.available_allow === undefined) {
        const disabledFn = dialogObj.disabledFn && dialogObj.disabledFn.trim()
        this.$set(this.dialogObj, 'available_allow', !!disabledFn)
        this.$set(this.dialogObj, 'available_fn', disabledFn || '')
      }
      // HACK: 按钮自定义点击前事件
      if (dialogObj.available_allow === undefined) {
        const beforeClickFn = dialogObj.beforeClickFn && dialogObj.beforeClickFn.trim()
        this.$set(this.dialogObj, 'useBeforeClickFn', !!beforeClickFn)
        this.$set(this.dialogObj, 'beforeClickFn', beforeClickFn || '')
      }
      // HACK: 按钮单击动作
      if (dialogObj.click_fn === undefined) {
        const {
          action,
          $click
        } = dialogObj
        if (action === 'openPage') {
          this.$set(dialogObj, 'click_fn', 'handleOpenPage')
        } else if (action === 'dataSource' || action === 'flow' || action === 'microservice') {
          this.$set(dialogObj, 'click_fn', 'doApiAction')
          if (dialogObj.categoryId && action
            === 'dataSource') { // HACK: 旧数据中,事务流 flowId 被设置为 categoryId
            this.handleCategoryIdChange(undefined, dialogObj.categoryId)
          }
        } else {
          this.$set(dialogObj, 'click_fn', $click)
        }
        this.$delete(dialogObj, 'action')
        this.$delete(dialogObj, '$click')
      }

      console.log('after hackBtnData dialogObj', dialogObj)
    },

    onOpen() {
      const {
        dialogObj
      } = this
      this.isValidate = true

      this.hackBtnData()
    },
    onClose() {
      this.close()
    },
    close(e) {
      if (this.isValidate) {
        this.$emit('update:visible', false)
      }
    },

    openIconsDialog(model) {
      this.iconsVisible = true
      this.currentIconModel = model
    },
    setIcon(val) {
      this.dialogObj[this.currentIconModel] = val
    },
    // 弹窗从图标库中点击选择图标
    selectIcon(iconName) {
      // console.log('iconname', iconName)
      this.dialogObj[this.currentIconModel] = iconName
      this.iconsVisible = false
    }
  }
}
</script>

<style lang="scss">
@import "./style";
</style>
