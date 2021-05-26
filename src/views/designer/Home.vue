<template>
  <div class="container designer_wrapper">
    <div class="left-board">
      <div class="logo-wrapper">
        <div class="logo">
          低代码设计器演示
        </div>
      </div>
      <el-scrollbar class="left-scrollbar">
        <el-collapse v-model="activeNames" accordion class="with-padding">
          <el-collapse-item name="1">
            <template slot="title">
              <svg-icon icon-class="componentGroup" />
              <span class="header_name">组件库</span>
            </template>
            <div class="components-list">
              <div class="components-title">
                <svg-icon icon-class="component" /> 基础组件
              </div>
              <draggable
                class="components-draggable"
                :list="basicComponents"
                :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
                :clone="onDragClone"
                draggable=".components-item"
                :sort="false"
                @end="onDragEnd"
              >
                <div
                  v-for="(element, index) in basicComponents" :key="index" class="components-item"
                  @click="addComponent(element)"
                >
                  <div class="components-body">
                    <svg-icon :icon-class="element.tagIcon" />
                    {{ element.label }}
                  </div>
                </div>
              </draggable>
              <div class="components-title">
                <svg-icon icon-class="container" /> 布局型组件
              </div>
              <draggable
                class="components-draggable"
                :list="layoutComponents"
                :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
                :clone="onDragClone"
                draggable=".components-item"
                :sort="false"
                @end="onDragEnd"
              >
                <div
                  v-for="(element, index) in layoutComponents" :key="index" class="components-item"
                  @click="addComponent(element)"
                >
                  <div class="components-body">
                    <svg-icon :icon-class="element.tagIcon" />
                    {{ element.label }}
                  </div>
                </div>
              </draggable>
            </div>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template slot="title">
              <svg-icon icon-class="jsPanel" />
              <span class="header_name">动作面板</span>
            </template>
            <div class="components-item" @click="showEditor('页面js')">
              <div class="components-body">
                <svg-icon icon-class="pageJs" />
                页面js
              </div>
            </div>
            <div class="components-item">
              <div class="components-body">
                <svg-icon icon-class="projectJs" />
                项目js
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
    </div>

    <div class="center-board">
      <div class="action-bar">
        <el-button v-record:[{type:3}].button="'保存'" icon="el-icon-circle-check" type="text" :loading="isOnLoadingSave" @click="saveBtn">
          保存
        </el-button>
        <el-button icon="el-icon-video-play" type="text" @click="run">
          运行
        </el-button>
        <el-button icon="el-icon-download" type="text" @click="download">
          导出vue文件
        </el-button>
        <el-button icon="el-icon-document-copy" type="text" @click="copy">
          复制代码
        </el-button>
        <el-button class="delete-btn" icon="el-icon-delete" type="text" @click="empty">
          清空
        </el-button>
      </div>
      <el-scrollbar class="center-scrollbar">
        <div class="center-board-row clearfix">
          <el-form
            :size="formConf.size"
            :label-position="formConf.labelPosition"
            :disabled="formConf.disabled"
            :label-width="formConf.labelWidth + 'px'"
          >
            <draggable class="drawing-board" :list="drawingList" :animation="340" group="componentsGroup">
              <draggable-item
                v-for="(element, index) in drawingList"
                :key="element.renderKey"
                :drawing-list="drawingList"
                :element="element"
                :index="index"
                :active-id="activeId"
                :form-conf="formConf"
                @activeItem="setActiveItem"
                @copyItem="drawingItemCopy"
                @deleteItem="drawingItemDelete"
              />
            </draggable>
            <div v-show="!drawingList.length" class="empty-info">
              <!-- 从左侧拖入或点选组件进行表单设计 -->
            </div>
          </el-form>
        </div>
      </el-scrollbar>
    </div>

    <right-panel
      :active-data="activeData"
      :form-conf="formConf"
      :custom-js-list="customJsList"
      :inner-js-list="innerJsList"
      :show-field="!!drawingList.length"
      :tag-component-list="tagComponentList"
      @tag-change="tagChange"
      @addComponent="addComponent"
      @reset-component-list="getRelateByData"
    />

    <form-drawer
      :visible.sync="drawerVisible"
      :form-data="formData"
      size="100%"
      :generate-conf="generateConf"
    />

    <code-type-dialog
      :visible.sync="dialogVisible"
      :show-file-name="showFileName"
      @confirm="generate"
    />
    <p>{{ jsCode }}</p>
    <code-editor-dialog
      :title="codeEditorTitle"
      :visible.sync="codeEditorVisible"
      :code.sync="jsCode"
      language="javascript"
      direction="btt"
      :modal="false"
      :close-on-click-modal="false"
      append-to-body
    />


    <input id="copyNode" type="hidden">
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { saveAs } from 'file-saver'
import beautifier from 'js-beautify'
import FormDrawer from './FormDrawer'
import RightPanel from './RightPanel'
import {
  basicComponents, layoutComponents, formConf, containerList
} from '@/components/generator/config'
import {
  beautifierConf,
  titleCase,
  getFunction,
  deepMerge,
  isEmpty
} from '@/utils/index'
import {
  refreshStore,
  saveDrawingList,
  getFormConf, saveSqlIdList
} from '@/utils/db'
import common from '@/utils/tool'
import bindCopy from '@/utils/copy'
import {
  makeUpHtml, vueTemplate, vueScript, cssStyle
} from '@/components/generator/html'
import { makeUpJs, getBuildOpts } from '@/components/generator/js'
import { makeUpCss } from '@/components/generator/css'
import configOperator from '@/components/generator/configOperator'
import {
  getWidgetConf
} from '@/components/generator/config/utils'
import logo from '@/assets/logo.png'
import CodeTypeDialog from './CodeTypeDialog'
import CodeEditorDialog from './CodeEditorDialog'
import DraggableItem from './DraggableItem.vue'

// const emptyActiveData = { style: {}, autosize: {} }
let oldActiveId
let tempActiveData
// const drawingListInDB = getDrawingList() // 从缓存中获取
const formConfInDB = getFormConf()

export default {
  components: {
    draggable,
    FormDrawer,
    RightPanel,
    CodeTypeDialog,
    CodeEditorDialog,
    DraggableItem
  },
  data() {
    return {
      logo,
      formConf: {}, // 当前页面属性
      basicComponents,
      layoutComponents,
      labelWidth: 100,
      tagComponentList: [], // 页面全部tag控件构成的一维数组 便于作为主控件选择
      drawingList: [], // 页面全部控件信息
      activeId: '', // 当前选中的控件id
      activeData: {}, // 当前选中的控件数据
      drawingData: {},
      drawerVisible: false,
      formData: {}, // 页面全部数据
      dialogVisible: false,
      // generateConf: null,
      generateConf: { type: 'file' },
      showFileName: false,
      codeEditorVisible: false, // 代码编辑框的显示
      codeEditorTitle: '', // 代码编辑框的title
      jsCode: '', // 代码编辑框的内容
      customJsList: [], // 自定义js方法名
      innerJsList: [], // 内置js方法名
      // 按钮状态
      isOnLoadingSave: false,
      activeNames: [], // 折叠面板展开的项
      comManageList: [], // 组件管理列表
      showMoreBtnVisible: false, // 显示更多
      comManagePageIndex: 1, // 组件管理当前页
      comManageName: '' // 组件管理搜索框值
    }
  },
  computed: {},
  watch: {
    // eslint-disable-next-line func-names
    // 'activeData.label': function (val, oldVal) {
    //   if (
    //     this.activeData.placeholder === undefined
    //     || !this.activeData.tag
    //     || oldActiveId !== this.activeId
    //   ) {
    //     return
    //   }
    //   this.activeData.placeholder = this.activeData.placeholder.replace(oldVal, '') + val.replace(/\s*/g, '')
    // },
    activeId: {
      handler(val) {
        oldActiveId = val
      },
      immediate: true
    },
    jsCode: {
      handler(val) {
        this.formConf.pageJs = val
        this.customJsList = getFunction(val).funName
      },
      immediate: true
    },
    drawingList: {
      handler(val) {
        saveDrawingList(val)
        if (val.length === 0) {
          configOperator.resetAutoId()
        }
      },
      deep: true
    },
    activeNames(val, oldVal) {
      if (val === '5' && this.comManageList.length === 0) {
        this.getComManageList()
      }
    }
  },

  mounted() {
    // 重置数据
    this.drawingList = []
    this.formConf = formConf
    configOperator.resetAutoId()

    // 修改页面  从远程获取保存的数据
    this.getPartSource()
    // 请求数据源分类、字典等数据
    this.getDsData()
  },

  methods: {
    // 修改页面、组件管理中的组件  从远程获取保存的数据
    getPartSource(id) {
      const partVersionId = id || common.getUrlParam('partVersionId')
      if (!partVersionId) {
        return
      }
      this.$server.getPartSource({
        partVersionId
      }).then(res => {
        if (typeof res !== 'object') {
          res = undefined
        }
        if (id === undefined) { // 不使用已存组件
          this.setFormData(res)
        } else { // 组件管理则合并
          this.formData.fields = [...(this.formData.fields || []), ...res.fields]
          this.drawingList = this.formData.fields
          this.formData.pageJs += res.pageJs.trim()
          this.setJsActionSelectList()
          this.getRelateByData()
        }
      })
    },

    hackData(activeData) {
      // HACK: 修改或设置 _key 值
      if (activeData._key === 'exportBtn') {
        activeData._key === 'exportExcelBtn'
      }
      // HACK: 设计器中不允许操作特殊的子组件
      if (activeData._key === 'exportExcelBtn') {
        activeData._canCopy = false
        activeData._canDelt = true
      }
      if (activeData._key === 'topRow' || activeData._key === 'formItemRow') {
        activeData._canCopy = false
        activeData._canDelt = false
      }
      if (activeData.tag === 'el-table') {
        // HACK: 兼容表格选项旧数据
        this.hackTableData(activeData)
      }
      // HACK: 表单自定义参数配置在按钮上的情况
      if (activeData.layout === 'formContainer' && !activeData.dataSource.paramType) {
        // 保存并关闭按钮
        const saveAndCloseBtnIndex = 2
        const saveAndCloseBtn = activeData.children[saveAndCloseBtnIndex]
        if (saveAndCloseBtn) {
          const { customType, customParam, customParamJson } = saveAndCloseBtn
          if (customParam || customParamJson) {
            const fnBody = customType === 'json'
              ? `return ${customParamJson || customParam || '{}'}`
              : customParam
            activeData.dataSource.paramType = '$$_fn'
            activeData.dataSource.param_fnBody = fnBody
            activeData.children[saveAndCloseBtnIndex].$click = 'saveAndCloseForm'
            delete activeData.children[saveBtnIndex].customType
            delete activeData.children[saveBtnIndex].customParam
            delete activeData.children[saveBtnIndex].customParamJson
            if (activeData.dataSource.categoryId === '') {
              const btnDs = activeData.children[saveBtnIndex].dataSource
              activeData.dataSource.type = btnDs.type
              activeData.dataSource.categoryId = btnDs.categoryId
              delete activeData.children[saveBtnIndex].dataSource.categoryId
              if (activeData.dataSource.type === 'url') {
                activeData.createDataId = btnDs.listId
                activeData.editDataId = btnDs.listId
                delete activeData.children[saveBtnIndex].dataSource.listId
              } else {
                activeData.dataSource.flowId = btnDs.flowId
                activeData.dataSource.microserviceId = btnDs.microserviceId
                delete activeData.children[saveBtnIndex].dataSource.flowId
                delete activeData.children[saveBtnIndex].dataSource.microserviceId
              }
            }
          }
        }
        // 保存按钮
        const saveBtnIndex = 1
        const saveBtn = activeData.children[saveBtnIndex]
        if (saveBtn) {
          const { customType, customParam, customParamJson } = saveBtn
          if (customParam || customParamJson) {
            const fnBody = customType === 'json'
              ? `return ${customParamJson || customParam || '{}'}`
              : customParam
            activeData.dataSource.paramType = '$$_fn'
            activeData.dataSource.param_fnBody = fnBody
            activeData.children[saveBtnIndex].$click = 'saveForm'
            delete activeData.children[saveBtnIndex].customType
            delete activeData.children[saveBtnIndex].customParam
            delete activeData.children[saveBtnIndex].customParamJson
            if (activeData.dataSource.categoryId === '') {
              const btnDs = activeData.children[saveBtnIndex].dataSource
              activeData.dataSource.type = btnDs.type
              activeData.dataSource.categoryId = btnDs.categoryId
              delete activeData.children[saveBtnIndex].dataSource.categoryId
              if (activeData.dataSource.type === 'url') {
                activeData.createDataId = btnDs.listId
                activeData.editDataId = btnDs.listId
                delete activeData.children[saveBtnIndex].dataSource.listId
              } else {
                activeData.dataSource.flowId = btnDs.flowId
                activeData.dataSource.microserviceId = btnDs.microserviceId
                delete activeData.children[saveBtnIndex].dataSource.flowId
                delete activeData.children[saveBtnIndex].dataSource.microserviceId
              }
            }
          }
        }
      }
      // HACK: 数据源自定义参数字段修改
      if (activeData.layout === 'formContainer' || activeData.tag === 'el-button') {
        const { customType, customParam, customParamJson } = activeData.dataSource
        if (customParam || customParamJson) {
          const fnBody = customType === 'json'
            ? `return ${customParamJson || customParam || '{}'}`
            : customParam
          activeData.dataSource.paramType = '$$_fn'
          activeData.dataSource.param_fnBody = fnBody
          delete activeData.dataSource.customType
          delete activeData.dataSource.customParam
          delete activeData.dataSource.customParamJson
        }
      }

      // HACK: 按钮点击方法修改。规范按钮和方法的参数设置
      if (activeData.tag === 'el-button') {
        if (activeData.$click === 'executeServer') {
          activeData.$click = 'btn_executeServer'
        }
        if (activeData.$click === 'exportBtn') {
          activeData.$click = 'exportExcel'
        }
      }

      // HACK: 删除数据源历史遗留数据
      if (activeData.dataSource) {
        if (activeData.dataSource.categoryOption) { delete activeData.dataSource.categoryOption }
        if (activeData.dataSource.listOption) { delete activeData.dataSource.listOption }
        if (activeData.dataSource.flowCategoryOption) { delete activeData.dataSource.flowCategoryOption }
      }

      if (Array.isArray(activeData.children)) {
        activeData.children.forEach(cItem => {
          this.hackData(cItem)
        })
      }
    },
    /**
     * HACK:兼容表格旧数据
     */
    hackTableData(activeData) {
      if (activeData.resetBtn_allow === undefined) {
        activeData.resetBtn_allow = true
      }
      const tableSearchArr = activeData.searchData || []
      tableSearchArr.forEach((option, index) => {
        if (option.widgetCode === undefined || option.widgetCode === 'undefined') {
          option.widgetCode = option.widget_type ?? option.widgettype ?? ''
        }
      })

      const tableColArr = activeData.options || []
      tableColArr.forEach((option, index) => {
        if (option.invisible === undefined) {
          option.invisible = option.is_display === 0
          delete option.is_display
        }
        if (option.widgetCode === undefined || option.widgetCode === 'undefined') {
          // NOTE: 原配置页面中使用 option.editControl。
          // 但其实渲染时使用了 widget_type。editControl 只在 input-button 时使用，其他情况下值可能都是 none。
          let type = option.editControl
          let code = ''
          if (!type || type === 'none') {
            code = option.widget_type ?? option.widgettype ?? ''
          } else {
            // 转换不一致的 type
            if (type === 'text') {
              type = 'input'
            } else if (type === 'selectmultiple') {
              type = 'multipleSelect'
            } else if (type === 'input_button') {
              type = 'input-button'
            }
            const widgetConf = getWidgetConf(type, 'type') || {}
            code = widgetConf.code || ''
          }
          option.widgetCode = `${code}`
          delete option.editControl
          delete option.widget_type
          delete option.widgettype
        }
        if (option.editable === undefined) {
          option.editable = option.isEdit || !isEmpty(option.widgetCode)
          delete option.isEdit
        }
      })

      const tableTopBtn = activeData.topEdit ? activeData.topEdit.options || [] : []
      tableTopBtn.forEach((btn, index) => {
        if (!btn.style) {
          btn.style = {
            display: 'inline-block',
            width: 'auto'
          }
        } else if (btn?.style?.width === '150px') {
          btn.style.width = 'auto'
          btn.type = 'default'
        }
      })
    },

    // 为页面表单配置对象赋值
    setFormData(data) {
      this.formData = data || {}
      if (!data) { return }

      const { formData } = this
      const { fields = [] } = formData
      // 设置页面id
      configOperator.setAutoId(formData.idGlobal)
      console.log('初始化页面 formData', formData, ' id:', formData.idGlobal, configOperator.autoId)

      // HACK: 数据兼容
      fields.forEach((item, index) => {
        // HACK: 兼容组件缺少formId的情况
        fields[index] = configOperator.setComponentConf(item, {
          componentId: item.formId
        })
        this.hackData(fields[index])
      })

      this.drawingList = fields
      this.formConf = {
        formRef: formData.formRef,
        formModel: formData.formModel,
        size: formData.size,
        labelPosition: formData.labelPosition,
        labelWidth: formData.labelWidth,
        formRules: formData.formRules,
        gutter: formData.gutter,
        disabled: formData.disabled,
        span: formData.span,
        formBtns: formData.formBtns,
        pageJs: formData.pageJs,
        enterToTab: formData.enterToTab,
        hookFnType: formData.hookFnType,
        hookFn: formData.hookFn
      }
      const pageJs = (formData.pageJs || '').trim()
      this.jsCode = pageJs || '/*\n请编写页面相关的js代码(按ctrl+s保存)\n\nfunction example(arg){\n  console.log(\'example\', arg)\n}\n*/\n'
      this.setJsActionSelectList()
      this.getRelateByData()
    },
    // 请求组件管理数据
    getComManageList(type) {
      this.comManagePageIndex = type === 'search' ? 1 : this.comManagePageIndex
      this.$server.selectDataPage('1277805065568411649', this.comManagePageIndex, 10, { part_name: this.comManageName }).then(res => {
        this.comManageList = type === 'search' ? [...res.page.rows] : [...this.comManageList, ...res.page.rows]
        this.showMoreBtnVisible = false
        if (res.page.totalPage > res.page.currentPage) {
          this.showMoreBtnVisible = true
        }
      })
    },
    /**
     * 请求数据源分类、字典等数据，并更新到缓存
     */
    getDsData() {
      refreshStore('sqlCategory') // SQL分组
      refreshStore('flowCategory') // 事务流分组
      refreshStore('dictList') // 数据字典分组和字典
      refreshStore('pageList') // 系统内置页面页面和字典
    },
    showEditor(title) {
      this.codeEditorTitle = title
      this.codeEditorVisible = true
    },

    // 选中组件
    setActiveItem(element) {
      this.activeData = element
      this.activeId = element.formId
    },

    // 从左侧组件库拖拽组件
    onDragClone(conf) {
      tempActiveData = conf
    },
    onDragEnd(event) {
      if (event.from !== event.to) {
        this.addComponent(tempActiveData, {
          parentId: event.to.getAttribute('data-id')
        })
      }
    },

    // 添加组件  或者作为子组件引入  addTime为时间戳累加 确保唯一不重复
    addComponent(item, {
      targetList,
      parentId, // 需要添加到的父级组件componentId(即父级组件formId)
      componentId, // 提供唯一值(即formId)。可选，默认自动生成。
      isForceId = true, // 已存在vModel或componentName时，是否强制刷新。
      needSetActive = true
    } = {}, param) {
      if (!targetList) {
        targetList = this.drawingList
      }
      const clone = JSON.parse(JSON.stringify(item))
      const newConf = configOperator.addComponent(targetList, clone, {
        formConf: this.formConf, // 提供 span 和 gutter 配置
        parentId,
        componentId,
        isForceId
      })
      if (needSetActive) {
        this.setActiveItem(newConf)
      }
      this.getRelateByData([newConf], true)
      this.setJsActionSelectList()
      return newConf
    },

    // 存储当前的tag组件作为数据关联的一维数组
    saveTagAsList(clone) {
      if (clone.tag && clone.relate) {
        this.tagComponentList.push({
          id: clone.vModel,
          label: `${clone.label}（${clone.vModel}）`,
          target: clone
        })
      }
    },

    // 遍历数据收集联动控件
    getRelateByData(data = this.drawingList, isNotFirst) {
      if (!isNotFirst) {
        this.tagComponentList = [] // 先清空 再填充
      }
      data.forEach(item => {
        this.saveTagAsList(item)
        if (item.children) {
          this.getRelateByData(item.children, true)
        }
      })
    },

    // 执行复制一个组件、控件
    drawingItemCopy(item, targetList) {
      this.addComponent(item, {
        targetList,
        isForceId: true // WARN: 强制更新复制组件中的所有id。因此复制表单容器会导致id错误。
      })
    },

    // 删除绘制项  同时从初始请求下拉数据参数数组中删除对应的项
    drawingItemDelete(index, parent) {
      const current = parent.splice(index, 1)
      // 如果是容器则需要递归遍历current的children来删除tagComponentList数组
      this.deleteChildList(current[0])

      this.$nextTick(() => {
        // 同步formContainer中的下拉请求
        this.drawingList.forEach(item => {
          if (item.layout === 'formContainer' && item.dataSource.optionParams[current[0].vModel]) {
            delete item.dataSource.optionParams[current[0].vModel]
          }
        })
        // 显示最后一项
        const len = this.drawingList.length
        if (len) {
          this.setActiveItem(this.drawingList[len - 1])
        }
      })
    },
    // 递归查找 删除容器下面所有子级在tagComponentList数组中的项
    deleteChildList(current) {
      if (!current) {
        console.error('deleteChildList no current')
        return
      }
      const idx = this.tagComponentList.findIndex(item => item.id === current.vModel)
      if (current.tag && idx > -1) {
        const curTagArr = this.tagComponentList.splice(idx, 1)
        if (!curTagArr[0].target.relate) { return }
        const activeObj = this.tagComponentList.find(item => item.id === curTagArr[0].target.relate.activeId)
        if (activeObj) {
          const activeIdx = activeObj.target.relate.passiveOptions.findIndex(item => item === curTagArr[0].target.vModel)
          if (activeIdx > -1) {
            activeObj.target.relate.passiveOptions.splice(activeIdx, 1)
          }
        }
      }
      if (!current.tag) { // 容器
        current.children.forEach(item => this.deleteChildList(item))
      }
    },

    // 切换标签
    tagChange(tagIcon) {
      const { activeData } = this
      const defaultConf = basicComponents.find(item => item.tagIcon === tagIcon)
      const newConf = {}
      Object.keys(defaultConf).forEach(key => {
        if (
          ['tag', 'tagIcon', 'document'].indexOf(key) < 0
          && activeData[key] !== undefined
          && typeof activeData[key] === typeof defaultConf[key]) {
          newConf[key] = deepMerge({}, activeData[key])
        } else {
          newConf[key] = deepMerge({}, defaultConf[key])
        }
      })
      const keyArr = ['formId', 'vModel', 'componentName']
      keyArr.forEach(key => {
        if (activeData[key] !== undefined) {
          newConf[key] = activeData[key]
        }
      })
      this.updateDrawingList(newConf, this.drawingList)
      this.setActiveItem(newConf)
      this.setJsActionSelectList()
    },

    // 更新绘制列表
    updateDrawingList(newTag, list) {
      const index = list.findIndex(item => item.formId === this.activeId)
      if (index > -1) {
        list.splice(index, 1, newTag)
      } else {
        list.forEach(item => {
          if (Array.isArray(item.children)) {
            this.updateDrawingList(newTag, item.children)
          }
        })
      }
    },

    // 合并对象
    AssembleFormData() {
      const conf = configOperator.assembleConf({
        confTree: this.drawingList,
        formConf: this.formConf
      })
      this.formData = {
        ...conf,
        ...this.formConf
      }
    },
    generate(data) {
      const func = this[`exec${titleCase(this.operationType)}`]
      this.generateConf = data
      func && func(data)
    },
    // 运行 进入预览
    execRun(data) {
      this.AssembleFormData()

      this.drawerVisible = true
    },
    execDownload(data) {
      const codeStr = this.generateCode()
      const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, data.fileName)
    },
    execCopy(data) {
      bindCopy('#copyNode', () => {
        const codeStr = this.generateCode()
        this.$notify({
          title: '成功',
          message: '代码已复制到剪切板，可粘贴。',
          type: 'success'
        })
        return codeStr
      }, e => {
        this.$message({
          showClose: true,
          type: 'error',
          message: '代码复制失败'
        })
      })
    },
    empty() {
      this.$confirm('确定要清空所有组件吗？', '提示', { type: 'warning' }).then(
        () => {
          this.drawingList = []
          this.tagComponentList = []
          configOperator.resetAutoId()
        }
      )
    },

    // 获取整个配置页面的js方法
    setJsActionSelectList() {
      const { type } = this.generateConf
      this.AssembleFormData()
      const { methodsList } = getBuildOpts(this.formData, type, 'preview')
      try {
        this.innerJsList = Object.keys(eval(`({${methodsList.join('')}})`))
      } catch (err) {
        console.warn('获取页面默认js方法失败', err)
      }
    },

    // 拼凑代码 便于复制和下载vue代码
    generateCode() {
      const { type } = this.generateConf
      this.AssembleFormData()
      const script = vueScript(makeUpJs(this.formData, type, 'prod'))
      const html = vueTemplate(makeUpHtml(this.formData, type, 'prod'))
      const css = cssStyle(makeUpCss(this.formData, type, 'prod'))
      return beautifier.html(html + script + css, beautifierConf.html)
    },
    // 下载
    download() {
      this.dialogVisible = true
      this.showFileName = true
      this.operationType = 'download'
    },
    // 向工作流父组件传递页面的提交数据
    getDataForWorkflow() {
      this.AssembleFormData()
      return new Promise(resolve => {
        resolve({
          // partVersionId: common.getUrlParam('partVersionId'),
          partSource: JSON.stringify(this.formData)
          // partHtml: this.generateCode()
        })
      })
    },
    // 从工作流父组件获取数据
    setDataForWorkflow(data) {
      this.setFormData(data)
    },
    // 保存 提交当前配置数据
    saveBtn() {
      this.AssembleFormData()
      this.isOnLoadingSave = true
      this.$server.savePartSource({
        partVersionId: common.getUrlParam('partVersionId'),
        partSource: JSON.stringify(this.formData),
        partHtml: this.generateCode()
      }).then(res => {
        // this.$message({
        //   showClose: true,
        //   message: res,
        //   type: 'success'
        // })
      }).finally(() => {
        this.isOnLoadingSave = false
      })
    },
    // 点击运行按钮 弹窗
    run() {
      this.dialogVisible = true
      this.showFileName = false
      this.operationType = 'run'
    },
    // 点击复制按钮
    copy() {
      this.dialogVisible = true
      this.showFileName = false
      this.operationType = 'copy'
    }
  }
}
</script>

<style lang='scss'>
@import '@/styles/pages/designer';
</style>
