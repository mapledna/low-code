<template>
  <el-form-item :label="label">
    <el-select
      v-model="fnName"
      filterable
      clearable
      placeholder="请选择事件"
      :style="{ width: '100%' }"
      @change="handleChangeFnName"
    >
      <el-option-group v-if="customJsList.length > 0" label="自定义事件">
        <el-option
          v-for="(item,index) in customJsList"
          :key="index"
          :label="item"
          :value="item"
        />
      </el-option-group>
      <el-option-group v-if="innerJsList.length > 0" label="内置事件">
        <el-option
          v-for="(item,index) in innerJsList"
          :key="index"
          :label="item"
          :value="item"
        />
      </el-option-group>
    </el-select>
  </el-form-item>
</template>
<script>

export default {
  name: 'SelectEvent',
  components: {
  },
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: ''
    },
    fnType: {
      type: String,
      default: ''
    },
    fnName: {
      type: String,
      default: ''
    },
    activeData: {
      type: Object,
      default: () => ({})
    },
    customJsList: {
      type: Array,
      default: () => ([])
    },
    innerJsList: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {}
  },
  computed: {
    _fnName: {
      get() {
        return this.fnName
      },
      set(fnName) {
        this.$emit('updateParentData', this.fnType, fnName)
      }
    }
  },
  methods: {
    handleChangeFnName(val) {
      // eslint-disable-next-line no-underscore-dangle
      this._fnName = val
    }
  }
}
</script>
