/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
import { ruleConf } from './config'
import { replaceEmpty, titleCase } from '@/utils/index'
import {
  getWidgetConf
} from '@/components/generator/config/utils'
import {
  getFieldId
} from '@/components/generator/methods-commom'
import {
  getChildItem
} from '@/components/generator/configOperator'

let confGlobal
let someSpanIsNot24

const renderGlobal = { // 是否已经加载。
  iframeDialog: false
}

export function dialogWrapper(str) {
  return `<el-dialog v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" title="Dialog Titile">
    ${str}
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handelConfirm">确定</el-button>
    </div>
  </el-dialog>`
}

export function iframeDialog(conf, type) {
  return `<el-dialog
    class="nti-page-dialog iframe-dialog"
    :visible.sync="isShowIframeDialog"
    :title="iframeDialogTitle"
    append-to-body
    :fullscreen="true"
    :modal="false"
    @open="isShowIframeDialog = true"
    @close="isShowIframeDialog = false"
  >
    <iframe v-if="isShowIframeDialog" ref="iframeDialog" name="iframeDialog" :src="iframeDialogSrc" frameborder=0></iframe>
  </el-dialog>`
}

const DIALOG_TYPE = 'dialog' // dialog 模态框|drawer 抽屉式
export function componentDialog(conf, type, buildType) {
  const inner = buildType === 'prod' ? '<component v-if="isShowComponentDialog" :is="componentDialogPage" v-on="$listeners" :page-params="componentDialogOptions" @closeComponentDialog="closeComponentDialog" @refreshTable="refreshTable" @refreshInitData="refreshInitData" @editDataSource="editDataSource"/>' : '抱歉，暂时不支持预览内置页面。<br/><br/>页面id：{{componentDialogPage}}<br/>输入参数：{{componentDialogOptions}}'
  if (DIALOG_TYPE === 'drawer') {
    return `<el-drawer
    class="nti-page-dialog"
    :close-on-click-modal="false"
    :visible.sync="isShowComponentDialog"
    :title="componentDialogTitle"
    direction="rtl"
    :size="dialogWidth"
    append-to-body
    @open="isShowComponentDialog = true"
    @close="isShowComponentDialog = false"
  >${inner}</el-drawer>`
  }
  return `<el-dialog
    class="nti-page-dialog"
    :close-on-click-modal="false"
    :visible.sync="isShowComponentDialog"
    :title="componentDialogTitle"
    :width="dialogWidth"
    :fullscreen="dialogWidth==='100%'"
    :modal="dialogWidth!=='100%'"
    append-to-body
    @open="isShowComponentDialog = true"
    @close="isShowComponentDialog = false"
  >${inner}</el-dialog>`
}

export function filePreviewDialog(conf, type, buildType) {
  return `<el-dialog
    class="nti-preview-dialog"
    :visible.sync="isShowPreviewDialog"
    title=""
    width="80%"
    :modal="true"
    append-to-body
    @open="isShowPreviewDialog = true"
    @close="isShowPreviewDialog = false"
  >
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>`
}

export function vueTemplate(str) {
  return `<template>
    <div>
      ${str}
    </div>
  </template>`
}

export function vueScript(str) {
  return `<script>
    ${str}
  </script>`
}

export function cssStyle(cssStr) {
  return `<style>
    ${cssStr}
  </style>`
}

function buildPageTemplate(conf, child, type) {
  let str = ''
  const target = conf.fields.find(item => item.tagType === 'templatePage')
  if (target) {
    str = `<div class="layout-container">
    ${child}
    ${buildFromBtns(conf, type)}
    </div>`
    return str
  }

  let labelPosition = ''
  if (conf.labelPosition !== 'right') {
    labelPosition = `label-position="${conf.labelPosition}"`
  }
  str = `<el-form
      ref="${conf.formRef}"
      :model="${conf.formModel}"
      :rules="${conf.formRules}"
      size="${conf.size}"
      ${buildBooleanAttr(conf, 'disabled')}
      label-width="${conf.labelWidth}px"
      ${labelPosition}
      v-loading="isLockPage"
      @submit.native.prevent
    >
      ${child}
      ${buildFromBtns(conf, type)}
    </el-form>`
  if (someSpanIsNot24) {
    str = `<el-row :gutter="${conf.gutter}">
      ${str}
    </el-row>`
  }
  return str
}

function buildFromBtns(conf, type) {
  let str = ''
  if (conf.formBtns && type === 'file') {
    str = `<el-form-item size="large">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>`
    if (someSpanIsNot24) {
      str = `<el-col :span="24">
          ${str}
        </el-col>`
    }
  }
  return str
}

// span不为24的用el-col包裹
function colWrapper(element, str) {
  const { readonly } = element
  const display = replaceEmpty((element.style || {}).display, 'block')
  const isBlock = display === 'block'
  const tag = isBlock ? 'el-col' : 'div'
  const classObj = {
    readonly,
    'col-inline': !isBlock
  }
  // if (someSpanIsNot24 || element.span !== 24) {
  return `<${tag} 
      ${isBlock ? `:span="${element.span}"` : ''} 
      class="${getClassName(classObj)}"
    >
      ${str}
    </${tag}>\n`
  // }
  // return str
}

const layouts = {
  colFormItem(element) {
    if (element.nonuse || element.invisible) {
      return ''
    }
    let labelWidth = ''
    let label = `label="${element.label}"`
    if (element.labelWidth && element.labelWidth !== confGlobal.labelWidth) {
      labelWidth = `label-width="${element.labelWidth}px"`
    }
    if (!element.showLabel) {
      labelWidth = 'label-width="0"'
      label = ''
    }
    const required = !ruleConf[element.tag] && element.required ? 'required' : ''
    const tagDom = tags[element.tag] ? tags[element.tag](element) : null
    let str = `<el-form-item ${labelWidth} ${label} prop="${element.vModel}" ${required}>
        ${tagDom}
      </el-form-item>`
    str = colWrapper(element, str)
    return str
  },
  // 行容器
  rowFormItem(element) {
    if (element.nonuse) {
      return ''
    }
    const type = element.type === 'default' ? '' : `type="${element.type}"`
    const justify = element.type === 'default' ? '' : `justify="${element.justify}"`
    const align = element.type === 'default' ? '' : `align="${element.align}"`
    const gutter = element.gutter || element.gutter === 0 ? `:gutter="${element.gutter}"` : ''
    const children = element.children.map(el => layouts[el.layout](el))
    let str = `<el-row ${type} ${justify} ${align} ${gutter}>
      ${children.join('\n')}
    </el-row>`
    str = colWrapper(element, str)
    return str
  },
  // 布局容器
  rowContainer(el) {
    if (el.nonuse) return ''
    const { style } = attrBuilder(el)
    let str = `<el-container class="content-layout" ${style}>
      ${el.aside ? `<el-aside class="content-layout__left" ${buildStyleAttr(el, 'asideStyle')}>
          ${buildRowContainerChild(el, 'leftChild')}
        </el-aside>` : ''} 
      <el-container class="content-layout__main" direction=${(el.header || el.footer) ? 'vertical' : 'horizontal'}>
        ${el.header ? `<el-header ${buildStyleAttr(el, 'headerStyle')}>Header</el-header>` : ''}
        <el-main ${buildStyleAttr(el, 'mainStyle')}>
          ${buildRowContainerChild(el, 'centerChild')}</el-main>
        ${el.footer ? `<el-footer ${buildStyleAttr(el, 'headerStyle')}>
          ${buildRowContainerChild(el, 'footerChild')}
        </el-footer>` : ''}
      </el-container>
    </el-container>`
    str = colWrapper(el, str)
    return str
  },

  // 表单详情
  formDetail(element) {
    return this.formContainer(element)
  },

  // 表单控件
  formContainer(element) {
    const type = element.type === 'default' ? '' : `type="${element.type}"`
    const justify = element.justify === 'default' ? '' : `justify="${element.justify}"`
    const align = element.align === 'default' ? '' : `align="${element.align}"`
    const gutter = element.gutter ? `:gutter="${element.gutter}"` : ''
    const children = element.children.map(el => layouts[el.layout](el))
    let str = `<el-row ${type} ${justify} ${align} ${gutter}>
      ${children.join('\n')}
    </el-row>`
    str = colWrapper(element, str)
    return str
  },
  // 主从表控件
  tableContainer(element) {
    const type = element.type === 'default' ? '' : `type="${element.type}"`
    const justify = element.justify === 'default' ? '' : `justify="${element.justify}"`
    const align = element.align === 'default' ? '' : `align="${element.align}"`
    const gutter = element.gutter ? `:gutter="${element.gutter}"` : ''
    const children = element.children.map(el => layouts[el.layout](el))
    let str = `<el-row ${type} ${justify} ${align} ${gutter}>
      ${children.join('\n')}
    </el-row>`
    str = colWrapper(element, str)
    return str
  },
  // 树+表格
  treeAndTable(el) {
    return layouts.rowContainer(el)
  },
  // 菜单+选项卡
  menuAndTab(el) {
    return layouts.rowContainer(el)
  },
  // 树+表单
  treeAndForm(el) {
    return layouts.rowContainer(el)
  },
  // 选项卡
  tabContainer(el) {
    const { type } = attrBuilder(el)
    const tabPosition = `tab-position="${el.tabPosition}"`
    const justify = el.justify === 'default' ? '' : `justify="${el.justify}"`
    const align = el.align === 'default' ? '' : `align="${el.align}"`
    const gutter = el.gutter ? `:gutter="${el.gutter}"` : ''
    const children = buildTabsChild(el)
    const vModel = el.childType === 'iframe' ? `v-model="${el.componentName}CurrentTabValue"` : ''
    const removeTab = el.childType === 'iframe' ? `@tab-remove="removeTab($event,'${el.componentName}')"` : ''

    let str = `<el-row ${type} ${justify} ${align} ${gutter}>
      <el-tabs ${vModel} ${type} ${tabPosition} ${removeTab}>
        ${children}
      </el-tabs >
    </el-row>`
    str = colWrapper(el, str)
    return str
  },
  // 登录模板
  uiLoginPage(el) {
    return `
    <ui-login-page
      loginBgLarge="${el.loginBgLarge}"
      loginBgSmall="${el.loginBgSmall}"
      imgSrc="${el.imgSrc}"
      websiteIco="${el.websiteIco}"
      loginUrl="${el.loginUrl}"
      projectName="${el.projectName}"
      appCode="${el.appCode}"
      path="${el.path}"
      name="${el.name}"
    />
    `
  },
  // 登录模板
  uiLoginPageV2(el) {
    return `
    <ui-login-page-v2
      loginBgLarge="${el.loginBgLarge}"
      loginBgSmall="${el.loginBgSmall}"
      imgSrc="${el.imgSrc}"
      websiteIco="${el.websiteIco}"
      loginUrl="${el.loginUrl}"
      projectName="${el.projectName}"
      appCode="${el.appCode}"
      path="${el.path}"
      name="${el.name}"
    />
    `
  },
  // 主页模板1
  uiMainV1(el) {
    return `<ui-main-v1
    aside-title="${el.projectName}"
    logo-icon="${el.logoIcon}"
    :variables="${el.componentName}variables"
    :is-collapse="${el.isCollapse}"
    menu-id="${el.id}"
    :menu-data="${el.componentName}Options"
    :home-page="${el.componentName}HomePage"
    system-type="${el.systemType}"
    />`
  },
  // 主页模板2
  uiMainV2(el) {
    return `<ui-main-v2
    header-title="${el.projectName}"
    logo-icon="${el.logoIcon}"
    :variables="${el.componentName}variables"
    :is-collapse="${el.isCollapse}"
    menu-id="${el.id}"
    :menu-data="${el.componentName}Options"
    :home-page="${el.componentName}HomePage"
    system-type="${el.systemType}"
    />`
  },

  // 移动端主页
  ntiMobileMain(el) {
    return `<ui-mobile-main :menu-data="${el.componentName}Options" />`
  }
}

// 标签属性
const tags = {
  // 列表弹窗选择
  listPicker: el => {
    const tagName = `Ui${titleCase(el.tag)}`
    const { vModelKey, style } = attrBuilder(el)
    const fieldId = getFieldId(el)
    let tableId = null
    const children = el.children.map(item => {
      if (item._key === 'listPickerTable') {
        tableId = getFieldId(item)
      }
      return layouts[item.layout](item)
    }).join('\n')
    const idConf = `{fieldId: '${fieldId}', tableId: '${tableId}'}`

    return `<${tagName} 
      v-model="${vModelKey}" 
      :visible.sync="${fieldId}_conf.visible"
      ${buildBooleanAttr(el, 'placeholder')}
      ${buildBooleanAttr(el, 'readonly')}
      ${buildStringAttr(el, 'size')}
      ${buildStringAttr(el, 'pickerWidth')}
      ${buildStringAttr(el, 'pickerHeight')}
      ${buildOptAndKeys(el)}
      ${style}
      @after-show="${confGlobal.formModel}.${tableId}Table && !${confGlobal.formModel}.${tableId}Table.height && setListPickerTableHeight(${idConf})"
      @change="changeListPicker(${idConf}, $event)"
      @cancel="cancelListPicker(${idConf})"
      @clear="clearListPicker(${idConf})"
      @confirm="changeListPickerByCurrent(${idConf})"
    >
      ${children}
    </${tagName}>`
  },

  // 表单详情项
  formItemText: el => {
    const tagName = `Ui${titleCase(el.tag)}`
    const { vModelKey, style } = attrBuilder(el)
    const modelValue = el._parentFieldId ? `formDetailData_${el._parentFieldId}.${el.vModel}` : vModelKey
    const errValue = el.errValue ? `errValue="${el.errValue}"` : ''
    return `<${tagName} 
      :modelValue="${modelValue}" 
      ${buildOptAndKeys(el)}
      ${errValue}
      ${style}
    />`
  },

  'el-input': el => {
    const { vModelKey, vModel, width } = attrBuilder(el)
    const maxlength = el.maxlength ? `:maxlength="${el.maxlength}"` : ''
    const showWordLimit = el['show-word-limit'] ? 'show-word-limit' : ''
    const prefixIcon = el['prefix-icon'] ? `prefix-icon='${el['prefix-icon']}'` : ''
    const suffixIcon = el['suffix-icon'] ? `suffix-icon='${el['suffix-icon']}'` : ''
    const type = el.type ? `type="${el.type}"` : ''
    const disabled = (el.disabled || el.serialNumber) ? ':disabled=\'true\'' : ''
    const autosize = el.autosize && el.autosize.minRows
      ? `:autosize="{minRows: ${el.autosize.minRows}, maxRows: ${el.autosize.maxRows}}"`
      : ''
    const clearSpace = `${vModelKey}=(${vModelKey}).trim();`
    const ref = `ref='${el.vModel}'`
    const {
      onInput, onChange, onFocus, onBlur, onClear
    } = eventBuilder(el, { change: { beforeFn: clearSpace } })
    return `<${el.tag} ${vModel} ${ref} ${type} ${maxlength} ${showWordLimit} ${disabled} 
      ${prefixIcon} ${suffixIcon} ${autosize} ${width} 
      ${buildBooleanAttr(el, 'placeholder')} 
      ${buildBooleanAttr(el, 'readonly')} 
      ${buildBooleanAttr(el, 'clearable')} 
      ${buildBooleanAttr(el, 'show-password')} 
      ${onInput} ${onChange} ${onFocus} ${onBlur} ${onClear}
    >
      ${buildElInputChild(el)}
    </${el.tag}>`
  },
  // 数字输入框
  'el-input-number': el => {
    const controlsPosition = el['controls-position'] ? `controls-position=${el['controls-position']}` : ''
    const min = el.min ? `:min='${el.min}'` : ''
    const max = el.max ? `:max='${el.max}'` : ''
    const step = el.step ? `:step='${el.step}'` : ''
    const stepStrictly = el['step-strictly'] ? 'step-strictly' : ''
    const precision = el.precision ? `:precision='${el.precision}'` : ''
    const valueKey = `${confGlobal.formModel}.${el.vModel}`
    const { onChange, onFocus, onBlur } = eventBuilder(el)

    return `<${el.tag} :value="${valueKey} === '' || ${valueKey} === null ? undefined : ${valueKey}" 
      ${step} ${stepStrictly} ${precision} ${controlsPosition} ${min} ${max}
      ${buildBooleanAttr(el, 'placeholder')} 
      ${buildBooleanAttr(el, 'disabled')}
      ${onChange} ${onFocus} ${onBlur} @input="($event)=>{${valueKey} = $event}"
    />`
  },

  // 按钮
  'el-button': el => {
    const { width } = attrBuilder(el)
    const fieldId = getFieldId(el)
    const tagName = el.tag || 'el-button'
    const type = el.type ? `type="${el.type}"` : ''
    const size = el.size ? `size="${el.size}"` : ''
    const prefixIcon = el['prefix-icon'] ? `icon="${el['prefix-icon']}"` : ''
    const suffixIcon = el['suffix-icon'] ? `<i class="${el['suffix-icon']} el-icon--right" />` : ''
    const label = el.defaultValue || ''
    // eslint-disable-next-line no-nested-ternary
    const nativeType = !confGlobal.enterToTab ? el.nativeType ? `native-type="${el.nativeType}"` : '' : ''
    const refName = ['submit', 'reset'].indexOf(el.nativeType) >= 0 ? `ref="${el.nativeType}Btn"` : ''
    const className = el.enterClick ? 'class="btn-enter-click"' : ''

    // 内置事件：打开页面-弹窗方式
    if (el.action === 'openPage' && el.openPageType === 'dialog') {
      if (el.actionType === 'pageId') { // 选择内部页面
        renderGlobal.componentDialog = true
      } else { // 自定义页面
        renderGlobal.iframeDialog = true
      }
    }
    // NOTE: 不在html中拼接复杂数据，存入js中。
    // const parameters = `'${fieldId}', ${JSON.stringify(el.dataSource || {}).replace(/"/ig, '\'')}, ${JSON.stringify(el.initDataOptions || {}).replace(/"/ig, '\'')}`
    const parameters = `'${fieldId}'`
    const { click } = eventBuilder(el, { click: { params: parameters } })
    const displayFn = el.displayFn ? `v-if="${el.displayFn}"` : ''
    const disabledFn = el.disabledFn ? `:disabled="!${el.disabledFn}"` : ''

    // TODO: 兼容顶部行容器中的按钮。不用 el.vModel，改用 fieldId 避免重复
    const allowAttr = el.allowAttr || (el.vModel && `v-allow:[$attrs].button="'${el.vModel}|||page'"`)

    return `<${tagName} ${type} ${size} ${width} ${nativeType} ${refName} ${className} ${prefixIcon}
      ${buildBooleanAttr(el, 'disabled')}
      ${buildBooleanAttr(el, 'plain')}
      ${buildBooleanAttr(el, 'round')}
      ${allowAttr} 
      ${el.otherAttr || ''} 
      ${click}
      ${displayFn} 
      ${disabledFn}
      :loading="loadingMap.${fieldId}"
    >
      ${label} ${suffixIcon}
    </${tagName}>`
  },
  // 选择框
  'el-select': el => {
    const { vModel, width } = attrBuilder(el)
    return `<${el.tag} ${vModel} ${width} 
      ${buildBooleanAttr(el, 'multiple')} 
      ${buildBooleanAttr(el, 'filterable')}
      ${buildBooleanAttr(el, 'placeholder')} 
      ${buildBooleanAttr(el, 'disabled')}
      ${buildBooleanAttr(el, 'clearable')}
      @change="handlerDataChange($event,'${el.vModel}')"
    >
      ${buildElSelectChild(el)}
    </${el.tag}>`
  },
  // 面包屑
  'el-breadcrumb': el => {
    const {
      vModel
    } = attrBuilder(el)
    let child = buildBreadcrumbChild(el)

    if (child) child = `\n${child}\n` // 换行
    return `<${el.tag} ${vModel}>${child}</${el.tag}>`
  },
  // 折叠面板
  'el-collapse': el => {
    const { vModel } = attrBuilder(el)
    const accordion = `accordion=${el.accordion}`
    let child = buildCollapseChild(el)

    if (child) child = `\n${child}\n` // 换行
    return `<${el.tag} ${vModel} ${accordion}>${child}</${el.tag}>`
  },
  // 轮播图
  'el-carousel': el => {
    const { vModel, type } = attrBuilder(el)
    const height = `height="${el.height}"`
    const autoplay = `autoplay="${el.autoplay}"`
    const interval = `:interval="${el.interval}"`
    const indicatorPosition = `indicator-position="${el['indicator-position']}"`
    const arrow = `arrow="${el.arrow}"`
    const loop = `loop="${el.loop}"`
    const direction = `direction="${el.direction}"`
    let child = buildCarouselChild(el)

    if (child) child = `\n${child}\n` // 换行
    return `<${el.tag} ${vModel} ${height} ${type} ${autoplay} ${interval} ${indicatorPosition} ${arrow} ${loop} ${direction}>${child}</${el.tag}>`
  },
  // 图片
  'el-image': el => {
    const { vModel, style, src } = attrBuilder(el)
    // const src = `src="${el.src}"`
    const fit = `fit="${el.fit}"`
    const alt = `alt="${el.alt}"`
    // const style = `style="width:${el.style.width};height:${el.style.height};display:${el.style.display};"`

    return `<${el.tag} ${vModel} ${src} ${fit} ${alt} ${style}></${el.tag}>`
  },
  'el-radio-group': el => {
    const { vModel } = attrBuilder(el)
    const size = `size="${el.size}"`
    return `<${el.tag} ${vModel} ${size} ${buildBooleanAttr(el, 'disabled')}>
      ${buildElRadioGroupChild(el)}
    </${el.tag}>`
  },
  'el-checkbox-group': el => {
    const { disabled, vModel } = attrBuilder(el)
    const size = `size="${el.size}"`
    const min = el.min ? `:min="${el.min}"` : ''
    const max = el.max ? `:max="${el.max}"` : ''
    let child = buildElCheckboxGroupChild(el)

    if (child) child = `\n${child}\n` // 换行
    return `<${el.tag} ${vModel} ${min} ${max} ${size} ${disabled}>${child}</${el.tag}>`
  },
  'el-switch': el => {
    const { disabled, vModel } = attrBuilder(el)
    const activeText = el['active-text'] ? `active-text="${el['active-text']}"` : ''
    const inactiveText = el['inactive-text'] ? `inactive-text="${el['inactive-text']}"` : ''
    const activeColor = el['active-color'] ? `active-color="${el['active-color']}"` : ''
    const inactiveColor = el['inactive-color'] ? `inactive-color="${el['inactive-color']}"` : ''
    const activeValue = el['active-value'] !== true ? `:active-value='${JSON.stringify(el['active-value'])}'` : ''
    const inactiveValue = el['inactive-value'] !== false ? `:inactive-value='${JSON.stringify(el['inactive-value'])}'` : ''

    return `<${el.tag} ${vModel} ${activeText} ${inactiveText} ${activeColor} ${inactiveColor} ${activeValue} ${inactiveValue} ${disabled}></${el.tag}>`
  },
  'el-cascader': el => {
    const { vModel, width } = attrBuilder(el)
    const options = el.options ? `:options="${el.vModel}Options"` : ''
    const props = el.props ? `:props="${el.vModel}Props"` : ''
    const showAllLevels = el['show-all-levels'] ? '' : ':show-all-levels="false"'
    const separator = el.separator === '/' ? '' : `separator="${el.separator}"`
    return `<${el.tag} ${vModel} ${options} ${props} ${width} ${showAllLevels} ${separator}
      ${buildBooleanAttr(el, 'filterable')}
      ${buildBooleanAttr(el, 'placeholder')} 
      ${buildBooleanAttr(el, 'disabled')}
      ${buildBooleanAttr(el, 'clearable')} />`
  },
  // 树形选择
  'el-tree': el => {
    // TODO: 参考 comboTree 添加 key 值
    const data = el.data ? `:data="${el.vModel}Tree"` : ''
    const showCheckbox = `:show-checkbox="${el['show-checkbox']}"`
    const nodeKey = 'node-key="id"'
    const ref = `ref="${el.vModel}Tree"`
    const defaultExpandAll = `:default-expand-all="${el['default-expand-all']}"`
    const highlightCurrent = `:highlight-current="${el['highlight-current']}"`
    const defaultCheckedKeys = `:default-expanded-keys="${JSON.stringify(el.defaultCheckedKeys)}"`
    const accordion = `:accordion="${el.accordion}"`
    const draggable = `:draggable="${el.draggable}"`
    // const nodeClick = `@node-click="handlerDataChange($event.id,'${el.vModel}')"`
    const nodeClick = `@node-click="handlerDataChange($event,'${el.vModel}','${el.$callback || ''}')"`
    const checkEvent = el['show-checkbox'] ? `@check="checkNode(...arguments,'${el.vModel}')"` : ''
    return `<${el.tag} ${ref} ${data} ${nodeKey} ${showCheckbox} ${defaultExpandAll} ${defaultCheckedKeys} ${highlightCurrent} ${accordion} ${draggable} ${nodeClick} ${checkEvent}>
      <span slot-scope="{ node, data }">
        <span class="node-label" :title="node.label">{{node.label}}</span>
      </span>
    </${el.tag}>`
  },
  // 树形 下拉
  'combo-tree': el => {
    const { vModel, style } = attrBuilder(el)
    const showCheckbox = `:show-checkbox="${el['show-checkbox']}"`
    const defaultExpandAll = `:default-expand-all="${el['default-expand-all']}"`
    const highlightCurrent = `:highlight-current="${el['highlight-current']}"`
    const accordion = `:accordion="${el.accordion}"`
    const draggable = `:draggable="${el.draggable}"`
    const size = `size="${el.size}"`
    const showRoot = `:showRoot="${el.showRoot}"`
    const width = el.width ? `width="${el.width}"` : ''
    const displayType = el.displayType ? `display-type="${el.displayType}"` : ''
    const triggerType = el.triggerType ? `trigger-type="${el.triggerType}"` : ''
    const nodeClick = el.$click ? `@node-click="${el.$click}"` : `@node-click="(node, value)=> handlerDataChange(value, '${el.vModel}')"` // 默认带handlerDataChange事件
    return `<${el.tag} ${vModel} ${size} ${width} ${style} ${showRoot} ${showCheckbox} ${defaultExpandAll} ${highlightCurrent} ${accordion} ${draggable} ${displayType} ${triggerType} 
    ${buildOptAndKeys(el, 'data')} 
    ${buildBooleanAttr(el, 'placeholder')} 
    ${nodeClick} />`
  },

  'el-slider': el => {
    const { disabled, vModel } = attrBuilder(el)
    const min = el.min ? `:min='${el.min}'` : ''
    const max = el.max ? `:max='${el.max}'` : ''
    const step = el.step ? `:step='${el.step}'` : ''
    const range = el.range ? 'range' : ''
    const showStops = el['show-stops'] ? `:show-stops="${el['show-stops']}"` : ''
    return `<${el.tag} ${min} ${max} ${step} ${vModel} ${range} ${showStops} ${disabled}></${el.tag}>`
  },

  // 时间选择器
  'el-time-picker': el => {
    const { vModel, width } = attrBuilder(el)
    const startPlaceholder = el['start-placeholder'] ? `start-placeholder="${el['start-placeholder']}"` : ''
    const endPlaceholder = el['end-placeholder'] ? `end-placeholder="${el['end-placeholder']}"` : ''
    const rangeSeparator = el['range-separator'] ? `range-separator="${el['range-separator']}"` : ''
    const isRange = el['is-range'] ? 'is-range' : ''
    const format = el.format ? `format="${el.format}"` : ''
    const valueFormat = el['value-format'] ? `value-format="${el['value-format']}"` : ''
    const pickerOptions = el['picker-options'] ? `:picker-options='${JSON.stringify(el['picker-options'])}'` : ''
    return `<${el.tag} ${vModel} ${isRange} ${format} ${valueFormat} ${pickerOptions} ${width} ${startPlaceholder} ${endPlaceholder} ${rangeSeparator} 
      ${buildBooleanAttr(el, 'placeholder')} 
      ${buildBooleanAttr(el, 'disabled')}
      ${buildBooleanAttr(el, 'clearable')}
    />`
  },

  // 日期选择器
  'el-date-picker': el => {
    const { vModel, width } = attrBuilder(el)
    const startPlaceholder = el['start-placeholder'] ? `start-placeholder="${el['start-placeholder']}"` : ''
    const endPlaceholder = el['end-placeholder'] ? `end-placeholder="${el['end-placeholder']}"` : ''
    const rangeSeparator = el['range-separator'] ? `range-separator="${el['range-separator']}"` : ''
    const format = el.format ? `format="${el.format}"` : ''
    const valueFormat = el['value-format'] ? `value-format="${el['value-format']}"` : ''
    const type = el.type === 'date' ? '' : `type="${el.type}"`
    return `<${el.tag} ${type} ${vModel} ${format} ${valueFormat} ${width} 
      ${startPlaceholder} ${endPlaceholder} ${rangeSeparator} 
      ${buildBooleanAttr(el, 'placeholder')} 
      ${buildBooleanAttr(el, 'clearable')} 
      ${buildBooleanAttr(el, 'readonly')} 
      ${buildBooleanAttr(el, 'disabled')} />`
  },

  //
  'el-rate': el => {
    const { vModel } = attrBuilder(el)
    const max = el.max ? `:max='${el.max}'` : ''
    const allowHalf = el['allow-half'] ? 'allow-half' : ''
    const showText = el['show-text'] ? 'show-text' : ''
    const showScore = el['show-score'] ? 'show-score' : ''
    return `<${el.tag} ${vModel} ${allowHalf} ${showText} ${showScore} ${buildBooleanAttr(el, 'disabled')} />`
  },

  // 颜色选择器
  'el-color-picker': el => {
    const { disabled, vModel } = attrBuilder(el)
    const size = `size="${el.size}"`
    const showAlpha = el['show-alpha'] ? 'show-alpha' : ''
    const colorFormat = el['color-format'] ? `color-format="${el['color-format']}"` : ''

    return `<${el.tag} ${vModel} ${size} ${showAlpha} ${colorFormat} ${disabled}></${el.tag}>`
  },

  // 上传
  'el-upload': el => {
    const disabled = el.disabled ? 'makeUpHtml:disabled=\'true\'' : ''
    const action = el.action ? `:action="${el.vModel}UploadAction"` : ''
    // const multiple = `:multiple="${!!el.multiple}"`
    const multiple = ':multiple="true"'
    const limit = el.limit ? `:limit="${el.limit}" :on-exceed="(...arg)=>{onExceed(arg,'${el.vModel}')}"` : ''
    const listType = el['list-type'] !== 'text' ? `list-type="${el['list-type']}"` : ''
    const accept = el.accept ? `accept="${el.accept}"` : ''
    const showFileList = el['show-file-list'] === false ? ':show-file-list="false"' : ''
    const autoUpload = el['auto-upload'] === false ? ':auto-upload="false"' : ''
    const beforeUpload = `:before-upload="(...arg)=>{return beforeUpload(arg,'${el.vModel}')}"`
    const request = `:http-request="(...arg)=>{doUpload(arg,'${el.vModel}')}"`
    const onchange = `:on-change="(...arg)=>{onUploadChange(arg,'${el.vModel}')}"`
    const onremove = `:on-remove="(...arg)=>{onUploadRemove(arg,'${el.vModel}')}"`
    const onpreview = `:on-preview="(...arg)=>{handlePreview(arg,'${el.vModel}')}"`
    const fileList = `:file-list="${el.vModel}fileList"`
    const ref = `ref="${el.vModel}"`
    let child = buildElUploadChild(el)
    if (el.type !== 'import')renderGlobal.filePreviewDialog = true
    if (child) child = `\n${child}\n` // 换行
    return `<${el.tag} ${ref} ${fileList} ${action} ${showFileList} ${autoUpload} ${multiple} ${limit} ${beforeUpload} ${request} ${onchange} ${onremove} ${onpreview} ${listType} ${accept} ${disabled}>${child}</${el.tag}>`
  },

  // 表格
  'el-table': el => {
    const tableId = `${confGlobal.formModel}.${el.vModel}Table` // NOTE: 不是id，是formData中的table配置数据
    const ref = `ref="${el.vModel}Table"`
    const border = `:border="${!!el.border}"`
    const stripe = `:stripe="${!!el.stripe}"`
    const height = `:height="${tableId}.height"`
    const size = `size="${el.size}"`
    const fit = `:fit=${el.fit}`
    const data = `:data="${confGlobal.formModel}.${el.vModel}"`
    const loading = `v-loading="loadingMap.${el.vModel}"`
    const rowkey = el.rowSort ? `row-key="${el.sortId}"` : ''
    const rowDblclick = el._key === 'listPickerTable'
      ? `@row-dblclick="changeListPickerByCurrent({fieldId: '${el._parentFieldId}', tableId: '${el.vModel}'})"`
      : ''

    // 表格
    let tableHtml = buildElTableChild(el)
    if (tableHtml) tableHtml = `\n${tableHtml}\n` // 换行

    // 表格搜索根据类型加载
    let searchForm = ''
    if (el.searchData.length > 0) {
      let widgetLen = 0
      const searchItemArr = el.searchData.map(item => {
        if (!item.value) { // 跳过数据不完整的配置
          return ''
        }
        if (item.nonuse) {
          return ''
        }
        let node = null
        const { widgetCode } = item
        const widgetType = (getWidgetConf(widgetCode) || {}).type || ''
        const vModel = `${tableId}.search.${item.value}`
        if (item.invisible === true || widgetType === 'invisible') { // 0 隐藏文本
          widgetLen++
          node = `<el-form-item label='${item.label}' style="display:none;">
            <el-input ref="${item.value}" @change="()=>{${vModel}=(${vModel}).trim()}" v-model="${vModel}" clearable size="small" placeholder="请输入" />
          </el-form-item>`
        } else if (widgetType === 'input') { // 1 单行输入
          node = `<el-form-item label='${item.label}'>
            <el-input ref="${item.value}" @change="()=>{${vModel}=(${vModel}).trim()}" v-model="${vModel}" clearable size="small" placeholder="请输入" />
          </el-form-item>`
        } else if (widgetType === 'number') { // 2 数字输入
          node = `<el-form-item label='${item.label}'>
            <el-input-number ref="${item.value}" :value="${vModel} === '' || ${vModel} === null ? undefined : ${vModel}" @input="($event)=>{${vModel} = $event}" size="small" controls-position="right" placeholder="请输入数字" />
          </el-form-item>`
        } else if (widgetType === 'password') { // 3 密码输入
          node = `<el-form-item label='${item.label}'>
            <el-input ref="${item.value}" @change="()=>{${vModel}=(${vModel}).trim()}" v-model="${vModel}" clearable size="small" show-password placeholder="请输入密码" />
          </el-form-item>`
        } else if (widgetType === 'date') { // 4 日期选择
          node = `<el-form-item label='${item.label}'>
            <el-date-picker ref="${item.value}" v-model="${vModel}" clearable size="small" value-format="yyyy-MM-dd" type="date" placeholder="请选择">
            </el-date-picker>
          </el-form-item>`
        } else if (widgetType === 'textarea') { // 5 多行文本
          node = `<el-form-item label='${item.label}'>
            <el-input ref="${item.value}" @change="()=>{${vModel}=(${vModel}).trim()}" v-model="${vModel}" size="small" type="textarea" rows="2" placeholder="请输入" />
          </el-form-item>`
        } else if (widgetType === 'time') { // 6 时间选择
          node = `<el-form-item label='${item.label}'>
            <el-time-picker ref="${item.value}" v-model="${vModel}" clearable size="small" value-format="HH:mm:ss" picker-options="{selectableRange: '00:00:00 - 23:59:59'}" placeholder="请选择时间点" />
          </el-form-item>`
        } else if (widgetType === 'datetime') { // 7 日期时间选择
          node = `<el-form-item label='${item.label}'>
            <el-date-picker ref="${item.value}" v-model="${vModel}" clearable size="small" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择日期时间" />
          </el-form-item>`
        } else if (widgetType === 'radio') { // 8 单选
          const optionItem = el.searchOption[item.value]
          const option = optionItem
            ? `<el-radio ref="${item.value}" v-for="(list, index) in ${confGlobal.formModel}.${el.vModel}Table.searchOptions.${item.value}" :key="index" :label="list.${optionItem.label}" :value="list.${optionItem.value}" />`
            : ''
          node = `<el-form-item label='${item.label}'>
            <el-radio-group v-model="${vModel}" size="small">
              ${option}
            </el-radio-group>
          </el-form-item>`
        } else if (widgetType === 'checkbox' || widgetType === 'select' || widgetType === 'multipleSelect') { // 9 复选 10 单选下拉 11 多选下拉
          const optionItem = el.searchOption[item.value]
          const option = optionItem
            ? `<el-option ref="${item.value}" v-for="(list, index) in ${confGlobal.formModel}.${el.vModel}Table.searchOptions.${item.value}" :key="index"  :label="list.${optionItem.label}" :value="list.${optionItem.value}" />`
            : ''
          node = `<el-form-item label='${item.label}'>
            <el-select v-model="${vModel}" clearable filterable size="small" :multiple=${widgetType === 'checkbox' || widgetType === 'multipleSelect'} placeholder="请选择">
              ${option}
            </el-select>
          </el-form-item>`
        } else if (widgetType === 'comboTree') { // 12 树形下拉
          const optionItem = el.searchOption[item.value]
          node = `<el-form-item label='${item.label}'>
              <combo-tree ref="${item.value}"
              :data="${confGlobal.formModel}.${el.vModel}Table.searchOptions.${item.value}"
              v-model="${vModel}"
              label-key="${optionItem.label}">
              </combo-tree>
            </el-form-item>`
        }
        return node
      })
      const isShow = el.searchData.length > widgetLen
      if (isShow) {
        const submitBtn = tags['el-button']({
          _parentFieldId: el.vModel,
          _key: 'search',
          defaultValue: '搜索',
          nativeType: 'submit',
          type: 'primary',
          'prefix-icon': 'el-icon-search',
          $click: `tableData('${el.vModel}')`
        })
        const resetBtn = el.resetBtn_allow ? tags['el-button']({
          _parentFieldId: el.vModel,
          _key: 'reset',
          defaultValue: '重置',
          nativeType: 'reset',
          type: '',
          'prefix-icon': 'el-icon-refresh',
          $click: `resetTableForm('${el.vModel}')`
        }) : ''
        searchForm = `<el-form 
          :inline="true"
          class="form-inline table-search-form" 
          @submit.native.prevent
        >
          ${searchItemArr.join('\n')}
          ${submitBtn}
          ${resetBtn}
        </el-form>`
      }
    }

    // 表格顶部操作
    let tableTopHtml = ''
    if (el.topEdit.show) {
      // 选中行引用。如果表格是多选（selection），则当前选中的数据是一个数组，否则是一个对象
      const selectionRow = `${tableId}.${el.columnType === 'selection' ? 'selectRowArr' : 'currentRow'}`

      const oldTopBtnArr = el.topEdit.options.map(item => ({
        ...item,
        tag: 'el-button',
        _parentFieldId: el.vModel,
        defaultValue: item.label,
        $click: `handleTableBtnClick('${el.vModel}', ${JSON.stringify({
          ...item,
          _parentFieldId: el.vModel,
          relateActiveId: el.relate && el.relate.activeId ? el.relate.activeId : '', // 和从表有联动的主动控件，用于操作从表时主表的数据也刷新
          displayFn: '', // 自定义方法中可能出现单引号或者双引号，所以这几个方法在此处赋值为''
          disabledFn: '',
          beforeClickFn: '',
          params: item.params ? item.params.replace(/'/ig, '"') : ''
        }).replace(/"/ig, '\'')})`,
        otherAttr: `top-btn="${item.topbtn}"`,
        allowAttr: `v-allow:[$attrs].button="'${item.topbtn}|||${el.vModel}'"`,
        displayFn: `displayFn({row:${selectionRow}},'${item.topbtn}','${el.vModel}')`,
        disabledFn: `disabledFn({row:${selectionRow}},'${item.topbtn}','${el.vModel}')`,
        beforeClickFn: `beforeClickFn({row:${selectionRow}},'${item.topbtn}','${el.vModel}')`
      }))

      const topRowItem = getChildItem(el, 'topRow')
      let topRow = ''
      if (topRowItem) {
        topRowItem.children = oldTopBtnArr.concat(topRowItem.children)
      } else if (oldTopBtnArr.length > 0) {
        const topBtnHtml = `<el-col class="table-top-btn-warp-old">
        ${oldTopBtnArr.map(item => tags['el-button'](item)).join('\n')}
        </el-col>`
        topRow = topBtnHtml
      }
      // 顶部行容器
      // TODO: 添加 _parentFieldId
      topRow += (el.children || []).map(item => layouts[item.layout](item)).join('\n')
      tableTopHtml = `<el-row 
        class="table-top-btn-warp" 
        type="flex"
        :class="{ 
          'toggle-more': ${tableId}.showToggleTopBtn,
          'show-more': ${tableId}.showMoreTopBtn 
        }"
      >
        <el-button 
          v-if="${tableId}.showToggleTopBtn"
          class="toggle-more-btn" 
          type="primary"
          plain 
          title="收起/展开更多操作按钮"
          @click="toggleTableTopBtn('${el.vModel}')"
        >
          {{${tableId}.showMoreTopBtn ? '收起' : '展开'}}
          <i 
            class="el-icon--right" 
            :class="${tableId}.showMoreTopBtn ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" 
          />
        </el-button>
        ${topRow}
      </el-row>`
    }

    // 表格底部合计
    let showSummary = ''
    let summaryTable = ''
    if (el.bottomSummary.showSummary) {
      let summaryChild = buildElTableSummary(el)
      if (summaryChild) summaryChild = `\n${summaryChild}\n` // 换行
      showSummary = `show-summary sum-text='${el.bottomSummary.sumText}'`
      summaryTable = `<${el.tag} class="summaryTable" :data="${confGlobal.formModel}.${el.vModel}Table.summaryArr" ${loading} ${border} ${stripe} ${size} ${fit} >${summaryChild}</${el.tag}>`
    }

    // 表格分页
    let pagination = ''
    if (el.pagination.show) {
      const small = ['small', 'mini'].indexOf(el.size) >= 0 ? ':small="true"' : ''
      pagination = `<el-pagination
        background
        ${small}
        style="text-align:right;"
        :current-page.sync="${tableId}.pagination.currentPage"
        :page-sizes="${tableId}.pagination.pageSizes"
        :page-size="${tableId}.pagination.pageSize"
        layout="${el.pagination.isShowGoto ? el.pagination.layout : 'total, sizes, prev, pager, next'}"
        :total="${tableId}.pagination.total"
        @current-change="tableData('${el.vModel}')"
        @size-change="sizeChange($event,'${el.vModel}')">
        </el-pagination>`
    }

    return `<div class="table-warp" data-model="${el.vModel}">
      ${searchForm} 
      <div ${loading}>
        ${tableTopHtml}
        <${el.tag} ${rowkey} ${ref} ${data} ${border} ${stripe} ${height} ${size} ${fit} ${showSummary} 
          class="${el.vModel}Table" 
          highlight-current-row 
          @current-change="handleCurrentChange($event,'${el.vModel}')" 
          @selection-change="handleSelectionChange($event,'${el.vModel}')"
          @sort-change="handleSortChange($event,'${el.vModel}')"
          ${rowDblclick}
        >
          ${tableHtml}
        </${el.tag}>
        ${summaryTable}
        ${pagination}
      </div>
    </div>`
  },

  // 文字
  p: el => {
    const { style } = attrBuilder(el)
    // const content = `${el.content}`
    const content = `${confGlobal.formModel}.${el.vModel}`
    return `<${el.tag} ${style} ><span>{{${content}}}</span></${el.tag}>`
  },

  // 分割线
  'el-divider': el => {
    const contentPosition = `content-position="${el['content-position']}"`
    return `<${el.tag} ${contentPosition} >${el.content}</${el.tag}>`
  },
  // 超链接
  'el-link': el => {
    const {
      href, type, style, disabled
    } = attrBuilder(el)
    const content = `${el.content}`
    const underline = `:underline="${el.underline}"`
    return `<${el.tag} ${style} ${type} ${underline}  ${href} ${disabled}>${content}</${el.tag}>`
  },

  // 图标
  'nti-icon': el => {
    const { style } = attrBuilder(el)
    return `<${el.tag} value="${el.iconName}" ${style} />`
  },

  // 图标选择
  'nti-icon-picker': el => {
    const {
      vModel
    } = attrBuilder(el)
    const enableInput = `:enableInput="${el.enableInput}"`
    return `<${el.tag} ${vModel} ${enableInput} />`
  },

  // 菜单栏
  'nti-menu': el => {
    // const { style } = attrBuilder(el)
    const defaultValue = `:defaultValue="${confGlobal.formModel}.${el.vModel}"`
    const isCollapse = `:isCollapse="${confGlobal.formModel}.${el.vModel}Menu.isCollapse"`
    const variables = `:variables="${confGlobal.formModel}.${el.vModel}Menu.variables"`
    const menuData = `:data="${el.vModel}Options"`
    const model = el.model ? `:model="'${el.model}'"` : ''
    const seletMenu = `@handle-menu-select="handlerDataChange($event,'${el.vModel}')"`

    return `<${el.tag} ${defaultValue} ${model} ${variables} ${isCollapse} ${menuData} ${seletMenu}></${el.tag}>`
  },

  // 代码编辑
  'code-editor': el => {
    const {
      vModel
    } = attrBuilder(el)
    const rows = el.rows ? `:rows="${el.rows}"` : ''
    const theme = el.theme ? `theme="${el.theme}"` : ''
    const language = el.language ? `language="${el.language}"` : ''
    return `<${el.tag} ${vModel} ${rows} ${theme} ${language}/>`
  },

  // 富文本
  'richtext-editor': el => {
    const { vModel } = attrBuilder(el)
    const height = el.height ? `:height="${el.height}"` : ''
    return `<${el.tag} ${vModel} ${buildBooleanAttr(el, 'readonly')} ${height} />`
  },

  // iframe
  iframe: el => {
    const {
      src, classObj, style
    } = attrBuilder(el)
    return `<${el.tag} ${src} ${classObj} ${buildStringAttr(el, 'frameborder')} ${style} ></${el.tag}>`
  }
}

function getClassName(classObj) {
  return Object.keys(classObj).map(key => (classObj[key] ? key : '')).join(' ')
}

// 基础属性构建
function attrBuilder(el) {
  const { vModel } = el
  const vModelKey = `${confGlobal.formModel}.${vModel}`
  return {
    vModelKey,
    vModel: `v-model="${vModelKey}"`,
    src: buildStringAttr(el, 'src'),
    href: buildStringAttr(el, 'href'),
    type: buildStringAttr(el, 'type'),
    classObj: buildStringAttr(el, 'classObj', 'class'),
    disabled: buildBooleanAttr(el, 'disabled'),
    width: el.style && el.style.width ? `:style="{width: '${el.style.width}'}"` : '',
    style: buildStyleAttr(el, 'style')
  }
}
function buildStringAttr(el, attrKey, outputKey) {
  if (!attrKey || !el[attrKey]) { return '' }
  return `${outputKey || attrKey}="${el[attrKey]}"`
}

/**
 * @param {Object} el 配置
 * @param {String} attrKey 属性键名
 * 处理 attrKey、${attrKey}_fn、${attrKey}_fnName
 */
function buildBooleanAttr(el, attrKey) {
  if (!attrKey || !el[attrKey]) { return '' }
  if (el[attrKey] === true || el[attrKey] === 'true') {
    return `${attrKey}`
  }
  if (el[attrKey] === 'fn') {
    let fnName = el[`${attrKey}_fnName`]
    if (!fnName) {
      console.warn('缺少自定义函数配置！')
      return ''
    }
    if (fnName === '$custom') {
      fnName = `${el.vModel || el.componentName}_${attrKey}Fn()`
    }
    return `:${attrKey}="${fnName}()"`
  }
  return ''
}

function buildStyleAttr(el, attrKey) {
  if (!attrKey || !el[attrKey]) { return '' }
  const styleObj = el[attrKey]
  const styleStr = Object.keys(styleObj).reduce((prev, cur) => `${prev}${cur}:${styleObj[cur]};`, '')
  return `style="${styleStr}"`
}

function buildOptAndKeys(el, optiongOutputKey) {
  const options = (el.options || el.data || el?.dataSource?.type === 'data')
    ? `:${optiongOutputKey || 'options'}="${el.vModel}Options" ` : ''
  return `
    ${options}
    ${buildStringAttr(el, 'labelKey')}
    ${buildStringAttr(el, 'valueKey')}
    ${buildStringAttr(el, 'nodeKey')}
    ${buildStringAttr(el, 'parentKey')}
    ${buildStringAttr(el, 'childrenKey')}`
}

// 事件构建
function eventBuilder(el, options = {}) {
  const vModelKey = el.vModel ? `${confGlobal.formModel}.${el.vModel}` : ''
  const eventObj = Object.entries(el.event || {}).reduce((obj, [key, val]) => {
    let eventName = key.replace('on', '')
    eventName = eventName.charAt(0).toLowerCase() + eventName.slice(1) // 首字母转小写
    if (val) {
      const extraAction = options[val] && options[val].beforeFn ? options[val].beforeFn : '' // TODO:针对input框 change\input等事件的特殊处理，本质上应该是允许挂载多个方法，当前为第一个
      obj[key] = `@${eventName}="(...arg)=>{${extraAction} ${val}(...arg, ${vModelKey});}"`
    }
    return obj
  }, {})

  // eslint-disable-next-line no-nested-ternary
  const $click = el.$click
    ? el.$click.indexOf(')') > 0 ? el.$click : `${el.$click}(...arg,${options.click.params})`
    : '' // TODO:点击事件的逻辑先保持不修改
  return {
    click: `@click="(...arg)=>{${el.beforeClickFn
      ? `if(${el.beforeClickFn}){return ${$click}}else{return false}`
      : `return ${$click}`}}"`,
    onInput: eventObj.onInput || '',
    onChange: eventObj.onChange || '',
    onBlur: eventObj.onBlur || '',
    onClear: eventObj.onClear || '',
    onFocus: eventObj.onFocus || ''
  }
}

// el-input innerHTML
function buildElInputChild(conf) {
  const children = []
  if (conf.prepend) {
    children.push(`<template slot="prepend">${conf.prepend}</template>`)
  }
  if (conf.append) {
    children.push(`<template slot="append">${conf.append}</template>`)
  }
  return children.join('\n')
}

function buildElSelectChild(conf) {
  const children = []
  // if (conf.options && conf.options.length) {
  if (conf.options) {
    children.push(`<el-option v-for="(item, index) in ${conf.vModel}Options" :key="index" :label="item.${conf.labelKey}" :value="item.${conf.valueKey ? conf.valueKey : 'id'}" :disabled="item.disabled"></el-option>`)
  }
  return children.join('\n')
}
// 构建面包屑的Child
function buildBreadcrumbChild(conf) {
  const children = []
  if (conf.options && conf.options.length) {
    children.push(`<el-breadcrumb-item v-for="(item, index) in ${conf.vModel}Options" :key="index" :to="{ path: 'item.value' }">{{item.label}}</el-breadcrumb-item>`)
  }
  return children.join('\n')
}
// 构建布局容器的child
function buildRowContainerChild(conf, type) {
  const el = conf.children.find(item => item.tabValue === type)
  if (el) {
    return `${layouts[el.layout](el)}\n`
  }
  return ''
}

// 构建标签页的Child
function buildTabsChild(conf) {
  let children = []
  if (conf.options && conf.options.length) {
    if (conf.childType === 'iframe') {
      const iframeCom = conf.children[0].children[0]
      const str = `
      <el-tab-pane
        v-for="(option,index) in ${conf.componentName}Options"
        :key="option.id"
        :closable="${conf.closable}&&index!=0"
        :name="option.id"
        :label="option.label"
      >
      <${iframeCom.tag}
      :src="option.menu_href"
      ${buildStringAttr(iframeCom, 'class')}
      ${buildStringAttr(iframeCom, 'frameborder')}
      style="${Object.keys(iframeCom.style).reduce((prev, next) => `${prev}${next}:${iframeCom.style[next]};`, '')}" >
      </${iframeCom.tag}>
      </el-tab-pane>`
      return str
    }
    children = conf.options.map(option => {
      if (option.value) {
        const el = conf.children.find(item => item.tabValue === option.value)
        if (el) {
          return `
            <el-tab-pane label=${option.label}>
              ${layouts[el.layout](el)}
            </el-tab-pane>`
        }
      }
      return false
    })
    return children.join('\n')
  }
  return ''
}
// 构建折叠面板的Child
function buildCollapseChild(conf) {
  const children = []
  if (conf.options && conf.options.length) {
    children.push(`<el-collapse-item v-for="(item, index) in ${conf.vModel}Options" :key="index"  :title="item.label" :name="item.value">{{item.label}}</el-collapse-item>`)
  }
  return children.join('\n')
}
// 构建轮播图的Child
function buildCarouselChild(conf) {
  const children = []
  if (conf.options && conf.options.length) {
    children.push(`<el-carousel-item v-for="(item, index) in ${conf.vModel}Options" :key="index"><el-image :src="item.value"></el-image></el-carousel-item>`)
  }
  return children.join('\n')
}

function buildElRadioGroupChild(conf) {
  const children = []
  if (conf.options && conf.options.length) {
    const tag = conf.optionType === 'button' ? 'el-radio-button' : 'el-radio'
    const border = conf.border ? 'border' : ''
    children.push(`<${tag} v-for="(item, index) in ${conf.vModel}Options" :key="index" :label="item.value" :disabled="item.disabled" ${border}>{{item.label}}</${tag}>`)
  }
  return children.join('\n')
}

function buildElCheckboxGroupChild(conf) {
  const children = []
  if (conf.options && conf.options.length) {
    const tag = conf.optionType === 'button' ? 'el-checkbox-button' : 'el-checkbox'
    const border = conf.border ? 'border' : ''
    children.push(`<${tag} v-for="(item, index) in ${conf.vModel}Options" :key="index" :label="item.value" :disabled="item.disabled" ${border}>{{item.label}}</${tag}>`)
  }
  return children.join('\n')
}
// 构建上传中的子标签
function buildElUploadChild(conf) {
  const { vModel } = attrBuilder(conf)
  const list = []
  list.push(`<input type="hidden" ${vModel}>`)
  if (conf['list-type'] === 'picture-card') list.push('<i class="el-icon-plus"></i>')
  else list.push(`<el-button size="small" type="primary" icon="el-icon-upload">${conf.buttonText}</el-button>`)
  if (conf.showTip) list.push(`<span slot="tip" class="el-upload__tip">只能上传不超过 ${conf.fileSize}${conf.sizeUnit} 的 ${conf.accept} 文件</span>`)
  return list.join('\n')
}

function buildCheckableHeader(el, item) {
  const { editable, widgetCode } = item
  if (!editable) { return '' }
  const widgetType = (getWidgetConf(widgetCode) || {}).type || ''
  if (widgetType !== 'checkbox') { return '' }
  // 头部复选框
  let str = `<el-checkbox v-model="${confGlobal.formModel}.${el.vModel}Table.isCheckbox.${item.value}" @change="checkAllClick($event,scope,'${item.value}','${el.vModel}')">${item.label}</el-checkbox>`
  // 校验选择列
  // TODO: 加入 ruleConf 配置的条件；加入自定义校验规则
  const rules = item.is_required ? `:rules="{
    validator: (rule, value, callback)=>{doValidateCol('${el.vModel}', '${item.value}', rule, callback)},
    message: '请选择${item.label}',
    trigger: 'change',
  }"` : ''
  str = `<el-form-item :prop="'${el.vModel}Table.isCheckbox.${item.value}'" ${rules}>${str}</el-form-item>`
  return `<template slot="header" slot-scope="scope">${str}</template>`
}
// 表格列
function renderTableCol(el, item) {
  // TODO: 后续要将表格中的可编辑类型直接调用现有组件
  const tableData = `${confGlobal.formModel}.${el.vModel}`
  const value = `${tableData}[scope.$index].${item.value}`
  const formatterLabel = item?.formatter?.label ? item.formatter.label : 'label'
  const formatterValue = item?.formatter?.value ? item.formatter.value : 'id'

  const { editable, widgetCode } = item
  const widgetType = editable
    ? (getWidgetConf(widgetCode) || {}).type || ''
    : ''
  // TODO: 整合 search 的实现
  // TODO: 缺少组件
  // comboTree
  // upload
  // color-picker
  // icon-picker
  console.log(item, widgetCode, widgetType)
  let str = ''
  switch (widgetType) {
    case 'invisible':// 0 隐藏文本
      break
    case 'input':// 1 单行输入
    case 'password':// 3 密码输入
    case 'textarea':// 5 多行文本输入
      str = `<el-input type="${widgetType === 'input' ? 'text' : widgetType}" size="mini" @change="()=>{${value}=(${value}).trim()}" v-model="${value}" />`
      break
    case 'number':// 2 数字输入
      str = `<el-input-number size="mini" @change="()=>{${value}=(${value}).trim()}" v-model="${value}" controls-position="right" placeholder="请输入数字" />`
      break
    case 'date':// 4 日期选择
      str = `<el-date-picker size="mini" v-model="${value}" clearable value-format="yyyy-MM-dd" type="date" placeholder="请选择${item.label}" />`
      break
    case 'time':// 6 时间选择
      str = `<el-time-picker size="mini" v-model="${value}" clearable picker-options="{selectableRange: '00:00:00 - 23:59:59'}" value-format="HH:mm:ss" placeholder="请选择时间点" />`
      break
    case 'datetime':// 7 日期时间选择
      str = `<el-date-picker size="mini" v-model="${value}" clearable type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择日期时间" />`
      break
    case 'radio':// 8 单选框
      str = `<el-radio size="mini" v-model="${value}" value="Number(${value})" true-label=${1} false-label=${0}
      onChange="{event => {${value} = event;}}" />`
      break
    case 'checkbox':// 9 复选框
      str = `<el-checkbox size="mini" v-model="${value}" value="Number(${value})" true-label=${1} false-label=${0} @change="tableCheckboxChange($event,scope,'${item.value}','${el.vModel}')"
      onChange="{event => {${value} = event;}}" />`
      break
    case 'select':// 10 单选下拉
    case 'multipleSelect':// 11 多选下拉
      str = `
        <el-select clearable filterable size="mini" v-model="${value}"
          :multiple="${widgetType === 'multipleSelect'}"
          placeholder="请选择${item.label}"
        >
          <el-option
            v-for="(option,index) in ${confGlobal.formModel}.${el.vModel}Table.filterOptions.${item.value}"
            :key="index"
            :label="option['${formatterLabel}']"
            :value="option.id"
          />
        </el-select>`
      break
    case 'input-button':// 16 输入框+按钮、弹框选择
      str = `
        <el-input placeholder="请选择${item.label}" size="mini" @change="()=>{${value}=(${value}).trim()}" v-model="${value}">
          ${tags['el-button']({
    ...item,
    defaultValue: '',
    $click: `handleTableBtnClick('${el.vModel}', ${JSON.stringify({
      ...item,
      displayFn: '', // 自定义方法中可能出现单引号或者双引号，所以这几个方法在此处赋值为''
      disabledFn: '',
      beforeClickFn: '',
      params: item.params ? item.params.replace(/'/ig, '"') : ''
    }).replace(/"/ig, '\'')}, scope)`,
    size: 'mini',
    otherAttr: 'slot="append" icon="el-icon-search" '
  })}
        </el-input>`
      break
    case 'input-select':// 17 可输入下拉
      str = `
        <el-select clearable filterable size="mini" v-model="${value}" @blur="(e)=>{${value}=e.target.value}" placeholder="请选择${item.label}">
          <el-option v-for="(option,index) in ${confGlobal.formModel}.${el.vModel}Table.filterOptions.${item.value}" :label="option['${formatterLabel}']" :key="index" :value="option.id" />
        </el-select>`
      break
    default:
      str = `<div v-html="formatterFn(scope, '${item.value}', '${el.vModel}', '${formatterLabel}', '${formatterValue}')" />`
  }

  // 单行校验：除多行校验外的表单组件
  const rowValidWidgetType = ['input', 'number', 'password', 'date', 'textarea', 'time', 'datetime', 'select', 'input-button', 'input-select']
  if (editable && rowValidWidgetType.indexOf(widgetType) > -1) {
    // TODO: 加入 ruleConf 配置的条件；加入自定义校验规则
    const rules = item.is_required
      ? `:rules="{ required: true, message: '请输入${item.label}', trigger: 'change', }"`
      : ''
    str = `<el-form-item 
      :prop="'${el.vModel}.' + scope.$index + '.${item.value}'" 
      ${rules}
    >
      ${str}
    </el-form-item>`
  }

  return `<template slot-scope="scope">${str}</template>`
}
// 表格中的子标签
function buildElTableChild(conf) {
  const list = []
  // 序号列
  if (conf.columnType !== 'none') {
    list.push(`<el-table-column label="序号" type="${conf.columnType}" width="50" align="center" fixed />`)
  }
  // 内容列
  const tableColumnArrKey = `${confGlobal.formModel}['${conf.vModel}Table']['tableColumnArr']`
  const needSortVal = conf?.pagination?.show ? '`custom`' : true
  list.push(conf.options.map((item, index) => {
    const width = item.width ? `min-width="${item.width}px"` : ''
    return `
    <el-table-column 
      v-allow:[$attrs].field="'${item.value}|||${conf.vModel}'" 
      v-if="!${tableColumnArrKey}[${index}].invisible"
      prop="${item.value}" 
      label="${item.label}" 
      ${width} 
      align="${item.align}"
      ${item.fixed !== 'none' ? `:fixed="${item.fixed}"` : ''}
      :sortable="${tableColumnArrKey}[${index}].sortable ? ${needSortVal} : false" 
      show-overflow-tooltip
    >
      ${buildCheckableHeader(conf, item)}
      ${renderTableCol(conf, item)}
    </el-table-column>`
  }).join('\n'))

  // 操作列
  if (conf.editRow.show) {
    const btnHtml = `${conf.editRow.options.map(item => tags['el-button']({
      ...item,
      _parentFieldId: conf.vModel,
      defaultValue: item.label,
      $click: `handleTableBtnClick('${conf.vModel}', ${JSON.stringify({
        ...item,
        _parentFieldId: conf.vModel,
        relateActiveId: conf.relate && conf.relate.activeId ? conf.relate.activeId : '', // 和从表有联动的主动控件，用于操作从表时主表的数据也刷新
        displayFn: '',
        disabledFn: '',
        beforeClickFn: ''
      } || '{}').replace(/"/ig, '\'')}, scope)`,
      type: conf.editRow.buttonType,
      size: 'small',
      otherAttr: `row-btn="${item.rowbtn}"`,
      allowAttr: `v-allow:[$attrs].button="'${item.rowbtn}|||${conf.vModel}'"`,
      displayFn: `displayFn(scope,'${item.rowbtn}','${conf.vModel}')`,
      disabledFn: `disabledFn(scope,'${item.rowbtn}','${conf.vModel}')`,
      beforeClickFn: `beforeClickFn(scope,'${item.rowbtn}','${conf.vModel}')`
    })).join('\n')}`
    const fixed = conf.editRow.fixed === 'none' ? false : `fixed="${conf.editRow.fixed}"`
    const width = conf.editRow.width ? `width="${conf.editRow.width}px"` : ''

    list.push(`<el-table-column ${fixed} label="${conf.editRow.title}" ${width}>
      <template slot-scope="scope">${btnHtml}</template>
    </el-table-column>`)
  }
  return list.join('\n')
}
// 底部合计的表格
function buildElTableSummary(conf) {
  const summaryList = []
  // 序号列
  if (conf.columnType !== 'none') {
    summaryList.push('<el-table-column label="序号" width="50" align="center"></el-table-column>')
  }
  // 内容列
  const tableColumnArrKey = `${confGlobal.formModel}['${conf.vModel}Table']['tableColumnArr']`
  summaryList.push(conf.options.map((item, index) => {
    const width = item.width ? `min-width="${item.width}px"` : ''
    return `<el-table-column 
    v-if="!${tableColumnArrKey}[${index}].invisible"
    v-allow:[$attrs].field="'${item.value}|||${conf.vModel}'" 
    prop="${item.value}" label="${item.label}" ${width} align="${item.align}"
      :fixed="${item.fixed === 'none' ? false : item.fixed}" show-overflow-tooltip>
      </el-table-column>`
  }).join('\n'))
  // 操作列
  if (conf.editRow.show) {
    const fixed = conf.editRow.fixed === 'none' ? false : `fixed="${conf.editRow.fixed}"`
    const width = conf.editRow.width ? `width="${conf.editRow.width}px"` : ''

    summaryList.push(`<el-table-column ${fixed} label="${conf.editRow.title}" ${width}>
    </el-table-column>`)
  }
  return summaryList.join('\n')
}

export function makeUpHtml(conf, type, buildType) {
  // 重置renderGlobal的属性
  Object.keys(renderGlobal).forEach(key => {
    renderGlobal[key] = false
  })

  const htmlList = []
  confGlobal = conf
  someSpanIsNot24 = conf.fields.some(item => item.span !== 24)
  conf.fields.forEach(el => {
    if (layouts[el.layout]) {
      htmlList.push(layouts[el.layout](el))
    } else {
      console.error(`缺少 layouts 配置：${el.layout}`)
    }
  })

  // 全局渲染
  Object.keys(renderGlobal).forEach(key => {
    if (renderGlobal[key]) {
      htmlList.push(eval(`${key}(conf, type, buildType)`))
    }
  })

  const htmlStr = htmlList.join('\n')

  let temp = buildPageTemplate(conf, htmlStr, type)

  if (type === 'dialog') {
    temp = dialogWrapper(temp)
  }
  confGlobal = null
  return temp
}
