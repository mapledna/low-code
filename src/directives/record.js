
import server from '@/assets/js/api'
import { debounce } from '@/utils/index'
import common from '@/utils/tool'

const debounceCallback = debounce(func => {
  func()
}, 5000)

// 存储到本地 同时提交到后台 防抖—操作停止后5s则提交
// TODO: 最后5s的内容会因为浏览器关闭而没有及时提交  js判断浏览器刷新或者关闭 均提交一次
export function saveUserAction(infoObj, type = 'normal', auth) {
  let pointsArr = window.localStorage.getItem('userAction')
  pointsArr = pointsArr ? JSON.parse(pointsArr) : []
  const defaultObj = {
    // 注意：这里记录的是当前操作的开始时间 也就是上一个页面的结束时间  精确到秒
    start_time: Number((Date.parse(new Date()).toString()).substr(0, 10)),
    end_time: 0,
    duration_time: 0
  }
  // 计算在前一页面的停留时间
  let pagesArr = window.localStorage.getItem('userPagesAction')
  pagesArr = pagesArr ? JSON.parse(pagesArr) : []
  if ((infoObj.point_type === 1 || infoObj.point_type === 4) && pagesArr.length > 0) {
    const lastPage = pagesArr[pagesArr.length - 1]
    defaultObj.end_time = lastPage.parameters.start_time
    defaultObj.duration_time = defaultObj.start_time - defaultObj.end_time
  }
  const targetObj = {
    sqlId: '1331416931133485060',
    parameters: { ...defaultObj, ...infoObj }
  }
  // 这里重复记录页面跳转的数据
  if (infoObj.point_type === 1 || infoObj.point_type === 4) {
    pagesArr.push(targetObj)
    pagesArr = pagesArr.splice(-3, 3)
    window.localStorage.setItem('userPagesAction', JSON.stringify(pagesArr))
  }

  pointsArr.push(targetObj)
  window.localStorage.setItem('userAction', JSON.stringify(pointsArr))

  if (type === 'normal') { // 其他提交请求  包括刷新
    debounceCallback(() => {
      const len = pointsArr.length
      server.allExecuteSqls(pointsArr).then(() => {
        pointsArr.splice(0, len)
        window.localStorage.setItem('userAction', JSON.stringify(pointsArr))
      })
    })
  } else if (type === 'close') { // 页面关闭的提交请求
    // common.postAajx(`${window.location.origin}/api/build/database/executeSqls`, {
    //   executeSqlList: pointsArr
    // }, auth)
    common.doFetch(`${window.location.origin}/api/build/database/executeSqls`, {
      executeSqlList: pointsArr
    }, auth)
  }
}

export const record = {
  inserted: (el, binding) => {
    // console.log('record-inserted')
    el.addEventListener('click', () => {
      const data = binding.value
      // console.log('click-data', binding, data)
      saveUserAction({
        point_type: binding.arg.type || 2,
        point_name: '点击',
        point_data: `点击${data}`,
        pv_id: 0
      })
    })
  }
}

