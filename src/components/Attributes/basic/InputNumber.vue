<template>
  <div>
    <el-input-number v-model="value" :min="0" :placeholder="config.placeholder ? config.placeholder : '请输入' + config.label" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      default: undefined
    },
    config: { default: undefined }
  },
  mounted() {

  }
}
</script>
