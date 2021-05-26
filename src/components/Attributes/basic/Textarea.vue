<template>
  <div>
    <el-input
      type="textarea"
      rows="5"
      :value="value"
      :placeholder="config.placeholder ? config.placeholder : '请输入' + config.label"
      @input="onDefaultValueInput"
    />
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

  },
  methods: {
    onDefaultValueInput() {}
  }
}
</script>
