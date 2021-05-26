<template>
  <div class="right-board">
    <el-tabs v-model="currentTab" class="center-tabs">
      <el-tab-pane label="组件属性" name="field" />
      <el-tab-pane label="页面属性" name="form" />
    </el-tabs>
    <div class="field-box">
      <a class="document-link" target="_blank" :href="'#'" title="查看组件文档">
        <i class="el-icon-link" />
      </a>
      <el-scrollbar>
        <!-- 组件属性 -->
        <el-form size="small" label-width="100px">
          <div v-for="(value,key,index) in componentConfig" :key="index">
            <el-form-item v-if="!value.collapse" :label="value.label">
              <component :is="value.tag" v-model="activeData[key]" :key-value="key" :conf="value" v-bind="value" @changeData="changeActiveData" v-on="$listeners" />
            </el-form-item>
          </div>
          <el-collapse style="margin:20px 0">
            <div v-for="(value,key,index) in componentConfig" :key="index">
              <el-collapse-item v-if="value.collapse" :title="value.label" name="6">
                <component :is="value.tag" v-model="activeData[key]" :active-data="activeData" :conf="value" />
              </el-collapse-item>
            </div>
          </el-collapse>
        </el-form>
        <!-- 页面属性 -->
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import * as ComponentConfigs from './config/basic'

export default {
  components: {
  },
  props: {
    activeData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      currentTab: 'field',
      componentConfig: {}
    }
  },
  watch: {
    activeData(newVal, oldVal) {
      console.log('测试', newVal)
      const type = this.getType(newVal.tag)
      this.componentConfig = ComponentConfigs[type]
      console.log('input配置信息', ComponentConfigs[type])
    },
    componentConfig(newVal, oldVal) {
      console.log('测试获取的配置', newVal)
    }
  },
  mounted() {},
  methods: {
    // eslint-disable-next-line consistent-return
    getType(tag) {
      if (tag === 'el-input') {
        return 'Input'
      }
      if (tag === 'el-input-number') {
        return 'InputNumber'
      }
      if (tag === 'el-table') {
        return 'Table'
      }
    },
    changeActiveData(val) {
      console.log(77, val)
      this.activeData[val.key] = val.value
    }
  }
}
</script>
