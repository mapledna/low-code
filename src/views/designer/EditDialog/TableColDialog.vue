<template>
  <el-drawer
    v-bind="$attrs"
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
      <el-form-item label="隐藏">
        <el-switch v-model="editDialogObj.option.invisible" />
      </el-form-item>
      <el-form-item label="列宽度">
        <el-input-number
          v-model="editDialogObj.option.width"
          controls-position="right"
          :min="0"
          placeholder="请输入宽度(px)"
        />
      </el-form-item>
      <el-form-item label="对齐方式">
        <el-radio-group
          v-model="editDialogObj.option.align"
          size="medium"
        >
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
        <el-radio-group
          v-model="editDialogObj.option.fixed"
          size="medium"
        >
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
        <el-switch v-model="editDialogObj.option.sortable" />
      </el-form-item>
      <el-form-item>
        <UiFormItemTips
          slot="label"
          content="【参数】<br>cellData 单元格数据。<br>formatStr 匹配字典后的单元格文本。<br>scope 可获取到 row, column, $index 和 store。<br>【返回】单元格展示内容。<br>【示例】function(cellData, formatStr, scope){ return formatStr }"
        >
          内容格式化
        </UiFormItemTips>
        <el-switch
          v-model="isUseFormatColFn"
          @change="initFormatColFn($event)"
        />
        <br>
        <el-input
          v-if="isUseFormatColFn"
          v-model="editDialogObj.option.formatColFn"
          type="textarea"
          rows="6"
          placeholder="请输入表格单元格内容格式化方法"
        />
      </el-form-item>
      <el-form-item label="编辑">
        <el-switch v-model="editDialogObj.option.editable" />
      </el-form-item>
      <template v-if="editDialogObj.option.editable">
        <el-form-item label="控件类型">
          <el-select
            v-model="editDialogObj.option.widgetCode"
            placeholder="请选择"
            @change="widgetCodeChange"
          >
            <el-option
              label="请选择编辑控件类型"
              value=""
            />
            <el-option
              v-for="item in widgetConfArr"
              :key="item.code"
              :label="item.label"
              :value="item.code"
            />
          </el-select>comboTree
        </el-form-item>
        <template v-if="widgetType === 'select' || widgetType === 'multipleSelect' || widgetType === 'comboTree'">
          <!-- TODO: 配置选项数据。目前数据通过表格数据源获取。存放在 item.formatterDs.data 中 -->
          <el-form-item label="数据源类型">
            <el-select
              v-model="editDialogObj.option.formatterDs.dsType"
              placeholder="请选择"
            >
              <el-option
                label="数据字典"
                value="dict"
              />
              <el-option
                label="数据服务"
                value="service"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="editDialogObj.option.formatterDs.dsType==='dict'"
            label="数据字典"
          >
            <combo-tree
              v-model="editDialogObj.option.formatterDs.dictId"
              :data="dictOption"
              width="200px"
              @node-click="handlesourceIdChange"
            />
          </el-form-item>
          <template v-else-if="editDialogObj.option.formatterDs.dsType==='service'">
            <el-form-item label="SQL分组">
              <combo-tree
                v-model="editDialogObj.option.formatterDs.sqlCategoryId"
                :data="categoryOption"
                width="200px"
                @node-click="handlesourceIdChange"
              />
            </el-form-item>
            <el-form-item label="SQL">
              <el-select
                v-model="editDialogObj.option.formatterDs.sqlId"
                placeholder="请选择"
                @change="handleserviceIdChange"
              >
                <el-option
                  v-for="(item, index) in listOption"
                  :key="index"
                  :label="item.sql_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
        </template>
      </template>
    </el-form>

    <!-- 表格顶部按钮、操作列按钮 -->
    <!-- TODO: v-if="['topEdit','rowEdit'].indexOf(editDialogObj.type) >= 0 || widgetType === 'input-button'" -->
    <el-form
      v-if="widgetType === 'input-button'"
      ref="elForm"
      size="small"
      label-width="110px"
    >
      <el-form-item
        v-if="editDialogObj.option.tag==='el-button'||editDialogObj.option.tag==='el-link'"
        label="类型"
      >
        <el-select
          v-model="editDialogObj.option.type"
          placeholder="请选择类型"
          :style="{ width: '100%' }"
        >
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
      <el-form-item
        v-if="editDialogObj.option['prefix-icon']!==undefined"
        label="前图标"
      >
        <el-input
          v-model="editDialogObj.option['prefix-icon']"
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
      <el-form-item
        v-if="editDialogObj.option['suffix-icon'] !== undefined"
        label="后图标"
      >
        <el-input
          v-model="editDialogObj.option['suffix-icon']"
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
      <el-form-item label="操作">
        <el-select v-model="editDialogObj.option.action">
          <el-option
            label="请选择按钮操作"
            value=""
          />
          <el-option
            label="打开页面"
            value="openPage"
          />
          <el-option
            label="关联数据源"
            value="dataSource"
          />
          <el-option
            label="关联事务流"
            value="flow"
          />
          <el-option
            label="关联微服务"
            value="microservice"
          />
          <el-option
            label="自定义函数"
            value="methods"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        v-show="editDialogObj.option.action=='methods'"
        label="点击事件"
      >
        <el-select
          v-model="editDialogObj.option.$click"
          filterable
          clearable
          placeholder="请选择事件"
          :style="{ width: '100%' }"
        >
          <el-option-group
            v-if="customJsList.length > 0"
            label="自定义事件"
          >
            <el-option
              v-for="(item,index) in customJsList"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-option-group>
          <el-option-group
            v-if="innerJsList.length > 0"
            label="内置事件"
          >
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
        v-show="editDialogObj.option.action=='dataSource'||editDialogObj.option.action=='flow'||editDialogObj.option.action=='microservice'"
        label="数据源"
      >
        <div v-show="editDialogObj.option.action=='dataSource'||editDialogObj.option.action=='microservice'">
          <el-form-item
            label="数据分类"
            label-width="70px"
            class="form-item-btm"
          >
            <combo-tree
              v-model="editDialogObj.option.categoryId"
              :data="categoryOption"
              :width="'150px'"
              @node-click="handleCategoryIdChange"
            />
          </el-form-item>
          <el-form-item
            v-show="editDialogObj.option.action=='dataSource'"
            label="SQL"
            label-width="70px"
          >
            <el-select
              v-model="editDialogObj.option.listId"
              filterable
              placeholder="请选择SQL"
              :style="{width:'150px'}"
              size="small"
              @change="handleListIdChange"
            >
              <el-option
                v-for="(item, index) in listOption"
                :key="index"
                :label="item.sql_name"
                :value="item.id_code"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-show="editDialogObj.option.action=='microservice'"
            label="微服务"
            label-width="70px"
          >
            <el-select
              v-model="editDialogObj.option.microserviceId"
              filterable
              placeholder="请选择微服务"
              :style="{width:'150px'}"
              size="small"
              @change="handleMicroIdChange"
            >
              <el-option
                v-for="(item, index) in microOption"
                :key="index"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item
          v-show="editDialogObj.option.action=='flow'"
          label="事务流"
          label-width="70px"
        >
          <combo-tree
            v-model="editDialogObj.option.flowId"
            value-key="id_code"
            :data="flowCategoryOption"
            :width="'150px'"
            @node-click="handleFlowIdChange"
          />
        </el-form-item>
      </el-form-item>
      <template v-if="editDialogObj.option.action === 'openPage'">
        <el-form-item label="链接地址">
          <el-radio-group
            v-model="editDialogObj.option.actionType"
            size="medium"
            class="form-item-btm"
          >
            <el-radio-button label="pageId">
              选择页面
            </el-radio-button>
            <el-radio-button label="customUrl">
              自定义链接
            </el-radio-button>
          </el-radio-group>
          <combo-tree
            v-show="editDialogObj.option.actionType === 'pageId'"
            v-model="editDialogObj.option.pageId"
            value-key="id_code"
            :data="systemUrlTree"
            :width="'245px'"
            @node-click="handleCategoryIdChange"
          />
          <el-input
            v-show="editDialogObj.option.actionType === 'customUrl'"
            v-model="editDialogObj.option.customUrl"
            placeholder="如:https://cloud.nti56.com"
            size="small"
          />
        </el-form-item>
        <el-form-item label="打开方式">
          <el-radio-group
            v-model="editDialogObj.option.openPageType"
            size="medium"
          >
            <el-radio-button label="dialog">
              弹窗
            </el-radio-button>
            <el-radio-button label="new">
              新页面
            </el-radio-button>
            <el-radio-button label="self">
              当前
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="editDialogObj.option.openPageType === 'dialog'"
          label="弹窗宽度"
        >
          <el-radio-group
            v-model="editDialogObj.option.dialogWidth"
            size="medium"
          >
            <el-radio-button label="100%">
              100%
            </el-radio-button>
            <el-radio-button label="80%">
              80%
            </el-radio-button>
            <el-radio-button label="50%">
              50%
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </template>

      <el-form-item>
        <UiFormItemTips
          slot="label"
          content="【参数】支持 page、row、scope、formData。操作多条时也支持 rows。<br>【注意】不支持使用 this，否则发布后执行失败。<br>【示例】{id: row.id}"
        >
          参数对象
        </UiFormItemTips>
        <el-input
          v-model="editDialogObj.option.params"
          type="textarea"
          rows="5"
          placeholder="请输入参数对象。"
        />
      </el-form-item>
    </el-form>

    <icon-picker-dialog
      :visible.sync="iconsVisible"
      :current="editDialogObj.option[currentIconModel]"
      @chooseMdiIcon="selectIcon"
    />
  </el-drawer>
</template>

<script>
import ComboTree from '@/components/ComboTree/index'
import IconPickerDialog from '@/components/IconPickerDialog/Index'
import {
  getFromStore
} from '@/utils/db'
import {
  widgetConfArr,
  getWidgetConf
} from '@/components/generator/config/utils'

export default {
  components: {
    ComboTree,
    IconPickerDialog
  },
  inheritAttrs: false,
  props: ['editDialogObj', 'customJsList', 'innerJsList', 'activeData', 'editType'],
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
      const {
        editDialogObj
      } = this
      if (!editDialogObj.option || !editDialogObj.option.editable) {
        return ''
      }
      const code = editDialogObj.option.widgetCode
      console.log('computed widgetType', widgetConf, code)
      const widgetConf = getWidgetConf(code)
      return widgetConf ? widgetConf.type : ''
    }
  },
  watch: {
    editDialogObj: {
      handler(val, oldVal) {
        if (val.option.action === 'openPage' && val.option.$click !== 'handleOpenPage') { // 打开页面
          val.option.$click = 'handleOpenPage'
        } else if (val.option.action === 'dataSource' || val.option.action === 'flow' || val.option
          .action === 'microservice') {
          val.option.$click = 'doApiAction'
        } else if (val.option.action === 'methods' && ['handleOpenPage', 'doApiAction',
          'doDeleteAct'
        ].indexOf(val.option.$click) >= 0) {
          val.option.$click = ''
        }

        if (val.option && val.option.categoryId) {
          if (val.option.action === 'dataSource') { // HACK: 旧数据中,事务流 flowId 被设置为 categoryId
            this.handleCategoryIdChange(undefined, val.option.categoryId)
          }
        }

        this.$emit('update:editDialogObj', val)
      },
      deep: true
    }
  },
  mounted() { },
  methods: {
    onOpen() {
      // 数据源、页面选项
      this.categoryOption = getFromStore('sqlCategory')
      this.flowCategoryOption = getFromStore('flowCategory')
      this.dictOption = getFromStore('dictList')
      this.systemUrlTree = getFromStore('pageList')

      const {
        editDialogObj
      } = this
      const {
        option
      } = editDialogObj || {}
      this.isValidate = true
      // 表格自定义列格式化方法
      const formatColFn = option && option.formatColFn && option.formatColFn.trim()
      this.isUseFormatColFn = !!formatColFn
      this.$set(this.editDialogObj.option, 'formatColFn', formatColFn || '')
      // 按钮自定义显示隐藏
      const displayFn = option && option.displayFn && option.displayFn.trim()
      this.isDisplay = !!displayFn
      this.$set(this.editDialogObj.option, 'displayFn', displayFn || '')
      // 按钮自定义者禁用
      const disabledFn = option && option.disabledFn && option.disabledFn.trim()
      this.isDisabled = !!disabledFn
      this.$set(this.editDialogObj.option, 'disabledFn', disabledFn || '')
      // 按钮点击前事件
      const beforeClickFn = option && option.beforeClickFn && option.beforeClickFn.trim()
      this.isBeforeClick = !!beforeClickFn
      this.$set(this.editDialogObj.option, 'beforeClickFn', beforeClickFn || '')
      // 表格按钮数据源
      const id = this.editDialogObj.option.formatterDs.dictId
      console.log('this.dictOption=====', this.dictOption, this.editDialogObj.option.formatter)
      console.log('find', id, this.dictOption.find(item => item.id === id), this.dictOption.find(
        item => item.label === '条件'
      ))
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
      this.editDialogObj.option[this.currentIconModel] = val
    },
    // 弹窗从图标库中点击选择图标
    selectIcon(iconName) {
      // console.log('iconname', iconName)
      this.editDialogObj.option[this.currentIconModel] = iconName
      this.iconsVisible = false
    },

    // 选择数据源数据分类
    handleCategoryIdChange(data, id) {
      if (this.editDialogObj.option.action === 'dataSource') {
        this.$server.executeSqls(5, {
          category_id: id
        })
          .then(res => {
            this.listOption = res
          })
      } else if (this.editDialogObj.option.action === 'microservice') {
        this.$server.listMicroByCategoryId({
          categoryId: id
        })
          .then(res => {
            this.microOption = res
          })
      }
    },
    // 选择数据源SQL
    handleListIdChange(val) {
      this.$server.executeSqls(6, {
        sqlId: val
      })
        .then(res => {
          this.editDialogObj.option.params = `{ ${res.map(item => `${item.value}: row.${item.value}`).join(', ')} }`
        })
    },
    // 选择微服务
    handleMicroIdChange(val) {
      this.$server.listMicroParamByMicroId({
        microId: val
      })
        .then(res => {
          this.editDialogObj.option.params = `{ ${res.search.map(item => `${item.value}: row.${item.value}`).join(', ')} }`
        })
    },
    // 选择事务流
    handleFlowIdChange(data, id) {
      this.$server.executeSqls('1269170765151240193', {
        transflow_id: id
      })
        .then(res => {
          this.editDialogObj.option.params = `{ ${res.map(item => `${item.value}: row.${item.value}`).join(', ')} }`
        })
    },
    // 选择数据字典和数据服务
    handlesourceIdChange(node, id) {
      if (this.editDialogObj.option.dataType === 'dict') {
        this.editDialogObj.option.serviceId = `GetDictionary('${id}')`
      } else if (this.editDialogObj.option.dataType === 'service') {
        this.handleCategoryIdChange(node)
      }
    },
    // 选择数据服务id
    handleserviceIdChange(id) {
      this.editDialogObj.option.serviceId = `GetData('${id},'label')`
    },

    initFormatColFn(isUse) {
      const defFnStr = `function(cellData, formatStr, scope){
  return formatStr === undefined || formatStr === null ? '' : formatStr
}`
      this.$set(this.editDialogObj.option, 'formatColFn', isUse ? defFnStr : '')
    },
    initDisplayFn(isUse) {
      const defFnStr = `function(scope){
  const { row } = scope
  return true
}`
      this.$set(this.editDialogObj.option, 'displayFn', isUse ? defFnStr : '')
    },
    initDisabledFn(isUse) {
      const defFnStr = `function(scope){
  const { row } = scope
  return true
}`
      this.$set(this.editDialogObj.option, 'disabledFn', isUse ? defFnStr : '')
    },
    initBeforeClickFn(isUse) {
      const defFnStr = `function(scope){
  const { row } = scope
  return true
}`
      this.$set(this.editDialogObj.option, 'beforeClickFn', isUse ? defFnStr : '')
    },

    // 编辑控件选择事件
    widgetCodeChange() {
      if (this.widgetType === 'input-button') {
        const {
          value
        } = this.editDialogObj.option
        this.editDialogObj.option.params = `{tableIndex:scope.$index,columnValue:'${value}',${value}:row.${value}}`
      }
    }

  }
}
</script>

<style lang="scss">
@import "./style";
</style>
