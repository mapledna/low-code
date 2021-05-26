<template>
  <div v-show="show" class="loading-container">
    <div class="loading-mask" />
    <div class="loading-content">
      <div class="loading-logo">
        <img src="./img/logo_loading.png" alt="" />
      </div>
      <div class="loading-text">加载中</div>
      <div class="loading-animate">
        <!-- <img src="./img/icon_loading.png" alt=""> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UiLoading',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  methods: {},
}
</script>

<style scoped>
.loading-container {
  position: relative;
  text-align: center;
}

.loading-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.loading-content {
  position: fixed;
  top: 45%;
  left: 50%;
  z-index: 999;
  transform: translate(-50%, -45%);
  text-align: center;
  color: #fff;
}

.loading-content .loading-logo {
  width: 127px;
  height: 77px;
  position: relative;
}

.loading-content .loading-logo img {
  /* width:127px; */
  animation: topBottomShow 0.5s ease-in;
}

.loading-content .loading-animate {
  display: inline-block;
  width: 30px;
  height: 30px;
  margin: 0px;
  position: absolute;
  right: 20px;
  bottom: -2px;
  background: url("./img/icon_loading.png") no-repeat center;
  animation: circleLoading 1.5s ease-in infinite;
}

.loading-content .loading-text {
  font-size: 16px;
  text-align: left;
  text-indent: 20px;
  height: 30px;
  line-height: 30px;
}

@keyframes circleLoading {
  0% {
    transform: rotate3d(0, 0, 1, 0deg);
  }

  100% {
    transform: rotate3d(0, 0, 1, 360deg);
  }
}

@keyframes topBottomShow {
  0% {
    height: 0px;
  }

  100% {
    height: 77px;
  }
}
</style>
