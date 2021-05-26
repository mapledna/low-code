<template>
  <el-image
    v-model.trim="value"
    :src="src"
    :fit="fit"
    :alt="alt"
  />
</template>

<script>
export default {
  name: 'UiImage',
  componentName: 'UiImage',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    src: {
      type: String,
      default: 'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg'
    },
    fit: {
      type: String,
      default: 'fill'
    },
    alt: {
      type: String,
      default: '图片'
    },
    conf: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      options: [
        {
          label: '选项一',
          value: '选项一'
        },
        {
          label: '选项二',
          value: '选项二'
        }
      ]
    }
  },
  computed: {

  },
  methods: {

  }
}
</script>
