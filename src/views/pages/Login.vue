<template>
  <div class="login-container">
    <ui-login-page
      :login-bg-large="loginBgLarge"
      :login-bg-small="loginBgSmall"
      :img-src="imgSrc"
      :login-url="loginUrl"
      :system-info="systemInfo"
      :project-name="projectName"
      :userip="userip"
      :path="path"
      :name="name"
      :app-code="appCode"
      :validate-username="validateUsername"
      :validate-password="validatePassword"
      :node-env="nodeEnv"
    />
  </div>
</template>

<script>
// import UiLoginPage from '@/components/UiLoginPage/Index.vue'

export default {
  name: 'Login',
  // components: {
  //   UiLoginPage
  // },
  data() {
    return {
      // eslint-disable-next-line global-require
      loginBgLarge: '/img/nti/login_bg_pc.png', // 大屏背景
      // eslint-disable-next-line global-require
      loginBgSmall: '/img/nti/login_bg_phone.png', // 小屏背景
      // eslint-disable-next-line global-require
      imgSrc: '/img/nti/logo.png', // 系统对应的logo
      loginUrl: '/oauth/oauth/token', // 系统对应的logo
      projectName: 'XXXXX', // 系统名称
      systemInfo: { // 系统说明信息
        title: '',
        desc: ''
      },
      validateUsername: '',
      validatePassword: '',
      userip: '127.0.0.1', // 用户ip
      appCode: 'prod', // 产品编码
      path: '/', // 成功登录之后跳转的路由地址
      name: 'mainView', // 成功登录之后跳转的路由名称
      nodeEnv: process.env.NODE_ENV || 'development' // 当前页面环境变量 作为参数 (当前环境env为{}，为了测试加个development)
    }
  }
}
</script>
