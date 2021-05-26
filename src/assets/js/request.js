import axios from 'axios'
import common from '@/utils/tool'
import window from '@/utils/polyfill'

import { getSpecialPath } from '@router/tool'

const extraUrlStr = '/build' // 根据不同接口增加的一个url字段

// 是否有请求正在刷新token
window.isRefreshing = false

// 被挂起的请求数组
let refreshSubscribers = []

/* push所有请求到数组中 */
function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb)
}

/* 刷新请求（refreshSubscribers数组中的请求得到新的token之后会自执行，用新的token去请求数据） */
function onRrefreshed(token) {
  refreshSubscribers.forEach(cb => cb(token))
  refreshSubscribers = []
}

const service = axios.create()

// 请求拦截
service.interceptors.request.use(
  config => {
    // console.log('interceptors.request', config)
    if (window.isRefreshing && config.url.indexOf('oauth/oauth/token') < -1) { // 正在刷新token 则挂起当前的所有请求
      // 放到数组中
      return new Promise(resolve => {
        subscribeTokenRefresh(token => {
          config.headers.Authorization = token
          /* 将请求挂起 */
          resolve(config)
        })
      })
    }
    return config
  }
)

// 响应拦截
service.interceptors.response.use(
  res => {
    // console.log('service.interceptors.response', res.config.url, res.config, res)

    let result = ''
    const { targetDataType } = res.config.headers

    if (res.config.url.indexOf('/oauth/oauth/token') > -1) { // 登录、刷新token 则直接返回错误对象
      return { code: res.data.code, data: res.data.data, message: res.data.message }
    }
    if (res.data.code === 0 && (targetDataType === 'data' || targetDataType === 'file')) {
      if (res.data.data && res.data.execute) {
        result = res.data
      } else {
        result = res.data.data || res.data.execute || res.data.message
      }
      if (/^[0-9]*$/g.test(result)) {
        return result
      }

      try {
        result = JSON.parse(result)
      // eslint-disable-next-line no-empty
      } catch (err) { }
      return result
    } if (res.data.code === 0 && targetDataType === 'msg') {
      result = res.data.message

      common.message.$resetMessage({
        type: 'success',
        showClose: true,
        message: result
      })
      return result
    // }
    // else if (res.data.code === 20003 && res.data.message.indexOf('该帐号在IP') === 0) {
    //   resolve({ code: 'judgeLogin', message: res.data.message })
    // } else if (res.data.code === 10034) { // 新用户钉钉扫码，需要用code来判断是调用登录还是注册
    //   resolve({ code: res.data.code, message: res.data.message })
    }

    let typeMess = ''
    if (res.data.code === -1) {
      typeMess = 'error'
    } else if (res.data.code === -2 || res.data.code === -3) {
      typeMess = 'warning'
    } else {
      typeMess = 'error'
    }

    common.message.$resetMessage({
      type: typeMess,
      showClose: true,
      message: res.data.message
    })

    if (res.data.code === 80002) { // 刷新令牌无效
      // 页面跳转到登录页
      window.location.href = getSpecialPath('LOGIN')
      return Promise.reject()
    }
    if (res.data.code === 80001) { // 登录超时。token认证失败或者已过期  自动刷新token
      if (!window.isRefreshing) { // 没有在刷新 则刷新
        window.isRefreshing = true
        refreshToken().then(
          () => {
            const auth = sessionStorage.getItem('Authorization')
            window.isRefreshing = false
            onRrefreshed(auth)
          }
        ).catch(err => {
          refreshSubscribers = []
          window.isRefreshing = false
        })
      }
      // 过期且正在刷新、过期没在刷新的都放到数组中
      return new Promise(resolve => {
        subscribeTokenRefresh(token => {
          res.config.headers.Authorization = token
          /* 将请求挂起 */
          resolve(service(res.config))
        })
      })
    }

    if (res.data.code === 403 || res.data.code === 401 || res.data.code === 10003) {
      // 延时跳转到登录页
      setTimeout(() => {
        window.location.href = getSpecialPath('LOGIN')
      }, 1500)
    }

    return Promise.reject(res.data.data)
  },
  error => {
    // console.log('response———————error', error.response)

    const res = error.response
    if (res.data.code === 20003 && res.data.message.indexOf('该帐号在IP') === 0) {
      return { code: 'judgeLogin', message: res.data.message }
    } if (res.data.code === 10034) { // 新用户钉钉扫码，需要用code来判断是调用登录还是注册
      return { code: res.data.code, message: res.data.message }
    }
    let typeMess = ''
    if (res.data.code === -1) {
      typeMess = 'error'
    } else if (res.data.code === -2 || res.data.code === -3) {
      typeMess = 'warning'
    } else {
      typeMess = 'error'
    }

    if (res.data.code === 80001) { // token认证失败或者已过期  自动刷新token
      if (!window.isRefreshing) { // 没有在刷新 则刷新
        window.isRefreshing = true
        refreshToken().then(
          () => {
            const auth = sessionStorage.getItem('Authorization')
            window.isRefreshing = false
            onRrefreshed(auth)
          }
        ).catch(err => {
          refreshSubscribers = []
          window.isRefreshing = false
        })
      }

      // 过期且正在刷新、过期没在刷新的都放到数组中
      return new Promise(resolve => {
        subscribeTokenRefresh(token => {
          res.config.headers.Authorization = token
          /* 将请求挂起 */
          resolve(service(res.config))
        })
      })
    }

    common.message.$resetMessage({
      type: typeMess,
      showClose: true,
      message: res.data.message
    })

    if (res.data.code === 403 || res.data.code === 401) {
      // 延时跳转到登录页
      setTimeout(() => {
        window.location.href = getSpecialPath('LOGIN')
      }, 1500)
    }
    if (res.data.code === 500) {
      // 500时延时跳转到Error
      setTimeout(() => {
        window.location.href = getSpecialPath('ERROR')
      }, 1000)
    }

    // return res.data.message

    return Promise.reject(error)
  }
)


/**
 *异步请求的通用方法 默认传递一个对象
  *
  * @param {*} {
  * url,
  * params,接口参数
  * type = 'data',参数类型
  * nonsense,
  * extraUrl = '/build'  额外的url参数 如build
  * hasOauth = true  判断头部是否加鉴权
  *   }
  * @returns
  */
const DEF_ORIGIN = `${window.location.origin}`
const IS_ENCRYPT = process.env.IS_ENCRYPT !== 'false'
function commonApiFn({
  url,
  params,
  type = 'data',
  nonsense,
  origin = DEF_ORIGIN,
  extraUrl = extraUrlStr,
  hasOauth = true,
  isEncrypt = IS_ENCRYPT
}) {
  let sessionKey = common.getUrlParam('sessionKey')
  if (sessionKey) {
    sessionKey = decodeURI(common.getUrlParam('sessionKey'))
  } else {
    sessionKey = sessionStorage.getItem('Authorization')
  }

  const headerObj = {
    ...(nonsense ? { nonsense } : undefined), // 防重复提交校验字段
    'Content-Type': type === 'file' ? 'multipart/form-data' : 'application/json; charset=UTF-8',
    // AppCode: sessionStorage.getItem('appCode') || 'prod', // TODO：appcode默认prod
    targetDataType: type
  }
  if (hasOauth) {
    headerObj.Authorization = sessionKey
  }
  let paramsObj
  if (isEncrypt) { // 参数是否需要加密
    headerObj.encryption = true
    paramsObj = common.Encrypt(JSON.stringify(params))
  } else {
    paramsObj = JSON.stringify(params)
  }

  return service({
    url: `${origin}/api${extraUrl}${url}`,
    method: 'POST',
    data: type === 'file' ? params : paramsObj,
    // data: params,
    headers: headerObj
  })
}

// 有效期内刷新token
function refreshToken() {
  const paramsObj = {
    grant_type: 'refresh_token', // 登录类型(固定)
    refresh_token: sessionStorage.getItem('refreshToken'),
    client_id: 'nti_client_id',
    client_secret: 'nti_client_secret'
  }

  if (!paramsObj.refresh_token) { // 清除浏览器缓存的情况下，直接返回
    window.location.href = getSpecialPath('LOGIN')
    Promise.reject()
  }

  // 拼接字符串
  let paramsStr = ''
  Object.keys(paramsObj).forEach((key, index) => {
    paramsStr += `${(index === 0 ? '?' : '&') + key}=${paramsObj[key]}`
  })

  return new Promise((resolve, reject) => {
    commonApiFn({
      url: `/oauth/oauth/token${paramsStr}`,
      type: 'data',
      extraUrl: '',
      hasOauth: false
    }).then(res => {
      if (res.code === 0) {
        sessionStorage.setItem('Authorization', `Bearer ${res.data.accessToken}`)
        sessionStorage.setItem('refreshToken', `${res.data.refreshToken}`)
        sessionStorage.setItem('username', `${res.data.username}`)
        sessionStorage.setItem('realname', `${res.data.realname}`)
        sessionStorage.setItem('userId', `${res.data.userId}`)
        resolve()
      } else {
        common.message.$resetMessage({
          type: 'error',
          showClose: true,
          message: res.message
        })
        window.location.href = getSpecialPath('LOGIN')
        reject()
      }
    })
  })
}

export default commonApiFn
