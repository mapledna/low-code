import md5 from 'js-md5'
import common from '@/utils/tool'
import request from './request'
import { getSpecialPath, changeHref } from '@router/tool'

import {
  sendSocket
} from './socket'

const server = {
  commonApiFn: request,

  getSessionKey() {
    return common.getUrlParam('sessionKey') || sessionStorage.getItem('Authorization')
  },

  /**
   * 生成防重复提交校验字段
   */
  generateNonsensePre() {
    const sessionKey = this.getSessionKey()
    const nonsensePre = [
      sessionKey,
      new Date().getTime(),
      Math.random()
        .toString()
        .slice(2)
    ].join('_')
    return nonsensePre
  },
  generateNonsense: (preStr, params) => md5((preStr || server.generateNonsensePre()) + JSON.stringify(params || {})),

  /**
   *登录接口
   * @param {*} islogin  是否强制登录
   * @param {*} params 参数对象 有(username、password)||(mobile、code)、loginUrl、appCode、path属性
   * @param {*} $loading loading状态对象
   * @param {*} loginType 登录类型 默认pwd为账号密码登录 sms为短信验证码模式  ding为钉钉扫码登录
   * @param {*} nonsense 防重复提交
   * @param {*} isToken 是否需要调用token
   */
  getLogin(islogin, params, $loading, loginType = 'pwd', nonsense, isToken = true) {
    // 删除当前存储的sessionKey
    sessionStorage.removeItem('SessionKey')
    sessionStorage.removeItem('Authorization')

    let paramsObj = {
      grant_type: loginType,
      scope: 'all',
      client_id: 'nti_client_id',
      client_secret: 'nti_client_secret'
    }
    let targetParmasObj = {}
    if (loginType === 'pwd') {
      targetParmasObj = {
        username: params.username,
        password: common.Encrypt(params.password)
      }
    } else if (loginType === 'sms') {
      targetParmasObj = {
        mobile: params.mobile,
        code: params.code
      }
    } else if (loginType === 'ding') {
      targetParmasObj = {
        code: params.code
      }
    }

    paramsObj = {
      ...paramsObj,
      ...targetParmasObj
    }

    // 拼接字符串
    let paramsStr = ''
    Object.keys(paramsObj).forEach((key, index) => {
      paramsStr += `${(index === 0 ? '?' : '&') + key}=${paramsObj[key]}`
    })

    $loading.show()

    request({
      url: params.loginUrl ? params.loginUrl + paramsStr : '/login/getLogin',
      type: 'data',
      extraUrl: '',
      nonsense,
      isEncrypt: false
    }).then(res => {
      $loading.hide()

      if (res.code === 10034 && loginType === 'ding') { // 钉钉扫码提示用户注册
        common.message.$resetMessage({
          type: 'error',
          showClose: true,
          message: res.message
        })
        window.location.href = getSpecialPath('REGISTER')
        return
      }

      if (res.code === 'judgeLogin') {
        common.message.$messageBoxConfirm(res.message, ['继续登录', '取消登录'], () => {
          this.getLogin(true, params, $loading)
        })
      } else if (res.code === 0) {
        sessionStorage.setItem('Authorization', `Bearer ${res.data.accessToken}`)
        sessionStorage.setItem('refreshToken', `${res.data.refreshToken}`)
        sessionStorage.setItem('username', `${res.data.username}`)
        sessionStorage.setItem('realname', `${res.data.realname}`)
        sessionStorage.setItem('userId', `${res.data.userId}`)
        sessionStorage.setItem('appCode', `${params.appCode}`)
        if (isToken) {
          this.getToken({
            token: {
              appCode: params.appCode
            }
          }).then(async token => {
            sessionStorage.removeItem('permission')

            const rights = await this.getPermission()
            sessionStorage.setItem('permission', JSON.stringify(rights))
            /**
             * hash\history两种模式下的跳转回登录页的逻辑外面
            */
            changeHref(params.path)
          })
        } else {
          changeHref(params.path)
        }
      } else {
        common.message.$resetMessage({
          type: 'error',
          showClose: true,
          message: res.message
        })
      }
    }).catch(err => {
      $loading.hide()
    })
  },
  //  获取token
  getToken(params) {
    return request({ url: '/oauth2/token', params, isEncrypt: false })
  },
  // 退出登录或注销
  getLogout(path) {
    // return request({ url: '/login/getLogout' })
    let accessToken = sessionStorage.getItem('Authorization') || ''
    accessToken = accessToken.replace('Bearer ', '')
    request({
      url: `/oauth/oauth/removeToken?accessToken=${accessToken}`,
      type: 'data',
      extraUrl: '',
      hasOauth: false,
      isEncrypt: false
    }).then(res => {
      sessionStorage.removeItem('Authorization')
      sessionStorage.removeItem('refreshToken')
      sessionStorage.removeItem('SessionKey')
      common.removeCookie('sessionKey')
    }).finally(res => {
      window.location.href = path || getSpecialPath('LOGIN')
    })
  },
  // 获取配置数据
  getPartSource(params) {
    return request({ url: '/part/getPartSource', params })
  },
  // 保存配置数据
  savePartSource(params) {
    return request({ url: '/part/savePartSource', params, type: 'msg' })
  },
  // 单次执行sql语句
  executeSqls(sourceKey, parameters, resType = 'data', nonsense) {
    return new Promise((resolve, reject) => {
      request({
        url: '/database/executeSqls',
        params: {
          executeSqlList: [{
            sqlId: `${sourceKey}`,
            ...(parameters ? { parameters } : undefined)
          }]
        },
        nonsense
      }).then(res => {
        if (resType === 'data') {
          resolve(res.table_0)
        } else if (resType === 'execute') {
          resolve(res.execute[0].msg)
        } else {
          resolve(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 多次执行sql语句
  allExecuteSqls(arr, nonsense) {
    // console.log('all', arr)
    if (arr.length === 0) {
      return false
    }
    return request({
      url: '/database/executeSqls',
      params: {
        executeSqlList: arr
      },
      nonsense
    })
  },
  // 获取表格分页数据  表格不分页则调用executeSqls
  selectDataPage(sourceKey, page = 1, rows = 10, parameters = {}, { sort, order } = {}) {
    return request({
      url: '/database/selectDataPage',
      params: {
        sqlId: sourceKey,
        pager: {
          rows,
          page,
          order, // "asc"升序|"desc" 降序
          sort
        },
        parameters
      }
    })
  },
  // 通过SqlId返回表格或表单数据格式
  designData({
    sourceId, // 数据源ID
    sourceType // 数据源类型。data|flow
  }) {
    return request({
      url: '/database/generator/designData',
      params: {
        sourceId,
        sourceType
      }
    })
  },
  // 创建组件
  addPart({
    sourceId, // 数据源ID
    sourceType, // 数据源类型。data|flow
    partJson, // 组件JSON
    partVue // 组件VUE
  }) {
    return request({
      url: '/part/addPart',
      params: {
        sourceId,
        sourceType,
        partJson,
        partVue
      }
    })
  },
  // 获取流水号
  getSequenceNo(params) {
    return request({ url: '/sequence/getSequenceNo', params })
  },
  // 文件上传
  upload(params, nonsense) {
    return request({
      url: '/file/uploadFile', params, type: 'file', nonsense
    })
  },
  // 导入
  importExcel(params, origin, nonsense) {
    return request({
      origin,
      url: '/file/importExcel',
      params,
      type: 'file',
      nonsense
    })
  },
  // 导出
  exportExcel(sourceKey, parameters, origin, nonsense) {
    return request({
      origin,
      url: '/file/exportExcel',
      params: {
        executeSqlList: [{
          sqlId: sourceKey,
          ...(parameters ? { parameters } : undefined)
        }]
      },
      nonsense
    })
  },
  // 运行事务流
  runTransflow(sourceKey, parameters, commit = true, nonsense) {
    console.log('commit', commit)
    if (commit === 'data') {
      commit = true
    }
    return request({
      url: '/transFlow/runTransflow',
      params: {
        transflowId: sourceKey,
        parameters,
        commit
      },
      nonsense
    })
  },
  // 事务流获取类集合
  listClass() {
    return request({ url: '/external/listClass' })
  },
  // 获取类方法集合
  listMethod(params) {
    return request({ url: '/external/listMethod', params })
  },
  // 获取类方法参数集合
  listParam(params) {
    return request({ url: '/external/listParam', params })
  },
  // 获取控制台页面的产品数据
  getProduct(params) {
    return request({ url: '/product/productCenter', params })
  },
  // 获取控制台页面固定产品prod和ui-system
  productFixed() {
    return request({ url: '/product/productFixed' })
  },
  // 帮助文档搜索
  querySearch(params) {
    return request({ url: '/database/querySearch', params })
  },
  // 获取按钮和字段权限
  getPermission() {
    return request({ url: '/permission/listFiledAndButtonDisable' })
  },
  // // 钉钉扫码登录
  // dingdingScan(params) {
  //   return request({ url: '/login/ding/scanLogin', params })
  // },
  // 钉钉扫码注册
  scanSignUp(params) {
    return request({ url: '/login/ding/scanSignUp', params, type: 'msg' })
  },
  // 登入发送短信验证码
  sendLoginSms(params, nonsense) {
    return request({ url: '/sms/sendLoginSms', params, nonsense })
  },
  // 忘记密码发送短信验证码
  sendUpdateSms(params, nonsense) {
    return request({ url: '/sms/sendUpdateSms', params, nonsense })
  },
  // 修改密码验证码验证
  checkUpdateSms(params, nonsense) {
    return request({ url: '/sms/checkUpdateSms', params, nonsense })
  },
  // 找回密码
  updatePassword(params, nonsense) {
    return request({
      url: '/sms/updatePassword', params, type: 'msg', nonsense
    })
  },
  // 修改密码
  modifyPassword(params) {
    return request({
      url: '/oauth2/updatePassword', params, type: 'msg'
    })
  },
  // // 手机号码加验证码登录
  // getLoginByMobile(params, nonsense) {
  //   return request({
  //     url: '/login/getLoginByMobile', params, nonsense
  //   })
  // },
  // 注册获取验证码
  sendRegisteredSms(params, nonsense) {
    return request({
      url: '/sms/sendRegisteredSms', params, nonsense
    })
  },
  // 手动注册
  doRegister(params, nonsense) {
    return request({
      url: '/login/doRegister', params, type: 'msg', nonsense
    })
  },
  // 自动生成SQL
  generateSql(params) {
    return request({
      url: '/table/generateSql', params, type: 'msg'
    })
  },
  // 展示页面-产品中心数据
  selectProductSolveList(params) {
    return request({
      url: '/document/slectProductSolveList', params
    })
  },
  // 控制台页面用户切换租户列表
  listClientUser() {
    return request({
      url: '/client/listClientUser'
    })
  },
  // 控制台页面获取产品分类
  listProductCategory(params) {
    return request({
      url: '/client/listProductCategory', params
    })
  },
  // 控制台页面获取产品列表
  listProduct(params) {
    return request({
      url: '/client/listProduct', params
    })
  },
  // 控制台页面获取允许复制产品列表
  listAllowCopyProduct(params) {
    return request({
      url: '/client/listAllowCopyProduct', params
    })
  },
  // 控制台页面获取数据库列表
  listDatabase(params) {
    return request({
      url: '/client/listDatabase', params
    })
  },
  // 控制台页面获取数据库实例
  listDatabaseInst(params) {
    return request({
      url: '/client/listDatabaseInst', params
    })
  },
  // 控制台页面创建产品
  createProduct(params) {
    return request({
      url: '/product/createProduct', params, type: 'msg'
    })
  },
  // 控制台页面复制产品
  copyProduct(params) {
    return request({
      url: '/product/copyProduct', params, type: 'msg'
    })
  },
  // 获取个人资料数据
  getUserDetails() {
    return request({
      url: '/oauth2/getUserDetails'
    })
  },
  // 获取用户信息
  getUserInfo(params) {
    return request({
      url: '/oauth2/userLoginInfo', params
    })
  },
  // 展示获取用户信息
  userLoginPlatInfo(params) {
    return request({
      url: '/oauth2/userLoginPlatInfo', params
    })
  },

  /** **********工作流 start ***************** */
  // 保存流程设计
  saveFlowDesign(params) {
    return request({
      url: '/flow/saveFlowDesign', params, extraUrl: '/build2'
    })
  },
  // 获取流程设计
  getFlowDesign(params) {
    return request({
      url: '/flow/getFlowDesign', params, extraUrl: '/build2'
    })
  },

  /** **********工作流 end ***************** */

  /** **********前端埋点 start ***************** */
  // 保存埋点数据
  saveUserBehavior(params) {
    return request({
      url: '/database/executeSqls', params
    })
  },

  /** **********前端埋点 end ***************** */


  // 获取审批详情
  instanceInfo(params) {
    return request({
      url: '/flow/instanceInfo', params, extraUrl: '/build2'
    })
  },
  // 流程申请
  startInstance(params) {
    return request({
      url: '/flow/startInstance', params, extraUrl: '/build2', type: 'msg'
    })
  },
  // 审批同意
  agreeInstance(params, nonsense) {
    return request({
      url: '/flow/agreeInstance', params, extraUrl: '/build2', nonsense
    })
  },
  // 审批拒绝
  rejectInstance(params, nonsense) {
    return request({
      url: '/flow/rejectInstance', params, extraUrl: '/build2', nonsense
    })
  },
  // 审批撤销
  cancelInstance(params, nonsense) {
    return request({
      url: '/flow/cancelInstance', params, extraUrl: '/build2', nonsense
    })
  },
  // 审批评论
  discussInstance(params, nonsense) {
    return request({
      url: '/flow/discussInstance', params, extraUrl: '/build2', nonsense
    })
  },
  // 视频监控树
  getDeviceList(params) {
    return request({ url: '/device/v1/getDeviceList', extraUrl: '/device', params })
  },
  // 视频播放
  devicePlay(params) {
    return request({ url: '/device/v2/play', extraUrl: '/device', params })
  },
  // 关闭视频流
  closePlay(params) {
    return request({ url: '/device/v2/close', extraUrl: '/device', params })
  },
  // 视频心跳接口
  heartbeat(params) {
    return request({ url: '/device/v2/heartbeat', extraUrl: '/device', params })
  },

  /* ---------执行微服务---------*/
  // 根据分类ID获取微服务列表
  listMicroByCategoryId(params) {
    return request({ url: '/micro/listMicroByCategoryId', params })
  },
  // 根据微服务ID获取参数字段
  listMicroParamByMicroId(params) {
    return request({ url: '/micro/listMicroParamByMicroId', params })
  },
  // 执行微服务
  executeMicro(sourceKey, parameters, nonsense) {
    return request({
      url: '/micro/executeMicro',
      params: {
        microId: sourceKey,
        parameters
      },
      nonsense
    })
  },
  // 执行微服务分页查找
  selectMicroDataPage(sourceKey, page = 1, rows = 10, parameters = {}, { sort, order } = {}) {
    return request({
      url: '/micro/selectMicroDataPage',
      params: {
        microId: sourceKey,
        pager: {
          rows,
          page,
          order, // "asc"升序|"desc" 降序
          sort
        },
        parameters
      }
    })
  },
  sendSocket
}

export default server
