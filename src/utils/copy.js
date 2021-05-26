const bindCopy = (selector, succFn = () => {}, errFn = () => {}) => {
  require.ensure(
    [],
    require => {
      const ClipboardJS = require('clipboard')
      const clipboard = new ClipboardJS(selector, {
        text: trigger => succFn(trigger)
      })
      clipboard.on('error', errFn)
      document.querySelector(selector).click()
    },
    'clipboard'
  )
}

export default bindCopy
