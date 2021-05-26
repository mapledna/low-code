<template>
  <div>
    <el-drawer
      :visible.sync="visible"
      size="350px"
      :modal="false"
      :close-on-click-modal="false"
      append-to-body
      @open="onOpen"
      @close="onClose"
    >
      <!-- 自定义表格列、自定义选项 -->
      <el-form
        v-if="dialogObj.type === 'column'"
        ref="elForm"
        size="small"
        label-width="110px"
      >
        <el-form-item label="隐藏">
          <el-switch v-model="dialogObj.invisible" />
        </el-form-item>
        <el-form-item label="列宽度">
          <el-input-number v-model="dialogObj.width" controls-position="right" :min="0" placeholder="请输入宽度(px)" />
        </el-form-item>
        <el-form-item label="对齐方式">
          <el-radio-group v-model="dialogObj.align" size="medium">
            <el-radio-button label="left">
              居左
            </el-radio-button>
            <el-radio-button label="center">
              居中
            </el-radio-button>
            <el-radio-button label="right">
              居右
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="固定方式">
          <el-radio-group v-model="dialogObj.fixed" size="medium">
            <el-radio-button label="none">
              无
            </el-radio-button>
            <el-radio-button label="left">
              左
            </el-radio-button>
            <el-radio-button label="right">
              右
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="允许排序">
          <el-switch v-model="dialogObj.sortable" />
        </el-form-item>
        <el-form-item>
          <UiFormItemTips
            slot="label"
            content="【参数】<br>cellData 单元格数据。<br>formatStr 匹配字典后的单元格文本。<br>scope 可获取到 row, column, $index 和 store。<br>【返回】单元格展示内容。<br>【示例】function(cellData, formatStr, scope){ return formatStr }"
          >
            内容格式化
          </UiFormItemTips>
          <el-switch v-model="isUseFormatColFn" @change="initFormatColFn($event)" />
          <br>
          <el-input
            v-if="isUseFormatColFn"
            v-model="dialogObj.formatColFn"
            type="textarea"
            rows="6"
            placeholder="请输入表格单元格内容格式化方法"
          />
        </el-form-item>
        <el-form-item label="编辑">
          <el-switch v-model="dialogObj.editable" />
        </el-form-item>
        <template v-if="dialogObj.editable">
        <!-- TODO: 控件选择 -->
        </template>
      </el-form>

      <!-- 表格顶部按钮、操作列按钮 -->
      <el-form
        v-if="['topEdit','rowEdit'].indexOf(dialogObj.type) >= 0 || widgetType === 'input-button'"
        ref="elForm"
        size="small"
        label-width="110px"
      >
        <el-form-item
          v-if="dialogObj.tag==='el-button'||dialogObj.tag==='el-link'"
          label="类型"
        >
          <el-select
            v-model="dialogObj.type"
            placeholder="请选择类型"
            :style="{ width: '100%' }"
          >
            <el-option label="基础" value="default" />
            <el-option label="主要" value="primary" />
            <el-option label="次要" value="info" />
            <el-option label="成功" value="success" />
            <el-option label="警告" value="warning" />
            <el-option label="危险" value="danger" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogObj['prefix-icon']!==undefined" label="前图标">
          <el-input v-model="dialogObj['prefix-icon']" placeholder="请输入前图标名称" clearable>
            <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('prefix-icon')">
              选择
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item v-if="dialogObj['suffix-icon'] !== undefined" label="后图标">
          <el-input v-model="dialogObj['suffix-icon']" placeholder="请输入后图标名称" clearable>
            <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('suffix-icon')">
              选择
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="操作">
          <el-select v-model="dialogObj.action">
            <el-option label="请选择按钮操作" value="" />
            <el-option label="打开页面" value="openPage" />
            <el-option label="关联数据源" value="dataSource" />
            <el-option label="关联事务流" value="flow" />
            <el-option label="关联微服务" value="microservice" />
            <el-option label="自定义函数" value="methods" />
          </el-select>
        </el-form-item>

        <el-form-item
          v-show="dialogObj.action=='methods'"
          label="点击事件"
        >
          <el-select
            v-model="dialogObj.$click"
            filterable clearable
            placeholder="请选择事件"
            :style="{ width: '100%' }"
          >
            <el-option-group v-if="customJsList.length > 0" label="自定义事件">
              <el-option
                v-for="(item,index) in customJsList"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-option-group>
            <el-option-group v-if="innerJsList.length > 0" label="内置事件">
              <el-option
                v-for="(item,index) in innerJsList"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-option-group>
          </el-select>
        </el-form-item>

        <!-- TODO: 改为数据源组件。注意兼容数据。 -->
        <el-form-item
          v-show="dialogObj.action=='dataSource'||dialogObj.action=='flow'||dialogObj.action=='microservice'"
          label="数据源"
        >
          <div v-show="dialogObj.action=='dataSource'||dialogObj.action=='microservice'">
            <el-form-item label="数据分类" label-width="70px" class="form-item-btm">
              <combo-tree
                v-model="dialogObj.categoryId"
                :data="categoryOption"
                :width="'150px'"
                @node-click="handleCategoryIdChange"
              />
            </el-form-item>
            <el-form-item v-show="dialogObj.action=='dataSource'" label="SQL" label-width="70px">
              <el-select v-model="dialogObj.listId" filterable placeholder="请选择SQL" :style="{width:'150px'}" size="small" @change="handleListIdChange">
                <el-option
                  v-for="(item, index) in listOption"
                  :key="index"
                  :label="item.sql_name"
                  :value="item.id_code"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-show="dialogObj.action=='microservice'" label="微服务" label-width="70px">
              <el-select v-model="dialogObj.microserviceId" filterable placeholder="请选择微服务" :style="{width:'150px'}" size="small" @change="handleMicroIdChange">
                <el-option
                  v-for="(item, index) in microOption"
                  :key="index"
                  :label="item.label"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item v-show="dialogObj.action=='flow'" label="事务流" label-width="70px">
            <combo-tree
              v-model="dialogObj.flowId"
              value-key="id_code"
              :data="flowCategoryOption"
              :width="'150px'"
              @node-click="handleFlowIdChange"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item
          v-if="dialogObj.type === 'topEdit'"
          label="操作数量"
        >
          <el-radio-group v-model="dialogObj.operatNum" size="medium">
            <el-radio-button label="none">
              无
            </el-radio-button>
            <el-radio-button label="single">
              单条
            </el-radio-button>
            <el-radio-button label="multi" :disabled="!activeData || activeData.columnType !== 'selection'">
              多条
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
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
            placeholder="请输入参数对象"
          />
        </el-form-item>
        <EventPanel />
        <openPagePanel v-if="dialogObj.action === 'openPage'" />
      </el-form>

      <icon-picker-dialog :visible.sync="iconsVisible" :current="dialogObj[currentIconModel]" @chooseMdiIcon="selectIcon" />
    </el-drawer>
  </div>
</template>
<script>
import ComboTree from '@/components/ComboTree/index'
import IconPickerDialog from '@/components/IconPickerDialog/Index'
import { getFromStore } from '@/utils/db'
import { widgetConfArr, getWidgetConf } from '@/components/generator/config/utils'

export default {
  name: 'EditTableBtnDialog',
  components: {
    ComboTree,
    IconPickerDialog
  },
  inheritAttrs: false,
  props: ['visible', 'title', 'dialogObj', 'activeData', 'customJsList', 'innerJsList'],
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
      systemUrlTree: [],
      // 按钮自定义方法相关
      isDisplay: false,
      isDisabled: false,
      isBeforeClick: false,
      // 图标弹窗
      iconsVisible: false,
      currentIconModel: null
    }
  },
  computed: {
    widgetType() {
      const { dialogObj } = this
      if (!dialogObj || !dialogObj.editable) { return '' }
      const code = dialogObj.widgetCode
      const widgetConf = getWidgetConf(code) || {}
      return widgetConf.type || ''
    }
  },
  watch: {
    dialogObj: {
      deep: true,
      handler(dialogObj) {
        if (dialogObj.action === 'openPage' && dialogObj.$click !== 'handleOpenPage') { // 打开页面
          dialogObj.$click = 'handleOpenPage'
        } else if (dialogObj.action === 'dataSource' || dialogObj.action === 'flow' || dialogObj.action === 'microservice') {
          dialogObj.$click = 'doApiAction'
        } else if (dialogObj.action === 'methods'
          && ['handleOpenPage', 'doApiAction', 'doDeleteAct'].indexOf(dialogObj.$click) >= 0) {
          dialogObj.$click = ''
        }

        if (dialogObj.categoryId) {
          if (dialogObj.action === 'dataSource') { // HACK: 旧数据中,事务流 flowId 被设置为 categoryId
            this.handleCategoryIdChange(undefined, dialogObj.categoryId)
          }
        }

        this.$emit('update:dialogObj', dialogObj)
      }
    }
  },
  mounted() {
  },
  methods: {
    onOpen() {
      // 数据源、页面选项
      this.categoryOption = getFromStore('sqlCategory')
      this.flowCategoryOption = getFromStore('flowCategory')
      this.dictOption = getFromStore('dictList')
      this.systemUrlTree = getFromStore('pageList')

      const { dialogObj } = this
      this.isValidate = true
      // 表格按钮数据源
      const id = this.dialogObj.formatterDs.dictId
      console.log('this.dictOption=====', this.dictOption, dialogObj.formatter)
      console.log('find', id, this.dictOption.find(item => item.id === id), this.dictOption.find(item => item.label === '条件'))
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
    },

    // 选择数据源数据分类
    handleCategoryIdChange(data, id) {
      if (this.dialogObj.action === 'dataSource') {
        this.$server.executeSqls(5, {
          category_id: id
        }).then(res => {
          this.listOption = res
        })
      } else if (this.dialogObj.action === 'microservice') {
        this.$server.listMicroByCategoryId({
          categoryId: id
        }).then(res => {
          this.microOption = res
        })
      }
    },
    // 选择数据源SQL
    handleListIdChange(val) {
      this.$server.executeSqls(6, {
        sqlId: val
      }).then(res => {
        this.dialogObj.params = `{ ${res.map(item => `${item.value}: row.${item.value}`).join(', ')} }`
      })
    },
    // 选择微服务
    handleMicroIdChange(val) {
      this.$server.listMicroParamByMicroId({
        microId: val
      }).then(res => {
        this.dialogObj.params = `{ ${res.search.map(item => `${item.value}: row.${item.value}`).join(', ')} }`
      })
    },
    // 选择事务流
    handleFlowIdChange(data, id) {
      this.$server.executeSqls('1269170765151240193', {
        transflow_id: id
      }).then(res => {
        this.dialogObj.params = `{ ${res.map(item => `${item.value}: row.${item.value}`).join(', ')} }`
      })
    },
    // 选择数据字典和数据服务
    handlesourceIdChange(node, id) {
      if (this.dialogObj.dataType === 'dict') {
        this.dialogObj.serviceId = `GetDictionary('${id}')`
      } else if (this.dialogObj.dataType === 'service') {
        this.handleCategoryIdChange(node)
      }
    },
    // 选择数据服务id
    handleserviceIdChange(id) {
      this.dialogObj.serviceId = `GetData('${id},'label')`
    },

    initFormatColFn(isUse) {
      const defFnStr = `function(cellData, formatStr, scope){
  return formatStr === undefined || formatStr === null ? '' : formatStr
}`
      this.$set(this.dialogObj, 'formatColFn', isUse ? defFnStr : '')
    },
    initDisplayFn(isUse) {
      const defFnStr = `function(scope){
  const { row } = scope
  return true
}`
      this.$set(this.dialogObj, 'displayFn', isUse ? defFnStr : '')
    },
    initDisabledFn(isUse) {
      const defFnStr = `function(scope){
  const { row } = scope
  return true
}`
      this.$set(this.dialogObj, 'disabledFn', isUse ? defFnStr : '')
    },
    initBeforeClickFn(isUse) {
      const defFnStr = `function(scope){
  const { row } = scope
  return true
}`
      this.$set(this.dialogObj, 'beforeClickFn', isUse ? defFnStr : '')
    },

    // 编辑控件选择事件
    widgetCodeChange() {
      if (this.widgetType === 'input-button') {
        const { value } = this.dialogObj
        this.dialogObj.params = `{tableIndex:scope.$index,columnValue:'${value}',${value}:row.${value}}`
      }
    }

  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/theme-default/utils/index.scss";
$padding: 20px;

.el-dialog__wrapper ::v-deep {
  .el-drawer__header {
    margin-bottom: $padding;
  }
  .el-drawer__body {
    padding-left: $padding / 2;
    padding-right: $padding;
    overflow-y: auto;
  }
}
.form-item-btm { margin-bottom: 5px;}
</style>
