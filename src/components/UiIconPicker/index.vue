<template>
  <div class="ui-icon-picker">
    <el-input
      v-if="enableInput"
      v-model="iconName"
      placeholder="请输入图标名称"
      clearable
      :prefix-icon="'icon-display ' + iconName"
    >
      <el-button
        slot="append"
        icon="el-icon-thumb"
        type="primary"
        @click="isShowDialog = true"
      >
        选择
      </el-button>
    </el-input>
    <div v-else>
      <el-button
        icon="el-icon-thumb"
        type="primary"
        style="margin-right: 15px;"
        @click="isShowDialog = true"
      >
        点击选择
      </el-button>
      <span v-show="iconName">
        <i class="icon-display" :class="iconName" />
        <span class="value-display">{{ iconName }}</span>
        <el-link :underline="false" @click="iconName = ''">
          <i class="el-icon-close" />
        </el-link>
      </span>
    </div>

    <icon-picker-dialog :visible.sync="isShowDialog" :current="iconName" @chooseMdiIcon="selectIcon" />
  </div>
</template>

<script>
import IconPickerDialog from '@/components/IconPickerDialog/Index'

export default {
  name: 'UiIconPicker',
  components: {
    IconPickerDialog
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    enableInput: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShowDialog: false,
      iconName: this.value
    }
  },
  watch: {
    value(value) {
      this.iconName = value
    },
    iconName(iconName) {
      this.$emit('change', iconName)
    }
  },
  methods: {
    setIcon(val) {
      this.iconName = val
    },
    // 弹窗从图标库中点击选择图标
    selectIcon(iconName) {
      // console.log('iconname',iconName)
      this.iconName = iconName
      this.isShowDialog = false
    }
  }
}
</script>

<style>
.ui-icon-picker .el-input__prefix {
  left: 8px;
}
.ui-icon-picker .el-input--prefix .el-input__inner {
  padding-left: 40px;
}

.ui-icon-picker .el-input-group__prepend {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
}
.ui-icon-picker .el-input-group__prepend:focus,
.ui-icon-picker .el-input-group__prepend:hover {
  background: #66b1ff;
  border-color: #66b1ff;
}
.ui-icon-picker .el-input-group__prepend:active {
    background: #3a8ee6;
    border-color: #3a8ee6;
}
/* .ui-icon-picker .el-input__suffix {
  right: 8px;
}
.ui-icon-picker .el-input--suffix .el-input__inner {
    padding-right: 40px;
} */
.ui-icon-picker .icon-display {
  vertical-align: sub;
  font-size: 25px;
}
.ui-icon-picker .value-display {
  margin-left: 6px;
  margin-right: 15px;
  color: #606266;
}
</style>
