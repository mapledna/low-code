import CryptoJS from 'crypto-js'
import server from '@/assets/js/api'
import message from '@/utils/message'
import window from '@/utils/polyfill'
import { getSpecialPath } from '@router/tool'

const common = {
  KEY: 'abcdefghijklmnopqrstuvwxyz012345', // 32位
  IV: '9876543210abcdef', // 16位
  /** ************************************************************
        *Crypto字符串加密
        *   str：需要加密的字符串
        *************************************************************** */
  Encrypt(str, userkey) {
    let key = CryptoJS.enc.Utf8.parse(common.KEY)
    const iv = CryptoJS.enc.Utf8.parse(common.IV)
    if (userkey) {
      key = CryptoJS.enc.Utf8.parse(userkey)
    }

    let encrypted = ''

    const srcs = CryptoJS.enc.Utf8.parse(str)
    encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })

    return encrypted.ciphertext.toString()
  },

  /** ************************************************************
  *Crypto字符串解密
  *   str：需要解密的字符串
  *************************************************************** */
  Decrypt(str, userkey) {
    let key = CryptoJS.enc.Utf8.parse(this.KEY)
    const iv = CryptoJS.enc.Utf8.parse(this.IV)
    if (userkey) {
      key = CryptoJS.enc.Utf8.parse(userkey)
    }
    const encryptedHexStr = CryptoJS.enc.Hex.parse(str)
    // var encryptedHexStr = CryptoJS.enc.Base64.parse(str);
    // var encryptedHexStr = CryptoJS.enc.Utf8.parse(str);
    const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
    const decrypt = CryptoJS.AES.decrypt(srcs, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    // console.log('Decrypt111',decrypt,CryptoJS.enc.Utf8)
    let decryptedStr = 'right'
    try {
      decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
    } catch (err) {
      decryptedStr = 'error'
    }
    // console.log('Decrypt222',decryptedStr)
    return decryptedStr.toString()
  },
  // _isGetJson为是否已经从本地获取过 获取过对应true
  isGetJson: false,
  // 默认的初始配置信息 如配置 则从配置文件获取
  iPConfig: {
    location: `${window.location.origin}/api`, // 初始默认带api
    expired_time: 10 * 60, // 默认为10分钟
    page_login_path: '/' // token失效跳转到登录页面  默认对应的登录页面的路由
  },
  // 当前环境变量的值 默认为生产环境
  nodeEnv: 'production',

  // 设置cookie  默认先删除cookie中存的改属性
  setCookie(name, value) {
    this.removeCookie(name)
    document.cookie = `${name}=${escape(value)};path=/;`
  },
  // 获取cookie
  getCookie(name) {
    const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`)
    const arr = document.cookie.match(reg)
    if (arr) return unescape(arr[2])
    return ''
  },
  // 删除cookie
  removeCookie(name) {
    const exp = new Date()
    exp.setTime(exp.getTime() - 1)
    const cval = this.getCookie(name)
    if (cval != null) document.cookie = `${name}=${cval};expires=${exp.toGMTString()}`
  },
  // 获取当前页面url
  getTempPageUrl() {
    return window.location.href.replace('/#', '#').split('#')[0]
  },
  // 获取url中的参数 name为当前获取的页面url参数对应的属性值，传字符串则获取一个，传数组则获取对应的多个属性构成的对象；
  // 如果不传name，则为获取整个页面url参数对象
  // href默认为当前页面的href，如果传入则为传入的url
  // 注意 :如果链接为？a=xxx&b=xxx#/login这种的路由 使用会有问题
  // 获取页面url里面的参数
  getUrlParam(name = '', href = '') {
    href = href || window.location.href
    let paramsStr = ''
    if (href) {
      [, paramsStr] = href.split('?')
    }
    if (paramsStr) {
      const paramsObj = {}
      let isString = false
      for (let i = 0; i < paramsStr.split('&').length; i++) {
        const [tempKey, tempVal] = paramsStr.split('&')[i].split('=')
        if (name && typeof (name) === 'string') {
          isString = true
          if (name.toLowerCase() === tempKey.toLowerCase()) {
          // console.log('geturlparams',name,tempVal)
            return tempVal
          }
        } else if (Array.isArray(name)) {
          for (let j = 0; j < name.length; j++) {
            if (name[j].toLowerCase() === tempKey.toLowerCase()) {
              paramsObj[name[j]] = tempVal
              break
            }
          }
        } else if (name === '') {
          paramsObj[tempKey] = tempVal
        }
      }
      if (isString) {
        return null
      }
      return paramsObj
    }
    return null
  },
  // 封装XMLHttpRequest的同步请求
  postAajx(url, data, auth) {
    // console.log('data:', data)
    data = common.Encrypt(JSON.stringify(data))
    const client = new XMLHttpRequest()
    client.open('post', url, false) // 第三个参数表明是同步的 xhr
    client.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
    client.setRequestHeader('encryption', 'true')
    if (auth) {
      client.setRequestHeader('Authorization', auth)
    }
    client.send(data)
  },

  // 封装fetch方法
  doFetch(url, data, auth) {
    data = common.Encrypt(JSON.stringify(data))
    const headers = new Headers({
      'Content-Type': 'application/json; charset=UTF-8',
      encryption: 'true',
      Authorization: auth
    })
    window.fetch(url, {
      method: 'POST',
      headers,
      body: data
    })
  },

  intensityReg(value) { // 校验登录密码规则 是否符合三级等保要求
    const reg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=/]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=/]+$)(?![0-9\W_!@#$%^&*`~()-+=/]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=/]{8,30}$/
    return reg.test(value)
  },
  testPhoneReg(value) { // 校验手机号码
    const reg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[4-9]{1})|(18[0-9]{1})|(199))+\d{8})$/
    return reg.test(value)
  },

  // 键盘事件
  addEnterListener() {
    // console.log(100,window.__completeEnterBind__)
    // eslint-disable-next-line no-underscore-dangle
    if (window.__completeEnterBind__) return
    window.addEventListener('keydown', this.enterCallback)
    // eslint-disable-next-line no-underscore-dangle
    window.__completeEnterBind__ = true
  },
  removeEnterListener() {
    window.removeEventListener('keydown', this.enterCallback)
    // eslint-disable-next-line no-underscore-dangle
    window.__completeEnterBind__ = false
  },
  enterCallback(e) {
    function findFormItem(el) {
      const parent = el.parentElement
      if (!parent) return document.body
      if (
        parent.className.includes('el-col')
      ) {
        return parent
      }
      return findFormItem(parent)
    }
    function findTarget(container) {
      let nextEl = container.nextElementSibling
      if (!nextEl) return
      let input = nextEl.querySelector('input')
      const button = nextEl.querySelector('button')
      while (input && input.id === 'el-select') {
        nextEl = nextEl.nextElementSibling
        if (!nextEl) return
        input = nextEl.querySelector('input')
      }
      // eslint-disable-next-line consistent-return
      if (input && input.className.includes('el-input__inner')) return input
      // eslint-disable-next-line consistent-return
      if (button && button.className.includes('btn-enter-click')) return button
      // eslint-disable-next-line consistent-return
      return findTarget(nextEl)
    }
    if (e.keyCode === 13) {
      const container = findFormItem(document.activeElement)
      // findTarget(container) && findTarget(container).focus()
      if (findTarget(container)) {
        findTarget(container).focus()
      } else {
        const buttonContainer = findFormItem(container)
        findTarget(buttonContainer) && findTarget(buttonContainer).click()
      }
    }
  },
  // 输入框防抖
  debounce(func, wait = 1000) {
    // let timeout = null
    // eslint-disable-next-line func-names
    return function (vmodel) {
      const context = this
      const args = arguments
      if (window[`${vmodel}timeout`]) {
        clearTimeout(window[`${vmodel}timeout`])
      }
      window[`${vmodel}timeout`] = setTimeout(() => {
        func.apply(context, args)
        // this[func].apply(context, args)
      }, wait)
    }
  },

  // 消息提示和确认模块
  message

}

export default common
