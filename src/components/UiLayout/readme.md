使用：
```
<template>
  <UiLayout>
    <template slot="header">
      header
    </template>
    <template slot="left">
      left
    </template>
    <template slot="top">
      top
    </template>
    main
    <template slot="bottom">
      bottom
    </template>
    <template slot="right">
      right
    </template>
    <template slot="footer">
      footer
    </template>
  </UiLayout>
</template>

<script>
import UiLayout from '@components/UiLayout/Index.vue'

export default {
  name: 'MainView',
  components: {
    UiLayout
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>
```
