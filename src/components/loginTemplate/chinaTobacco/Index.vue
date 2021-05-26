<template>
  <div class="login chinaTobacco" :style="{backgroundImage:loginBg?'url('+loginBg+')':'none', backgroundSize:'cover',height:screenHeight+'px'}">
    <header>
      <div class="logo">
        <img :src="imgSrc" alt="logo">
      </div>
    </header>
    <div class="system_info">
      <!-- <div class="title">
        {{ systemInfo.title }}
      </div>
      <div class="desc">
        {{ systemInfo.desc }}
      </div> -->
    </div>

    <el-form ref="form" class="login_form" :model="form" :rules="rules" label-position="right">
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
            @keyup.enter.native="loginButton"
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
            @keyup.enter.native="loginButton"
          >
            <i slot="prefix" class="el-input__icon login_icon password" />
          </el-input>
          <span class="forget_password" @click="forgetPswd">忘记密码？</span>
        </el-form-item>
        <el-form-item prop="warehouse">
          <el-select
            v-model="form.warehouse"
            class="login_select"
            placeholder="请选择仓库"
          >
            <el-option label="片烟库" value="pianyan" />
            <el-option label="标准库" value="biaozhun" />
            <i slot="prefix" class="el-input__icon login_icon warehouse" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- <input type="button" :loading='loading' class="btn experience_btn" @click='loginButton' value="登录"  />
          <input type="button" class="btn experience_btn_reg" @click='register' value="注册" /> -->
          <el-button type="primary" :loading="loading" class="btn experience_btn" @click="loginButton">
            登 录
          </el-button>
          <!-- <el-button  class="btn experience_btn_reg" @click='register' >注册</el-button> -->
        </el-form-item>
      </div>
    </el-form>

    <div id="lottie" />

    <el-dialog
      :title="dialogType=='1'?'用户注册':'登录提示'"
      :visible.sync="dialogVisible"
      width="340px"
    >
      <template v-if="dialogType=='1'">
        <div style="line-height:30px;text-align:left;">
          方式一：<br>通过平台注册企业帐号，由管理员添加用户分配权限使用；<br>
          方式二：<br>通过钉钉注册，由钉钉同步组织及人员，直接从钉钉入口登录。
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="doSelect('dingding')">钉钉入口</el-button>
          <el-button type="primary" @click="doSelect('platform')">平台注册</el-button>
        </span>
      </template>
      <template v-else-if="dialogType=='2'">
        <div style="line-height:30px;text-align:left;">
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
import lottie from '@/utils/lottie'
import { changeFavicon } from '@/utils/favicon'

export default {
  name: 'UiLoginPage',
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
    const validateUsernameNow = this.validateUsername ? this.validateUsername : (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号！'))
      } else {
        callback()
      }
    }
    const validatePasswordNow = this.validatePassword ? this.validatePassword : (rule, value, callback) => {
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
        password: '', // Zhouhang123.
        warehouse: '' // zh
      },
      loginBg: '',
      rules: {
        username: [{ trigger: 'blur', validator: validateUsernameNow }],
        password: [{ trigger: 'blur', validator: validatePasswordNow }]
      },

      loading: false,
      dialogVisible: false,
      dialogType: '1', // 1 代表注册 2代表重新登录
      lottie: null // 动效对象

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

      if (document.documentElement.clientWidth > 1199) {
        this.loadLottie()
      }
    }
    document.title = this.projectName

    this.changeWebsiteIco()

    // 页面初始宽度够的情况下 显示动效
    if (document.documentElement.clientWidth > 1199) {
      this.loadLottie()
    }
  },
  methods: {
    // 修改网页的ico图标
    changeWebsiteIco() {
      if (this.websiteIco) {
        window.localStorage.setItem('websiteIco', this.websiteIco) // 存储以供其他页面使用
        changeFavicon(this.websiteIco)
      }
    },
    forgetPswd() { // 忘记密码
      window.location.href = 'https://cloud.nti56.com/Main/FindUserPswd'
    },
    loginButton() { // 手动点击登录
      // this.$ntiLoading.show()

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
      }, this.$ntiLoading)
    },
    // 加载动效
    loadLottie() {
      // if (typeof navigator !== 'undefined') {
      //   (function (root, factory) {
      //     if (typeof define === 'function' && define.amd) {
      //       define(() => factory(root))
      //     } else if (typeof module === 'object' && module.exports) {
      //       module.exports = factory(root)
      //     } else {
      //       root.lottie = factory(root)
      //       root.bodymovin = root.lottie
      //     }
      //   }((window || {}), lottie))
      // }
      if (this.lottie) {
        return
      }
      this.lottie = lottie(window || {})
      console.log('lottie', this.lottie)


      const animationData = {
        v: '5.6.6',
        fr: 60,
        ip: 0,
        op: 900,
        w: 800,
        h: 700,
        nm: 'login_illustration',
        ddd: 0,
        assets: [{
          id: 'image_0', w: 126, h: 86, u: './img/login/chinaTobacco/', p: '3_1.png', e: 0
        }, {
          id: 'image_1', w: 84, h: 81, u: './img/login/chinaTobacco/', p: '3_2.png', e: 0
        }, {
          id: 'image_2', w: 117, h: 126, u: './img/login/chinaTobacco/', p: '3_3.png', e: 0
        }, {
          id: 'image_3', w: 269, h: 236, u: './img/login/chinaTobacco/', p: '3_4.png', e: 0
        }, {
          id: 'image_4', w: 112, h: 98, u: './img/login/chinaTobacco/', p: '3_5.png', e: 0
        }, {
          id: 'image_5', w: 68, h: 77, u: './img/login/chinaTobacco/', p: '3_6.png', e: 0
        }, {
          id: 'image_6', w: 227, h: 175, u: './img/login/chinaTobacco/', p: '2_1.png', e: 0
        }, {
          id: 'image_7', w: 66, h: 75, u: './img/login/chinaTobacco/', p: '2_2.png', e: 0
        }, {
          id: 'image_8', w: 98, h: 85, u: './img/login/chinaTobacco/', p: '2_3.png', e: 0
        }, {
          id: 'image_9', w: 66, h: 76, u: './img/login/chinaTobacco/', p: '2_4.png', e: 0
        }, {
          id: 'image_10', w: 103, h: 185, u: './img/login/chinaTobacco/', p: '2_5.png', e: 0
        }, {
          id: 'image_11', w: 239, h: 210, u: './img/login/chinaTobacco/', p: '2_6.png', e: 0
        }, {
          id: 'image_12', w: 196, h: 154, u: './img/login/chinaTobacco/', p: '1_1.png', e: 0
        }, {
          id: 'image_13', w: 146, h: 113, u: './img/login/chinaTobacco/', p: '1_2.png', e: 0
        }, {
          id: 'image_14', w: 280, h: 272, u: './img/login/chinaTobacco/', p: '1_3.png', e: 0
        }, {
          id: 'image_15', w: 116, h: 112, u: './img/login/chinaTobacco/', p: '1_4.png', e: 0
        }, {
          id: 'image_16', w: 48, h: 53, u: './img/login/chinaTobacco/', p: '1_5.png', e: 0
        }, {
          id: 'image_17', w: 41, h: 120, u: './img/login/chinaTobacco/', p: '1_6.png', e: 0
        }, {
          id: 'comp_0',
          layers: [{
            ddd: 0,
            ind: 1,
            ty: 0,
            nm: 'i3',
            td: 1,
            refId: 'comp_1',
            sr: 1,
            ks: {
              o: { a: 0, k: 100, ix: 11 }, r: { a: 0, k: 0, ix: 10 }, p: { a: 0, k: [400, 348, 0], ix: 2 }, a: { a: 0, k: [960, 540, 0], ix: 1 }, s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            w: 1920,
            h: 1080,
            ip: 600,
            op: 900,
            st: 600,
            bm: 0
          }, {
            ddd: 0,
            ind: 2,
            ty: 4,
            nm: '形状图层 6',
            tt: 1,
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 123, s: [70]
                }, {
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 619, s: [90]
                }, {
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 670, s: [0]
                }, {
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 723, s: [90]
                }, {
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 774, s: [0]
                }, {
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 828, s: [90]
                }, { t: 885, s: [0] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: { a: 0, k: [632, 466, 0], ix: 2 },
              a: { a: 0, k: [0, 0, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            shapes: [{
              ty: 'gr',
              it: [{
                ty: 'rc', d: 1, s: { a: 0, k: [624.07, 419.68], ix: 2 }, p: { a: 0, k: [0, 0], ix: 3 }, r: { a: 0, k: 0, ix: 4 }, nm: '矩形路径 1', mn: 'ADBE Vector Shape - Rect', hd: false
              }, {
                ty: 'fl', c: { a: 0, k: [1, 0.993245921415, 0.965104166667, 1], ix: 4 }, o: { a: 0, k: 100, ix: 5 }, r: 1, bm: 0, nm: '填充 1', mn: 'ADBE Vector Graphic - Fill', hd: false
              }, {
                ty: 'tr', p: { a: 0, k: [-375.965, -138.16], ix: 2 }, a: { a: 0, k: [0, 0], ix: 1 }, s: { a: 0, k: [100, 100], ix: 3 }, r: { a: 0, k: 0, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: '变换'
              }],
              nm: '矩形 1',
              np: 3,
              cix: 2,
              bm: 0,
              ix: 1,
              mn: 'ADBE Vector Group',
              hd: false
            }],
            ip: 600,
            op: 900,
            st: 600,
            bm: 0
          }, {
            ddd: 0,
            ind: 3,
            ty: 0,
            nm: 'i3',
            refId: 'comp_1',
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 885, s: [100]
                }, { t: 899, s: [35] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: {
                a: 1,
                k: [{
                  i: { x: 0.833, y: 0.833 }, o: { x: 0.167, y: 0.167 }, t: 885, s: [400, 348, 0], to: [0, -15, 0], ti: [0, 15, 0]
                }, { t: 899, s: [400, 258, 0] }],
                ix: 2
              },
              a: { a: 0, k: [960, 540, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            w: 1920,
            h: 1080,
            ip: 600,
            op: 900,
            st: 600,
            bm: 0
          }, {
            ddd: 0,
            ind: 4,
            ty: 0,
            nm: 'i2',
            td: 1,
            refId: 'comp_2',
            sr: 1,
            ks: {
              o: { a: 0, k: 100, ix: 11 }, r: { a: 0, k: 0, ix: 10 }, p: { a: 0, k: [400, 348, 0], ix: 2 }, a: { a: 0, k: [960, 540, 0], ix: 1 }, s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            w: 1920,
            h: 1080,
            ip: 300,
            op: 600,
            st: 300,
            bm: 0
          }, {
            ddd: 0,
            ind: 5,
            ty: 4,
            nm: '形状图层 5',
            tt: 1,
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 123, s: [70]
                }, {
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 319, s: [90]
                }, {
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 370, s: [0]
                }, {
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 423, s: [90]
                }, {
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 474, s: [0]
                }, {
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 528, s: [90]
                }, { t: 585, s: [0] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: { a: 0, k: [632, 466, 0], ix: 2 },
              a: { a: 0, k: [0, 0, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            shapes: [{
              ty: 'gr',
              it: [{
                ty: 'rc', d: 1, s: { a: 0, k: [624.07, 419.68], ix: 2 }, p: { a: 0, k: [0, 0], ix: 3 }, r: { a: 0, k: 0, ix: 4 }, nm: '矩形路径 1', mn: 'ADBE Vector Shape - Rect', hd: false
              }, {
                ty: 'fl', c: { a: 0, k: [1, 0.993245921415, 0.965104166667, 1], ix: 4 }, o: { a: 0, k: 100, ix: 5 }, r: 1, bm: 0, nm: '填充 1', mn: 'ADBE Vector Graphic - Fill', hd: false
              }, {
                ty: 'tr', p: { a: 0, k: [-375.965, -138.16], ix: 2 }, a: { a: 0, k: [0, 0], ix: 1 }, s: { a: 0, k: [100, 100], ix: 3 }, r: { a: 0, k: 0, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: '变换'
              }],
              nm: '矩形 1',
              np: 3,
              cix: 2,
              bm: 0,
              ix: 1,
              mn: 'ADBE Vector Group',
              hd: false
            }],
            ip: 300,
            op: 600,
            st: 300,
            bm: 0
          }, {
            ddd: 0,
            ind: 6,
            ty: 0,
            nm: 'i2',
            refId: 'comp_2',
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 585, s: [100]
                }, { t: 599, s: [35] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: {
                a: 1,
                k: [{
                  i: { x: 0.833, y: 0.833 }, o: { x: 0.167, y: 0.167 }, t: 585, s: [400, 348, 0], to: [0, -15, 0], ti: [0, 15, 0]
                }, { t: 599, s: [400, 258, 0] }],
                ix: 2
              },
              a: { a: 0, k: [960, 540, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            w: 1920,
            h: 1080,
            ip: 300,
            op: 600,
            st: 300,
            bm: 0
          }, {
            ddd: 0,
            ind: 7,
            ty: 0,
            nm: 'i1',
            td: 1,
            refId: 'comp_3',
            sr: 1,
            ks: {
              o: { a: 0, k: 100, ix: 11 }, r: { a: 0, k: 0, ix: 10 }, p: { a: 0, k: [400, 344, 0], ix: 2 }, a: { a: 0, k: [960, 540, 0], ix: 1 }, s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            w: 1920,
            h: 1080,
            ip: 0,
            op: 300,
            st: 0,
            bm: 0
          }, {
            ddd: 0,
            ind: 8,
            ty: 4,
            nm: '形状图层 4',
            tt: 1,
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 24, s: [90]
                }, {
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 70, s: [0]
                }, {
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 123, s: [90]
                }, {
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 174, s: [0]
                }, {
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 228, s: [90]
                }, { t: 285, s: [0] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: { a: 0, k: [632, 462, 0], ix: 2 },
              a: { a: 0, k: [0, 0, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            shapes: [{
              ty: 'gr',
              it: [{
                ty: 'rc', d: 1, s: { a: 0, k: [624.07, 419.68], ix: 2 }, p: { a: 0, k: [0, 0], ix: 3 }, r: { a: 0, k: 0, ix: 4 }, nm: '矩形路径 1', mn: 'ADBE Vector Shape - Rect', hd: false
              }, {
                ty: 'fl', c: { a: 0, k: [1, 0.993245921415, 0.965104166667, 1], ix: 4 }, o: { a: 0, k: 100, ix: 5 }, r: 1, bm: 0, nm: '填充 1', mn: 'ADBE Vector Graphic - Fill', hd: false
              }, {
                ty: 'tr', p: { a: 0, k: [-375.965, -138.16], ix: 2 }, a: { a: 0, k: [0, 0], ix: 1 }, s: { a: 0, k: [100, 100], ix: 3 }, r: { a: 0, k: 0, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: '变换'
              }],
              nm: '矩形 1',
              np: 3,
              cix: 2,
              bm: 0,
              ix: 1,
              mn: 'ADBE Vector Group',
              hd: false
            }],
            ip: 0,
            op: 300,
            st: 0,
            bm: 0
          }, {
            ddd: 0,
            ind: 9,
            ty: 0,
            nm: 'i1',
            refId: 'comp_3',
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 275, s: [100]
                }, { t: 299, s: [35] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: {
                a: 1,
                k: [{
                  i: { x: 0.833, y: 0.833 }, o: { x: 0.167, y: 0.167 }, t: 285, s: [400, 344, 0], to: [0, -15, 0], ti: [0, 15, 0]
                }, { t: 299, s: [400, 254, 0] }],
                ix: 2
              },
              a: { a: 0, k: [960, 540, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            w: 1920,
            h: 1080,
            ip: 0,
            op: 300,
            st: 0,
            bm: 0
          }, {
            ddd: 0,
            ind: 10,
            ty: 5,
            nm: '为您的仓储管理提供一个完整的管理方案 从配置管理到实际应用，您都可以在短时间内高效地完成 2',
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 49, s: [0]
                }, { t: 79, s: [100] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: {
                a: 1,
                k: [{
                  i: { x: 0.833, y: 0.833 }, o: { x: 0.167, y: 0.167 }, t: 49, s: [83, 633, 0], to: [0, -2.333, 0], ti: [0, 2.333, 0]
                }, {
                  i: { x: 0.833, y: 0.833 }, o: { x: 0.167, y: 0.167 }, t: 79, s: [83, 619, 0], to: [0, 0, 0], ti: [0, 0, 0]
                }, { t: 145, s: [83, 619, 0] }],
                ix: 2
              },
              a: { a: 0, k: [0, 0, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            t: {
              d: {
                k: [{
                  s: {
                    s: 16, f: 'PingFangSC-Regular', t: '为您的仓储管理提供一个完整的管理方案\r从配置管理到实际应用，您都可以在短时间内高效地完成', j: 0, tr: 0, lh: 28, ls: 0, fc: [1, 1, 1]
                  },
                  t: 0
                }]
              },
              p: {},
              m: { g: 1, a: { a: 0, k: [0, 0], ix: 2 } },
              a: []
            },
            ip: 49,
            op: 928,
            st: 49,
            bm: 0
          }, {
            ddd: 0,
            ind: 11,
            ty: 5,
            nm: '运输管理系统 2',
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 21, s: [0]
                }, { t: 51, s: [100] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: {
                a: 1,
                k: [{
                  i: { x: 0.833, y: 0.833 }, o: { x: 0.167, y: 0.167 }, t: 21, s: [260, 625, 0], to: [0, -7.333, 0], ti: [0, 7.333, 0]
                }, {
                  i: { x: 0.833, y: 0.833 }, o: { x: 0.167, y: 0.167 }, t: 51, s: [260, 581, 0], to: [0, 0, 0], ti: [0, 0, 0]
                }, { t: 145, s: [260, 581, 0] }],
                ix: 2
              },
              a: { a: 0, k: [0, 0, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            t: {
              d: {
                k: [{
                  s: {
                    s: 36, f: 'PingFangSC-Regular', t: '运输管理系统', j: 2, tr: 0, lh: 43.2, ls: 0, fc: [1, 1, 1]
                  },
                  t: 0
                }]
              },
              p: {},
              m: { g: 1, a: { a: 0, k: [0, 0], ix: 2 } },
              a: []
            },
            ip: 21,
            op: 922,
            st: 21,
            bm: 0
          }]
        }, {
          id: 'comp_1',
          layers: [{
            ddd: 0,
            ind: 1,
            ty: 2,
            nm: '3_1.png',
            cl: 'png',
            refId: 'image_0',
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 13, s: [0]
                }, { t: 33, s: [100] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: {
                a: 1,
                k: [{
                  i: { x: 0.74, y: 1 }, o: { x: 0.4, y: 0.8 }, t: 13, s: [686, 779, 0], to: [0, -25.333, 0], ti: [0, 20.833, 0]
                }, {
                  i: { x: 0.6, y: 0.436 }, o: { x: 0.26, y: 0 }, t: 32, s: [686, 627, 0], to: [0, -20.833, 0], ti: [0, -4.5, 0]
                }, { t: 41, s: [686, 654, 0] }],
                ix: 2
              },
              a: { a: 0, k: [63, 43, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            ip: 13,
            op: 313,
            st: 13,
            bm: 0
          }, {
            ddd: 0,
            ind: 2,
            ty: 2,
            nm: '3_2.png',
            cl: 'png',
            refId: 'image_1',
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 16, s: [0]
                }, { t: 36, s: [100] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: {
                a: 1,
                k: [{
                  i: { x: 0.74, y: 1 }, o: { x: 0.4, y: 0.8 }, t: 16, s: [640, 704, 0], to: [0, -25.333, 0], ti: [0, 20.833, 0]
                }, {
                  i: { x: 0.6, y: 0.436 }, o: { x: 0.26, y: 0 }, t: 35, s: [640, 552, 0], to: [0, -20.833, 0], ti: [0, -4.5, 0]
                }, { t: 44, s: [640, 579, 0] }],
                ix: 2
              },
              a: { a: 0, k: [42, 40.5, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            ip: 16,
            op: 316,
            st: 16,
            bm: 0
          }, {
            ddd: 0,
            ind: 3,
            ty: 2,
            nm: '3_3.png',
            cl: 'png',
            refId: 'image_2',
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 10, s: [0]
                }, { t: 30, s: [100] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: {
                a: 1,
                k: [{
                  i: { x: 0.74, y: 1 }, o: { x: 0.4, y: 0.8 }, t: 10, s: [894, 774, 0], to: [0, -25.333, 0], ti: [0, 20.833, 0]
                }, {
                  i: { x: 0.6, y: 0.436 }, o: { x: 0.26, y: 0 }, t: 29, s: [894, 622, 0], to: [0, -20.833, 0], ti: [0, -4.5, 0]
                }, { t: 38, s: [894, 649, 0] }],
                ix: 2
              },
              a: { a: 0, k: [58.5, 63, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            ip: 10,
            op: 310,
            st: 10,
            bm: 0
          }, {
            ddd: 0,
            ind: 4,
            ty: 2,
            nm: '3_4.png',
            cl: 'png',
            refId: 'image_3',
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 7, s: [0]
                }, { t: 27, s: [100] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: {
                a: 1,
                k: [{
                  i: { x: 0.74, y: 1 }, o: { x: 0.4, y: 0.8 }, t: 7, s: [777, 620, 0], to: [0, -25.333, 0], ti: [0, 20.833, 0]
                }, {
                  i: { x: 0.6, y: 0.436 }, o: { x: 0.26, y: 0 }, t: 26, s: [777, 468, 0], to: [0, -20.833, 0], ti: [0, -4.5, 0]
                }, { t: 35, s: [777, 495, 0] }],
                ix: 2
              },
              a: { a: 0, k: [134.5, 118, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            ip: 7,
            op: 307,
            st: 7,
            bm: 0
          }, {
            ddd: 0,
            ind: 5,
            ty: 2,
            nm: '3_5.png',
            cl: 'png',
            refId: 'image_4',
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 4, s: [0]
                }, { t: 24, s: [100] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: {
                a: 1,
                k: [{
                  i: { x: 0.74, y: 1 }, o: { x: 0.4, y: 0.8 }, t: 4, s: [1001, 705, 0], to: [0, -25.333, 0], ti: [0, 20.833, 0]
                }, {
                  i: { x: 0.6, y: 0.436 }, o: { x: 0.26, y: 0 }, t: 23, s: [1001, 553, 0], to: [0, -20.833, 0], ti: [0, -4.5, 0]
                }, { t: 32, s: [1001, 580, 0] }],
                ix: 2
              },
              a: { a: 0, k: [56, 49, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            ip: 4,
            op: 304,
            st: 4,
            bm: 0
          }, {
            ddd: 0,
            ind: 6,
            ty: 2,
            nm: '3_6.png',
            cl: 'png',
            refId: 'image_5',
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0]
                }, { t: 20, s: [100] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: {
                a: 1,
                k: [{
                  i: { x: 0.74, y: 1 }, o: { x: 0.4, y: 0.8 }, t: 0, s: [939, 620, 0], to: [0, -25.333, 0], ti: [0, 20.833, 0]
                }, {
                  i: { x: 0.6, y: 0.436 }, o: { x: 0.26, y: 0 }, t: 19, s: [939, 468, 0], to: [0, -20.833, 0], ti: [0, -4.5, 0]
                }, { t: 28, s: [939, 495, 0] }],
                ix: 2
              },
              a: { a: 0, k: [34, 38.5, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            ip: 0,
            op: 300,
            st: 0,
            bm: 0
          }]
        }, {
          id: 'comp_2',
          layers: [{
            ddd: 0,
            ind: 1,
            ty: 2,
            nm: '2_1.png',
            cl: 'png',
            refId: 'image_6',
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 13, s: [0]
                }, { t: 33, s: [100] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: {
                a: 1,
                k: [{
                  i: { x: 0.74, y: 1 }, o: { x: 0.4, y: 0.8 }, t: 13, s: [734, 758, 0], to: [0, -25.333, 0], ti: [0, 20.833, 0]
                }, {
                  i: { x: 0.6, y: 0.436 }, o: { x: 0.26, y: 0 }, t: 32, s: [734, 606, 0], to: [0, -20.833, 0], ti: [0, -4.5, 0]
                }, { t: 41, s: [734, 633, 0] }],
                ix: 2
              },
              a: { a: 0, k: [113.5, 87.5, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            ip: 13,
            op: 300,
            st: 13,
            bm: 0
          }, {
            ddd: 0,
            ind: 2,
            ty: 2,
            nm: '2_2.png',
            cl: 'png',
            refId: 'image_7',
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 16, s: [0]
                }, { t: 36, s: [100] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: {
                a: 1,
                k: [{
                  i: { x: 0.74, y: 1 }, o: { x: 0.4, y: 0.8 }, t: 16, s: [1003, 787, 0], to: [0, -25.333, 0], ti: [0, 20.833, 0]
                }, {
                  i: { x: 0.6, y: 0.436 }, o: { x: 0.26, y: 0 }, t: 35, s: [1003, 635, 0], to: [0, -20.833, 0], ti: [0, -4.5, 0]
                }, { t: 44, s: [1003, 662, 0] }],
                ix: 2
              },
              a: { a: 0, k: [33, 37.5, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            ip: 16,
            op: 300,
            st: 16,
            bm: 0
          }, {
            ddd: 0,
            ind: 3,
            ty: 2,
            nm: '2_3.png',
            cl: 'png',
            refId: 'image_8',
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 10, s: [0]
                }, { t: 30, s: [100] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: {
                a: 1,
                k: [{
                  i: { x: 0.74, y: 1 }, o: { x: 0.4, y: 0.8 }, t: 10, s: [891, 794, 0], to: [0, -25.333, 0], ti: [0, 20.833, 0]
                }, {
                  i: { x: 0.6, y: 0.436 }, o: { x: 0.26, y: 0 }, t: 29, s: [891, 642, 0], to: [0, -20.833, 0], ti: [0, -4.5, 0]
                }, { t: 38, s: [891, 669, 0] }],
                ix: 2
              },
              a: { a: 0, k: [49, 42.5, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            ip: 10,
            op: 300,
            st: 10,
            bm: 0
          }, {
            ddd: 0,
            ind: 4,
            ty: 2,
            nm: '2_4.png',
            cl: 'png',
            refId: 'image_9',
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 7, s: [0]
                }, { t: 27, s: [100] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: {
                a: 1,
                k: [{
                  i: { x: 0.74, y: 1 }, o: { x: 0.4, y: 0.8 }, t: 7, s: [624, 689, 0], to: [0, -25.333, 0], ti: [0, 20.833, 0]
                }, {
                  i: { x: 0.6, y: 0.436 }, o: { x: 0.26, y: 0 }, t: 26, s: [624, 537, 0], to: [0, -20.833, 0], ti: [0, -4.5, 0]
                }, { t: 35, s: [624, 564, 0] }],
                ix: 2
              },
              a: { a: 0, k: [33, 38, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            ip: 7,
            op: 300,
            st: 7,
            bm: 0
          }, {
            ddd: 0,
            ind: 5,
            ty: 2,
            nm: '2_5.png',
            cl: 'png',
            refId: 'image_10',
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 4, s: [0]
                }, { t: 24, s: [100] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: {
                a: 1,
                k: [{
                  i: { x: 0.74, y: 1 }, o: { x: 0.4, y: 0.8 }, t: 4, s: [732, 591, 0], to: [0, -25.333, 0], ti: [0, 20.833, 0]
                }, {
                  i: { x: 0.6, y: 0.436 }, o: { x: 0.26, y: 0 }, t: 23, s: [732, 439, 0], to: [0, -20.833, 0], ti: [0, -4.5, 0]
                }, { t: 32, s: [732, 466, 0] }],
                ix: 2
              },
              a: { a: 0, k: [51.5, 92.5, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            ip: 4,
            op: 300,
            st: 4,
            bm: 0
          }, {
            ddd: 0,
            ind: 6,
            ty: 2,
            nm: '2_6.png',
            cl: 'png',
            refId: 'image_11',
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0]
                }, { t: 20, s: [100] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: {
                a: 1,
                k: [{
                  i: { x: 0.74, y: 1 }, o: { x: 0.4, y: 0.8 }, t: 0, s: [925, 641, 0], to: [0, -25.333, 0], ti: [0, 20.833, 0]
                }, {
                  i: { x: 0.6, y: 0.436 }, o: { x: 0.26, y: 0 }, t: 19, s: [925, 489, 0], to: [0, -20.833, 0], ti: [0, -4.5, 0]
                }, { t: 28, s: [925, 516, 0] }],
                ix: 2
              },
              a: { a: 0, k: [119.5, 105, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            ip: 0,
            op: 300,
            st: 0,
            bm: 0
          }]
        }, {
          id: 'comp_3',
          layers: [{
            ddd: 0,
            ind: 1,
            ty: 2,
            nm: '1_1.png',
            cl: 'png',
            refId: 'image_12',
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 13, s: [0]
                }, { t: 33, s: [100] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: {
                a: 1,
                k: [{
                  i: { x: 0.74, y: 1 }, o: { x: 0.4, y: 0.8 }, t: 13, s: [686, 772, 0], to: [0, -18.796, 0], ti: [0, 28.746, 0]
                }, {
                  i: { x: 0.74, y: 1 }, o: { x: 0.284, y: 1 }, t: 32, s: [686, 620.788, 0], to: [0, -3.116, 0], ti: [0, 2.037, 0]
                }, { t: 41, s: [686, 647, 0] }],
                ix: 2
              },
              a: { a: 0, k: [98, 77, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            ip: 13,
            op: 300,
            st: 13,
            bm: 0
          }, {
            ddd: 0,
            ind: 2,
            ty: 2,
            nm: '1_2.png',
            cl: 'png',
            refId: 'image_13',
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 16, s: [0]
                }, { t: 36, s: [100] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: {
                a: 1,
                k: [{
                  i: { x: 0.74, y: 1 }, o: { x: 0.4, y: 0.8 }, t: 16, s: [841, 777, 0], to: [0, -18.796, 0], ti: [0, 28.746, 0]
                }, {
                  i: { x: 0.74, y: 1 }, o: { x: 0.284, y: 1 }, t: 35, s: [841, 625.788, 0], to: [0, -3.116, 0], ti: [0, 2.037, 0]
                }, { t: 44, s: [841, 652, 0] }],
                ix: 2
              },
              a: { a: 0, k: [73, 56.5, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            ip: 16,
            op: 300,
            st: 16,
            bm: 0
          }, {
            ddd: 0,
            ind: 3,
            ty: 2,
            nm: '1_3.png',
            cl: 'png',
            refId: 'image_14',
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 10, s: [0]
                }, { t: 30, s: [100] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: {
                a: 1,
                k: [{
                  i: { x: 0.74, y: 1 }, o: { x: 0.4, y: 0.8 }, t: 10, s: [808, 639, 0], to: [0, -18.796, 0], ti: [0, 28.746, 0]
                }, {
                  i: { x: 0.74, y: 1 }, o: { x: 0.284, y: 1 }, t: 29, s: [808, 487.788, 0], to: [0, -3.116, 0], ti: [0, 2.037, 0]
                }, { t: 38, s: [808, 514, 0] }],
                ix: 2
              },
              a: { a: 0, k: [140, 136, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            ip: 10,
            op: 300,
            st: 10,
            bm: 0
          }, {
            ddd: 0,
            ind: 4,
            ty: 2,
            nm: '1_4.png',
            cl: 'png',
            refId: 'image_15',
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 7, s: [0]
                }, { t: 27, s: [100] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: {
                a: 1,
                k: [{
                  i: { x: 0.74, y: 1 }, o: { x: 0.4, y: 0.8 }, t: 7, s: [963, 768, 0], to: [0, -18.796, 0], ti: [0, 28.745, 0]
                }, {
                  i: { x: 0.74, y: 1 }, o: { x: 0.284, y: 1 }, t: 26, s: [963, 616.787, 0], to: [0, -3.115, 0], ti: [0, 2.037, 0]
                }, { t: 35, s: [963, 643, 0] }],
                ix: 2
              },
              a: { a: 0, k: [58, 56, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            ip: 7,
            op: 300,
            st: 7,
            bm: 0
          }, {
            ddd: 0,
            ind: 5,
            ty: 2,
            nm: '1_5.png',
            cl: 'png',
            refId: 'image_16',
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 4, s: [0]
                }, { t: 24, s: [100] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: {
                a: 1,
                k: [{
                  i: { x: 0.74, y: 1 }, o: { x: 0.4, y: 0.8 }, t: 4, s: [1041, 738, 0], to: [0, -18.796, 0], ti: [0, 28.745, 0]
                }, {
                  i: { x: 0.74, y: 1 }, o: { x: 0.284, y: 1 }, t: 23, s: [1041, 586.787, 0], to: [0, -3.115, 0], ti: [0, 2.037, 0]
                }, { t: 32, s: [1041, 613, 0] }],
                ix: 2
              },
              a: { a: 0, k: [24, 26.5, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            ip: 4,
            op: 300,
            st: 4,
            bm: 0
          }, {
            ddd: 0,
            ind: 6,
            ty: 2,
            nm: '1_6.png',
            cl: 'png',
            refId: 'image_17',
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [{
                  i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0]
                }, { t: 20, s: [100] }],
                ix: 11
              },
              r: { a: 0, k: 0, ix: 10 },
              p: {
                a: 1,
                k: [{
                  i: { x: 0.74, y: 1 }, o: { x: 0.4, y: 0.8 }, t: 0, s: [968, 659, 0], to: [0, -18.796, 0], ti: [0, 28.746, 0]
                }, {
                  i: { x: 0.74, y: 1 }, o: { x: 0.284, y: 1 }, t: 19, s: [968, 507.788, 0], to: [0, -3.116, 0], ti: [0, 2.037, 0]
                }, { t: 28, s: [968, 534, 0] }],
                ix: 2
              },
              a: { a: 0, k: [20.5, 60, 0], ix: 1 },
              s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            ip: 0,
            op: 300,
            st: 0,
            bm: 0
          }]
        }],
        fonts: {
          list: [{
            origin: 0, fPath: '', fClass: '', fFamily: 'PingFang SC', fWeight: '', fStyle: 'Regular', fName: 'PingFangSC-Regular', ascent: 72.7996826171875
          }]
        },
        layers: [{
          ddd: 0,
          ind: 1,
          ty: 0,
          nm: '预合成 1',
          refId: 'comp_0',
          sr: 1,
          ks: {
            o: { a: 0, k: 100, ix: 11 }, r: { a: 0, k: 0, ix: 10 }, p: { a: 0, k: [400, 350, 0], ix: 2 }, a: { a: 0, k: [400, 350, 0], ix: 1 }, s: { a: 0, k: [80, 80, 100], ix: 6 }
          },
          ao: 0,
          w: 800,
          h: 700,
          ip: 0,
          op: 900,
          st: 0,
          bm: 0
        }],
        markers: []
      }

      const params = {
        container: document.getElementById('lottie'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData
      }

      this.lottie.loadAnimation(params)
    }


  }
}
</script>

<style scoped>
.chinaTobacco.login{box-sizing: initial;min-height: 100%;width: 100%;overflow: hidden;position: relative;background-size: cover;}
.chinaTobacco.login{font: 18px/1.6 "苹方","微软雅黑","宋体",arial, verdana, sans-serif;}
.chinaTobacco.login label{font-weight:normal;}
.chinaTobacco.login img{height: 50px;position:absolute;top:15px;left:72px;}

.chinaTobacco.login .system_info{text-align:left;padding-left:150px;width:100%;height: 167px;position: absolute;top:50%;transform:translateY(-50%);color:#fff;}
.chinaTobacco.login .system_info .title{font-size:36px;}
.chinaTobacco.login .system_info .desc{line-height: 180%;padding-top: 8px;font-size: 16px;color: #ffffff;opacity: 0.8;}
.chinaTobacco.login .login_form{z-index:5; position: absolute;right:200px;top:50%;transform:translateY(-50%); overflow:hidden;background-color: #f0f0f5;box-shadow: 50px 87px 40px 0px rgba(0, 0, 0, 0.35);border-radius: 4px; width:470px;height:446px;max-width: 100%;margin: 0 auto;box-sizing: border-box;}
.chinaTobacco.login .logo_mini img{height: 50px;position:absolute;left:50%;transform: translateX(-50%);top:-75px;display:none;}
.chinaTobacco.login .login_select{width:100%;}

.chinaTobacco.login .login_title{margin-bottom:0px;height:120px;line-height:120px;background:none;}
.chinaTobacco.login .login_title .title{font-size:24px;color:#000;text-align:center;font-weight:500;letter-spacing:1px;margin:0px;}
.chinaTobacco.login .form_area{padding:0px 40px;}
.chinaTobacco.login .forget_password{user-select: none;display: inline-block;position: absolute;top:45px;right: 0;cursor: pointer;color: rgb(0, 149, 136);font-size: 16px;line-height:30px;}
.chinaTobacco.login .forget_password:hover{color:rgba(0, 149, 136,0.7);}
.chinaTobacco.login .btn {outline:none;cursor: pointer;margin-top:20px;border-radius:3px;padding:0px; display: inline-block;line-height: 48px;height: 48px;width: 148px;text-align: center;font-size: 18px;transition: background-color 218ms;}
.chinaTobacco.login .experience_btn{float: left; width:100%;}
.chinaTobacco.login .experience_btn_reg{float: right; color: #da251c;background: #fff;border: solid 1px #da251c;}
.chinaTobacco.login .login_icon{display:inline-block;width:21px;height:21px;position:absolute;top:15px;left:5px;}
.chinaTobacco.login .login_icon.user{ background:url('./img/user_icon.png') no-repeat center;background-size: cover;}
.chinaTobacco.login .login_icon.password{width:15px;left: 8px; background:url('./img/lock_icon.png') no-repeat center;background-size: cover;}
.chinaTobacco.login .login_icon.warehouse{ background:url('./img/warehouse_icon.png') no-repeat center;background-size: cover;}

@media screen and (max-width:767px){
  header{display: none;}
  .chinaTobacco.login .logo_mini img{display:block;}
  .chinaTobacco.login .login_form{left: 50%;transform: translateX(-50%);top:100px;}
  .chinaTobacco.login .system_info{display:none;}
  .chinaTobacco.login #lottie{display:none;}
  /* .language{display:none;} */
}

@media screen and (min-width:768px) and (max-width:991px){
  .chinaTobacco.login .login_form{left: 50%;transform: translateX(-50%);top:150px;}
  .chinaTobacco.login .system_info{display:none;}
  .chinaTobacco.login #lottie{display:none;}
}

@media screen and (min-width:992px) and (max-width:1199px){
  .chinaTobacco.login  .system_info{padding-left:80px;}
  .chinaTobacco.login .login_form{left:50%;top:50%;transform:translate(-50%,-50%);}
  .chinaTobacco.login #lottie{display:none;}
}

@media screen and (min-width:1200px){
  .chinaTobacco.login  .system_info{padding-left:150px;}
  .chinaTobacco.login .login_form{right:200px;top:50%;transform:translateY(-50%);}
}


body{
  background-color:#fff;
  margin: 0px;
  height: 100%;
  overflow: hidden;
}
.chinaTobacco.login #lottie{
  background-color:transparent;
  width:100%;
  height:100%;
  transform: translate3d(-16%,-10%,0);
  /* width: 800px;
  height: 700px;
  position: absolute;
  left: 100px;
  top: -44px; */

  overflow: hidden;
  text-align: center;
  opacity: 1;
}


</style>
<style>
.chinaTobacco.login .el-form-item__label{font-weight:normal;text-align: left;color: #586069;font-size: 16px;line-height:30px;}
.chinaTobacco.login .login_input.el-input--prefix .el-input__inner,
.chinaTobacco.login .login_select .el-input--suffix .el-input__inner{padding-left:40px;height:50px;line-height:50px;}
.chinaTobacco.login .form_area .el-form-item{margin-bottom:25px;}
.el-message-box__wrapper .el-message-box{width:340px;padding-bottom:30px;}
.el-message-box__btns{text-align: center;}
.el-message-box__btns .el-button{font-size:15px;}
.el-message-box__btns button:nth-child(2){margin-left:50px;}

</style>
