/* 数据源配置 */
<template>
  <div v-if="activeData.dataSource">
    <el-form-item label="类型">
      <el-select
        v-model="activeData.dataSource.type"
        size="medium"
        placeholder="请选择类型"
        @change="handleTypeChange"
      >
        <el-option
          v-for="item in dsTypeArr"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
    </el-form-item>

    <!-- 动态数据配置：SQL、事务流 -->
    <template v-if="activeData.dataType === 'dynamic'">
      <!-- 目前就导出按钮需要修改请求源。 -->
      <el-form-item v-if="activeData.dataSource.origin !== undefined" label="请求源">
        <el-input v-model="activeData.dataSource.origin" placeholder="eg. http://10.20.30.40:5060" />
      </el-form-item>

      <el-form-item v-if="activeData.dataSource.type !== 'dict'" label="数据分类">
        <el-col :span="22">
          <combo-tree
            v-model="activeData.dataSource.categoryId"
            :data="categoryOptions"
            :width="'187px'"
            @node-click="handleCategoryChange"
          />
        </el-col>
        <el-col :span="2">
          <el-link :underline="false" @click="handleRefreshOptions">
            <i class="el-icon-refresh" />
          </el-link>
        </el-col>
      </el-form-item>

      <!-- SQL配置（表单以外的组件） -->
      <el-form-item v-if="activeData.dataSource.type === 'url' && !isFormContainer" label="SQL">
        <el-select
          v-model="activeData.dataSource.listId"
          filterable
          clearable
          placeholder="请选择SQL"
          @change="handleChangeDsId"
        >
          <el-option
            v-for="(item, index) in listOptionsMap[
              activeData.dataSource.categoryId
            ] || []"
            :key="index"
            :label="item.sql_name"
            :value="item.id_code"
          />
        </el-select>
      </el-form-item>

      <!-- 事务流配置 -->
      <el-form-item v-if="activeData.dataSource.type === 'flow'" label="事务流">
        <el-select
          v-model="activeData.dataSource.flowId"
          filterable
          clearable
          placeholder="请选择事务流"
          @change="handleChangeDsId"
        >
          <el-option
            v-for="(item, index) in flowOptionsMap[
              activeData.dataSource.categoryId
            ] || []"
            :key="index"
            :label="item.servicename"
            :value="item.id_code"
          />
        </el-select>
      </el-form-item>

      <!-- 微服务配置 -->
      <el-form-item v-if="activeData.dataSource.type === 'microservice'" label="微服务">
        <el-select
          v-model="activeData.dataSource.microserviceId"
          filterable
          clearable
          placeholder="请选择微服务"
          @change="handleChangeDsId"
        >
          <!-- WARN: HACK: 临时兼容湖北WMS团队需求：微服务列表不根据数据分类过滤 -->
          <!-- v-for="(item, index) in microserviceOptionsMap[activeData.dataSource.categoryId] || []" -->
          <el-option
            v-for="(item, index) in microserviceOptionsMap['-1'] || []"
            :key="index"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <!-- 数据字典配置 -->
      <el-form-item v-if="activeData.dataSource.type === 'dict'" label="数据字典">
        <combo-tree
          v-model="activeData.dataSource.dictId"
          :data="dictOption"
          @node-click="handleChangeDsId"
        />
      </el-form-item>

      <!-- 表单数据源or事务流配置：选择初始/创建/编辑数据源 -->
      <FormExtend
        v-if="isFormContainer"
        ref="FormExtend"
        :active-data="activeData"
        :form-options="formOptions"
        @setOptionValue="setOptionValue"
        @setDatasourceParams="setCommonDsParams"
      />

      <!-- 数据源参数 initDataOptions -->
      <div v-if="isShowParamList">
        <el-divider>数据源参数</el-divider>
        <el-row
          v-for="(item, index) in activeData.initDataOptions"
          :key="index"
          class="select-item"
        >
          <el-col :span="14" :title="item.value">
            {{ item.label }} ({{ item.value }})
          </el-col>
          <el-col :span="10">
            <el-input
              placeholder="请输入初始值"
              size="small"
              :value="item.inputVal"
              @input="setOptionValue(item, $event, 'inputVal', 'el-select')"
            />
          </el-col>
        </el-row>
      </div>
      <!-- 自定义参数 -->
      <!-- :json.sync="activeData.dataSource.param_json" -->
      <CustomParam
        v-if="isShowParamList || activeData.dataSource.type === 'microservice'"
        :type.sync="activeData.dataSource.paramType"
        :fn-body.sync="activeData.dataSource.param_fnBody"
        style="margin-top: 15px;"
      />
      <CallBack
        :resove-fn.sync="activeData.dataSource.resoveFn"
        :is-resove-fn.sync="activeData.dataSource.isResoveFn"
      />
    </template>

    <!-- 静态数据配置：data -->
    <div v-if="activeData.dataType === 'static'">
      <el-form-item label="静态数据">
        <!-- NOTE: activeData.dataSource.staticData 影响静态数据和表单初始数据 -->
        <el-input
          v-model="activeData.dataSource.staticData"
          type="textarea"
          rows="6"
          placeholder="请输入 JSON 或 Array 数据。eg. [{label: 'A', value:'a'}]"
          @change="handlerChangeStatic"
        />
      </el-form-item>
      <!-- 可视化编辑静态数据 -->
      <!-- <EditJsonData /> -->
    </div>

    <!-- 数据条件 -->
    <div v-if="isOptionTag || isTreeTag || ['el-cascader'].indexOf(activeData.tag) > -1">
      <el-divider>数据条件</el-divider>
      <el-form-item label="标签键名">
        <el-input
          v-model="activeData.labelKey"
          placeholder="label"
        />
      </el-form-item>
      <el-form-item label="值键名">
        <el-input v-model="activeData.valueKey" placeholder="value" />
      </el-form-item>
      <!-- 自定义树结构键名 -->
      <template v-if="isTreeTag">
        <el-form-item label="父ID键名">
          <el-input
            v-model="activeData.parentKey"
            placeholder="pid"
          />
        </el-form-item>
        <el-form-item label="结点ID键名">
          <el-input
            v-model="activeData.nodeKey"
            placeholder="id"
          />
        </el-form-item>
        <el-form-item label="子列表键名">
          <el-input
            v-model="activeData.childrenKey"
            placeholder="children"
          />
        </el-form-item>
      </template>
    </div>
  </div>
</template>

<script>
import ComboTree from '@/components/ComboTree/index'
import TreeNodeDialog from '@/views/designer/TreeNodeDialog'
import FormExtend from './FormExtend' // 表单数据源组件
import EditJsonData from './EditJsonData' // 可视化编辑静态数据
import CustomParam from './CustomParam'
import CallBack from './CallBack'

import {
  getSqlOpts,
  getDsOptionParams,
  getKeyConditionFromResult,
  getExampleData,
  getInitDsParams,
  getInitParams
} from '@/components/generator/autoGenerate/methods'
import { optionComponentList } from '@/components/generator/config'
import { isEmpty, isNumberStr } from '@/utils/index'
import { getFromStore } from '@/utils/db'

// 静态数据源 static
// data: {
//   // id: 'microserviceId',
//   // changeFn: 'handleFlowChange'
// }

// 动态数据源 dynamic
const DS_CONF_MAP = {
  url: {
    label: 'SQL',
    id: 'listId',
    changeFn: 'handleDatasourceChange'
  },
  flow: {
    label: '事务流',
    id: 'flowId',
    changeFn: 'handleFlowChange'
  },
  microservice: {
    label: '微服务',
    id: 'microserviceId',
    changeFn: 'handleMicroChange'
  },
  dict: {
    label: '数据字典',
    id: 'dictId',
    changeFn: 'handleDictChange'
  },
  data: {
    label: '静态数据'
  }
}

const DS_TYPE_ARR = Object.keys(DS_CONF_MAP).concat(['data'])

// TODO: 删除 options 配置。用 dataSource.staticData 代替。
export default {
  name: 'BaseDatasource',
  components: {
    ComboTree,
    TreeNodeDialog,
    FormExtend,
    CustomParam,
    CallBack
    // EditJsonData
  },
  props: {
    activeData: {
      type: Object,
      default: () => ({})
    },
    excludeType: {
      type: Array,
      default: () => ([])
    },
    showParamList: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      categoryOptions: getFromStore('sqlCategory'), // 数据分类下拉选项
      listOptionsMap: {}, // 存储数据源下拉选项
      flowOptionsMap: {}, // 存储事务流下拉选项
      microserviceOptionsMap: {}, // 存储微服务下拉选项
      dictOption: getFromStore('dictList'), // 数据字典下拉选项
      formOptions: [], // 表单创建/编辑/初始数据源下拉选项
      isFirstSetting: false // 是否第一次设置数据源，用于表格关联表单的数据请求
    }
  },
  computed: {
    isFormContainer() {
      return this.activeData.layout === 'formContainer'
    },
    isOptionTag() {
      return optionComponentList.indexOf(this.activeData.tag) > -1
    },
    isTreeTag() {
      return this.activeData.tag === 'combo-tree' || this.activeData.tag === 'el-tree'
    },
    isShowParamList() {
      return this.showParamList && !this.isFormContainer && this.activeData.initDataOptions.length > 0
    },
    dsTypeArr() {
      const { excludeType, isOptionTag, isTreeTag } = this
      const excludeTypeArr = typeof excludeType === 'string'
        ? excludeType.split(',')
        : excludeType.concat()
      if (!isOptionTag && !isTreeTag) {
        excludeTypeArr.push('dict')
        excludeTypeArr.push('data')
      }
      const typeArr = []
      Object.keys(DS_CONF_MAP).forEach(key => {
        if (excludeTypeArr.indexOf(key) < 0) {
          const { label } = DS_CONF_MAP[key]
          typeArr.push({
            key,
            label
          })
        }
      })
      return typeArr
    }
  },
  watch: {
    activeData: {
      handler(activeData) {
        let { dataSource } = activeData
        if (!dataSource) {
          dataSource = {}
          this.$set(this.activeData, 'dataSource', dataSource)
        }
        // HACK: 为 vue 数据设置变量，否则数据双向绑定会有问题
        if (dataSource.categoryId === undefined) {
          this.$set(this.activeData.dataSource, 'categoryId', '')
        }
        if (dataSource.listId === undefined) {
          this.$set(this.activeData.dataSource, 'listId', '')
        }
        if (dataSource.flowId === undefined) {
          this.$set(this.activeData.dataSource, 'flowId', '')
        }
        if (dataSource.microserviceId === undefined) {
          this.$set(this.activeData.dataSource, 'microserviceId', '')
        }
        if (dataSource.optionParams === undefined) {
          // 控件选项等异步请求需要的参数（下拉、多选等）
          this.$set(this.activeData.dataSource, 'optionParams', {})
        }
        if (activeData.initDataOptions === undefined) {
          // 初始数据源
          this.$set(this.activeData, 'initDataOptions', [])
        }
        // 初始化静态数据源
        // NOTE: dataSource.staticData 影响静态数据和表单初始数据
        // if (!dataSource.staticData) {
        //   this.initStaticData()
        // }

        // 是否第一次设置数据源
        if (isEmpty(dataSource.listId) && isEmpty(dataSource.flowId) && isEmpty(dataSource.microserviceId)) {
          // this.$set(this.activeData.dataSource, 'type', 'data')
          this.isFirstSetting = true
        }

        // 初始化组件
        this.$set(
          this.activeData,
          'dataType',
          this.activeData.dataSource.type === 'data' ? 'static' : 'dynamic'
        )
        this.fetchOptions()
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    // 修改 activeData.options 数组中的 value 的值
    // TODO: 该方法与 RightPanel.vue 的 setOptionValue 方法类似，待整理
    setOptionValue(item, val, type) {
      const typeKey = type || 'value'
      const typeVal = isNumberStr(val) ? `${val}` : val
      this.$set(item, typeKey, typeVal)
      // 设置初始请求参数
      this.setInitParams(this.activeData.initDataOptions)
    },

    /**
     * 设置初始请求参数
     */
    setInitParams(initDataOptions) {
      const initParams = getInitParams(this.activeData, initDataOptions)
      if (initParams) {
        const {
          initFetchKey,
          initFetchParam
        } = initParams
        this.$set(this.activeData.dataSource.optionParams, initFetchKey, initFetchParam)
      }
    },

    /**
     * 设置表单数据源下拉选项
     */
    setFormOptions() {
      const { categoryId, type } = this.activeData.dataSource
      let arr = []
      let labelName = ''
      arr = this.listOptionsMap[categoryId] || []
      labelName = 'sql_name'
      this.formOptions = arr.map(item => ({
        label: item[labelName],
        value: item.id_code
      }))
    },

    // 初始化静态数据源
    // TODO: 临时方法。不完善。需要整理数据
    // initStaticData() {
    //   const { activeData } = this
    //   // eslint-disable-next-line no-nested-ternary
    //   this.staticData = activeData.options && activeData.options.length
    //     ? activeData.options
    //     : activeData.data && activeData.data.length
    //       ? activeData.data
    //       : []
    // },

    /**
     * 清除已选择的数据
     */
    clearSetting() {
      this.activeData.dataSource.listId = null
      this.activeData.dataSource.flowId = null
      this.activeData.dataSource.microserviceId = null
      if (this.isFormContainer) {
        this.formOptions = []
        this.activeData.initDataId = null
        this.$nextTick(() => {
          this.$refs.FormExtend
            && this.$refs.FormExtend.clearFormContainerSetting()
        })
      }
      this.activeData.dataSource.optionParams = {} // 数据源参数
      this.activeData.initDataOptions = [] // 初始数据源参数列表
      this.$emit('clearDataSource', 'all')
    },

    /**
     * 修改数据源类型
     */
    handleTypeChange() {
      this.$set(
        this.activeData,
        'dataType',
        this.activeData.dataSource.type === 'data' ? 'static' : 'dynamic'
      )
      this.$emit('changeType', this.activeData.dataSource.type)
      this.clearSetting() // 清除已选择的数据
      this.fetchOptions()
    },

    /**
     * 修改数据分类
     */
    handleCategoryChange(node, id) {
      this.$set(this.activeData.dataSource, 'categoryId', id)
      this.clearSetting() // 清除已选择的数据
      this.fetchOptions()
    },

    /**
     * 刷新数据分类下的数据源/事务流数据缓存
     * NOTE: 不会刷新数据分类。重新请求数据源中分类id数据：executeSqls(4, { service_type: 6 })
     */
    handleRefreshOptions() {
      // 清除已选择的数据
      this.clearSetting()
      // 获取缓存中的数据分类信息
      this.categoryOptions = getFromStore('sqlCategory')
      // 重新请求数据分类下的数据源/事务流数据
      this.listOptionsMap = {}
      this.flowOptionsMap = {}
      this.microserviceOptionsMap = {}
      this.fetchOptions()
    },

    /**
     * 请求数据分类下的数据源/事务流/微服务数据
     * @param {Boolean} isForce 是否强制刷新。
     * 默认取 listOptionsMap 或 flowOptionsMap 或 microserviceOptionsMap中的缓存数据。
     */
    fetchOptions() {
      const { dataType, dataSource } = this.activeData
      const { type } = dataSource
      const { categoryId } = dataSource

      if (!categoryId || dataType !== 'dynamic') {
        return
      }

      if (type === 'flow' && !this.flowOptionsMap[categoryId]) {
        this.$server
          .executeSqls('1247451904391696385', {
            service_category_id: categoryId
          })
          .then(resData => {
            this.$set(this.flowOptionsMap, categoryId, resData)
          })
      }
      // WARN: HACK: 临时兼容湖北WMS团队需求：微服务列表不根据数据分类过滤。使用 noCategoryId 请求所有微服务。
      const noCategoryId = '-1'
      if (type === 'microservice' && !this.microserviceOptionsMap[noCategoryId]) {
        this.$server
          .listMicroByCategoryId({
            categoryId: noCategoryId
          })
          .then(resData => {
            this.$set(this.microserviceOptionsMap, noCategoryId, resData)
          })
      }

      if (this.listOptionsMap[categoryId]) {
        this.isFormContainer && this.setFormOptions()
        return
      }

      this.$server
        .executeSqls(5, {
          category_id: categoryId
        })
        .then(resData => {
          this.$set(this.listOptionsMap, categoryId, resData)
          this.isFormContainer && this.setFormOptions()
        })
    },

    async handleChangeDsId(dsId, needOpts = true) {
      const { activeData } = this
      const { type } = activeData.dataSource
      const dsConf = DS_CONF_MAP[type]
      if (!dsId) {
        // TODO: 统一的数据清理
        this.setCommonDsParams()
        this.$emit('clearDataSource', type)
        return
      }
      if (type === 'dict') {
        dsId = dsId.id
      }
      const dsOpts = needOpts ? await getSqlOpts(dsId, type) : undefined
      this[dsConf.changeFn](dsId, dsOpts)
      this.$emit('changeDataSource', type, dsId, dsOpts)
    },

    async setOptionConf(exampleSourceId, exampleParam, result) {
      const { activeData } = this
      const { tag, showRoot } = activeData
      // 设置数据Key条件
      const {
        parentKey, nodeKey, childrenKey,
        labelKey, valueKey
      } = getKeyConditionFromResult(result)
      this.$set(this.activeData, 'labelKey', labelKey)
      this.$set(this.activeData, 'valueKey', valueKey)
      if (this.isTreeTag) {
        this.$set(this.activeData, 'parentKey', parentKey)
        this.$set(this.activeData, 'nodeKey', nodeKey)
        this.$set(this.activeData, 'childrenKey', childrenKey)
      }
      // 设置设计器展示数据
      const exampleData = await getExampleData(exampleSourceId, exampleParam, {
        tag,
        labelKey,
        valueKey,
        showRoot// 用于判断是否显示根节点
      })
      this.$set(
        this.activeData,
        [['el-select'].indexOf(tag) >= 0 ? 'options' : 'data'],
        exampleData
      )
    },

    /**
     * 修改数据源
     * 修改数据后，设置除表单外的组件配置
     * NOTE: 保持与 method.js 的 setDataSource 方法逻辑一致
     */
    async handleDatasourceChange(sourceId, dsOpts) {
      const { activeData } = this
      const { tag, vModel } = activeData
      const { search, result, filterMap } = dsOpts

      if (this.isOptionTag || this.isTreeTag) {
        await this.setOptionConf(sourceId, search, result)
      }

      // NOTE: 表单需要校验创建编辑数据源。因此不在这里处理
      if (this.isFormContainer) {
        return
      }

      const dataSourceOptionParams = getDsOptionParams(
        { tag, vModel },
        { filterMap, search, result }
      ) || {}
      this.$set(
        this.activeData.dataSource,
        'optionParams',
        dataSourceOptionParams
      )
      console.log('dataSourceOptionParams', dataSourceOptionParams)
      // 设置初始请求参数
      this.setCommonDsParams(dsOpts.search)
    },

    /**
     * 设置初始请求参数。
     * 修改： searchData、initDataOptions、optionParams.initData
     * NOTE: 注意，保持与 method.js 的 setDataSource 方法逻辑一致
     * @params initData {Array}
     */
    setCommonDsParams(paramList = []) {
      const { activeData } = this
      const {
        searchData,
        initDataOptions,
        initFetchKey,
        initFetchParam
      } = getInitDsParams(activeData, paramList)
      // 设置联动相关数据
      this.$set(this.activeData, 'searchData', searchData)

      // NOTE: initDataOptions 和 optionParams 中存在重复数据。
      // 目前 initDataOptions 用于属性面板填写参数列表。
      //  optionParams 用于在 js.js 生成初始请求数据
      // TODO: 能否合并两份数据？

      // 设置初始数据查询参数
      this.$set(this.activeData, 'initDataOptions', initDataOptions)
      // 将初始查询条件添加到 optionParams 中
      if (initFetchKey) {
        this.$set(activeData.dataSource.optionParams, initFetchKey, initFetchParam)
      }
      console.log('initFetchKey, initFetchParam', initFetchKey, initFetchParam)
    },

    /**
     * 修改事务流
     * NOTE: 只有表单和按钮支持事务流操作。按钮事务流操作。目前单独写在 editDialog 中
     */
    handleFlowChange(dsId, dsOpts) {
      if (this.isFormContainer) {
        this.$nextTick(() => {
          if (this.$refs.FormExtend) {
            // 表单中选择事务流，相当于选择创建+编辑数据源
            // TODO: 表单不需要请求 getSqlOpts。使用 dsOpts 即可
            this.$refs.FormExtend.setFormConf(dsId, 'flow')
          }
        })
        return
      }
      this.setCommonDsParams(dsOpts.search)
      // this.$server
      //   .executeSqls('1269170765151240193', {
      //     transflow_id: dsId
      //   })
      //   .then(resData => {
      //     console.log('请求事务流参数', dsId, resData)
      //   })
    },
    // 修改微服务
    handleMicroChange(dsId, dsOpts) {
      if (this.isFormContainer) {
        this.$nextTick(() => {
          if (this.$refs.FormExtend) {
            this.$refs.FormExtend.setFormConf(dsId, 'microservice')
          }
        })
      }
      this.setCommonDsParams(dsOpts.search)
    },

    /**
     * 修改数据字典
     */
    async handleDictChange(dsId) {
      await this.setOptionConf('1257968258652504065', [{ value: 'p_id', param: dsId }])
      // 设置初始请求参数
      this.setInitParams()
    },

    /**
     * 修改静态数据源
     */
    handlerChangeStatic(val) {
      const { activeData } = this
      // 静态数据渲染到选项
      // NOTE: 特殊处理树形选择组件。静态数据绑定到 activeData.data
      if (activeData.options || this.isTreeTag) {
        try {
          let options = eval(val.replace(/\n|\r\n|\s/g, ''))
          options=options||[]
          if (this.isTreeTag) {
            activeData.data = options
          } else {
            activeData.options = options
          }

          //考虑默认第一项的赋值
          if(activeData.defaultValueType==='selectFirst'){
            activeData.defaultValue=options.length?options[0].value:''
          }

        } catch (err) {
          console.warn('静态数据格式有误！', err)
        }
      }
    }
  }
}
</script>
