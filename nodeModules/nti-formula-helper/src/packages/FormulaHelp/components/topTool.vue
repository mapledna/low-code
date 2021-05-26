<template>
  <div class="full-panel_top-tool">
    <div
      class="full-panel_top-tool_filter-bar"
      :style="{
        'padding-right': paddingRight,
      }"
    >
      <el-input
        placeholder="过滤"
        v-model="filterText"
        autofocus
        clearable
        size="small"
        @change="handleFilter"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <div class="full-panel_top-tool_btn-group">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'topTool',
  components: {},
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      filterText: '',
    }
  },

  computed: {
    paddingRight() {
      return `${(this.$slots.default ? this.$slots.default.length : 0) * 23}px`
    },
  },

  watch: {
    filterText: {
      immediate: true,
      handler() {
        this.handleFilter()
      },
    },
  },

  mounted() {},

  methods: {
    handleFilter() {
      const { filterText } = this
      this.$emit('filter', filterText)
    },
  },
}
</script>
