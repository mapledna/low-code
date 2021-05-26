<template>
  <el-link
    :type="type"
    :underline="underline"
    :disabled="disabled"
    :href="href"
  >
    {{ conf.content }}qq
  </el-link>
</template>

<script>
export default {
  name: 'UiLink',
  componentName: 'UiLink',
  props: {
    type: {
      type: String,
      default: 'primary'
    },
    underline: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    href: {
      type: String,
      default: ''
    },
    conf: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>
