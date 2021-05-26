/* eslint-disable camelcase */
import { deepMerge } from '@/utils/index'

import { basicComponents } from '@/components/generator/config'
import { getWidgetConf } from '@/components/generator/config/utils'
import configOperator, { getFirstRow, getFirstRowId } from '@/components/generator/configOperator'
import {
  getDsFromFilterItem,
  getKeyConditionFromFilterItem
} from '@/components/generator/autoGenerate/methods'

/**
 * 获取表单默认提交参数相关配置（paramsOptions、staticData、${type}Options）
 * @param type 'create'|'edit'|''
 */
export function getFormParamsConf(paramsArr, type) {
  const paramObj = {} // Array 转 Object
  const staticData = {}
  paramsArr.forEach(item => {
    const key = item.value
    paramObj[item.value] = { ...item }
    staticData[key] = item.inputVal || ''
  })
  return {
    [`${type}Options`]: paramObj, // 用于编辑器的展示和配置 // TODO: 事务流可以不需要这个配置？？？
    paramsOptions: paramObj,
    staticData: JSON.stringify(staticData) // 保存表单控件默认提交参数配置，供运行时使用
  }
}

function getFormItemConfArr(formItemList, filterMap, opts = {}) {
  return formItemList.map(item => {
    const formatItem = filterMap[item.value] || {}
    const { data } = formatItem
    const keyCondition = getKeyConditionFromFilterItem(formatItem)
    const dsInfo = getDsFromFilterItem(formatItem) || {}

    const widgetType = (getWidgetConf(item.widgettype) || {}).type
    const isInvisible = opts.isInvisible || widgetType === 'invisible'
    const isReadonly = !!(item.readonly || opts.readonly)

    const params = {
      invisible: isInvisible,
      readonly: isReadonly,
      // TODO: 目前通过tagIcon作为唯一标识，在 basicComponents 中查找对应组件配置
      // eslint-disable-next-line no-nested-ternary
      tagIcon: isInvisible
        ? 'input'
        : (isReadonly ? 'formItemText' : widgetType),
      label: item.label,
      vModel: item.value,
      required: !isReadonly && !!item.is_required,
      errValue: opts.errValue,
      width: '200px',
      style: { width: '200px' },
      widgetCode: `${item.widgettype || ''}`,
      dataSource: dsInfo,
      defaultValue: '',
      ...keyCondition
    }
    if (params.modelValue !== undefined) {
      params.modelValue = ''
    }

    if (data) {
      const { valueKey, labelKey } = keyCondition
      // TODO: 为啥组装exampleData 的时候只判断了 el-select，而这里只判断了comboTree？？？
      if (widgetType === 'comboTree') {
        // WARN: config.js 中设置的是 undefined。'combo-tree'在预览的时候，defaultValue作为data要求为数组，否则报错。但实际运行时要求的value是单个值，否则不能正确还原表单。
        params.data = data.map(sub => {
          if (sub.selected) {
            params.defaultValue = sub[valueKey]
            if (params.modelValue !== undefined) {
              params.modelValue = sub[valueKey]
            }
          }
          return sub
        })
      } else {
        params.options = data.map(sub => {
          if (sub.selected) {
            params.defaultValue = sub[valueKey]
            if (params.modelValue !== undefined) {
              params.modelValue = sub[valueKey]
            }
          }
          return {
            value: sub[valueKey],
            label: sub[labelKey]
          }
        })
      }
    }
    return params
  })
}

/**
 * 添加表单组件
 * NOTE: 该方法中的 configOperator.addComponent 直接修改 activeData 数据
 */
export function addFormComponent(formItemList, filterMap, activeData, opts) {
  const itemConfArr = getFormItemConfArr(formItemList, filterMap, opts)
  // const parentId = getFirstRowId(activeData)
  const row = getFirstRow(activeData)
  itemConfArr.forEach(conf => {
    const { tagIcon } = conf
    const defaultConf = basicComponents.find(item => item.tagIcon === tagIcon)
    if (defaultConf) {
      const newConf = deepMerge(defaultConf, conf)
      // configOperator.addComponent(activeData, newConf, {
      //   parentId,
      //   formConf: activeData
      // })
      configOperator.addComponent(row.children, newConf, {
        formConf: activeData
      })
    }
  })
  return activeData
}

export function setForm({
  operateType,
  search,
  filterMap,
  activeData
}) {
  // 表单默认提交参数相关配置
  const paramsOptions = getFormParamsConf(search, operateType)
  // 添加表单组件 NOTE: 该方法直接修改 activeData 数据
  activeData = addFormComponent(search, filterMap, activeData)
  return {
    ...activeData,
    ...paramsOptions
  }
}
