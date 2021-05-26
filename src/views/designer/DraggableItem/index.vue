<script>
import renderLayouts from './renderLayouts'
import renderError from './renderError'

import render from './render'

import draggable from 'vuedraggable'
import ComboTree from '@/components/ComboTree/index'
import RichtextEditor from '@/components/RichtextEditor/Index'
import UiLoginPage from '@/components/UiLoginPage/Index'
import UiLoginPageV2 from '@/components/loginTemplate/chinaTobacco/Index.vue'

function layoutIsNotFound() {
  throw new Error('没有匹配的layout：', this.element.layout, this.element)
}

export default {
  components: {
    render,
    draggable,
    ComboTree,
    RichtextEditor,
    UiLoginPage,
    UiLoginPageV2
  },
  props: [
    'element',
    'index',
    'drawingList',
    'activeId',
    'formConf'
  ],
  render(h) {
    const elementClone = JSON.parse(JSON.stringify(this.element))
    const renderFn = renderLayouts[elementClone.layout]
    if (!renderFn) {
      return renderError()
    }
    return renderFn.call(this, h, elementClone, this.index, this.drawingList)
  }
}
</script>
