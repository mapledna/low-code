import { defaultFormConf } from '@/components/generator/config/utils'
import { optionComponentList } from '@/components/generator/config'
import { isEmpty, findObjFromTreeById } from '@/utils/index'

export function getChildIndex(activeData, val, key = '_key') {
  return (activeData.children || []).findIndex(item => item[key] === val)
}
export function getChildItem(activeData, val, key = '_key') {
  return (activeData.children || []).find(item => item[key] === val)
}
export function setChildByKey(activeData, newData, val, key = '_key') {
  if (!activeData.children || activeData.children.length <= 0) return null
  const index = getChildIndex(activeData, val, key)
  activeData.children[index] = {
    ...activeData.children[index],
    ...newData
  }
  return activeData.children[index]
}

/**
 * 获取表单控件中默认添加的行容器。
 * 相当于获取表单第一个行容器
 */
export function getFirstRow(activeData = {}) {
  return (activeData.children || []).find(
    item => item.layout === 'rowFormItem'
  )
}
/**
 * 获取表单控件中默认添加的row容器Id。
 */
export function getFirstRowId(activeData) {
  const row = getFirstRow(activeData)
  return row ? row.formId : undefined
}

function getMaxId(list, compareId) {
  const listMax = Math.max.apply(
    null,
    list.map(item => {
      const { formId } = item
      if (!formId) {
        return 0
      }
      if (typeof formId === 'number') {
        return formId
      }
      const arr = formId.split('_')
      return arr.length > 0 ? arr[arr.length - 1] || 0 : 0
      // const match = formId.match(/[\d]+$/)
      // if (!match) { return 0 }
      // return Number(match[0])
    })
  )
  return Math.max(listMax, compareId)
}

const DEF_ID = 100

export default {
  // NOTE: home.vue 中，删除组件时不会修改 id，id继续累加。
  autoId: DEF_ID,
  setAutoId(val) {
    this.autoId = val || DEF_ID
  },
  getAutoId(add) {
    if (add) {
      this.autoId++
    }
    return this.autoId
  },
  resetAutoId() {
    this.setAutoId(DEF_ID)
  },

  /**
   * 添加组件 JSON 配置
   * @params confTree 完整的数据
   * @params conf 待添加的数据
   * @params opts
   * @params    opts.parentId 需要添加到的父级组件componentId(即formId)。可选，默认在根节点中追加。
   * @params    opts.formConf 提供全局的 span 和 gutter 配置。可选，默认为 defaultFormConf
   * @params    opts.componentId 提供唯一值。可选，默认自动生成。
   * @params    opts.isForceId 已存在vModel或componentName时，是否强制刷新。默认不强制刷新。
   */
  addComponent(confTree, conf, {
    parentId, formConf, componentId, isForceId
  }) {
    let target = confTree
    if (parentId) {
      const parent = findObjFromTreeById(confTree, 'formId', parentId) || {}
      target = parent.children || []
      if (!componentId) {
        componentId = this.getAutoId(true)
      }
    }
    const componentConf = this.setComponentConf(conf, {
      formConf,
      componentId,
      isForceId
    })
    target.push(componentConf)
    return componentConf
  },

  /**
   * 设置组件配置的 id 等基础数据，同时递归设置子组件数据。
   * @params conf
   * @params opts
   * @params    opts.formConf 提供全局的 span 和 gutter 配置。可选，默认为 defaultFormConf
   * WARN: 不需要总是设置 span 和 gutter，而是在使用时动态取值。目前这样的设计不能在修改 formConf 后动态更新 span 和 gutter
   * @params    opts.componentId 提供唯一值。可选，默认使用 conf.formId 或自动生成。
   * @params    opts.isForceId 已存在vModel或componentName时，是否强制刷新。默认不强制刷新。
   * NOTE: 生成的 id 包括：
   *  formId 唯一id。不用于展示，根据 componentId 生成。
   *  renderKey 用于组件循环的 key 值，改变该值可强制更新组件。默认为 formId，可能被修改为时间戳。
   *  vModel 即字段名，设计器中可修改。仅 layout 为 colFormItem 的组件有这一字段。
   *  componentName 即组件名，设计器中不可修改。仅 layout 不为 colFormItem 的组件有这一字段。NOTE: 影响组件联动
   */
  setComponentConf(
    conf,
    { formConf = { ...defaultFormConf }, componentId, isForceId } = {}
  ) {
    if (isEmpty(componentId)) {
      componentId = !isForceId && conf.formId ? conf.formId : this.getAutoId(true)
    }
    const componentConf = {
      ...conf,
      formId: componentId,
      renderKey: componentId
      // span: isEmpty(conf.span) ? formConf.span : conf.span
    }
    if (componentConf.layout === 'colFormItem') {
      // NOTE: 表单控件自动生成 vModel
      if (!componentConf.vModel || isForceId) {
        componentConf.vModel = `field${componentId}`
      }
      if (componentConf.placeholder === '') {
        const preStr = optionComponentList.indexOf(componentConf.tag) > -1
          ? '请选择'
          : '请输入'
        componentConf.placeholder = `${preStr}${componentConf.label}`
      }
    } else {
      // NOTE: 目前 basicComponents 中的 layout 均为 colFormItem，containerLayoutList 包含了其余所有的 layout 值。
      // else if (containerLayoutList.indexOf(componentConf.layout) > -1) {
      if (!componentConf.componentName || isForceId) {
        componentConf.componentName = `row${componentId}`
      }
      // delete componentConf.label
      if (conf.span) {
        componentConf.gutter = isEmpty(conf.gutter)
          ? formConf.gutter
          : conf.gutter
      }
    }

    // TODO: 设置联动
    // this.saveTagAsList(item)

    if (Array.isArray(componentConf.children)) {
      const childrenList = componentConf.children
      componentConf.children = childrenList.map((child, index) => {
        const childId = child.formId || this.getAutoId(true)
        return this.setComponentConf(child, {
          formConf,
          componentId: childId,
          isForceId
        })
      })
    }
    return componentConf
  },

  /**
   * 合并对象
   */
  assembleConf({ confTree, formConf = { ...defaultFormConf }, componentId }) {
    return {
      fields: JSON.parse(JSON.stringify(confTree)),
      ...formConf,
      idGlobal: componentId || this.getAutoId(false)
    }
  }
}
