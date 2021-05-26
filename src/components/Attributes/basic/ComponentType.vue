<template>
  <div>
    <el-select
      v-model="value"
      placeholder="请选择组件类型"
      :style="{width: '100%'}"
      @change="tagChange"
    >
      <el-option-group v-for="group in tagList" :key="group.label" :label="group.label">
        <el-option
          v-for="item in group.options"
          :key="item.label"
          :label="item.label"
          :value="item.tagIcon"
        >
          <svg-icon class="node-icon" :icon-class="item.tagIcon" />
          <span> {{ item.label }}</span>
        </el-option>
      </el-option-group>
    </el-select>
  </div>
</template>

<script>
import {
  basicComponents, layoutComponents
} from '@/components/generator/config'

export default {
  props: {
    value: {
      default: undefined
    },
    config: {
      default: undefined
    }
  },
  computed: {
    tagList() {
      return [
        {
          label: '基础组件',
          options: basicComponents
        }
      ]
    }
  },
  mounted() {

  }
}
</script>
