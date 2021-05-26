<template>
  <aside class="ui-main__aside">
    <slot name="logo" />
    <el-scrollbar class="ui-main__menu-warp">
      <slot name="menu" />
    </el-scrollbar>
  </aside>
</template>

<script>
export default {
  name: 'MainAside',
  props: {},
  methods: {}
}
</script>
