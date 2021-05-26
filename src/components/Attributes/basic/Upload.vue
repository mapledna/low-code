<template>
  <el-upload
    class="attr-upload"
    action=""
    :file-list="fileList"
    :multiple="false"
    :limit="1"
    :on-exceed="onExceed"
    :before-upload="beforeUpload"
    :http-request="doUpload"
    :on-change="onUploadChange"
    :on-remove="onUploadRemove"
  >
    <el-button size="small" type="primary" icon="el-icon-upload">
      点击上传
    </el-button>
  </el-upload>
</template>

<script>
export default {
  name: 'BasicUpload',
  props: {
    activeData: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: () => ('')
    }
  },
  data() {
    return {
      fileList: [] // 上传的图片文件
    }
  },
  computed: {
    sizeUnit() {
      return this.activeData.sizeUnit || 'MB'
    },
    fileSize() {
      return this.activeData.fileSize || 5
    }
  },
  methods: {
    // 允许同时上传的文件数
    onExceed(files, fileList) {
      this.$message({
        showClose: true,
        type: 'warning',
        message: '最多允许选择 1 个文件！'
      })
    },
    // 上传之前
    beforeUpload(file) {
      const units = {
        KB: 1024,
        MB: 1024 * 1024,
        GB: 1024 * 1024 * 1024
      }
      const unitNum = units[this.sizeUnit]
      const isRightSize = file.size / unitNum < this.fileSize
      if (!isRightSize) {
        this.$message({
          showClose: true,
          type: 'error',
          message: `文件大小不能超过 ${this.fileSize}${this.sizeUnit}!`
        })
        return false
      }
      const isAccept = new RegExp('image/*').test(file.type)
      if (!isAccept) {
        this.$message({
          showClose: true,
          type: 'error',
          message: '应该选择图片类型的文件!'
        })
        return false
      }
      return isRightSize && isAccept
    },
    // 执行上传
    doUpload(params) {
      console.log(this.activeData, this.type)
      // 根据后台需求数据格式
      const formDataObj = new FormData()
      const {
        file,
        onProgress,
        onSuccess,
        onError
      } = params
      const {
        name
      } = file
      // 文件对象
      formDataObj.append('form', file)
      // 添加其他属性
      formDataObj.append('fileDir', '')
      const fileName = name
      // if ('') {
      //   const fileType = name.substring(name.lastIndexOf('.'), name.length)
      //   const index = this.fileList.length
      //   fileName = fileType === '' ? '' : `${index || ''}${fileType}`
      // }
      formDataObj.append('fileName', fileName)
      this.$server.upload(formDataObj).then(res => {
        onSuccess()
        // console.log(res)
        // this.activeData[this.type] = `http://10.1.21.3:8050/file/prod${res}`
        this.activeData[this.type] = res
      }).catch(() => {
        onError()
      })
    },
    // 上传文件变化
    onUploadChange(files, fileList) {
      this.fileList = fileList
    },
    // 删除已上传文件
    onUploadRemove(files, fileList) {
      this.fileList = fileList
      this.activeData[this.type] = ''
    }


  }


}
</script>

<style>
.attr-upload .el-icon-close-tip{
  display: none;
}
.attr-upload .el-icon-close{
  opacity:0;
}

</style>

