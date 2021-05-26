<template>
  <div
    class="login"
    :style="{
      backgroundImage: loginBg ? 'url(' + loginBg + ')' : 'none',
      backgroundSize: 'cover',
      height: screenHeight + 'px',
    }"
  >
    <header>
      <div class="logo">
        <img :src="imgSrc" alt="logo">
      </div>
    </header>
    <el-form
      ref="form"
      class="login_form"
      :model="form"
      :rules="rules"
      label-position="right"
      @submit.native.prevent
    >
      <div class="logo_mini">
        <img :src="imgSrc" alt="">
      </div>
      <div class="login_title">
        <h3 class="title">
          {{ projectName }}
        </h3>
      </div>
      <div class="form_area">
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            class="login_input"
            placeholder="请输入账号"
          >
            <i slot="prefix" class="el-input__icon login_icon user" />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            class="login_input"
            placeholder="请输入密码"
            show-password
          >
            <i slot="prefix" class="el-input__icon login_icon password" />
          </el-input>
          <el-button type="text" class="forget_password" @click="forgetPswd">
            忘记密码？
          </el-button>
        </el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          class="btn experience_btn"
          native-type="submit"
          @click="loginButton"
        >
          登 录
        </el-button>
      </div>
    </el-form>

    <el-dialog
      :title="dialogType == '1' ? '用户注册' : '登录提示'"
      :visible.sync="dialogVisible"
      width="340px"
    >
      <template v-if="dialogType == '1'">
        <div style="line-height: 30px; text-align: left">
          方式一：<br>通过平台注册企业帐号，由管理员添加用户分配权限使用；<br>
          方式二：<br>通过钉钉注册，由钉钉同步组织及人员，直接从钉钉入口登录。
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="doSelect('dingding')">钉钉入口</el-button>
          <el-button type="primary" @click="doSelect('platform')">平台注册</el-button>
        </span>
      </template>
      <template v-else-if="dialogType == '2'">
        <div style="line-height: 30px; text-align: left">
          该帐号在IP(106.122.202.122)有登录,是否注销强行登录？
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="doSelect('dingding')">取消登录</el-button>
          <el-button type="primary" @click="doSelect('platform')">继续登录</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import common from '@/utils/tool'
// import VueParticles from 'vue-particles'
import { changeFavicon } from '@/utils/favicon'

export default {
  name: 'UiLoginPage',
  components: {
    // VueParticles
  },
  props: [
    'loginBgLarge', // 大屏背景
    'loginBgSmall', // 小屏背景
    'loginUrl', // 登录接口url
    'imgSrc', // 系统对应的logo
    // 'systemInfo', // 系统说明信息
    'websiteIco', // 网站ico图标
    'projectName', // 系统名称
    'userip', // 用户ip
    'appCode', // 产品编码
    'path', // 成功登录之后跳转的路由地址
    'name', // 成功登录之后跳转的路由名称
    'validateUsername', // 账号的校验规则
    'validatePassword', // 密码的校验规则
    'nodeEnv' // 当前页面环境变量
  ],
  data() {
    const validateUsernameNow = this.validateUsername
      ? this.validateUsername
      : (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入账号！'))
        } else {
          callback()
        }
      }
    const validatePasswordNow = this.validatePassword
      ? this.validatePassword
      : (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码！'))
        } else if (value.length < 6) {
          callback(new Error('密码长度应不小于6位！'))
        } else {
          callback()
        }
      }
    return {
      screenHeight: document.documentElement.clientHeight,
      form: {
        username: '', // zh
        password: '' // Zhouhang123.
      },
      loginBg: '',
      rules: {
        username: [
          {
            trigger: 'blur',
            validator: validateUsernameNow
          }
        ],
        password: [
          {
            trigger: 'blur',
            validator: validatePasswordNow
          }
        ]
      },

      loading: false,
      dialogVisible: false,
      dialogType: '1' // 1 代表注册 2代表重新登录
    }
  },
  mounted() {
    if (document.documentElement.clientWidth < 768) {
      this.loginBg = this.loginBgSmall
    } else {
      this.loginBg = this.loginBgLarge
    }

    window.onresize = () => {
      this.screenHeight = document.documentElement.clientHeight
      const { clientWidth } = document.documentElement
      if (clientWidth < 768) {
        this.loginBg = this.loginBgSmall
      } else {
        this.loginBg = this.loginBgLarge
      }
    }
    document.title = this.projectName
    this.changeWebsiteIco()
  },
  methods: {
    // 修改网页的ico图标
    changeWebsiteIco() {
      // console.log('this.websiteIco', this.websiteIco)
      if (this.websiteIco) {
        window.localStorage.setItem('websiteIco', this.websiteIco) // 存储以供其他页面使用
        changeFavicon(this.websiteIco)
      }
    },
    forgetPswd() {
      // 忘记密码
      window.location.href = 'https://cloud.nti56.com/Main/FindUserPswd'
    },
    loginButton() {
      // 手动点击登录
      this.$refs.form.validate(valid => {
        if (valid) {
          this.apilogin(false)
        }
        return false
      })
    },
    // 调用登录接口
    apilogin(islogin) {
      this.$server.getLogin(islogin, {
        username: this.form.username,
        password: this.form.password,
        loginUrl: this.loginUrl,
        appCode: this.appCode,
        path: this.path
      },
      this.$ntiLoading)
    }
  }
}
</script>
