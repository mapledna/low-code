<template>
  <EditDialogWarper>
    <WidgetPnl />
  </EditDialogWarper>
</template>

<script>
import EditDialogWarper from './EditDialogWarper'
import WidgetPnl from './WidgetPnl'

export default {
  name: 'WidgetPanel',
  components: {
    EditDialogWarper,
    WidgetPnl
  },
  inheritAttrs: false,
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
}
</script>
