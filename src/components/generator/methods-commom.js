
// export const getFieldId = el => {
//   const fieldId = el.vModel ? el.vModel : el.componentName
//   if (!el._parentFieldId) { return fieldId }
//   const specialId = el.topbtn || el.rowbtn || el._key
//   return `${el._parentFieldId}_${specialId || fieldId}`
// }

export const getFieldId = el => {
  const fieldId = el.vModel ? el.vModel : el.componentName
  if (fieldId) {
    return fieldId
  }
  const { _parentFieldId: parentFieldId } = el
  if (parentFieldId) {
    const specialId = el.topbtn || el.rowbtn || el._key || 'special'
    return `${parentFieldId}_${specialId}`
  }
  console.warn('[getFieldId]缺少id信息', el)
  return ''
}
