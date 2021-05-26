export default (element, msg = '没有匹配的layout。element:') => {
  throw new Error(msg, element)
}
