<template>
  <div>
    <el-slider v-model="value" :max="24" :min="1" :marks="{12:''}" />
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
