<template>
  <el-dialog
    title="进度"
    :visible.sync="show"
    append-to-body
    width="400px"
    :before-close="handleClose"
  >
    <el-progress :text-inside="options.textInside" :stroke-width="26" :color="options.customColors" :percentage="percent" status="success" />
  </el-dialog>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    options: {
      type: Object,
      default() {
        return {
          textInside: true,
          customColors: [
            { color: '#f56c6c', percentage: 20 },
            { color: '#e6a23c', percentage: 40 },
            { color: '#6f7ad3', percentage: 60 },
            { color: '#1989fa', percentage: 80 },
            { color: '#5cb87a', percentage: 100 }
          ]
        }
      }
    }
  },
  data() {
    return {
      percent: 0, // 进度条长度
      show: false, // 显示和隐藏
      canSuccess: true // 是否是成功的状态
    }
  },
  methods: {
    handleClose() {

    }
  }


}

</script>


