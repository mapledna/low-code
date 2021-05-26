import BasicFormItem from './BasicFormItem'

export default {
  ...BasicFormItem,
  placeholder: { label: '提示语', tag: 'UiInput', placeholder: '请输入提示语' }, // 占位符提示语,
  prepend: { label: '前缀', tag: 'UiInput' }, // 前缀,
  append: { label: '后缀', tag: 'UiInput' }, // 后缀,
  'prefix-icon': { label: '前图标', tag: 'UiIconPicker', enableInput: true }, // 前图标,
  'suffix-icon': { label: '后图标', tag: 'UiIconPicker', enableInput: true }, // 后图标,
  maxlength: {
    label: '最多输入', tag: 'UiInput', append: '个字符', placeholder: '请输入字符长度'
  }, // 最多输入多少个字符,
  serialNumber: { label: '流水号', tag: 'UiSelect' }, // 流水号,
  size: {
    label: '尺寸',
    tag: 'UiRadio',
    type: 'button',
    options: [{
      label: '大',
      value: 'large'
    }, {
      label: '中',
      value: 'medium'
    }, {
      label: '小',
      value: 'small'
    }, {
      label: '迷你',
      value: 'mini'
    }]
  }, // 尺寸,
  'show-word-limit': { label: '输入统计', tag: 'UiSwitch' }, // 输入统计,
  readonly: { label: '是否只读', tag: 'UiSwitch' }, // 是否清空
  clearable: { label: '是否清空', tag: 'UiSwitch' }, // 是否清空
  methods: { onclick: true, onchange: true }
}
