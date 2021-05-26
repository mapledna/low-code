<template>
  <div class="page404" :style="screenHeight">
    <div class="img_d">
      <img src="../../assets/404.png" alt="">
      <router-link to="/MainPage">
        <i class="el-icon-arrow-left" /><span>返回主页</span>
      </router-link>
    </div>
  </div>
</template>

<script>
// import HelpCenter from '@/components/Helper'

export default {
  name: 'NotFound',
  components: {
    // HelpCenter
  },
  props: {},
  data() {
    return {
      // userName: ''
      screenHeight: { height: `${document.documentElement.clientHeight}px` } // 获取屏幕高度
    }
  },
  computed: {},
  mounted() {},
  methods: {}
}
</script>

<style scoped>
.page404 {
  height: 100%;
  min-height: 350px;
  background: #f7f7fc;
  text-align: center;
}
.page404 .img_d {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
.page404 img {
  height: 260px;
  width: 500px;
  display: block;
  margin: auto;
}
</style>
