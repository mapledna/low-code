<template>
  <div class="page500" :style="screenHeight">
    <div class="img_d">
      <img src="../../assets/500.png" alt="">
      <router-link to="/MainPage">
        <i class="el-icon-arrow-left" /><span>返回主页</span>
      </router-link>
    </div>
  </div>
</template>

<script>
// import HelpCenter from '@/components/Helper'

export default {
  name: 'Error',
  components: {
    // HelpCenter
  },
  props: {
  },
  data() {
    return {
      // userName: ''
      screenHeight: { height: `${document.documentElement.clientHeight}px` }// 获取屏幕高度
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style scoped>
.page500{
  background: #F7F7FC;
  text-align: center;
}
.page500 .img_d{
  /* margin: 0 auto; */
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
.page500 img{
  height: 260px;
  width: 500px;
  display: block;
  margin: auto;
}
</style>
