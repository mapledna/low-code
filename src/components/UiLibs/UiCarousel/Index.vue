<template>
  <el-carousel
    v-model.trim="value"
    :type="type"
    :height="height"
    :autoplay="autoplay"
    :interval="interval"
    :indicator-position="indicatorPosition"
    :arrow="arrow"
    :loop="loop"
    :direction="direction"
    @change="handleChange"
  >
    <el-carousel-item v-for="(item, index) in options" :key="index">
      <el-image :src="item.value" />
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  name: 'UiCarousel',
  componentName: 'UiCarousel',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'default'
    },
    height: {
      type: String,
      default: '300px'
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    },
    indicatorPosition: {
      type: String,
      default: 'none'
    },
    arrow: {
      type: String,
      default: 'always'
    },
    loop: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: 'horizontal'
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
          label: '图一',
          value:
          'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg'
        },
        {
          label: '图二',
          value:
          'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg'
        }
      ]
    }
  },
  computed: {
  },
  methods: {
    handleChange(...arg) {
      this.$emit('handleChange', ...arg)
    }
  }
}
</script>
