import { isEmpty } from '@/utils/index'

export default {
  name: 'FormItemText',
  props: {
    modelValue: {
      // type: [String, Number, Array],
      default: ''
    },
    errValue: {
      type: [String, Number],
      default: '--'
    },
    options: {
      type: Array,
      default: () => ([])
    },
    labelKey: { // label对应的值
      type: String,
      default: 'label'
    },
    valueKey: { // 选中后返回的值
      type: String,
      default: 'value'
    }
    // TODO: 树形选择渲染
    // nodeKey: { // 结点id对应的值
    //   type: String,
    //   default: 'id'
    // },
    // parentKey: { // 父结点id对应的值
    //   type: String,
    //   default: 'pid'
    // },
    // childrenKey: { // children对应的值
    //   type: String,
    //   default: 'children'
    // }
  },

  methods: {
    getMultText() {
      const { modelValue } = this
      if (Array.isArray(modelValue)) {
        return modelValue.map(val => this.getText(val)).join(', ')
      }
      return this.getText(modelValue)
    },

    getText(val) {
      const { options, valueKey, labelKey } = this
      const text = Array.isArray(options) && options.length
        // eslint-disable-next-line eqeqeq
        ? (options.find(item => item[valueKey] == val) || {})[labelKey]
        : val
      if (isEmpty(text)) {
        return this.errValue ? this.errValue : val
      }
      return text
    }
  },

  render(h) {
    const { getMultText } = this
    // const {
    //   modelValue, errValue, valueKey, labelKey
    // } = this
    return (
      <div class="form-item-text">
        {getMultText()}
      </div>
    )
  }
}
