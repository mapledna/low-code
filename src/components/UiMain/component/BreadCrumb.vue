<template>
  <div class="ui-main__breadcrumb">
    <span
      v-for="(v, i) in breadData"
      :key="i"
      :class="i == breadData.length - 1 ? 'last' : ''"
    >{{ v
    }}<template v-if="i != breadData.length - 1"><i class="el-icon-arrow-right" /></template></span>
  </div>
</template>

<script>
export default {
  props: ['breadData'],
  data() {
    return {}
  }
}
</script>
