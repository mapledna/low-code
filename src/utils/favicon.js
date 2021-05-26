
// 根据配置修改网页图标
export function changeFavicon(websiteIco) {
  const link = document.querySelector("link[rel*='icon']") || document.createElement('link')
  link.type = 'image/x-icon'
  link.rel = 'shortcut icon'
  // link.href = websiteIco
  link.href = websiteIco.indexOf('http') > -1 ? websiteIco : 'img/xinjiang/xinjiangTobacco.ico' // TODO:暂时使用该ico图标
  // console.log('websiteIco', link.href)
  document.getElementsByTagName('head')[0].appendChild(link)
}

