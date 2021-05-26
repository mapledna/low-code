export default {
  name: 'UiFormItemTips',
  props: {
    content: {
      type: String,
      required: true
    }
  },
  render(h) {
    const { content } = this
    const tipsNode = (
      <el-popover
        placement="bottom-start"
        width="250"
        trigger="hover"
        style="opacity: 0.6;"
      >
        {h('div', {
          domProps: {
            innerHTML: content
          }
        })}
        <template slot="reference">
          <i class="el-icon el-icon-question" style="opacity: 0.6;" />
        </template>
      </el-popover>
    )
    return h('span', [tipsNode, ' ', this.$slots.default])
  }
}
