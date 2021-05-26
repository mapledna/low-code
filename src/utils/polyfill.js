const { location } = window
if (!location.origin) {
  location.origin = `${location.protocol}//${location.hostname}${
    location.port ? `:${location.port}` : ''
  }`
}
export default window
