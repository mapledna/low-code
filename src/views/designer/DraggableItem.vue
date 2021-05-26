<script>
/* eslint-disable no-underscore-dangle */
import draggable from 'vuedraggable'
import render from './DraggableItem/render'
import ComboTree from '@/components/ComboTree/index'
import RichtextEditor from '@/components/RichtextEditor/Index'
import UiLoginPage from '@/components/UiLoginPage/Index'
import UiLoginPageV2 from '@/components/loginTemplate/chinaTobacco/Index.vue'

import { replaceEmpty, titleCase } from '@/utils/index'
import {
  getWidgetConf
} from '@/components/generator/config/utils'

function renderDrawingBtns(h, element, index, parent, type) {
  if (!parent || element._canClick === false) { return null }
  return [
    <el-button
      class="drawing-item-copy"
      type="primary"
      plain
      title="复制"
      icon="el-icon-copy-document"
      size="mini"
      circle
      disabled={element._canCopy === false}
      onClick={event => {
        this.$listeners.copyItem(element, parent)
        event.stopPropagation()
      }}
    />,
    <el-button
      class="drawing-item-delete"
      type="danger"
      plain
      title="删除"
      icon="el-icon-delete"
      size="mini"
      circle
      disabled={element._canDelt === false}
      onClick={event => {
        this.$listeners.deleteItem(index, parent)
        event.stopPropagation()
      }}
    />
  ]
}

function setActiveEvent(element) {
  return element._canClick === false
    ? () => {}
    : event => {
      this.$listeners.activeItem(element)
      event.stopPropagation()
    }
}

function getDrawingClassName(isActive, element) {
  if (element._canClick === false) { return undefined }
  const isLayout = element.layout
  const display = replaceEmpty((element.style || {}).display, 'block')
  return {
    'drawing-item': !isLayout,
    'drawing-row-item': isLayout,
    'active-from-item': isActive,
    'col-inline': display !== 'block',
    readonly: element.readonly
  }
}

function tableTopWarp(h, element, index, parent) {
  // eslint-disable-next-line camelcase
  const showToggleTopBtn = element?.topEdit?.toggleTopBtn_allow !== false
  return (
    <el-row
      type="flex"
      class={{
        'table-top-btn-warp': true,
        'toggle-more show-more': showToggleTopBtn
      }}
    >
      {
        showToggleTopBtn
        && <el-button
            class="toggle-more-btn"
            type="primary"
            plain
            title="收起/展开更多操作按钮"
          >
            收起
            <i class="el-icon-arrow-up el-icon--right" />
          </el-button>
      }
      <div class="table-top-btn-warp-old">
        {
          element.topEdit.options.map(item => (
            <el-button type={item.type || 'default'} topbtn={item.topbtn} icon={item['prefix-icon'] || ''}>
              {item.label}
              {item['suffix-icon']
              && <i class={`${item['suffix-icon']} el-icon--right`} />
              }
            </el-button>
          ))
        }
      </div>
      {renderChildren.apply(this, arguments)}
    </el-row>
  )
}

function renderTableCol(h, row, widgetType, item) {
  // TODO: 整合 search 的实现

  // TODO: 缺少组件
  // comboTree
  // upload
  // color-picker
  // icon-picker

  // TODO: 缺少 formatter ？？
  // const formatterLabel = item.formatter.label || 'label'
  // const formatterValue = item.formatter.value || 'id'

  switch (widgetType) {
    case 'invisible':// 0 隐藏文本
      return null
    case 'input':// 1 单行输入
    case 'password':// 3 密码输入
    case 'textarea':// 5 多行文本输入
      return <el-input type={widgetType === 'input' ? 'text' : widgetType} v-model={row[item.value]} size="mini" />
    case 'number':// 2 数字输入
      return <el-input-number size="mini" v-model={row[item.value]}controls-position="right" placeholder="请输入数字" />
    case 'date':// 4 日期选择
      return <el-date-picker v-model={row[item.value]} clearable type="date" size="mini" value-format="yyyy-MM-dd" placeholder={`请选择${item.label}`}>
      </el-date-picker>
    case 'time':// 6 时间选择
      return <el-time-picker v-model={row[item.value]} clearable size="mini" picker-options="{selectableRange: '00:00:00 - 23:59:59'}" value-format="HH:mm:ss" placeholder="请选择时间点" />
    case 'datetime':// 7 日期时间选择
      return <el-date-picker v-model={row[item.value]} clearable size="mini" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择日期时间" />
    case 'radio':// 8 单选
      return <el-radio value={!!Number(row[item.value])} true-label={1} false-label={0} size="mini" onChange={event => {
        row[item.value] = event
      }} />
    case 'checkbox':// 9 复选
      return <el-checkbox value={!!Number(row[item.value])} true-label={1} false-label={0} size="mini" onChange={event => {
        row[item.value] = event
      }} />
    case 'select':// 10 单选下拉
    case 'multipleSelect':// 11 多选下拉
      // eslint-disable-next-line no-case-declarations
      const options = (item.formatter || {}).data || []
      return <el-select clearable v-model={row[item.value]} size="mini"
        multiple={widgetType === 'multipleSelect'}
        placeholder={`请选择${item.label}`}
      >
        {options.map(optItem => <el-option label={optItem.label} value={optItem.id} />)}
      </el-select>
    case 'input-button':// 16 输入框+按钮、弹框选择
      return <el-input placeholder={`请选择${item.label}`} size="mini" v-model={row[item.value]}>
      <el-button slot="append" icon="el-icon-search" size="mini"></el-button>
    </el-input>
    case 'input-select':// 17 可输入下拉
    //  @blur="(e)=>{${value}=e.target.value}"
      return <el-select clearable filterable size="mini"
        v-model={row[item.value]}
        multiple={widgetType === 'multipleSelect'}
        placeholder={`请选择${item.label}`}
      >
      {
        ((item.formatter || {}).data || []).map(option => <el-option label={option.label} value={option.id}></el-option>)
      }
    </el-select>
    default:
      return <span>{row[item.value]}</span>
  }
}
const layouts = {
  colFormItem(h, element, index, parent) {
    // 隐藏文本不显示
    // TODO: 如果渲染为 hidden，这里需要重新考虑表单删除创建或编辑数据源其中一个配置的情况
    if (element.nonuse || element.invisible) {
      return null
    }
    const isTable = element.tag === 'el-table'
    const { readonly } = element
    const display = replaceEmpty((element.style || {}).display, 'block')
    const isBlock = display === 'block'

    const drawingClassName = {
      ...getDrawingClassName(this.activeId === element.formId, element),
      'unfocus-bordered': this.formConf.unFocusedComponentBorder,
      readonly,
      'col-inline': !isBlock
    }
    // eslint-disable-next-line no-nested-ternary
    const labelWidth = element.showLabel === false
      ? '0'
      : (element.labelWidth ? `${element.labelWidth}px` : null)
    if (!isTable) {
      return (
      <el-col span={isBlock ? element.span : ''} class={drawingClassName} nativeOnClick={setActiveEvent.bind(this)(element)}>
        <el-form-item label-width={labelWidth}
          label={element.showLabel ? element.label : ''} required={element.required}
        >
          <render key={element.renderKey} conf={element} onInput={ event => {
            this.$set(element, 'defaultValue', event)
          }}>
            {element?.children?.length > 0
              && renderChildren.apply(this, arguments)}
          </render>
        </el-form-item>
        {renderDrawingBtns.apply(this, arguments)}
      </el-col>
      )
    }

    const summaryArr = []
    const summaryField = {}
    // 表格底部合计
    const { summaryOptions } = element.bottomSummary
    if (element.bottomSummary.showSummary && summaryOptions && summaryOptions.length > 0) {
      for (let i = 0; i < summaryOptions.length; i++) {
        for (let j = 0; j < element.options.length; j++) {
          if (element.options[j].value !== 'id') this.$set(summaryField, element.options[j].value, j === 1 ? summaryOptions[i].label : '')
          this.$set(summaryField, 'value', summaryOptions[i].value)
        }
        summaryArr.push(JSON.parse(JSON.stringify(summaryField)))
      }
    }

    let widgetLen = 0

    // 表格渲染
    return (
      <el-col span={element.span} class={drawingClassName} nativeOnClick={setActiveEvent.bind(this)(element)}>
        <el-form-item label-width={labelWidth}
          label={element.showLabel ? element.label : ''} required={element.required} >
          <el-form inline={true} class="form-inline table-search-form">
            {
              element.searchData.map(item => {
                if (item.nonuse) {
                  return ''
                }
                let node = null
                const style = { width: '150px', marginBottom: '10px' }
                const { widgetCode } = item
                const widgetType = (getWidgetConf(widgetCode) || {}).type || ''
                let isItemInvisible = false
                const isItemReadonly = readonly || item.readonly
                // 只读文本
                if (isItemReadonly) {
                  const optionConf = element.searchOption ? element.searchOption[item.value] : undefined
                  node = <ui-form-item-text modelValue={item.inputVal} options={optionConf.data} />
                } else if (item.invisible === true || widgetType === 'invisible') { // 0 隐藏文本
                  widgetLen++
                  isItemInvisible = true
                  node = ''
                } else if (widgetType === 'input') { // 1 单行输入
                  node = <el-input value={item.inputVal} clearable size="small" style={style} placeholder={`请输入${item.label}`} />
                } else if (widgetType === 'number') { // 2 数字输入
                  node = <el-input-number value={item.inputVal === '' || item.inputVal === null ? undefined : item.inputVal} size="small" controls-position="right" style={style} placeholder="请输入数字" />
                } else if (widgetType === 'password') { // 3 密码输入
                  node = <el-input value={item.inputVal} clearable size="small" show-password style={style} placeholder="请输入密码" />
                } else if (widgetType === 'date') { // 4 日期选择
                  node = <el-date-picker value={item.inputVal} clearable size="small" style={style} type="date" value-format="yyyy-MM-dd" placeholder={`请选择${item.label}`}>
                    </el-date-picker>
                } else if (widgetType === 'textarea') { // 5 多行文本
                  node = <el-input value={item.inputVal} size="small" type="textarea" rows="2" style={style} placeholder={`请选择${item.label}`} />
                } else if (widgetType === 'time') { // 6 时间选择
                  node = <el-time-picker value={item.inputVal} clearable size="small" picker-options="{selectableRange: '00:00:00 - 23:59:59'}" value-format="HH:mm:ss" style={style} placeholder="请选择时间点" />
                } else if (widgetType === 'datetime') { // 7 日期时间选择
                  node = <el-date-picker value={item.inputVal} clearable size="small" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style={style} placeholder="请选择日期时间" />
                } else if (widgetType === 'radio') { // 8 单选
                  const optionConf = element.searchOption[item.value]
                  node = <el-radio-group value={item.inputVal} size="small">
                      {
                        optionConf ? optionConf.data.map(list => <el-radio
                          label={list[optionConf.label]}
                          value={list[optionConf.id]}>
                        </el-radio>) : ''
                      }
                    </el-radio-group>
                } else if (widgetType === 'checkbox' || widgetType === 'select' || widgetType === 'multipleSelect') { // 9 复选 10 单选下拉 11 多选下拉
                  const optionConf = element.searchOption[item.value]
                  node = <el-select value={item.inputVal} clearable size="small" multiple={widgetType === 'checkbox' || widgetType === 'multipleSelect'} style={style} placeholder={`请选择${item.label}`}>
                      {
                        optionConf ? optionConf.data.map(list => <el-option
                          label={list[optionConf.label]}
                          value={list[optionConf.id]}>
                        </el-option>) : ''
                      }
                    </el-select>
                } else if (widgetType === 'comboTree') { // 12 树形下拉
                  const optionConf = element.searchOption[item.value]
                  node = <combo-tree
                      data={optionConf.data}
                      label-key={optionConf.label}
                      value={item.inputVal} style={style} >
                    </combo-tree>
                }

                return isItemInvisible
                  ? null
                  : <el-form-item
                    label={item.label}
                    class={{ readonly: isItemReadonly }}
                  >
                    {node}
                  </el-form-item>
              })
            }
            {
              element.searchData.length > widgetLen
                ? (<span>
                  <el-button type="primary" icon="el-icon-search">搜索</el-button>
                  {element.resetBtn_allow
                    && <el-button icon="el-icon-refresh">重置</el-button>
                  }
                  </span>
                )
                : ''
            }
          </el-form>
          {element.topEdit.show && tableTopWarp.apply(this, arguments)}
          <el-table
            data={element.defaultValue}
            border={element.border}
            stripe={element.stripe}
            fit={element.fit}
            height={element.height}
            size={element.size}
            show-summary={element.bottomSummary.showSummary}
            sum-text={element.bottomSummary.sumText}
          >
            {element.columnType !== 'none'
              && <el-table-column
                label="序号"
                type={element.columnType}
                width="50"
                align="center"
                key={Math.random()}
              />
            }
            {
              element.options.map(item => {
                if (item.invisible === undefined ? item.is_display === 0 : item.invisible) { // HACK: 兼容旧数据
                  return null
                }
                const { editable, widgetCode } = item
                const widgetType = editable
                  ? (getWidgetConf(widgetCode) || {}).type || ''
                  : ''
                return <el-table-column
                  resizable={false}
                  prop={item.value}
                  label={item.label}
                  min-width={item.width}
                  align={item.align}
                  fixed={item.fixed === 'none' ? false : item.fixed}
                  show-overflow-tooltip
                  sortable={item.sortable}
                  scopedSlots={{
                    default: ({ row }) => renderTableCol(h, row, widgetType, item)
                  }}
                  key={item.value + widgetType}
                >
                {editable && widgetType === 'checkbox'
                  && <template slot="header" slot-scope="scope">
  <el-checkbox>{item.label}</el-checkbox>
</template>
                  }
                </el-table-column>
              })
            }
            {element.editRow.show
            && <el-table-column
                resizable={false}
                fixed={element.editRow.fixed === 'none' ? false : element.editRow.fixed}
                label={element.editRow.title}
                width={element.editRow.width}
                key={Math.random()}
              >
                {element.editRow.options.map((item, i) => <el-button
                    type={element.editRow.buttonType}
                    size="small"
                    rowbtn={item.rowbtn}
                    >
                    {item['prefix-icon'] ? <i class={item['prefix-icon']}></i> : ''}{item.label}{item['suffix-icon'] ? <i class={`${item['suffix-icon']} el-icon--right`} ></i> : ''}
                  </el-button>)
                }
              </el-table-column>
            }
          </el-table>
          {
            element.bottomSummary.showSummary ? <el-table class="summaryTable" data={summaryArr}
              border={element.border} stripe={element.stripe} fit={element.fit} size={element.size}>
            {element.columnType !== 'none'
              && <el-table-column
                label="序号"
                width="50"
                align="center"
                key={Math.random()}
              />
            }
            {
              element.options.map(item => {
                if (item.invisible === undefined ? item.is_display === 0 : item.invisible) { // HACK: 兼容旧数据
                  return null
                }
                return <el-table-column
                  resizable={false}
                  prop={item.value}
                  label={item.label}
                  min-width={item.width}
                  align={item.align}
                  fixed={item.fixed === 'none' ? false : item.fixed}
                  show-overflow-tooltip
                  sortable={item.sortable}
                />
              })
            }
            {
              element.editRow.show ? <el-table-column
                resizable={false}
                fixed={element.editRow.fixed === 'none' ? false : element.editRow.fixed}
                label={element.editRow.title}
                width={element.editRow.width}>
              </el-table-column> : ''
            }
            </el-table> : ''
          }
          {element.pagination.show ? <el-pagination
            small={['small', 'mini'].indexOf(element.size) >= 0}
            current-page={element.pagination.currentPage}
            page-sizes={element.pagination.pageSizes.split(',')}
            page-size={Number(element.pagination.pageSize || 0)}
            layout={element.pagination.isShowGoto ? element.pagination.layout : 'total, sizes, prev, pager, next'}
            total={element.pagination.total} background style="text-align:right;">
          </el-pagination> : ''}

        </el-form-item>
        {renderDrawingBtns.apply(this, arguments)}
      </el-col>

    )
  },
  // 行容器
  rowFormItem(h, element, index, parent) {
    if (element.nonuse) {
      return null
    }
    const { activeItem } = this.$listeners
    const drawingClassName = getDrawingClassName(this.activeId === element.formId, element)
    let child = renderChildren.apply(this, arguments)
    if (element.type === 'flex') {
      child = <el-row type={element.type} justify={element.justify} align={element.align}>
              {child}
            </el-row>
    }
    return (
      <el-col span={element.span}>
        <el-row gutter={element.gutter} class={drawingClassName}
          nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
          <span class="component-name">{element.componentName}</span>
          <draggable data-id={element.formId} list={element.children} animation={340} group="componentsGroup" class="drag-wrapper">
            {child}
          </draggable>
          {renderDrawingBtns.apply(this, arguments)}
        </el-row>
      </el-col>
    )
  },

  // 布局容器
  rowContainer(h, element, index, parent) {
    if (element.nonuse) {
      return null
    }
    const { activeItem } = this.$listeners
    const drawingClassName = getDrawingClassName(this.activeId === element.formId, element)
    return (
      <el-container class={drawingClassName} style={element.style}
        nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
        {
          element.aside ? <el-aside style={element.asideStyle}>
            {renderChildren.apply(this, [...arguments, 'leftChild'])}
          </el-aside> : ''
        }
        <el-container direction={(element.header || element.footer) ? 'vertical' : 'horizontal'}>
          {
            element.header ? <el-header style={element.headerStyle}>Header</el-header> : ''
          }
          <el-main style={element.mainStyle}>
            {renderChildren.apply(this, [...arguments, 'centerChild'])}
          </el-main>
          {
            element.footer ? <el-footer style={element.headerStyle}>
              {renderChildren.apply(this, [...arguments, 'footerChild'])}
            </el-footer> : ''
          }
        </el-container>
        {renderDrawingBtns.apply(this, arguments)}
      </el-container>
    )
  },

  // 表单详情
  formDetail(h, element, index, parent) {
    const layoutClone = layouts.formContainer
    return layoutClone.call(this, h, element, index, parent)
  },

  // 表单控件
  formContainer(h, element, index, parent) {
    const { activeItem } = this.$listeners
    const drawingClassName = getDrawingClassName(this.activeId === element.formId, element)
    let child = renderChildren.apply(this, arguments)
    if (element.type === 'flex') {
      child = <el-row type={element.type} justify={element.justify} align={element.align}>
        {child}
      </el-row>
    }
    return (
      <el-col span={element.span}>
        <el-row gutter={element.gutter} class={drawingClassName}
          nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
          <draggable data-id={element.formId} list={element.children} animation={340} group="componentsGroup" class="drag-wrapper">
            {child}
          </draggable>
          {renderDrawingBtns.apply(this, arguments)}
        </el-row>
      </el-col>
    )
  },
  // tab控件
  tabContainer(h, element, index, parent) {
    const { activeItem } = this.$listeners
    const drawingClassName = getDrawingClassName(this.activeId === element.formId, element)
    return (
      <el-col span={element.span}>
        <el-row gutter={element.gutter} class={drawingClassName}
          nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
          <el-tabs v-model={element.activeName} type={element.type} tab-position={element.tabPosition} closable={element.closable}>
            {
              element.options.map((item, idx) => <el-tab-pane label={item.label}>
                {renderChildren.apply(this, [...arguments, item.value])}
              </el-tab-pane>)
            }
          </el-tabs>
          {renderDrawingBtns.apply(this, arguments)}
        </el-row>
      </el-col>
    )
  },
  // 主从表布局
  tableContainer(h, element, index, parent) {
    const layoutClone = layouts.formContainer
    return layoutClone.call(this, h, element, index, parent)
  },
  // 树+表格
  treeAndTable(h, element, index, parent) {
    const layoutClone = layouts.rowContainer
    return layoutClone.call(this, h, element, index, parent)
  },
  // 菜单+选项卡
  menuAndTab(h, element, index, parent) {
    const layoutClone = layouts.rowContainer
    return layoutClone.call(this, h, element, index, parent)
  },
  // 树+表单
  treeAndForm(h, element, index, parent) {
    const layoutClone = layouts.rowContainer
    return layoutClone.call(this, h, element, index, parent)
  },
  // 登录
  uiLoginPage(h, element, index, parent) {
    const { activeItem } = this.$listeners
    const drawingClassName = getDrawingClassName(this.activeId === element.formId, element)
    return (
      <el-col span={element.span}>
        <el-row gutter={element.gutter} class={drawingClassName}
          nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
          <ui-login-page
            loginBgLarge={element.loginBgLarge}
            loginBgSmall={element.loginBgSmall}
            imgSrc={element.imgSrc}
            projectName={element.projectName}
            path={element.path}
            name={element.name}
          />
          {renderDrawingBtns.apply(this, arguments)}
        </el-row>
      </el-col>
    )
  },
  // 登录
  uiLoginPageV2(h, element, index, parent) {
    const { activeItem } = this.$listeners
    const drawingClassName = getDrawingClassName(this.activeId === element.formId, element)
    return (
      <el-col span={element.span}>
        <el-row gutter={element.gutter} class={drawingClassName}
          nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
          <ui-login-page-v2
            loginBgLarge={element.loginBgLarge}
            loginBgSmall={element.loginBgSmall}
            imgSrc={element.imgSrc}
            projectName={element.projectName}
            path={element.path}
            name={element.name}
          />
          {renderDrawingBtns.apply(this, arguments)}
        </el-row>
      </el-col>
    )
  },
  // 主页1
  uiMainV1(h, element, index, parent) {
    const { activeItem } = this.$listeners
    const drawingClassName = getDrawingClassName(this.activeId === element.formId, element)
    return (
      <el-col span={element.span}>
        <el-row gutter={element.gutter} class={drawingClassName}
          nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
          <ui-main-v1
            asideTitle={element.projectName}
            logoIcon={element.logoIcon}
            variables={element.variables}
            isCollapse={element.isCollapse}
            menuId={element.id}
            homePage={element.homePage}
            systemType={element.systemType}
            menuData={element.data}
          />
          {renderDrawingBtns.apply(this, arguments)}
        </el-row>
      </el-col>
    )
  },
  // 主页2
  uiMainV2(h, element, index, parent) {
    const { activeItem } = this.$listeners
    const drawingClassName = getDrawingClassName(this.activeId === element.formId, element)
    return (
      <el-col span={element.span}>
        <el-row gutter={element.gutter} class={drawingClassName}
          nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
          <ui-main-v2
            headerTitle={element.projectName}
            logoIcon={element.logoIcon}
            variables={element.variables}
            isCollapse={element.isCollapse}
            menuId={element.id}
            homePage={element.homePage}
            systemType={element.systemType}
            menuData={element.data}
          />
          {renderDrawingBtns.apply(this, arguments)}
        </el-row>
      </el-col>
    )
  }
}

// 渲染子节点
function renderChildren(h, element, index, parent, type = 'children') {
  let eleArr
  if (element.layout && ['tabContainer', 'rowContainer', 'treeAndTable', 'menuAndTab', 'treeAndForm'].indexOf(element.layout) > -1) { // 只要对应的key的一个 构成数组
    eleArr = [element.children.find(item => item.tabValue === type)] // 根据控件自身带的父级的标记过滤遍历渲染
  } else {
    eleArr = element[type]
  }
  if (!Array.isArray(eleArr)) return null
  return eleArr.map((el, i) => {
    if (!el) { return null }
    const layout = layouts[el.layout]
    if (layout) {
      return layout.call(this, h, el, i, eleArr)
    }
    return layoutIsNotFound.call(this)
  })
}

function layoutIsNotFound() {
  throw new Error('没有匹配的layout：', this.element.layout, this.element)
}

export default {
  components: {
    render,
    draggable,
    ComboTree,
    RichtextEditor,
    UiLoginPage,
    UiLoginPageV2
  },
  props: [
    'element',
    'index',
    'drawingList',
    'activeId',
    'formConf'
  ],
  render(h) {
    // WARN: activeData 使用方式错误，导致此处不能拷贝。因此不能在这里修改 element 数据。
    // const elementClone = JSON.parse(JSON.stringify(this.element))
    const elementClone = this.element
    const layout = layouts[elementClone.layout]
    if (layout) {
      return layout.call(this, h, elementClone, this.index, this.drawingList)
    }
    return layoutIsNotFound.call(this)
  }
}
</script>
