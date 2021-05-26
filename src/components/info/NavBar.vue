<template>
  <div class="bg" :class="{ isfixed: fixed }">
    <div class="nav-contanir">
      <div class="left-content" @click="showMenu">
        <img
          class="menu-img"
          src="../../assets/img/info/cloud-warehouse-ph/menu_icon.png"
        />
      </div>
      <div class="center-content">
        <img
          class="title-img"
          src="../../assets/img/info/cloud-warehouse-ph/logo_icon.png"
        />
      </div>
      <div class="right-content">
        <img
          class="head-img"
          src="../../assets/img/info/cloud-warehouse-ph/white_head.png"
        />
      </div>
    </div>
    <drawer-menu ref="drawerMenu" />
  </div>
</template>
<script>
import DrawerMenu from "@/components/info/DrawerMenu";

export default {
  components: { DrawerMenu },
  props: {
    title: {
      type: String,
      default: "",
    },
    // 是否显示左侧箭头
    leftArrow: {
      type: Boolean,
      default: false,
    },
    // 是否固定在顶部
    fixed: {
      type: Boolean,
      default: false,
    },
    background: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  name: "navBar",
  data: {},
  methods: {
    showMenu: function () {
      this.$refs.drawerMenu.openMenu();
    },
  },
};
</script>
<style lang="scss" scoped>
.bg {
  background: transparent;
  z-index: 10;
   position: fixed;
    width: 100%;
    background-image: linear-gradient(to right, #5a95f1, #745ae2);
    background-color: #6777e9;
  .nav-contanir {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 60px;
    .left-content {
      margin-left: 18px;
      min-width: 80px;
    }
    .center-content {
      flex: 1;
      text-align: center;
      font-size: 20px;
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
    .right-content {
      min-width: 80px;
      display: flex;
      flex-direction: row-reverse;
      margin-right: 18px;
    }

    .menu-img {
      width: 15px;
      height: 14px;
    }
    .title-img {
      width: 115px;
      height: 23px;
    }
    .head-img {
      width: 16px;
      height: 18px;
    }
  }
}
.isfixed {
  position: fixed;
  width: 100%;
}
</style>
