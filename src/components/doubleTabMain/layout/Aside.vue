<template>
  <div class="page_aside">
    <el-row class="system_name">
      <slot name="logo" />
    </el-row>
    <el-row id="menu_container" v-scrollBar>
      <el-col :span="24">
        <slot name="menu" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'UiAside',
  props: {
  },
  methods: {
  }
}
</script>
