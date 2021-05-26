/**
 * webSocket 相关
 */
import window from '@/utils/polyfill'

// NOTE: 不支持多开
let socketObj = null
// const extraUrlStr = '/api/build' // 根据不同接口增加的一个url字段
const baseUrl = `${window.location.origin.replace(/^http/, 'ws').replace(/^https/, 'wss')}`
const DEF_FN = (...params) => {
  console.log(params)
}

export const sendSocket = async ({
  url, extraUrlStr = '/api/build', params, ...callback
}) => {
  const wsUrl = `${baseUrl + extraUrlStr}/websocket${url}`
  /**
   * 验证 socketObj
   */
  if (!socketObj) {
    openSocket({ url: wsUrl, ...callback })
    return false
  }
  const { readyState } = socketObj
  // 正在建立连接连接，还没有完成
  if (readyState === 0) return false
  // 连接正在进行关闭握手，即将关闭
  // if (readyState === 2) {}
  // 连接已经关闭或者根本没有建立
  if (readyState === 3) {
    openSocket({ ...callback })
    return false
  }

  /**
   * 发送请求
   */
  socketObj.send(JSON.stringify(params))
  console.log('数据发送...', params)

  return socketObj
}

const openSocket = async ({
  url,
  handleOpen = DEF_FN,
  handleMessage = DEF_FN,
  handleClose = DEF_FN,
  handleErr = DEF_FN
}) => {
  console.log('[openSocket]')
  if (socketObj) {
    const { readyState } = socketObj
    // 正在建立连接连接，还没有完成
    if (readyState === 0) return
    // 连接成功建立，可以进行通信
    if (readyState === 1) {
      handleOpen()
      return
    }
    // 连接正在进行关闭握手，即将关闭
    // if (readyState === 2) {}
  }
  if (!('WebSocket' in window)) {
    console.warn('浏览器不支持 WebSocket!')
    return
  }
  socketObj = new WebSocket(url)
  console.log('创建 WebSocket ...')

  socketObj.onopen = () => {
    console.log('连接已开启...')
    handleOpen()
  }
  socketObj.onmessage = async event => {
    console.log('数据已接收...', event)
    const { data = {} } = event
    // const { json, errcode, errmsg } = JSON.parse(data)
    let targetData = {}
    try {
      targetData = JSON.parse(data)
    } catch (err) {
      targetData = data
    }

    // 请求成功
    handleMessage(targetData)
  }
  socketObj.onclose = err => {
    console.log('连接已关闭...', err)
    handleClose(err)
    socketObj = null
  }
}
