<template>
  <div>
    <el-switch v-model="value" />
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
