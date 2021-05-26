<template>
  <el-divider
    :content-position="contentPosition"
  >
    {{ conf.content }}
  </el-divider>
</template>

<script>
export default {
  name: 'UiDivider',
  componentName: 'UiDivider',
  props: {
    contentPosition: {
      type: String,
      default: 'left'
    },
    conf: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>
