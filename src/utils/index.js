/* eslint-disable no-nested-ternary */
export function makeMap(str, expectsLowerCase) {
  const map = Object.create(null)
  const list = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}

/**
 * num 小于0，左缩进num*2个空格； 大于0，右缩进num*2个空格。
 * @param {string} str 代码
 * @param {number} num 缩进次数
 * @param {number} len 【可选】缩进单位，空格数
 */
export function indent(str, num, len = 2) {
  if (num === 0) return str
  const isLeft = num < 0; const result = []; let reg; let
    spaces = ''
  if (isLeft) {
    num *= -1
    reg = new RegExp(`(^\\s{0,${num * len}})`, 'g')
  } else {
    for (let i = 0; i < num * len; i++) spaces += ' '
  }

  str.split('\n').forEach(line => {
    line = isLeft ? line.replace(reg, '') : spaces + line
    result.push(line)
  })
  return result.join('\n')
}

// 首字母大小
export function titleCase(str) {
  return str.replace(/( |^)[a-z]/g, L => L.toUpperCase())
}

// 下划转驼峰
export function camelCase(str) {
  return str.replace(/-[a-z]/g, str1 => str1.substr(-1).toUpperCase())
}

export const emptyValArr = ['', undefined, null]

/**
 * 判断数据是否为空值。空值包括 undefined、null、和空字符串。
 * @param val 要判断的数据
 * @param isStrEmpty 是否认为空字符串是空值。默认为 true。
 */
export function isEmpty(val, isStrEmpty = true) {
  return val === undefined || val === null || (isStrEmpty && val === '')
}

/**
 * 根据 val 是否为空(undefined、null、'')，返回替换值
 * @param {*} val 要判断的值
 * @param {*} nullVal 必须。val 为空时返回该值。
 * @param {*} replaceVal 可选。val 不为空时返回该值，默认为 val。
 */
export const replaceEmpty = (val, nullVal, replaceVal) => (val === undefined || val === null || val === ''
  ? nullVal
  : replaceVal === undefined ? val : replaceVal)

export function isNumberStr(str) {
  return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str)
}

export const exportDefault = 'export default '

export const beautifierConf = {
  html: {
    indent_size: '2',
    indent_char: ' ',
    max_preserve_newlines: '-1',
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'separate',
    brace_style: 'end-expand',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: true,
    wrap_line_length: '110',
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true
  },
  js: {
    indent_size: '2',
    indent_char: ' ',
    max_preserve_newlines: '-1',
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'normal',
    brace_style: 'end-expand',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: true,
    end_with_newline: true,
    wrap_line_length: '110',
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true
  }
}

function stringify(obj) {
  return JSON.stringify(obj, (key, val) => {
    if (typeof val === 'function') {
      return `${val}`
    }
    return val
  })
}

function parse(str) {
  JSON.parse(str, (k, v) => {
    if (v && v.indexOf && v.indexOf('function') > -1) {
      return eval(`(${v})`)
    }
    return v
  })
}

export function deepClone(obj) {
  return parse(stringify(obj))
}

const typeMap = Object.freeze({
  '[object Boolean]': 'boolean',
  '[object Number]': 'number',
  '[object String]': 'string',
  '[object Function]': 'function',
  '[object Array]': 'array',
  '[object Date]': 'date',
  '[object RegExp]': 'regExp',
  '[object Undefined]': 'undefined',
  '[object Null]': 'null',
  '[object Object]': 'object'
})
function getType(obj) {
  return typeMap[Object.prototype.toString.call(obj)]
}

export function deepMerge(tgtObj, mergeData, isMergeArray) {
  const type = getType(mergeData)
  if (isMergeArray && type === 'array') {
    const newArr = JSON.parse(JSON.stringify(tgtObj || []))
    for (let i = 0, len = mergeData.length; i < len; i++) {
      newArr.slice(i, 1, deepMerge(newArr[i], mergeData[i]))
    }
    return newArr
  }
  if (type === 'object') {
    const newObj = JSON.parse(JSON.stringify(tgtObj || {}))
    Object.keys(mergeData).forEach(key => {
      newObj[key] = deepMerge(newObj[key], mergeData[key])
    })
    return newObj
  }
  return mergeData
}

/**
 * 获取数据的数值类型。若无法获取，返回 errVal。
 * eg.
 * getNumber(true) ⇒ 1
 * Number('10') ⇒ 10
 * getNumber('10px') ⇒ null
 */
export function getNumber(val, errVal = null) {
  if (!Number.isNaN(Number(val))) {
    return Number(val)
  }
  return errVal
}

// 拆分字符串 获取其中的function函数体
export function getFunction(str) {
  // const regex = /\s*(?:(async)\s+)?function\s+(?:([_$a-zA-Z][_$a-zA-Z0-9]*)\s*?)?\(((?:\s*(?:[_$a-zA-Z0-9]*)\s*)(?:,\s*(?:[_$a-zA-Z][_$a-zA-Z0-9]*)\s*)*?)\)\s*?\{\s*([\s\S]*?)\s*\}\s*/g  //只能检测至第一个}符号处
  // const regex = /\s*(?:(async)\s+)?function\s+(?:([_$a-zA-Z][_$a-zA-Z0-9]*)\s*?)?\(((?:\s*(?:[_$a-zA-Z0-9]*)\s*)(?:,\s*(?:[_$a-zA-Z][_$a-zA-Z0-9]*)\s*)*?)\)\s*?\{([\s\S]*?)\}\s*(async\s+function|function|$)/g
  const regex = /\s*(?:(async)\s+)?function\s+(?:([_$a-zA-Z][_$a-zA-Z0-9]*)\s*?)?\(((?:\s*(?:[_$a-zA-Z0-9]*)\s*)(?:,\s*(?:[_$a-zA-Z][_$a-zA-Z0-9]*)\s*)*?)\)\s*?\{\s*/g // 只获取方法名
  let result = null
  // const list = []
  const funName = []

  do {
    result = regex.exec(str)
    if (result) {
      // list.push(result[0].replace('function', ''))
      funName.push(result[2])
    }
  } while (result)

  return {
    jsStr: str
      .replace(/\/\*(.|\n|\r\n)*\*\//g, '')
      .replace(/async\s+function\s+/g, 'function async ')
      .replace(/function\s+/, '')
      .replace(/\s+function\s+/g, ','),
    funName
  }
}

// 在树形结构嵌套数组中根据某个属性查找对应对象  children中可以是对象、数组
export function findObjFromTreeById(list, idField = 'id', id, children = 'children') {
  list = [].concat(list)
  let target = null
  for (let i = 0; i < list.length; i++) {
    if (target) {
      return target
    }
    // eslint-disable-next-line eqeqeq
    if (list[i][idField] == id) {
      return list[i]
    }
    const childObj = list[i][children] || null
    if (childObj) {
      if (Array.isArray(childObj)) {
        if (childObj.length > 0) {
          target = findObjFromTreeById(childObj, idField, id, children)
        }
      } else {
        const newArr = []
        Object.keys(childObj).forEach(item => {
          newArr.push(childObj[item])
        })
        if (newArr.length > 0) {
          target = findObjFromTreeById(newArr, idField, id, children)
        }
      }
    }
  }
  return target
}

// 将一维数组转化为树形结构
export function arrayToTree(array, pid, id, childrensKey) {
  array = JSON.parse(JSON.stringify(array))
  if (typeof childrensKey === 'undefined') childrensKey = 'children'
  array.splice(0, array.length, ...array.filter((item, i) => {
    const parent = array.find(compare => item[pid] === compare[id])
    if (parent) {
      if (!Array.isArray(parent[childrensKey])) {
        parent[childrensKey] = []
      }
      parent[childrensKey].push(item)
      return false
    }
    return true
  }))
  return array
}


// 判断两个数组是否相等 数组中包含一维对象
export function compareObject(cArr, eArr) {
  console.log('compareObject', cArr, eArr)
  return cArr.every(item => {
    const cFieldArr = Object.keys(item)
    const eArrTarget = eArr.find(other => other.value === item.value)
    const eFieldArr = Object.keys(eArrTarget || {}) || []
    if (cFieldArr.length !== eFieldArr.length) {
      return false
    }
    return cFieldArr.every(field => {
      if (item[field] === eArrTarget[field]) {
        return true
      }
      console.log('不一样', item, field, eArrTarget)
      return false
    })
  })
}

/**
 * 简易防抖函数
 * @param {Function} func -防抖目标函数
 * @param {Number}} duration - 防抖时间间隔
 */
export function debounce(func, duration) {
  let timer
  return function () {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, arguments)
    }, duration)
  }
}
