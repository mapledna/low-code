<template>
  <el-button
    :type="type"
    :disabled="!!disabled"
    :size="size"
    :plain="plain"
    :round="round"
    :icon="icon"
    @click="handleClick"
  >
    {{ label }}
    <template v-if="suffixIcon">
      <i :class="suffixIcon" class="el-icon--right" />
    </template>
  </el-button>
</template>

<script>
export default {
  name: 'UiButton',
  componentName: 'UiButton',
  props: {
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'default'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium'
    },
    plain: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
    suffixIcon: {
      type: String,
      default: ''
    },
    conf: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    handleClick(...arg) {
      this.$emit('handleClick', ...arg)
    }
  }
}
</script>
