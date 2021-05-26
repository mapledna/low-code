<template>
  <el-breadcrumb
    v-model.trim="value"
  >
    <el-breadcrumb-item v-for="(item, index) in options" :key="index"
                        :to="{ path: item.value }"
    >
      {{ item.label }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'UiBreadcrumb',
  componentName: 'UiBreadcrumb',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    conf: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      options: [
        {
          label: '选项一',
          value: '选项一'
        },
        {
          label: '选项二',
          value: '选项二'
        }
      ]
    }
  },
  computed: {

  },
  methods: {

  }
}
</script>
