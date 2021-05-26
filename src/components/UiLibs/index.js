import UiInput from './UiInput'
import UiSelect from './UiSelect'
import UiSlider from './UiSlider'
import UiSwitch from './UiSwitch'
import UiRadio from './UiRadio'
import UiInputNumber from './UiInputNumber'
import UiButton from './UiButton'
import UiTree from './UiTree'

const components = [
  UiInput,
  UiSelect,
  UiSlider,
  UiSwitch,
  UiRadio,
  UiInputNumber,
  UiButton,
  UiTree
]

const install = function (Vue, ops = {}) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

export default {
  install,
  UiInput,
  UiSelect,
  UiSlider,
  UiSwitch,
  UiRadio,
  UiInputNumber,
  UiButton,
  UiTree
}
