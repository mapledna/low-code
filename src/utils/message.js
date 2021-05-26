
import {
  Message, MessageBox, Notification, Loading
} from 'element-ui'

let messageInstance = null


const message = {
  // 页面下方提示
  $messageBoxBottom(status, msg) {
    Notification({
      title: status === 1 ? '成功' : '失败',
      type: status === 1 ? 'success' : 'error',
      message: msg
    })
  },
  // 页面提示
  $messageBoxAlert(status, msg, fun) {
    Message({
      showClose: true,
      title: status === 1 ? '成功' : '失败',
      type: status === 1 ? 'success' : 'error',
      message: msg,
      onClose: () => {
        fun && fun()
      }
    })
  },
  // 弹出确认框
  $messageBoxConfirm(msg, btn, fun1, fun2) {
    MessageBox.confirm(msg, '信息', {
      confirmButtonText: btn[0] ? btn[0] : '确定',
      cancelButtonText: btn[1] ? btn[1] : '取消',
      type: 'warning'
    }).then(() => {
      fun1 && fun1()
    }).catch(() => {
      fun2 && fun2()
    })
  },
  // 开启页面加载状态
  $messageLoad() {
    Loading.service({ fullscreen: true, background: 'rgba(0,0,0,0.1)' })
  },
  // 关闭页面加载状态
  $messageBoxCloseLoading() {
    // Loading.close();
    const loadingInstance = Loading.service({ fullscreen: true })
    loadingInstance.close()
  },
  // 关闭页面所有弹出层
  $messageBoxCloseAll() {
    const loadingInstance = Loading.service({ fullscreen: true })
    loadingInstance.close()
    Notification.closeAll()
    Message.closeAll()
  },
  // 吸附在元素上提示 待改进
  // export function $messageTips(msg, id, tips){
  $messageTips(msg) {
    Notification({
      title: '',
      type: 'error',
      message: msg
    })
  },
  // 简单信息提示
  $messageMsg(msg) {
    Notification({
      title: '',
      type: 'info',
      message: msg
    })
  },
  // 重置message弹框
  $resetMessage(options) {
    if (messageInstance) {
      messageInstance.close()
    }
    messageInstance = Message(options)
  }


}

// 根据message的使用特性扩展$resetMessage
const messageTypeArr = ['error', 'success', 'info', 'warning']
messageTypeArr.forEach(type => {
  message.$resetMessage[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    options.type = type
    return message.$resetMessage(options)
  }
})


export default message


