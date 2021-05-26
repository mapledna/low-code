<template>
  <div>
    <el-form-item>
      <UiFormItemTips
        slot="label"
        content="按钮自定义显示/隐藏方法。<br>【参数】<br>scope {Object} 可获取到 row。<br>field {String} 按钮鉴权值。<br>tableId {String} 表格字段名。<br>【返回】<br>{Boolean} 返回真值展示，返回假值隐藏。"
      >
        显示/隐藏
      </UiFormItemTips>
      <el-switch v-model="_visible_allow" @change="handleToggleVisible_allow" />
      <br>
      <el-input
        v-if="_visible_allow"
        v-model="_visible_fn"
        type="textarea"
        rows="6"
        placeholder="按钮自定义显示/隐藏方法"
      />
    </el-form-item>
    <el-form-item>
      <UiFormItemTips
        slot="label"
        content="按钮自定义禁用/启用方法。<br>【参数】<br>scope {Object} 可获取到 row。<br>field {String} 按钮鉴权值。<br>tableId {String} 表格字段名。<br>【返回】<br>{Boolean} 返回真值禁用，返回假值启用。"
      >
        禁用/启用
      </UiFormItemTips>
      <el-switch v-model="_available_allow" @change="handleToggleAvailable_allow" />
      <br>
      <el-input
        v-if="_available_allow"
        v-model="_visible_fn"
        type="textarea"
        rows="6"
        placeholder="按钮自定义禁用/启用方法"
      />
    </el-form-item>
  </div>
</template>
<script>

const DEF_DISPLAY_STR = `function(scope, field, tableId){
  const { row } = scope
  return true
}`
const DEF_DISABLED_STR = `function(scope, field, tableId){
  const { row } = scope
  return true
}`

export default {
  name: 'DisplayEventPanel',
  components: {
  },
  inheritAttrs: false,
  props: {
    // panelObj: {
    //   type: Object,
    //   default: () => ({})
    // },
    visible_allow: {
      type: Boolean,
      default: false
    },
    visible_fn: {
      type: String,
      default: ''
    },
    available_allow: {
      type: Boolean,
      default: false
    },
    available_fn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {
    _visible_allow: {
      get() {
        return this.visible_allow
      },
      set(visible_allow) {
        this.$emit('updateParentData', 'visible_allow', visible_allow)
      }
    },
    _visible_fn: {
      get() {
        return this.visible_fn
      },
      set(visible_fn) {
        this.$emit('updateParentData', 'visible_fn', visible_fn)
      }
    },
    _available_allow: {
      get() {
        return this.available_allow
      },
      set(available_allow) {
        this.$emit('updateParentData', 'available_allow', available_allow)
      }
    },
    _available_fn: {
      get() {
        return this.available_fn
      },
      set(available_fn) {
        this.$emit('updateParentData', 'available_fn', available_fn)
      }
    }
  },
  methods: {

    handleToggleVisible_allow(isUse) {
      // eslint-disable-next-line no-underscore-dangle
      if (isUse && !this._visible_fn) {
        // eslint-disable-next-line no-underscore-dangle
        this._visible_fn = DEF_DISPLAY_STR
      }
    },

    handleToggleAvailable_allow(isUse) {
      // eslint-disable-next-line no-underscore-dangle
      if (isUse && !this._available_fn) {
        // eslint-disable-next-line no-underscore-dangle
        this._available_fn = DEF_DISABLED_STR
      }
    }
  }
}
</script>
