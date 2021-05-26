const loadSrcMap = {}

export function setLoadSrcMap(id, key) {
  loadSrcMap[id] = key
}

function stdOnEnd(id, $dom, callback) {
  $dom.onload = () => {
    $dom.onerror = $dom.onload = null
    loadSrcMap[id] = 'FINISH'
    callback($dom, id)
  }
  $dom.onerror = () => {
    $dom.onerror = $dom.onload = null
    loadSrcMap[id] = 'ERROR'
    callback($dom, id, new Error(`Failed to load ${$dom.src}`))
  }
}

function ieOnEnd(id, $dom, callback) {
  $dom.onreadystatechange = () => {
    if ($dom.readyState !== 'complete' && $dom.readyState !== 'loaded') {
      return
    }
    $dom.onreadystatechange = null
    loadSrcMap[id] = 'FINISH'
    callback($dom, id)
  }
}

export function getId(src) {
  return src.replace(/\//gi, '__').split('?')[0]
}

function hasLoad(id, callback) {
  const loadStasus = loadSrcMap[id]
  if (!loadStasus) {
    return false
  }
  const $src = document.querySelector(`#${id}`)
  if (loadStasus === 'FINISH' || loadStasus === 'ERROR') {
    callback($src)
  } else if (loadStasus < 10) {
    loadSrcMap[id]++
    setTimeout(() => {
      hasLoad(id, callback)
    }, 500)
  }
  return true
}

export function loadScript(src, callback = () => {}) {
  if (!src) return
  const id = getId(src)
  if (hasLoad(id, callback)) return
  loadSrcMap[id] = 1
  const $script = document.createElement('script')
  $script.src = src
  $script.id = id
  document.body.appendChild($script)
  const onEnd = 'onload' in $script ? stdOnEnd : ieOnEnd
  onEnd(id, $script, callback)
}

export function loadStyle(src, callback = () => {}) {
  if (!src) return
  const id = getId(src)
  if (hasLoad(id, callback)) return
  loadSrcMap[id] = 1
  const $link = document.createElement('link')
  $link.href = src
  $link.id = id
  $link.rel = 'stylesheet'
  $link.type = 'text/css'
  document.head.appendChild($link)
  const onEnd = 'onload' in $link ? stdOnEnd : ieOnEnd
  onEnd(id, $link, callback)
}

export function loadScriptQueue(list, callback) {
  const first = list.shift()
  if (list.length === 0) {
    loadScript(first, callback)
  } else {
    loadScript(first, () => {
      loadScriptQueue(list, callback)
    })
  }
}
