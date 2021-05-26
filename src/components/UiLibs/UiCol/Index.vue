<template>
  <el-form-item
    :prop="valueKey"
    :label="label"
    :label-width="labelWidth"
    :size="size"
    :required="!!required"
    :rules="rules"
    :error="error"
  >
    <template v-if="children" slot="children">
      {{ children }}
    </template>
  </el-form-item>
</template>

<script>

export default {
  name: 'UiCol',
  componentName: 'UiCol',
  props: {
    valueKey: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    rules: {
      type: [Object, Array],
      default: undefined
    },
    error: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    children: {
      type: [String, Number],
      default: ''
    }
  },
  computed: {}
}
</script>
