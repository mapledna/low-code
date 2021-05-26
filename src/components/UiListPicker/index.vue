<template>
  <el-popover
    v-model="_visible"
    placement="bottom-start"
    trigger="click"
    @after-enter="handleAfterShow"
  >
    <el-input
      slot="reference"
      class="ui-list-picker"
      :value="pickLabel"
      :size="size"
      :placeholder="placeholder"
      :readonly="readonly"
      clearable
    >
      <el-button
        slot="append"
        icon="el-icon-search"
        :size="size"
      />
    </el-input>
    <div
      class="ui-list-picker--list-warp"
      :style="{width: pickerWidth, height: pickerHeight}"
    >
      <slot
        ref="defaultSlot"
        name="default"
      />
    </div>
    <div class="ui-list-picker--btn-warp">
      <el-button
        size="small"
        type="text"
        @click="handleCancel"
      >
        取消
      </el-button>
      <el-button
        size="small"
        type="text"
        @click="handleClear"
      >
        清除
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click="handleConfirm"
      >
        确定
      </el-button>
    </div>
  </el-popover>
</template>

<script>
import {
  builderComputedMap
} from '@utils/vue'

const propsMap = {
  visible: {
    type: Boolean,
    default: false,
    autoUpdate: true
  }
}

export default {
  name: 'UiPicker',
  components: {},
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    readonly: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: undefined
    },
    pickerWidth: {
      type: String,
      default: 'auto'
    },
    pickerHeight: {
      type: String,
      default: 'auto'
    },
    options: {
      type: Array,
      default: () => []
    },
    labelKey: {
      type: String,
      default: 'name'
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    ...propsMap
  },

  data() {
    return {
      tempData: []
    }
  },

  computed: {
    ...builderComputedMap(propsMap),
    // eslint-disable-next-line no-underscore-dangle
    _options() {
      const {
        options
      } = this
      if (Array.isArray(options)) {
        return options
      }
      if (!options) { return [] }
      return [options]
    },

    // eslint-disable-next-line no-underscore-dangle
    _value() {
      const { value, _options, valueKey } = this
      if (typeof value === 'string' || typeof value === 'number') {
        return value
      }
      if (!value) { return '' }
      if (typeof value === 'object') {
        return value[valueKey] || ''
      }
      return value
    },

    pickLabel() {
      const {
        _value,
        labelKey,
        valueKey,
        _options
      } = this
      const find = _options.find(item => item[valueKey] === _value) || {}
      return find[labelKey] || _value
    }
  },

  watch: {
    _value: {
      immediate: true,
      handler(_value) {
        if (_value !== this.value) {
          this.$emit('change', _value)
        }
      }
    }
  },

  methods: {
    close() {
      this._visible = false
    },
    handleAfterShow() {
      this.$emit('after-show')
    },
    handleCancel() {
      this.$emit('cancel')
      this.close()
    },
    handleClear() {
      this.$emit('clear')
      this.close()
    },
    handleConfirm() {
      this.$emit('confirm')
      this.close()
    }
  }
}
</script>
