/* 表单数据源配置
数据源类型为url时：设置创建、编辑、初始数据源，及相关参数字段。
数据源类型为事务流时：设置初始数据源，及相关参数字段。 */
<template>
  <div>
    <template v-if="activeData.dataSource.type == 'url'">
      <el-form-item label="创建数据源">
        <el-select
          v-model="activeData.createDataId"
          filterable
          clearable
          placeholder="请选择创建数据源"
          @change="setFormConf($event, 'create')"
        >
          <el-option
            v-for="(item, index) in formOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="编辑数据源">
        <el-select
          v-model="activeData.editDataId"
          filterable
          clearable
          placeholder="请选择编辑数据源"
          @change="setFormConf($event, 'edit')"
        >
          <el-option
            v-for="(item, index) in formOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </template>
    <el-form-item label="初始数据源">
      <el-select
        v-model="activeData.initDataId"
        filterable
        clearable
        placeholder="请选择初始数据源"
      >
        <el-option
          v-for="(item, index) in formOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <!-- 数据源参数字段 -->
    <div v-if="!isEmpty(activeData.initDataId)">
      <el-divider>初始数据源参数</el-divider>
      <el-row
        v-for="(item, index) in activeData.initDataOptions"
        :key="index"
        class="select-item"
      >
        <el-col :span="14" :title="item.value">
          {{ item.label }}（{{ item.value }}）
        </el-col>
        <el-col :span="10">
          <el-input
            v-model="item.inputVal"
            placeholder="请输入初始值"
            size="small"
            @input="$emit('setOptionValue', item, $event, 'inputVal', 'el-select')"
          />
        </el-col>
      </el-row>
    </div>
    <div
      v-if="activeData.dataSource.type === 'url' &&
        (!isEmpty(activeData.createDataId) || !isEmpty(activeData.editDataId))"
    >
      <el-divider>创建/编辑参数</el-divider>
      <el-row
        v-for="(item, key) in activeData.paramsOptions"
        :key="key"
        class="select-item"
      >
        <el-col :span="14" :title="item.value">
          {{ item.label }}（{{ item.value }}）
        </el-col>
        <el-col :span="10">
          <el-input
            v-model="item.inputVal"
            placeholder="请输入初始值"
            size="small"
            @input="handleParamsOptionsChange"
          />
        </el-col>
      </el-row>
    </div>
    <div
      v-if="(activeData.dataSource.type === 'flow' && !isEmpty(activeData.dataSource.flowId))
        || (activeData.dataSource.type === 'microservice' && !isEmpty(activeData.dataSource.microserviceId))"
    >
      <el-divider>提交参数</el-divider>
      <el-row
        v-for="(item, index) in activeData.paramsOptions"
        :key="index"
        class="select-item"
      >
        <el-col :span="14" :title="item.value">
          {{ item.label }}（{{ item.value }}）
        </el-col>
        <el-col :span="10">
          <el-input
            v-model="item.inputVal"
            placeholder="请输入初始值"
            size="small"
            @input="handleParamsOptionsChange"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { getFirstRow } from '@/components/generator/configOperator'
import { isEmpty, compareObject } from '@/utils/index'

import {
  getSqlOpts,
  getFormInitDataOptions,
  getDsOptionParams
} from '@/components/generator/autoGenerate/methods'
import {
  getFormParamsConf,
  addFormComponent
} from '@/components/generator/autoGenerate/methods-form'

export default {
  name: 'FormExtend',
  components: {},
  props: {
    activeData: {
      type: Object,
      default: () => ({})
    },
    formOptions: {
      type: Array,
      default: () => ([])
    }
  },
  watch: {
    /**
     * 修改初始数据源
     */
    'activeData.initDataId': {
      async handler(initDataId) {
        const initData = initDataId ? await getFormInitDataOptions(initDataId) : []
        // 设置初始请求参数
        this.$emit('setDatasourceParams', initData)
      }
    }
  },
  mounted() {},
  methods: {
    isEmpty,

    /**
     * 获取表单的所有字段
     * @param sourceId
     * @param operateType 'create' 创建数据源 | 'edit' 编辑数据源 | 'flow' 事务流
     */
    async setFormConf(sourceId, operateType) {
      const { activeData } = this
      if (!sourceId) {
        // NOTE: 由于创建和编辑要求组件相同。删除一个数据源时只清除配置，不修改表单组件的渲染。
        // TODO: 隐藏的表单组件不会被渲染。如果渲染为 hidden，这里需要重新考虑
        this.handleClearSourceId(operateType)
        if (!activeData.createDataId && !activeData.editDataId) {
          this.clearFormItems()
          return
        }
        return
      }

      const isBothId = !!(activeData.createDataId && activeData.editDataId)
      if (!isBothId) {
        // 清空表单中控件的选项配置
        this.$set(this.activeData.dataSource, 'optionParams', {
          initData: {
            ...this.activeData.dataSource.optionParams.initData // 保留 initData 数据
          }
        })
        // 清空已渲染的表单组件
        this.clearFormItems()
      }

      // 请求数据源配置信息
      const { search, filterMap } = await getSqlOpts(
        sourceId,
        activeData.dataSource.type
      )

      if (operateType !== 'flow' && operateType !== 'microservice') {
        // 对比创建和编辑的显示控件数据是否一致
        this.$set(this.activeData, `${operateType}Data`, search) // 用于compareVisible
        if (isBothId && !this.compareVisible()) return
      }

      // TODO: 改为getFormParamsConf(search, operateType)，返回paramsOptions、staticData、${type}Options
      // 表单默认数据相关配置
      this.addParamsOptions(search, operateType)
      // 保存表单控件默认数据配置 formContainerInitData，供运行时使用
      this.setStaticData()

      // 添加表单中的组件
      const newItemList = isBothId && operateType !== 'flow' && operateType !== 'microservice'
        ? this.getAppendItem(search, operateType)
        : search
      addFormComponent(newItemList, filterMap, activeData)

      // 设置创建/编辑参数
      const dataSourceOptionParams = getDsOptionParams(
        { tag: activeData.tag },
        { filterMap }
      ) || {}
      this.$set(
        this.activeData.dataSource,
        'optionParams',
        {
          ...dataSourceOptionParams,
          initData: {
            ...this.activeData.dataSource.optionParams.initData // 保留 initData 数据
          }
        }
      )
    },

    /**
     * 对比创建和编辑的显示控件数据是否一致
     */
    compareVisible() {
      const createVisible = this.activeData.createData.filter(
        item => item.widgettype !== 0
      )
      const editVisible = this.activeData.editData.filter(
        item => item.widgettype !== 0
      )
      if (!compareObject(createVisible, editVisible)) {
        this.$message({
          showClose: true,
          type: 'error',
          message: '创建和编辑的显示控件数据不一致，请重选！'
        })
        return false
      }
      return true
    },

    /**
     * 同时选择了创建和初始数据原时，过滤出需要新增的组件
     * 只需新增先选的那种没有的隐藏控件
     */
    getAppendItem(resData, type) {
      const createInvisible = this.activeData.createData.filter(
        item => item.widgettype === 0
      )
      const editInvisible = this.activeData.editData.filter(
        item => item.widgettype === 0
      )
      const newFields = [] // 新增字段
      let compareArr = []
      let curArr = []
      if (type === 'create') {
        curArr = createInvisible
        compareArr = editInvisible
      } else if (type === 'edit') {
        curArr = editInvisible
        compareArr = createInvisible
      }
      curArr.forEach(item => {
        const exist = compareArr.find(sub => sub.value === item.value)
        if (!exist) {
          newFields.push(item.value)
        }
      })
      return resData.filter(item => newFields.find(sub => sub === item.value))
    },

    /**
     * 根据 activeData.paramsOptions 中的 inputVal 字段，设置静态数据。
     * 在 js.js 中，staticData 被渲染为 formContainerInitData
     * inputVal 字段为用户输入的初始值信息
     */
    setStaticData() {
      const paramsObj = this.activeData.paramsOptions || {}
      const staticData = {}
      Object.keys(paramsObj).forEach(key => {
        staticData[key] = paramsObj[key].inputVal
      })
      this.$set(
        this.activeData.dataSource,
        'staticData',
        JSON.stringify(staticData)
      )
    },

    handleParamsOptionsChange() {
      this.setStaticData()
    },

    /**
     * 清空已渲染的表单组件
     */
    clearFormItems() {
      const { activeData } = this
      const formFirstRow = getFirstRow(activeData)
      if (formFirstRow) { formFirstRow.children = [] }
    },

    /**
     * 清除数据源相关配置
     * NOTE: 但不会修改表单控件的渲染
     * @param operateType 'create'|'edit'|'flow'
     */
    handleClearSourceId(operateType) {
      if (operateType === 'flow') {
        this.addParamsOptions([], 'flow')
        this.handleClearSourceId('create')
        this.handleClearSourceId('edit')
        return
      }
      this.activeData[`${operateType}DataId`] = null
      this.activeData[`${operateType}Data`] = []
      // 清除默认参数配置
      this.addParamsOptions([], operateType)
      // 重置默认数据
      this.setStaticData()
    },

    /**
     * 清除表单创建和编辑（包括事务流）配置和渲染
     */
    clearFormContainerSetting() {
      // 清除事务流配置的同时也会清除创建和编辑配置
      this.handleClearSourceId('flow')
      // 清空已渲染的表单组件
      this.clearFormItems()
    },

    /**
     * 添加表单控件默认数据
     * @param paramsArr
     * @param operateType 'create'|'edit'|'flow'
     */
    addParamsOptions(paramsArr = [], operateType) {
      // Array 转 Object
      const paramObj = {}
      paramsArr.forEach(item => {
        paramObj[item.value] = { ...item }
      })

      let newParamsObj
      if (operateType === 'flow' || operateType === 'microservice') {
        newParamsObj = paramObj
      } else {
        this.$set(this.activeData, `${operateType}Options`, paramObj) // 仅用于合并 newParamsObj 数据
        newParamsObj = {
          ...this.activeData.createOptions,
          ...this.activeData.editOptions
        }
        const oldParamsObj = this.activeData.paramsOptions || {}
        Object.keys(newParamsObj).forEach((key, val) => {
          const oldVal = oldParamsObj[key]
          if (!isEmpty(oldVal)) {
            newParamsObj[key] = oldVal
          }
        })
      }
      this.$set(this.activeData, 'paramsOptions', newParamsObj)
    }
  }
}
</script>
