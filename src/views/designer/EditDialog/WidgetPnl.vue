<template>
  <div>
    <el-form-item label="标签名">
      <el-input
        v-model="widgetCopy.label"
        placeholder="请输入标签名"
      />
    </el-form-item>
    <el-form-item label="字段名">
      <el-input
        v-model="widgetCopy.value"
        placeholder="请输入字段名"
      />
    </el-form-item>
    <el-form-item label="初始值">
      <el-input
        v-model="widgetCopy.inputVal"
        placeholder="请输入初始值"
      />
    </el-form-item>
    <el-form-item label="控件类型">
      <el-select
        v-model="widgetCopy.widgetCode"
        placeholder="请选择"
        @change="handleChangeCode"
      >
        <el-option
          label="请选择控件类型"
          value=""
        />
        <el-option
          v-for="item in widgetConfArr"
          :key="item.code"
          :label="item.label"
          :value="item.code"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch v-model="widgetCopy.is_required" />
    </el-form-item>
    <!-- <el-form-item label="最小长度/值">
      <el-input v-model="widgetCopy.param_min" placeholder="请输入最小长度/值" />
    </el-form-item>
    <el-form-item label="最大长度/值">
      <el-input v-model="widgetCopy.param_max" placeholder="请输入最大长度/值" />
    </el-form-item>
    <el-form-item label="验证规则">
      <el-select v-model="widgetCopy.valid_rule" placeholder="请选择验证规则" />
    </el-form-item>
    -->
    <!-- TODO: 配置选项数据。
    数据源 paramvalue: "GetDictionary('1282590391801380866')",
    目前数据通过表格数据源获取。存放在 item.formatterDs.data 中 -->
    <template v-if="showDs">
      <el-divider>选项数据源</el-divider>
      <Datasource :active-data="dsObj" />
    </template>
  </div>
</template>

<script>
import Datasource from '@/components/Attributes/collapse/Datasource/Index'
import {
  basicComponents
} from '@/components/generator/config'
import {
  widgetConfArr,
  getWidgetConf
} from '@/components/generator/config/utils'

export default {
  name: 'WidgetPanel',
  components: {
    Datasource
  },
  inheritAttrs: false,
  model: {
    prop: 'widgetObj',
    event: 'update:widgetObj'
  },
  props: {
    widgetObj: {
      type: Object,
      default: () => ({})
    }
    // activeData: {
    //   type: Object,
    //   default: () => ({})
    // },
  },
  data() {
    return {
      widgetCopy: {},
      widgetType: '',
      widgetConfArr,
      dsObj: {
        dataSource: {
          type: 'dict'
        }
      }
    }
  },
  computed: {
    showDs() {
      const {
        widgetType
      } = this
      return ['radio', 'checkbox', 'select', 'multipleSelect', 'comboTree'].indexOf(widgetType) >= 0
    }
  },
  watch: {
    widgetObj: {
      immediate: true,
      deep: true,
      handler(widgetObj) {
        if (JSON.stringify(widgetObj) === JSON.stringify(this.widgetCopy)) {
          return
        }

        if (widgetObj.paramvalue) {
          // TODO:"paramvalue": "GetDictionary('1282590391801380866')",
        }
        this.widgetCopy = {
          ...widgetObj,
          paramvalue: undefined
        }
        this.dsObj = {
          ...widgetObj.datasource
        }
        if (this.showDs && widgetObj.paramvalue) {
          this.handleChangeCode(this.widgetCopy.widgetCode)
        }
      }
    },
    widgetCopy: {
      deep: true,
      handler(widgetCopy) {
        this.$emit('update:widgetObj', widgetCopy)
      }
    },
    dsObj: {
      deep: true,
      handler(dsObj) {
        if (!this.showDs) {
          return
        }
        console.log('dsObj', dsObj)
        // NOTE: 保持原有逻辑。直接输出选项，生成页面后不重新请求数据。
        this.$set(this.widgetCopy, 'datasource', dsObj.datasource)
        this.$set(this.widgetCopy, 'labelKey', dsObj.labelKey)
        this.$set(this.widgetCopy, 'valueKey', dsObj.valueKey)
        this.$set(this.widgetCopy, 'nodeKey', dsObj.nodeKey)
        this.$set(this.widgetCopy, 'childrenKey', dsObj.childrenKey)
        this.$set(this.widgetCopy, 'parentKey', dsObj.parentKey)
        // TODO: searchOption
        this.$set(this.widgetCopy, 'options', dsObj.options)
      }
    }
  },
  mounted() { },
  methods: {
    handleChangeCode(widgetCode) {
      this.widgetType = (getWidgetConf(widgetCode) || {})
        .type || ''
      const { widgetType } = this
      const defaultConf = basicComponents.find(item => item.tagIcon === widgetType)
      if (!defaultConf) { return }
      const { tag, layout } = defaultConf
      this.dsObj = {
        ...this.dsObj,
        tag,
        layout
      }
    }
  }
}
</script>
