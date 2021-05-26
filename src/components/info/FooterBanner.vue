<template>
  <div class="foot-logo-view">
    <img src="../../assets/img/info/cloud-warehouse-ph/logo_icon.png" alt="" />
    <div class="foot-text">智慧物流·智能制造系统提供商</div>
    <div class="contact-button">服务咨询</div>
  </div>
</template>
<script>
export default {
  name: "FooterBanner",
  components: {},
  props: {},
  data: {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.foot-logo-view {
  background-color: #424242;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 45px;
  padding-bottom: 27px;
  align-items: center;
  img {
    width: 125px;
    height: 25px;
  }
  .foot-text {
    font-family: "MicrosoftYaHei";
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 14px;
    letter-spacing: 3px;
    color: #9b9ea0;
    margin-top: 32px;
    margin-bottom: 28px;
  }
  .contact-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120px;
    height: 30px;
    background-color: #1b9fff;
    border-radius: 15px;
    font-family: "MicrosoftYaHei";
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 11px;
    letter-spacing: 0px;
    color: #ffffff;
  }
}
</style>