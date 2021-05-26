<template>
  <component
    :is="componentName"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import baseDs from '@/components/Attributes/collapse/Datasource/baseDs'
import tableDatasource from '@/components/Attributes/collapse/Datasource/tableDatasource'
import listPickerDatasource from '@/components/Attributes/collapse/Datasource/listPickerDatasource'
import formDetailDatasource from '@/components/Attributes/collapse/Datasource/formDetailDatasource'

const DEF_COMPONENT_NAME = 'baseDs'
const specilComponentNameList = {
  'el-table': 'tableDatasource',
  listPicker: 'listPickerDatasource',
  // 'formContainer',
  formDetail: 'formDetailDatasource'
}
export default {
  components: {
    baseDs,
    tableDatasource,
    listPickerDatasource,
    formDetailDatasource
  },
  props: {
    tag: {
      type: String,
      default: ''
    },
    layout: {
      type: String,
      default: ''
    }
  },
  computed: {
    componentName() {
      const { tag, layout } = this
      return specilComponentNameList[tag] || specilComponentNameList[layout] || DEF_COMPONENT_NAME
    }
  },
  methods: {}
}
</script>
