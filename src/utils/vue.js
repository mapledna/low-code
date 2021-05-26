export function builderComputedMap(propsMap) {
  const computedMap = {}
  Object.keys(propsMap).forEach(key => {
    if (propsMap[key].autoUpdate) {
      computedMap[`_${key}`] = {
        get() {
          return this[key]
        },
        set(val) {
          if (val !== this[`_${key}`]) {
            this.$emit(`update:${key}`, val)
            this.$emit('updateParentData', key, val)
          }
        }
      }
    }
  })
  return computedMap
}
