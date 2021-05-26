const { formatReturn } = require('../config')

const CLIENT_LISTCLIENT = [
  {
    id: '1',
    label: '租户1'
  },
  {
    id: '1262622154699513857',
    label: '租户2'
  }
]

module.exports = [
  {
    url: '/client/listClient',
    type: 'post',
    response: config => {
      console.log('mock config', config)
      return formatReturn(CLIENT_LISTCLIENT)
    }
  }
]
