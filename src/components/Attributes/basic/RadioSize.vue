<template>
  <div>
    <el-radio-group v-model="value" size="medium">
      <el-radio-button label="large">
        大
      </el-radio-button>
      <el-radio-button label="medium">
        中
      </el-radio-button>
      <el-radio-button label="small">
        小
      </el-radio-button>
      <el-radio-button label="mini">
        迷你
      </el-radio-button>
    </el-radio-group>
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
