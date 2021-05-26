import {
  basicComponents, layoutComponents
} from '@/components/generator/config'

export default {
  tagIcon: {
    label: '组件类型', tag: 'UiSelect', type: 'group', options: basicComponents
  }, // 组件类型,
  vModel: { label: '字段名', tag: 'UiInput' }, // 字段名,
  label: { label: '标题', tag: 'UiInput' }, // 标签，标题,
  span: { label: '表单栅格', tag: 'UiSlider' }, // 表单格栅,
  labelWidth: { label: '标签宽度', tag: 'UiInputNumber' }, // 组件宽度,
  width: { label: '组件宽度', tag: 'UiInput' }, // 组件宽度,
  defaultValue: {
    label: '默认值', tag: 'UiInput', type: 'textarea', rows: 5
  }, // 默认值,
  showLabel: { label: '显示标签', tag: 'UiSwitch' }, // 是否显示标签,
  required: { label: '是否必填', tag: 'UiSwitch' }, // 是否是必填
  disabled: { label: '是否禁用', tag: 'UiSwitch' } // 是否禁用
}
