function setClientId(id = '') {
  localStorage.setItem('clientId', id)
}

function getClientId() {
  return localStorage.getItem('clientId')
}

export {
  setClientId,
  getClientId
}
