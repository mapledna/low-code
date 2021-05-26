import Input from './basic/Input'
import ComponentType from './basic/ComponentType'
import Switch from './basic/Switch'
import RadioSize from './basic/RadioSize'
import Textarea from './basic/Textarea'
import Slider from './basic/Slider'
import InputNumber from './basic/InputNumber'
import Datasource from './collapse/Datasource/Index'

export default {
  install(Vue, options) {
    Vue.component('attr-el-input', Input)
    Vue.component('attr-component-type', ComponentType)
    Vue.component('attr-el-switch', Switch)
    Vue.component('attr-radio-size', RadioSize)
    Vue.component('attr-textarea', Textarea)
    Vue.component('attr-el-slider', Slider)
    Vue.component('attr-el-input-number', InputNumber)
    Vue.component('attr-datasource', Datasource)
  }
}
