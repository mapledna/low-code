<template>
  <el-drawer
    :title="title"
    :visible.sync="visible"
    class="attr-edit-drawer"
    size="350px"
    :modal="false"
    :close-on-click-modal="false"
    append-to-body
    @open="onOpen"
    @close="onClose"
  >
    <el-form
      ref="elForm"
      size="small"
      label-width="110px"
    >
      <slot name="default" />
    </el-form>
  </el-drawer>
</template>

<script>
export default {
  name: 'EditDialogWarper',
  components: {},
  inheritAttrs: false,
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    onOpen() { },
    onClose() {
      this.close()
    },
    close(e) {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/theme-default/utils/index.scss";
$padding: 20px;

.el-dialog__wrapper ::v-deep {
  .el-drawer__header {
    margin-bottom: $padding;
  }

  .el-drawer__body {
    padding-left: $padding / 2;
    padding-right: $padding;
    overflow-y: auto;
  }
}

.form-item-btm {
  margin-bottom: 5px;
}
</style>
