<template>
  <div class="right-board">
    <el-tabs v-model="currentTab" class="center-tabs">
      <el-tab-pane label="组件属性" name="field" style="width: 100%;" />
      <!-- <el-tab-pane label="页面属性" name="form" /> -->
    </el-tabs>
    <div class="field-box">
      <el-scrollbar>
        <!-- 组件属性 -->
        <el-form v-show="currentTab==='field' && showField" size="small" label-width="100px">
          <el-form-item v-if="activeData.tag" label="组件类型">
            <el-select
              v-model="activeData.tagIcon"
              placeholder="请选择组件类型"
              :disabled="!activeData.changeTag"
              @change="tagChange"
            >
              <el-option-group v-for="group in tagList" :key="group.label" :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.label"
                  :label="item.label"
                  :value="item.tagIcon"
                >
                  <svg-icon class="node-icon" :icon-class="item.tagIcon" />
                  <span> {{ item.label }}</span>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.vModel!==undefined" label="字段名">
            <el-input v-model="activeData.vModel" placeholder="请输入字段名（v-model）" @focus="setOldComponentName" @change="changeComponentName" />
          </el-form-item>
          <el-form-item v-if="activeData.componentName!==undefined" label="组件名">
            {{ activeData.componentName }}
          </el-form-item>
          <el-form-item v-if="activeData.showLabel !== undefined" label="显示标签">
            <el-switch v-model="activeData.showLabel" />
          </el-form-item>
          <template v-if="activeData.showLabel">
            <el-form-item v-if="activeData.label!==undefined" label="标签名">
              <el-input v-model="activeData.label" placeholder="请输入标签名" />
            </el-form-item>
            <el-form-item v-if="activeData.labelWidth!==undefined" label="标签宽度">
              <el-input v-model.number="activeData.labelWidth" type="number" placeholder="请输入标签宽度" />
            </el-form-item>
          </template>

          <!-- <el-form-item v-if="activeData.title!==undefined" label="标题">
            <el-input
              v-model="activeData.title"
              placeholder="请输入标题"
            />
          </el-form-item> -->
          <el-form-item v-if="activeData.placeholder!==undefined" label="提示语">
            <el-input v-model="activeData.placeholder" placeholder="请输入提示语" />
          </el-form-item>
          <el-form-item v-if="activeData['start-placeholder']!==undefined" label="开始占位">
            <el-input v-model="activeData['start-placeholder']" placeholder="请输入提示语" />
          </el-form-item>
          <el-form-item v-if="activeData['end-placeholder']!==undefined" label="结束占位">
            <el-input v-model="activeData['end-placeholder']" placeholder="请输入提示语" />
          </el-form-item>
          <el-form-item v-if="['rowContainer','treeAndTable','menuAndTab'].indexOf(activeData.layout)>-1" label="main背景色">
            <el-color-picker v-model="activeData.mainStyle.background" show-alpha />
          </el-form-item>
          <el-form-item v-if="['rowContainer','treeAndTable','menuAndTab'].indexOf(activeData.layout)>-1" label="显示aside">
            <el-switch v-model="activeData.aside" />
          </el-form-item>
          <el-form-item v-if="['rowContainer','treeAndTable','menuAndTab'].indexOf(activeData.layout)>-1&&activeData.aside" label="aside宽度">
            <el-input v-model="activeData.asideStyle.width" placeholder="请输入aside宽度" />
          </el-form-item>
          <el-form-item v-if="['rowContainer','treeAndTable','menuAndTab'].indexOf(activeData.layout)>-1&&activeData.aside" label="aside背景色">
            <el-color-picker v-model="activeData.asideStyle.background" show-alpha />
          </el-form-item>
          <el-form-item v-if="['rowContainer','treeAndTable','menuAndTab'].indexOf(activeData.layout)>-1" label="显示header">
            <el-switch v-model="activeData.header" />
          </el-form-item>
          <el-form-item v-if="['rowContainer','treeAndTable','menuAndTab'].indexOf(activeData.layout)>-1" label="显示footer">
            <el-switch v-model="activeData.footer" />
          </el-form-item>
          <el-form-item v-if="['rowContainer','treeAndTable','menuAndTab'].indexOf(activeData.layout)>-1&&(activeData.header||activeData.footer)" label="头/底部高度">
            <el-input v-model="activeData.headerStyle.height" placeholder="请输入头/底部高度" />
          </el-form-item>
          <el-form-item v-if="['rowContainer','treeAndTable','menuAndTab'].indexOf(activeData.layout)>-1&&(activeData.header||activeData.footer)" label="头/底部背景">
            <el-color-picker v-model="activeData.headerStyle.background" show-alpha />
          </el-form-item>
          <el-form-item v-if="activeData.span!==undefined" label="表单栅格">
            <el-slider v-model="activeData.span" :max="24" :min="1" :marks="{12:''}" />
          </el-form-item>

          <!-- 登录模板专用 start -->
          <template v-if="['uiLoginPage','uiLoginPageV2'].indexOf(activeData.layout)>-1">
            <el-form-item label="系统名称">
              <el-input v-model="activeData.projectName" placeholder="请输入系统名称" />
            </el-form-item>
            <el-form-item label="产品编码">
              <el-input v-model="activeData.appCode" placeholder="请输入产品编码" />
            </el-form-item>
            <el-form-item label="登录接口">
              <el-input v-model="activeData.loginUrl" placeholder="默认为：/login/getLogin" />
            </el-form-item>
            <el-form-item label="登录后的跳转路由路径">
              <el-input v-model="activeData.path" placeholder="请输入路由路径" />
            </el-form-item>
            <el-form-item label="登录后的跳转路由名称">
              <el-input v-model="activeData.name" placeholder="请输入路由名称" />
            </el-form-item>
            <el-form-item label="PC端背景">
              <el-input v-model="activeData.loginBgLarge" placeholder="请输入图片url" />
            </el-form-item>
            <el-form-item label="PC端背景">
              <basic-upload :active-data="activeData" type="loginBgLarge" />
            </el-form-item>
            <el-form-item label="移动端背景">
              <el-input v-model="activeData.loginBgSmall" placeholder="请输入图片url" />
            </el-form-item>
            <el-form-item label="移动端背景">
              <basic-upload :active-data="activeData" type="loginBgSmall" />
            </el-form-item>
            <el-form-item label="系统logo">
              <el-input v-model="activeData.imgSrc" placeholder="请输入图片url" />
            </el-form-item>
            <el-form-item label="系统logo">
              <basic-upload :active-data="activeData" type="imgSrc" />
            </el-form-item>
            <el-form-item label="网页图标">
              <el-input v-model="activeData.websiteIco" placeholder="网页图标url" />
            </el-form-item>
            <el-form-item label="网页图标">
              <basic-upload :active-data="activeData" type="websiteIco" />
            </el-form-item>
          </template>
          <!-- 登录模板专用 end -->

          <!-- 主页模板专用 start -->
          <template v-if="['uiMainV1', 'uiMainV2'].indexOf(activeData.layout) > -1">
            <el-form-item label="系统名称">
              <el-input v-model="activeData.projectName" placeholder="请输入系统名称" />
            </el-form-item>
            <el-form-item label="系统logo">
              <el-input v-model="activeData.logoIcon" placeholder="请输入图片url" />
            </el-form-item>
            <el-form-item label="系统logo">
              <basic-upload :active-data="activeData" type="logoIcon" />
            </el-form-item>
            <el-form-item label="系统类型">
              <el-select v-model="activeData.systemType" clearable placeholder="请选择系统类型" style="width:227px;">
                <el-option label="项目" value="project" />
                <el-option label="产品" value="product" />
                <el-option label="无" value="none" />
              </el-select>
            </el-form-item>
            <el-form-item label="首 页">
              <combo-tree
                v-model="activeData.pageId"
                value-key="id_code"
                :data="systemUrlTree"
                :width="'227px'"
                @node-click="(node, id)=>{activeData.homePage = node}"
              />
            </el-form-item>
          </template>
          <!-- 主页模板专用 end -->

          <el-form-item v-if="activeData.layout==='rowFormItem'" label="栅格间隔">
            <el-input-number v-model="activeData.gutter" :min="0" placeholder="栅格间隔" />
          </el-form-item>
          <el-form-item v-if="activeData.layout==='rowFormItem'" label="布局模式">
            <el-radio-group v-model="activeData.type" size="medium">
              <el-radio-button label="default" />
              <el-radio-button label="flex" />
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.justify!==undefined&&activeData.type==='flex'" label="水平排列">
            <el-select v-model="activeData.justify" placeholder="请选择水平排列">
              <el-option
                v-for="(item, index) in justifyOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.align!==undefined&&activeData.type==='flex'" label="垂直排列">
            <el-radio-group v-model="activeData.align" size="medium">
              <el-radio-button label="top" />
              <el-radio-button label="middle" />
              <el-radio-button label="bottom" />
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.style&&activeData.style.width!==undefined" label="组件宽度">
            <el-input v-model="activeData.style.width" placeholder="请输入组件宽度" clearable />
          </el-form-item>
          <el-form-item v-if="activeData.style&&activeData.style.height!==undefined" label="组件高度">
            <el-input v-model="activeData.style.height" placeholder="请输入组件高度" clearable />
          </el-form-item>
          <template v-if="activeData.tag === 'listPicker'">
            <el-form-item label="弹窗内容宽度">
              <el-input v-model="activeData.pickerWidth" />
            </el-form-item>
            <el-form-item label="弹窗内容高度">
              <el-input v-model="activeData.pickerHeight" />
            </el-form-item>
          </template>
          <!-- NOTE: conf.modelValue 会作为默认值渲染到最终页面 -->
          <!-- <el-form-item v-if="activeData.modelValue!==undefined" label="数据值">
            <el-input
              v-model="activeData.f"
              placeholder="请输入数据值"
            />
          </el-form-item> -->
          <el-form-item v-if="activeData.errValue!==undefined" label="异常值">
            <el-input
              v-model="activeData.errValue"
              placeholder="请输入异常值"
            />
          </el-form-item>
          <el-form-item v-if="activeData.vModel!==undefined" label="默认值">
            <el-select
              v-if="activeData.defaultValueType!==undefined"
              v-model="activeData.defaultValueType"
              placeholder="请选择默认值类型"
              :style="{ width: '100%' }"
              @change="defaultValueTypeChange"
            >
              <el-option label="无" value="" />
              <el-option label="自定义" value="custom" />
              <el-option label="默认第一项" value="selectFirst" />
              <!-- <el-option label="其他" value="else" /> -->
            </el-select>
            <el-input
              v-if="activeData.defaultValueType===undefined||activeData.defaultValueType==='custom'"
              type="textarea"
              rows="5"
              :value="setDefaultValue(activeData.defaultValue)"
              placeholder="请输入默认值"
              @input="onDefaultValueInput"
            />
          </el-form-item>
          <el-form-item v-if="activeData.tag==='el-checkbox-group'" label="至少应选">
            <el-input-number
              :value="activeData.min"
              :min="0"
              placeholder="至少应选"
              @input="$set(activeData, 'min', $event?$event:undefined)"
            />
          </el-form-item>
          <el-form-item v-if="activeData.tag==='el-checkbox-group'" label="最多可选">
            <el-input-number
              :value="activeData.max"
              :min="0"
              placeholder="最多可选"
              @input="$set(activeData, 'max', $event?$event:undefined)"
            />
          </el-form-item>
          <el-form-item v-if="activeData.prepend!==undefined" label="前缀">
            <el-input v-model="activeData.prepend" placeholder="请输入前缀" />
          </el-form-item>
          <el-form-item v-if="activeData.append!==undefined" label="后缀">
            <el-input v-model="activeData.append" placeholder="请输入后缀" />
          </el-form-item>
          <el-form-item v-if="activeData['iconName']!==undefined" label="图标">
            <el-input v-model="activeData['iconName']" placeholder="请输入图标名称">
              <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('iconName')">
                选择
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData['prefix-icon']!==undefined" label="前图标">
            <el-input v-model="activeData['prefix-icon']" placeholder="请输入前图标名称">
              <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('prefix-icon')">
                选择
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData['suffix-icon'] !== undefined" label="后图标">
            <el-input v-model="activeData['suffix-icon']" placeholder="请输入后图标名称">
              <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('suffix-icon')">
                选择
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-cascader'" label="选项分隔符">
            <el-input v-model="activeData.separator" placeholder="请输入选项分隔符" />
          </el-form-item>

          <template v-if="activeData.tag === 'code-editor'">
            <el-form-item label="展示行数">
              <el-input-number v-model="activeData.rows" placeholder="展示行数" />
            </el-form-item>
            <el-form-item label="语言类型">
              <el-select
                v-model="activeData.language"
                placeholder="请选择语言类型"
              >
                <el-option label="不指定" value="" />
                <el-option label="sql" value="sql" />
                <el-option label="java" value="java" />
                <el-option label="html" value="html" />
                <el-option label="javascript" value="javascript" />
                <el-option label="css" value="css" />
                <el-option label="json" value="json" />
                <el-option label="markdown" value="markdown" />
              </el-select>
            </el-form-item>
            <el-form-item label="主题风格">
              <el-radio-group v-model="activeData.theme" size="medium">
                <el-radio-button label="vs">
                  白色
                </el-radio-button>
                <el-radio-button label="vs-dark">
                  黑色
                </el-radio-button>
                <el-radio-button label="hc-black">
                  高亮
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </template>

          <el-form-item v-if="activeData.autosize !== undefined" label="最小行数">
            <el-input-number v-model="activeData.autosize.minRows" :min="1" placeholder="最小行数" />
          </el-form-item>
          <el-form-item v-if="activeData.autosize !== undefined" label="最大行数">
            <el-input-number v-model="activeData.autosize.maxRows" :min="1" placeholder="最大行数" />
          </el-form-item>
          <el-form-item v-if="activeData.min !== undefined" label="最小值">
            <el-input-number v-model="activeData.min" placeholder="最小值" />
          </el-form-item>
          <el-form-item v-if="activeData.max !== undefined" label="最大值">
            <el-input-number v-model="activeData.max" placeholder="最大值" />
          </el-form-item>
          <el-form-item v-if="activeData.step !== undefined" label="步长">
            <el-input-number v-model="activeData.step" placeholder="步数" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-input-number'" label="精度">
            <el-input-number v-model="activeData.precision" :min="0" placeholder="精度" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-input-number'" label="按钮位置">
            <el-radio-group v-model="activeData['controls-position']" size="medium">
              <el-radio-button label="">
                默认
              </el-radio-button>
              <el-radio-button label="right">
                右侧
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.maxlength !== undefined" label="最多输入">
            <el-input v-model="activeData.maxlength" placeholder="请输入字符长度">
              <template slot="append">
                个字符
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData['active-text'] !== undefined" label="开启提示">
            <el-input v-model="activeData['active-text']" placeholder="请输入开启提示" />
          </el-form-item>
          <el-form-item v-if="activeData['inactive-text'] !== undefined" label="关闭提示">
            <el-input v-model="activeData['inactive-text']" placeholder="请输入关闭提示" />
          </el-form-item>
          <el-form-item v-if="activeData['active-value'] !== undefined" label="开启值">
            <el-input
              :value="setDefaultValue(activeData['active-value'])"
              placeholder="请输入开启值"
              @input="onSwitchValueInput($event, 'active-value')"
            />
          </el-form-item>
          <el-form-item v-if="activeData['inactive-value'] !== undefined" label="关闭值">
            <el-input
              :value="setDefaultValue(activeData['inactive-value'])"
              placeholder="请输入关闭值"
              @input="onSwitchValueInput($event, 'inactive-value')"
            />
          </el-form-item>
          <el-form-item
            v-if="activeData.type !== undefined && 'el-date-picker' === activeData.tag"
            label="时间类型"
          >
            <el-select
              v-model="activeData.type"
              placeholder="请选择时间类型"
              @change="dateTypeChange"
            >
              <el-option
                v-for="(item, index) in dateOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.accept !== undefined" label="文件类型">
            <el-select
              v-model="activeData.accept"
              placeholder="请选择文件类型"
              clearable
            >
              <el-option label="图片" value="image/*" />
              <el-option label="视频" value="video/*" />
              <el-option label="音频" value="audio/*" />
              <el-option label="excel" value=".xls,.xlsx" />
              <el-option label="word" value=".doc,.docx" />
              <el-option label="pdf" value=".pdf" />
              <el-option label="txt" value=".txt" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.fileSize !== undefined" label="文件大小">
            <el-input v-model.number="activeData.fileSize" placeholder="请输入文件大小">
              <el-select slot="append" v-model="activeData.sizeUnit" :style="{ width: '110px' }">
                <el-option label="KB" value="KB" />
                <el-option label="MB" value="MB" />
                <el-option label="GB" value="GB" />
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData.fileDir !== undefined" label="上传路径">
            <el-input v-model="activeData.fileDir" placeholder="请输入上传路径" clearable />
          </el-form-item>
          <el-form-item v-if="activeData.fileName !== undefined" label="保存文件名">
            <el-input v-model="activeData.fileName" placeholder="请输入保存文件名" clearable />
          </el-form-item>
          <el-form-item v-if="activeData.limit !== undefined" label="最大上传数">
            <el-input v-model.number="activeData.limit" placeholder="请输入最大上传数" clearable />
          </el-form-item>
          <!-- <el-form-item v-if="activeData.action !== undefined" label="上传地址">
            <el-input v-model="activeData.action" placeholder="请输入上传地址" clearable />
          </el-form-item> -->
          <el-form-item v-if="activeData['list-type'] !== undefined" label="列表类型">
            <el-radio-group v-model="activeData['list-type']" size="medium">
              <el-radio-button label="text">
                text
              </el-radio-button>
              <el-radio-button label="picture">
                picture
              </el-radio-button>
              <el-radio-button label="picture-card">
                picture-card
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="activeData.buttonText !== undefined"
            v-show="'picture-card' !== activeData['list-type']"
            label="按钮文字"
          >
            <el-input v-model="activeData.buttonText" placeholder="请输入按钮文字" />
          </el-form-item>
          <el-form-item v-if="activeData.content !== undefined" label="内容">
            <el-input v-model="activeData.content" type="textarea" :rows="2" placeholder="请输入文字内容" />
          </el-form-item>
          <el-form-item v-if="activeData.href !== undefined" label="链接">
            <el-input v-model="activeData.href" type="textarea" :rows="2" placeholder="请输入链接地址" />
          </el-form-item>
          <el-form-item v-if="activeData.style && activeData.style.display !== undefined" label="显示">
            <el-radio-group v-model="activeData.style.display" size="medium">
              <el-radio-button label="block">
                块级
              </el-radio-button>
              <el-radio-button label="inline-block">
                行内块
              </el-radio-button>
              <el-radio-button label="inline">
                行内
              </el-radio-button>
              <!-- <el-radio-button label="flex">
                flex
              </el-radio-button> -->
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.stretch !== undefined" label="宽度自适应">
            <el-switch v-model="activeData.stretch" />
          </el-form-item>
          <el-form-item v-if="activeData.style && activeData.style.color !== undefined" label="颜色">
            <el-color-picker v-model="activeData.style.color" show-alpha />
          </el-form-item>
          <el-form-item v-if="activeData.style && activeData.style.fontSize !== undefined" label="大小">
            <el-input v-model="activeData.style.fontSize" placeholder="请输入大小" />
          </el-form-item>
          <el-form-item v-if="activeData['content-position'] !== undefined" label="分割线文案位置">
            <el-radio-group v-model="activeData['content-position']" size="medium">
              <el-radio-button label="left">
                left
              </el-radio-button>
              <el-radio-button label="center">
                center
              </el-radio-button>
              <el-radio-button label="right">
                right
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.style && activeData.style.textAlign !== undefined" label="对齐方式">
            <el-radio-group v-model="activeData.style.textAlign" size="medium">
              <el-radio-button label="left">
                left
              </el-radio-button>
              <el-radio-button label="center">
                center
              </el-radio-button>
              <el-radio-button label="right">
                right
              </el-radio-button>
              <!-- <el-radio-button label="justify">
                justify
              </el-radio-button> -->
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="activeData.size !== undefined &&
              (activeData.optionType === 'button' ||
                activeData.border ||
                activeData.tag === 'el-color-picker' ||
                activeData.tag === 'el-button' ||
                activeData.tag === 'el-input')"
            label="尺寸"
          >
            <el-radio-group v-model="activeData.size" size="medium">
              <el-radio-button label="large">
                大
              </el-radio-button>
              <el-radio-button label="medium">
                中
              </el-radio-button>
              <el-radio-button label="small">
                小
              </el-radio-button>
              <el-radio-button label="mini">
                迷你
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="activeData.tag==='el-button'||activeData.tag==='el-link'"
            label="风格类型"
          >
            <el-select
              v-model="activeData.type"
              placeholder="请选择风格"
            >
              <el-option label="文本" value="text" />
              <el-option label="基础" value="default" />
              <el-option label="主要" value="primary" />
              <el-option label="次要" value="info" />
              <el-option label="成功" value="success" />
              <el-option label="警告" value="warning" />
              <el-option label="危险" value="danger" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-button'" label="Enter键触发事件">
            <el-switch v-model="activeData.enterClick" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-button'" label="朴素按钮">
            <el-switch v-model="activeData.plain" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-button'" label="圆角按钮">
            <el-switch v-model="activeData.round" />
          </el-form-item>
          <el-form-item v-if="activeData.underline !== undefined" label="显示下划线">
            <el-switch v-model="activeData.underline" />
          </el-form-item>
          <el-form-item v-if="activeData.style && activeData.style.background !== undefined" label="背景">
            <el-color-picker v-model="activeData.style.background" show-alpha />
          </el-form-item>
          <el-form-item v-if="activeData.closable !== undefined" label="是否可关闭">
            <el-switch v-model="activeData.closable" />
          </el-form-item>
          <el-form-item v-if="['tabContainer'].indexOf(activeData.layout) > -1||activeData.tag==='el-carousel'" label="类型">
            <el-radio-group v-model="activeData.type" size="medium">
              <el-radio-button label="default">
                默认
              </el-radio-button>
              <el-radio-button label="card">
                选项卡
              </el-radio-button>
              <el-radio-button v-if="['tabContainer'].indexOf(activeData.layout) > -1" label="border-card">
                卡片化
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.tabPosition !== undefined" label="位置">
            <el-radio-group v-model="activeData.tabPosition" size="medium">
              <el-radio-button label="top">
                上
              </el-radio-button>
              <el-radio-button label="right">
                右
              </el-radio-button>
              <el-radio-button label="bottom">
                下
              </el-radio-button>
              <el-radio-button label="left">
                左
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <template v-if="activeData.src !== undefined">
            <el-form-item :label="activeData.tag==='el-image' ? '图片地址' : '链接地址'">
              <el-input v-model="activeData.src" :placeholder="activeData.tag==='el-image' ? '图片地址' : '链接地址'" />
            </el-form-item>
          </template>
          <el-form-item v-if="activeData.tag==='el-image'" label="上传图片">
            <basic-upload :active-data="activeData" type="src" />
          </el-form-item>
          <el-form-item v-if="activeData.alt !== undefined" label="提示文字">
            <el-input v-model="activeData.alt" placeholder="提示文字" />
          </el-form-item>
          <el-form-item v-if="activeData.videoType !== undefined" label="视频格式">
            <el-input v-model="activeData.videoType" placeholder="如video/mp4" />
          </el-form-item>
          <el-form-item v-if="activeData.tag==='el-image'" label="适应方式">
            <el-select v-model="activeData.fit" clearable placeholder="请选择适应方式">
              <el-option label="fill" value="fill" />
              <el-option label="contain" value="contain" />
              <el-option label="cover" value="cover" />
              <el-option label="none" value="none" />
              <el-option label="scale-down" value="scale-down" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData['range-separator'] !== undefined" label="分隔符">
            <el-input v-model="activeData['range-separator']" placeholder="请输入分隔符" />
          </el-form-item>
          <el-form-item v-if="activeData['picker-options'] !== undefined" label="时间段">
            <el-input
              v-model="activeData['picker-options'].selectableRange"
              placeholder="请输入时间段"
            />
          </el-form-item>
          <el-form-item v-if="activeData.format !== undefined" label="时间格式">
            <el-input
              :value="activeData.format"
              placeholder="请输入时间格式"
              @input="setTimeValue($event)"
            />
          </el-form-item>
          <template v-if="['el-table', 'el-button','el-cascader'].indexOf(activeData.tag) > -1
            || optionComponentList.indexOf(activeData.tag) > -1
            || ['formDetail','formContainer','tabContainer','uiMainV1','uiMainV2','ntiMobileMain'].indexOf(activeData.layout) > -1
            || activeData.type==='import'"
          >
            <el-collapse class="with-padding">
              <el-collapse-item v-if="activeData.layout !== 'tabContainer'" title="数据源" name="collapse-datasource">
                <attr-datasource :active-data="activeData" :label="activeData.label" :tag="activeData.tag" :layout="activeData.layout" />
              </el-collapse-item>
              <el-collapse-item v-if="activeData.tag === 'el-table' || isListPicker" title="搜索表单" name="table-search">
                <el-form-item label="启用重置">
                  <el-switch v-model="activeData.resetBtn_allow" />
                </el-form-item>
                <el-divider>搜索条件</el-divider>
                <draggable
                  :list="activeData.searchData"
                  :animation="340"
                  group="selectItem"
                  handle=".option-drag"
                >
                  <div v-for="(item, index) in activeData.searchData" :key="index" class="select-item">
                    <span class="select-line-icon option-drag" title="拖拽排序">
                      <i class="el-icon-s-operation" />
                    </span>
                    <el-input v-model="item.label" placeholder="标签名" size="small" />
                    <el-input
                      placeholder="字段名"
                      size="small"
                      :value="item.value"
                      :readonly="!item.isCustom"
                      @input="setOptionValue(item, $event, 'value')"
                    />
                    <el-input
                      placeholder="初始值"
                      size="small"
                      :value="item.inputVal"
                      @input="setOptionValue(item, $event, 'inputVal')"
                    />
                    <!-- <div
                      class="close-btn select-line-icon"
                      title="编辑"
                      @click="showEditDialog('tableSearchForm', activeData.searchData[index], '搜索条件')"
                    >
                      <i class="el-icon-edit-outline" />
                    </div> -->
                    <div
                      v-if="item.isCustom"
                      class="close-btn select-line-icon"
                      title="删除"
                      @click="activeData.searchData.splice(index, 1)"
                    >
                      <i class="el-icon-remove-outline" />
                    </div>
                    <div
                      v-else
                      class="close-btn select-line-icon"
                      :title="item.invisible ? '展示' : '隐藏'"
                      @click="handleToggleOptionValue(item, 'invisible', 'el-table')"
                    >
                      <i :class="{
                        'el-icon-remove-outline': !item.invisible,
                        'el-icon-plus': item.invisible
                      }"
                      />
                    </div>
                  </div>
                </draggable>
                <div style="margin-left: 10px;">
                  <el-button
                    style="padding-bottom: 0"
                    icon="el-icon-circle-plus-outline"
                    type="text"
                    @click="addTableSearchFormItem"
                  >
                    添加
                  </el-button>
                </div>
              </el-collapse-item>
              <!--
                NOTE: 此处逻辑跟页面生成的逻辑不符。非表格组件配置不生效。
                页面生成逻辑：非表格控件时，只在没有数据源的情况下才会使用 option 数据。
                原有判断条件：自定义选项 activeData.options && ['tabContainer','uiMainV1','uiMainV2'].indexOf(activeData.layout) === -1
              -->
              <el-collapse-item v-if="activeData.tag === 'el-table' || isListPicker" title="表格列" name="9">
                <draggable
                  :list="activeData.options"
                  :animation="340"
                  group="selectItem"
                  handle=".option-drag"
                >
                  <div v-for="(item, index) in activeData.options" :key="index" class="select-item">
                    <span class="select-line-icon option-drag" title="拖拽排序">
                      <i class="el-icon-s-operation" />
                    </span>
                    <el-input v-model="item.label" placeholder="输入label" size="small" />
                    <el-input
                      placeholder="输入value"
                      size="small"
                      :value="item.value"
                      @input="setOptionValue(item, $event)"
                    />
                    <div class="close-btn select-line-icon" title="编辑" @click="rowPropEdit('column', index)">
                      <i class="el-icon-edit-outline" />
                    </div>
                    <!-- <div class="close-btn select-line-icon" title="编辑" @click="showEditDialog('tableCol',item, `表格列属性：${activeData.options[index].label}`)">
                      <i class="el-icon-edit-outline" />
                    </div> -->
                    <div class="close-btn select-line-icon"
                         :title="item.invisible ? '展示' : '隐藏'"
                         @click="handleToggleOptionValue(item, 'invisible', 'el-table')"
                    >
                      <i :class="{
                        'el-icon-remove-outline': !item.invisible,
                        'el-icon-plus': item.invisible
                      }"
                      />
                    </div>
                  </div>
                </draggable>
                <div style="margin-left: 10px;">
                  <el-button
                    style="padding-bottom: 0"
                    icon="el-icon-circle-plus-outline"
                    type="text"
                    @click="addSelectItem('column')"
                  >
                    添加
                  </el-button>
                </div>
              </el-collapse-item>
              <el-collapse-item v-if="['el-table'].indexOf(activeData.tag) > -1" title="顶部操作面板" name="table-top">
                <el-form-item label="启用">
                  <el-switch v-model="activeData.topEdit.show" />
                </el-form-item>
                <!-- TODO: 导出 -->
                <div v-show="activeData.topEdit.show">
                  <el-form-item label="">
                    <UiFormItemTips
                      slot="label"
                      content="操作面板内容超过一行时，自动折叠剩余内容，并显示“展开/收起”操作按钮。"
                    >
                      多行折叠
                    </UiFormItemTips>
                    <el-switch v-model="activeData.topEdit.toggleTopBtn_allow" />
                  </el-form-item>
                  <el-form-item label="启用导出">
                    <el-switch v-model="activeData.topEdit.exportExcelBtn_allow" @change="handleToggleExportExcelBtn" />
                  </el-form-item>
                  <!-- <el-form-item label="启用设置列">
                  <el-switch v-model="activeData.topEdit.setColBtn_allow" @change="handleToggleSetColBtn" />
                </el-form-item> -->
                  <draggable
                    :list="activeData.topEdit.options"
                    :animation="340"
                    group="selectItem"
                    handle=".option-drag"
                  >
                    <div v-for="(item, index) in activeData.topEdit.options" :key="index" class="select-item">
                      <span class="select-line-icon option-drag" title="拖拽排序">
                        <i class="el-icon-s-operation" />
                      </span>
                      <el-input v-model="item.label" placeholder="按钮名称" size="small" />
                      <el-input
                        v-model="item.topbtn"
                        placeholder="按钮唯一标识"
                        size="small"
                      />
                      <div class="close-btn select-line-icon" title="编辑" @click="rowPropEdit('topEdit', index)">
                        <i class="el-icon-edit-outline" />
                      </div>
                      <!-- <div class="close-btn select-line-icon" title="编辑" @click="showEditDialog('tableBtn', activeData.topEdit.options[index], '顶部按钮属性')">
                        <i class="el-icon-edit-outline" />
                      </div> -->
                      <div class="close-btn select-line-icon" title="删除" @click="activeData.topEdit.options.splice(index, 1)">
                        <i class="el-icon-remove-outline" />
                      </div>
                    </div>
                  </draggable>
                  <div style="margin-left: 10px;">
                    <el-button
                      style="padding-bottom: 0"
                      icon="el-icon-circle-plus-outline"
                      type="text"
                      @click="addSelectItem('tableTopBtn')"
                    >
                      添加
                    </el-button>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item v-if="['el-table'].indexOf(activeData.tag) > -1" title="行尾操作列" name="table-editRow">
                <el-form-item label="启用操作列">
                  <el-switch v-model="activeData.editRow.show" />
                </el-form-item>
                <div v-show="activeData.editRow.show">
                  <el-form-item label="列标题">
                    <el-input v-model="activeData.editRow.title" placeholder="请输入列标题" />
                  </el-form-item>
                  <el-form-item label="列宽度">
                    <el-input-number v-model="activeData.editRow.width" controls-position="right" :min="1" placeholder="请输入列宽度(px)" />
                  </el-form-item>
                  <el-form-item label="列固定">
                    <el-radio-group v-model="activeData.editRow.fixed" size="medium">
                      <el-radio-button label="none">
                        无
                      </el-radio-button>
                      <el-radio-button label="left">
                        左
                      </el-radio-button>
                      <el-radio-button label="right">
                        右
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-divider>
                    行尾操作按钮
                  </el-divider>
                  <el-form-item label="按钮风格">
                    <el-select
                      v-model="activeData.editRow.buttonType"
                      placeholder="请选择风格"
                    >
                      <el-option label="文本" value="text" />
                      <el-option label="基础" value="default" />
                      <el-option label="主要" value="primary" />
                      <el-option label="次要" value="info" />
                      <el-option label="成功" value="success" />
                      <el-option label="警告" value="warning" />
                      <el-option label="危险" value="danger" />
                    </el-select>
                  </el-form-item>
                  <draggable
                    :list="activeData.editRow.options"
                    :animation="340"
                    group="selectItem"
                    handle=".option-drag"
                  >
                    <div v-for="(item, index) in activeData.editRow.options" :key="index" class="select-item">
                      <span class="select-line-icon option-drag" title="拖拽排序">
                        <i class="el-icon-s-operation" />
                      </span>
                      <el-input v-model="item.label" placeholder="按钮名称" size="small" />
                      <el-input
                        v-model="item.rowbtn"
                        placeholder="按钮唯一标识"
                        size="small"
                      />
                      <div class="close-btn select-line-icon" @click="rowPropEdit('rowEdit', index)">
                        <i class="el-icon-edit-outline" />
                      </div>
                      <!-- <div class="close-btn select-line-icon" @click="showEditDialog('tableBtn', activeData.editRow.options[index], '行操作按钮属性')">
                        <i class="el-icon-edit-outline" />
                      </div> -->
                      <div class="close-btn select-line-icon" @click="activeData.editRow.options.splice(index, 1)">
                        <i class="el-icon-remove-outline" />
                      </div>
                    </div>
                  </draggable>
                  <div style="margin-left: 10px;">
                    <el-button
                      style="padding-bottom: 0"
                      icon="el-icon-circle-plus-outline"
                      type="text"
                      @click="addSelectItem('tableRowBtn')"
                    >
                      添加行操作按钮
                    </el-button>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item v-if="activeData.pagination" title="分页" name="4">
                <el-form-item label="显示分页">
                  <el-switch v-model="activeData.pagination.show" />
                </el-form-item>
                <el-form-item v-show="activeData.pagination.show" label="可选分页数">
                  <el-input v-model="activeData.pagination.pageSizes" placeholder="可选分页数" />
                </el-form-item>
                <el-form-item v-show="activeData.pagination.show" label="默认分页数">
                  <el-select v-model="activeData.pagination.pageSize" placeholder="请输入默认分页数">
                    <el-option
                      v-for="(item, index) in activeData.pagination.pageSizes.split(',')"
                      :key="index"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item v-show="activeData.pagination.show" label="显示前往">
                  <el-switch v-model="activeData.pagination.isShowGoto" />
                </el-form-item>
              </el-collapse-item>
              <el-collapse-item v-if="['el-table'].indexOf(activeData.tag) > -1" title="页底" name="3">
                <el-form-item label="启用页底">
                  <el-switch v-model="activeData.bottomSummary.showSummary" />
                </el-form-item>
                <el-form-item v-show="activeData.bottomSummary.showSummary" label="第一列标题">
                  <el-input v-model="activeData.bottomSummary.sumText" placeholder="请输入列标题" />
                </el-form-item>
                <el-form-item v-show="activeData.bottomSummary.showSummary" label="底部行函数">
                  <el-button type="primary">
                    编辑代码
                  </el-button>
                </el-form-item>
                <draggable
                  v-show="activeData.bottomSummary.showSummary"
                  :list="activeData.bottomSummary.summaryOptions"
                  :animation="340"
                  group="selectItem"
                  handle=".option-drag"
                >
                  <div v-for="(items, indexs) in activeData.bottomSummary.summaryOptions" :key="indexs" class="select-item">
                    <span class="select-line-icon option-drag" title="拖拽排序">
                      <i class="el-icon-s-operation" />
                    </span>
                    <el-input v-model="items.label" placeholder="标题" size="small" />
                    <!-- <el-input
                      v-model="items.value"
                      placeholder="方法"
                      size="small"
                    /> -->
                    <el-select
                      v-model="items.value"
                      filterable clearable
                      placeholder="请选择方法"
                    >
                      <el-option-group v-if="customJsList.length > 0" label="自定义事件">
                        <el-option
                          v-for="(item,index) in customJsList"
                          :key="index"
                          :label="item"
                          :value="item"
                        />
                      </el-option-group>
                      <el-option-group v-if="innerJsList.length > 0" label="内置事件">
                        <el-option
                          v-for="(item,index) in innerJsList"
                          :key="index"
                          :label="item"
                          :value="item"
                        />
                      </el-option-group>
                    </el-select>
                    <div class="close-btn select-line-icon" title="删除" @click="activeData.bottomSummary.summaryOptions.splice(index, 1)">
                      <i class="el-icon-remove-outline" />
                    </div>
                  </div>
                </draggable>
                <div v-show="activeData.bottomSummary.showSummary" style="margin-left: 10px;">
                  <el-button
                    style="padding-bottom: 0"
                    icon="el-icon-circle-plus-outline"
                    type="text"
                    @click="addSummary"
                  >
                    添加
                  </el-button>
                </div>
              </el-collapse-item>
              <el-collapse-item v-if="activeData.relate" title="联动" name="7">
                <el-form-item label="主动控件">
                  <!-- 选主动控件排除自身和自己的被动控件 -->
                  <el-select v-model="activeData.relate.activeId" filterable clearable placeholder="请选择主动控件" @change="relateChange">
                    <el-option
                      v-for="(item, index) in tagComponentList.filter(item=>item.id!==activeData.vModel&&!activeData.relate.passiveOptions.find(subItem=>subItem.id===item.id))"
                      :key="index"
                      :label="item.label"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <div>
                  <el-divider>关联字段</el-divider>
                  <draggable
                    :list="activeData.relate.fieldOptions"
                    :animation="340"
                    group="selectItem"
                    handle=".option-drag"
                  >
                    <el-row v-for="(item, index) in activeData.relate.fieldOptions" :key="index" :gutter="5" class="select-item">
                      <el-col :span="2" class="select-line-icon option-drag">
                        <i class="el-icon-s-operation" />
                      </el-col>
                      <el-col :span="10">
                        <el-select v-model="item.mainField" filterable placeholder="主动控件字段" size="small">
                          <el-option
                            v-for="(subItem, idx) in activeData.relate.activeOptions"
                            :key="idx"
                            :label="subItem"
                            :value="subItem"
                          />
                        </el-select>
                      </el-col>
                      <el-col :span="10">
                        <el-select v-model="item.subField" filterable placeholder="被动控件字段" size="small">
                          <el-option
                            v-for="(subItem, idx) in activeData.searchData"
                            :key="idx"
                            :label="subItem.value"
                            :value="subItem.value"
                          />
                        </el-select>
                      </el-col>
                      <el-col :span="2" class="close-btn select-line-icon" @click="activeData.relate.fieldOptions.splice(index, 1)">
                        <i class="el-icon-remove-outline" />
                      </el-col>
                    </el-row>
                  </draggable>
                  <div style="margin-left: 10px;">
                    <el-button
                      style="padding-bottom: 0"
                      icon="el-icon-circle-plus-outline"
                      type="text"
                      @click="addSelectItem('relate')"
                    >
                      添加
                    </el-button>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item v-if="['el-table'].indexOf(activeData.tag) > -1" title="风格" name="1">
                <el-form-item label="拖拽排序">
                  <el-switch v-model="activeData.rowSort" />
                </el-form-item>
                <el-form-item v-show="activeData.rowSort" label="行排序字段">
                  <el-select v-model="activeData.sortId" placeholder="请选择行排序字段">
                    <el-option
                      v-for="(item, index) in activeData.options"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="纵向边框">
                  <el-switch v-model="activeData.border" />
                </el-form-item>
                <el-form-item label="斑马纹">
                  <el-switch v-model="activeData.stripe" />
                </el-form-item>
                <el-form-item label="列宽适应">
                  <el-switch v-model="activeData.fit" />
                </el-form-item>
                <el-form-item label="首列类型">
                  <el-radio-group v-model="activeData.columnType" size="medium">
                    <el-radio-button label="none">
                      无
                    </el-radio-button>
                    <el-radio-button label="selection">
                      多选
                    </el-radio-button>
                    <el-radio-button label="index">
                      序号
                    </el-radio-button>
                    <el-radio-button label="expand">
                      展开
                    </el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-collapse-item>
            </el-collapse>
            <!-- <el-divider /> -->
          </template>
          <template v-if="['el-breadcrumb', 'el-collapse', 'el-carousel'].indexOf(activeData.tag) > -1||['tabContainer'].indexOf(activeData.layout) > -1">
            <el-divider>选项</el-divider>
            <draggable
              :list="activeData.options"
              :animation="340"
              group="selectItem"
              handle=".option-drag"
            >
              <div v-for="(item, index) in activeData.options" :key="index" class="select-item">
                <span class="select-line-icon option-drag" title="拖拽排序">
                  <i class="el-icon-s-operation" />
                </span>
                <el-input v-model="item.label" placeholder="label" size="small" />
                <el-input
                  placeholder="值"
                  size="small"
                  :value="item.value"
                  @input="setOptionValue(item, $event, null, activeData.layout || activeData.tag)"
                />
                <div class="close-btn select-line-icon" title="删除"
                     @click="deltSelectItem(activeData.layout || activeData.tag, index)"
                >
                  <i class="el-icon-remove-outline" />
                </div>
              </div>
            </draggable>
            <div style="margin-left: 10px;">
              <el-button
                style="padding-bottom: 0"
                icon="el-icon-circle-plus-outline"
                type="text"
                @click="addSelectItem(activeData.layout || activeData.tag)"
              >
                添加
              </el-button>
            </div>
            <el-divider />
          </template>
          <el-form-item v-if="activeData.tag === 'el-input'" label="流水号">
            <el-select
              v-model="activeData.serialNumber"
              placeholder="请选择流水号"
              clearable
              @change="colorFormatChange"
            >
              <el-option
                v-for="(item, index) in sequenceNoOptions"
                :key="index"
                :label="item.seq_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.optionType !== undefined" label="选项样式">
            <el-radio-group v-model="activeData.optionType" size="medium">
              <el-radio-button label="default">
                默认
              </el-radio-button>
              <el-radio-button label="button">
                按钮
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.height !== undefined" label="高度">
            <el-input v-model="activeData.height" placeholder="高度">
              <template slot="append">
                px
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData['active-color'] !== undefined" label="开启颜色">
            <el-color-picker v-model="activeData['active-color']" show-alpha />
          </el-form-item>
          <el-form-item v-if="activeData['inactive-color'] !== undefined" label="关闭颜色">
            <el-color-picker v-model="activeData['inactive-color']" show-alpha />
          </el-form-item>

          <el-form-item v-if="activeData.showRoot !== undefined" label="显示根节点">
            <el-switch v-model="activeData.showRoot" />
          </el-form-item>
          <el-form-item v-if="activeData['allow-half'] !== undefined" label="允许半选">
            <el-switch v-model="activeData['allow-half']" />
          </el-form-item>
          <el-form-item v-if="activeData['show-text'] !== undefined" label="辅助文字">
            <el-switch v-model="activeData['show-text']" @change="rateTextChange" />
          </el-form-item>
          <el-form-item v-if="activeData['show-score'] !== undefined" label="显示分数">
            <el-switch v-model="activeData['show-score']" @change="rateScoreChange" />
          </el-form-item>
          <el-form-item v-if="activeData['show-stops'] !== undefined" label="显示间断点">
            <el-switch v-model="activeData['show-stops']" />
          </el-form-item>
          <el-form-item v-if="activeData.range !== undefined" label="范围选择">
            <el-switch v-model="activeData.range" @change="rangeChange" />
          </el-form-item>
          <el-form-item
            v-if="activeData.border !== undefined && activeData.optionType === 'default'"
            label="是否带边框"
          >
            <el-switch v-model="activeData.border" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-color-picker'" label="颜色格式">
            <el-select
              v-model="activeData['color-format']"
              placeholder="请选择颜色格式"
              @change="colorFormatChange"
            >
              <el-option
                v-for="(item, index) in colorFormatOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData['show-alpha'] !== undefined" label="显示透明度">
            <el-switch v-model="activeData['show-alpha']" />
          </el-form-item>
          <el-form-item v-if="activeData['show-word-limit'] !== undefined" label="输入统计">
            <el-switch v-model="activeData['show-word-limit']" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-input-number'" label="严格步数">
            <el-switch v-model="activeData['step-strictly']" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-cascader'" label="是否多选">
            <el-switch v-model="activeData.props.multiple" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-cascader'" label="展示全路径">
            <el-switch v-model="activeData['show-all-levels']" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-cascader'" label="可否筛选">
            <el-switch v-model="activeData.filterable" />
          </el-form-item>
          <el-form-item v-if="activeData['show-checkbox'] !== undefined" label="可选择">
            <el-switch v-model="activeData['show-checkbox']" />
          </el-form-item>
          <el-form-item v-if="activeData['default-expand-all'] !== undefined" label="默认展开">
            <el-switch v-model="activeData['default-expand-all']" />
          </el-form-item>
          <el-form-item v-if="activeData['highlight-current'] !== undefined" label="选中高亮">
            <el-switch v-model="activeData['highlight-current']" />
          </el-form-item>
          <el-form-item v-if="activeData.accordion !== undefined" label="手风琴">
            <el-switch v-model="activeData.accordion" />
          </el-form-item>
          <el-form-item v-if="activeData.autoplay !== undefined" label="自动播放">
            <el-switch v-model="activeData.autoplay" />
          </el-form-item>
          <el-form-item v-if="activeData.loop !== undefined" label="是否循环">
            <el-switch v-model="activeData.loop" />
          </el-form-item>
          <el-form-item v-if="activeData.interval !== undefined" label="间隔时间">
            <el-input v-model="activeData.interval" placeholder="请输入间隔时间（毫秒）" />
          </el-form-item>
          <el-form-item
            v-if="activeData['indicator-position'] !== undefined "
            label="指示器位置"
          >
            <el-radio-group v-model="activeData['indicator-position']" size="medium">
              <el-radio-button label="default">
                default
              </el-radio-button>
              <el-radio-button label="none">
                none
              </el-radio-button>
              <el-radio-button label="outside">
                outside
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="activeData.arrow !== undefined "
            label="箭头显示"
          >
            <el-radio-group v-model="activeData.arrow" size="medium">
              <el-radio-button label="always">
                always
              </el-radio-button>
              <el-radio-button label="hover">
                hover
              </el-radio-button>
              <el-radio-button label="never">
                never
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="activeData.direction !== undefined "
            label="展示方向"
          >
            <el-radio-group v-model="activeData.direction" size="medium">
              <el-radio-button label="horizontal">
                horizontal
              </el-radio-button>
              <el-radio-button label="vertical">
                vertical
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="activeData.model !== undefined "
            label="展示方向"
          >
            <el-radio-group v-model="activeData.model" size="medium">
              <el-radio-button label="horizontal">
                水平方向
              </el-radio-button>
              <el-radio-button label="vertical">
                垂直方向
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.displayType !== undefined" label="展示方式">
            <el-radio-group v-model="activeData.displayType" size="medium">
              <el-radio-button label="input">
                编辑框
              </el-radio-button>
              <el-radio-button label="label">
                文本
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.triggerType !== undefined" label="触发方式">
            <el-radio-group v-model="activeData.triggerType" size="medium">
              <el-radio-button label="click">
                点击
              </el-radio-button>
              <el-radio-button label="hover">
                悬停
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.draggable !== undefined" label="可拖拽">
            <el-switch v-model="activeData.draggable" />
          </el-form-item>
          <el-form-item v-if="activeData.showTip !== undefined" label="显示提示">
            <el-switch v-model="activeData.showTip" />
          </el-form-item>
          <!-- <el-form-item v-if="activeData.tag === 'el-upload'" label="多选文件">
            <el-switch v-model="activeData.multiple" />
          </el-form-item> -->
          <el-form-item v-if="activeData['show-file-list'] !== undefined" label="显示文件">
            <el-switch v-model="activeData['show-file-list']" />
          </el-form-item>
          <el-form-item v-if="activeData['auto-upload'] !== undefined" label="自动上传">
            <el-switch v-model="activeData['auto-upload']" />
          </el-form-item>
          <el-form-item v-if="activeData.isDebounce !== undefined" label="是否防抖">
            <el-switch v-model="activeData.isDebounce" />
          </el-form-item>
          <el-form-item v-if="activeData.readonly !== undefined" label="是否只读">
            <el-switch v-model="activeData.readonly" />
          </el-form-item>
          <el-form-item v-if="activeData.disabled !== undefined" label="是否禁用">
            <el-switch v-model="activeData.disabled" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-button' || activeData.tag === 'el-table'">
            <UiFormItemTips
              slot="label"
              content="执行请求等异步方法时，是否锁定当前页面。"
            >
              锁定页面
            </UiFormItemTips>
            <el-switch v-model="activeData.isLockPage" />
          </el-form-item>
          <!-- <FlagAttrBlock
            v-if="activeData.readonly !== undefined"
            label="只读"
            :value.sync="activeData.readonly"
            :fn-body.sync="activeData.readonly_fnBody"
            :use-select="false"
            fn-tips="自定义函数返回真值时只读，否则可用。<br>可以通过 this.formData.[组件字段名] 获取数据。"
            fn-pre-str="function(){"
            fn-after-str="}"
          />
          <FlagAttrBlock
            v-if="activeData.disabled !== undefined"
            label="禁用"
            :value.sync="activeData.disabled"
            :fn-body.sync="activeData.disabled_fnBody"
            :use-select="false"
            fn-tips="自定义函数返回真值时禁用，否则可用。<br>可以通过 this.formData.[组件字段名] 获取数据。"
            fn-pre-str="function(){"
            fn-after-str="}"
          /> -->
          <el-form-item v-if="activeData.required !== undefined" label="是否必填">
            <el-switch v-model="activeData.required" />
          </el-form-item>
          <el-form-item v-if="activeData.tagIcon === 'password'" label="是否加密">
            <el-switch v-model="activeData.needEncrypt" />
          </el-form-item>
          <el-form-item v-if="activeData.clearable !== undefined" label="能否清空">
            <el-switch v-model="activeData.clearable" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'ui-icon-picker'" label="是否可输入">
            <el-switch v-model="activeData.enableInput" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-select'" label="是否可搜索">
            <el-switch v-model="activeData.filterable" />
          </el-form-item>
          <!-- <el-form-item v-if="activeData.tag === 'el-select'" label="是否多选">
            <el-switch v-model="activeData.multiple" @change="multipleChange" />
          </el-form-item> -->
          <template v-if="activeData.layoutTree">
            <el-divider>布局结构树</el-divider>
            <el-tree
              :data="[activeData]"
              :props="layoutTreeProps"
              node-key="renderKey"
              default-expand-all
              draggable
            >
              <span slot-scope="{ node, data }">
                <span class="node-label">
                  <svg-icon class="node-icon" :icon-class="data.tagIcon" />
                  {{ node.label }}
                </span>
              </span>
            </el-tree>
          </template>
          <el-form-item v-if="activeData.type==='import'"
                        label="导入关联"
          >
            <el-select v-model="activeData.relateData" filterable clearable placeholder="请选择导入关联">
              <el-option
                v-for="(item, index) in tagComponentList.filter(item=>item.id!==activeData.vModel)"
                :key="index"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <template v-if="activeData.event||activeData.$click!==undefined||activeData.$callback!==undefined">
            <el-collapse class="with-padding">
              <el-collapse-item title="事件" name="collapse-event">
                <el-form-item
                  v-if="activeData.tag==='el-button'"
                  label="原生类型"
                >
                  <el-select
                    v-model="activeData.nativeType"
                    placeholder="请选择原生类型"
                  >
                    <el-option label="button" value="button" />
                    <el-option label="submit" value="submit" />
                    <el-option label="reset" value="reset" />
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-for="eventName in Object.keys(activeData.event||{})"
                  :key="eventName"
                  :label="eventName"
                >
                  <el-select
                    v-model="activeData.event[eventName]"
                    filterable clearable
                    placeholder="请选择事件"
                  >
                    <el-option-group v-if="customJsList.length > 0" label="自定义事件">
                      <el-option
                        v-for="(item,index) in customJsList"
                        :key="index"
                        :label="item"
                        :value="item"
                      />
                    </el-option-group>
                    <el-option-group v-if="innerJsList.length > 0" label="内置事件">
                      <el-option
                        v-for="(item,index) in innerJsList"
                        :key="index"
                        :label="item"
                        :value="item"
                      />
                    </el-option-group>
                  </el-select>
                </el-form-item>
                <!-- TODO: EventBlock -->
                <SelectEvent
                  v-if="activeData.$click !== undefined"
                  label="点击事件"
                  fn-type="$click"
                  :fn-name="activeData.$click"
                  :active-data="activeData" :custom-js-list="customJsList" :inner-js-list="innerJsList"
                  @updateParentData="updateParentData"
                />
                <SelectEvent
                  v-if="activeData.$callback !== undefined"
                  label="回调事件"
                  fn-type="$callback"
                  :fn-name="activeData.$callback"
                  :active-data="activeData" :custom-js-list="customJsList" :inner-js-list="innerJsList"
                  @updateParentData="updateParentData"
                />
              </el-collapse-item>
            </el-collapse>
          </template>


          <template v-if="activeData.layout === 'colFormItem'&&activeData.tag!=='el-button'">
            <el-divider>正则校验</el-divider>
            <div
              v-for="(item, index) in activeData.regList"
              :key="index"
              class="reg-item"
            >
              <span class="close-btn" @click="activeData.regList.splice(index, 1)">
                <i class="el-icon-close" />
              </span>
              <el-form-item label="表达式">
                <el-input v-model="item.pattern" placeholder="请输入正则" />
              </el-form-item>
              <el-form-item label="错误提示" style="margin-bottom:0">
                <el-input v-model="item.message" placeholder="请输入错误提示" />
              </el-form-item>
            </div>
            <div style="margin-left: 10px">
              <el-button icon="el-icon-circle-plus-outline" type="text" @click="addReg">
                添加规则
              </el-button>
            </div>
          </template>
        </el-form>
        <!-- 页面属性 -->
        <!-- <el-form v-show="currentTab === 'form'" size="small" label-width="90px">
          <el-form-item label="页面名">
            <el-input v-model="formConf.formRef" placeholder="请输入页面名（ref）" />
          </el-form-item>
          <el-form-item label="页面模型">
            <el-input v-model="formConf.formModel" placeholder="请输入页面模型" />
          </el-form-item>
          <el-form-item label="校验模型">
            <el-input v-model="formConf.formRules" placeholder="请输入校验模型" />
          </el-form-item>
          <el-form-item label="页面尺寸">
            <el-radio-group v-model="formConf.size" size="medium">
              <el-radio-button label="large">
                大
              </el-radio-button>
              <el-radio-button label="medium">
                中
              </el-radio-button>
              <el-radio-button label="small">
                小
              </el-radio-button>
              <el-radio-button label="mini">
                迷你
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="标签对齐">
            <el-radio-group v-model="formConf.labelPosition" size="medium">
              <el-radio-button label="left">
                左
              </el-radio-button>
              <el-radio-button label="right">
                右
              </el-radio-button>
              <el-radio-button label="top">
                顶部
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="标签宽度">
            <el-input-number v-model="formConf.labelWidth" placeholder="标签宽度" />
          </el-form-item>
          <el-form-item label="栅格间隔">
            <el-input-number v-model="formConf.gutter" :min="0" placeholder="栅格间隔" />
          </el-form-item>
          <el-form-item label="禁用表单">
            <el-switch v-model="formConf.disabled" />
          </el-form-item>
          <el-form-item label="页面按钮">
            <el-switch v-model="formConf.formBtns" />
          </el-form-item>
          <el-form-item label="显示未选中组件边框">
            <el-switch v-model="formConf.unFocusedComponentBorder" />
          </el-form-item>
          <el-form-item label="Enter键切换">
            <el-switch v-model="formConf.enterToTab" />
          </el-form-item>
          <el-form-item label="钩子函数类型">
            <el-select v-model="formConf.hookFnType" clearable placeholder="钩子函数类型">
              <el-option label="beforeCreate" value="beforeCreate" />
              <el-option label="created" value="created" />
              <el-option label="beforeMount" value="beforeMount" />
              <el-option label="mounted" value="mounted" />
              <el-option label="beforeUpdate" value="beforeUpdate" />
              <el-option label="updated" value="updated" />
              <el-option label="beforeDestroy" value="beforeDestroy" />
              <el-option label="destroyed" value="destroyed" />
            </el-select>
          </el-form-item>
          <el-form-item label="钩子函数">
            <el-select
              v-model="formConf.hookFn"
              filterable clearable
              placeholder="请选择钩子函数"
            >
              <el-option-group v-if="customJsList.length > 0" label="自定义事件">
                <el-option
                  v-for="(item,index) in customJsList"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-option-group>
              <el-option-group v-if="innerJsList.length > 0" label="内置事件">
                <el-option
                  v-for="(item,index) in innerJsList"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-option-group>
            </el-select>
          </el-form-item>
        </el-form> -->
      </el-scrollbar>
    </div>

    <icon-picker-dialog :visible.sync="iconsVisible" :current="activeData[currentIconModel]" @chooseMdiIcon="selectIcon" />
    <edit-dialog
      class="edit-dialog"
      :visible.sync="editVisible"
      :edit-dialog-obj.sync="editDialogObj"
      :active-data="activeData"
      :title="columnTitle"
      :custom-js-list="customJsList"
      :inner-js-list="innerJsList"
    />
    <!-- <EditDialogWarper
      v-if="dialogVisible['tableSearchForm']"
      :visible.sync="dialogVisible['tableSearchForm']"
      :title="dialogTitle"
    >
      <div>
        dialogObj: {{ dialogObj }}
        <WidgetPnl v-model="dialogObj" />
      </div>
    </EditDialogWarper> -->
    <!-- TODO: activeData\customJsList 存入 store，innerJsList 单独管理 -->
    <!-- <EditTableBtnDialog
      v-if="dialogVisible['tableBtn']"
      :visible.sync="dialogVisible['tableBtn']"
      :title="dialogTitle"
      :dialog-obj.sync="dialogObj"
      :active-data="activeData" :custom-js-list="customJsList" :inner-js-list="innerJsList"
      /> -->
    <!-- <EditTableColDialog
      :visible.sync="dialogVisible['tableCol']"
      :title="dialogTitle"
      :dialog-obj.sync="dialogObj"
      :active-data="activeData" :custom-js-list="customJsList" :inner-js-list="innerJsList"
      /> -->
  </div>
</template>

<script>
import ComboTree from '@/components/ComboTree/index'
import IconPickerDialog from '@/components/IconPickerDialog/Index'
import Datasource from '@/components/Attributes/collapse/Datasource/Index'
// import FlagAttrBlock from './EventPanel/FlagAttrBlock'
import BasicUpload from '@/components/Attributes/basic/Upload'

import EditDialog from './EditDialog'
// import EditDialogWarper from './EditDialog/EditDialogWarper'
// import WidgetPnl from './EditDialog/WidgetPnl'
// import EditTableBtnDialog from './EditDialog/TableBtnDialog'
// import EditTableColDialog from './EditDialog/TableColDialog'
import SelectEvent from './EventPanel/SelectEvent'

import {
  isEmpty, isNumberStr
} from '@/utils/index'
import {
  basicComponents, layoutComponents, optionComponentList
} from '@/components/generator/config'
import {
  tabContainerRow
} from '@/components/generator/config/layout/tabContainer'
import {
  defaultColOption,
  defaultTableRowBtn,
  defaultTableTopBtn,
  defaultTableExportBtn,
  defaultTableSetColBtn
} from '@/components/generator/config/basic/el-table'
import {
  getTableExportBtnDs,
  getTableSetColBtn
} from '@/components/generator/autoGenerate/methods-table'
import { getFirstRow, getChildItem, getChildIndex } from '@/components/generator/configOperator'
import {
  getInitParams
} from '@/components/generator/autoGenerate/methods'
import { saveFormConf } from '@/utils/db'

const dateTimeFormat = {
  date: 'yyyy-MM-dd',
  week: 'yyyy 第 WW 周',
  month: 'yyyy-MM',
  year: 'yyyy',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  monthrange: 'yyyy-MM',
  datetimerange: 'yyyy-MM-dd HH:mm:ss'
}

export default {
  components: {
    ComboTree,
    IconPickerDialog,
    BasicUpload,
    'attr-datasource': Datasource,
    EditDialog,
    // EditDialogWarper,
    // WidgetPnl,
    // EditTableBtnDialog,
    // EditTableColDialog,
    SelectEvent
    // FlagAttrBlock
  },
  props: ['showField', 'activeData', 'tagComponentList', 'formConf', 'customJsList', 'innerJsList'],
  data() {
    return {
      currentTab: 'field',
      iconsVisible: false,
      currentIconModel: null,
      optionComponentList,
      dateTypeOptions: [
        {
          label: '日(date)',
          value: 'date'
        },
        {
          label: '周(week)',
          value: 'week'
        },
        {
          label: '月(month)',
          value: 'month'
        },
        {
          label: '年(year)',
          value: 'year'
        },
        {
          label: '日期时间(datetime)',
          value: 'datetime'
        }
      ],
      dateRangeTypeOptions: [
        {
          label: '日期范围(daterange)',
          value: 'daterange'
        },
        {
          label: '月范围(monthrange)',
          value: 'monthrange'
        },
        {
          label: '日期时间范围(datetimerange)',
          value: 'datetimerange'
        }
      ],
      colorFormatOptions: [
        {
          label: 'hex',
          value: 'hex'
        },
        {
          label: 'rgb',
          value: 'rgb'
        },
        {
          label: 'rgba',
          value: 'rgba'
        },
        {
          label: 'hsv',
          value: 'hsv'
        },
        {
          label: 'hsl',
          value: 'hsl'
        }
      ],
      justifyOptions: [
        {
          label: 'start',
          value: 'start'
        },
        {
          label: 'end',
          value: 'end'
        },
        {
          label: 'center',
          value: 'center'
        },
        {
          label: 'space-around',
          value: 'space-around'
        },
        {
          label: 'space-between',
          value: 'space-between'
        }
      ],
      layoutTreeProps: {
        label(data, node) {
          return data.componentName || `${data.label}: ${data.vModel}`
        }
      },
      // 编辑弹窗
      editVisible: false,
      columnTitle: '',
      editDialogObj: { // 传递到右侧隐藏栏的数据
        option: {},
        type: ''
      },
      dialogVisible: {},
      dialogTitle: '',
      dialogObj: {},
      sequenceNoOptions: [], // 流水号下拉数据
      fileList: [], // 上传的图片文件
      systemUrlTree: [], // 页面树列表数据
      oldComponentName: '' // 记录旧的组件字段名称
    }
  },

  computed: {
    documentLink() {
      return (
        this.activeData.document
      || 'https://element.eleme.cn/#/zh-CN/component/installation'
      )
    },
    dateOptions() {
      if (
        this.activeData.type !== undefined
      && this.activeData.tag === 'el-date-picker'
      ) {
        if (this.activeData['start-placeholder'] === undefined) {
          return this.dateTypeOptions
        }
        return this.dateRangeTypeOptions
      }
      return []
    },
    tagList() {
      return [
        {
          label: '基础组件',
          options: basicComponents
        }
      ]
    },
    isListPicker() {
      return this.activeData.tag === 'listPicker'
    }
  },
  watch: {
    formConf: {
      handler(val) {
        saveFormConf(val)
      },
      deep: true
    },
    // 监听当前选中组件，判断容器是否为初始状态，自动为布局容器填充内容
    activeData: {
      handler(activeData) {
      // 主页模板获取页面树数据
        if (['uiMainV1', 'uiMainV2'].indexOf(activeData.layout) > -1 && this.systemUrlTree.length === 0) {
          this.getPageTreeData()
        }
      }
    },
    'editDialogObj.option': {
      handler(option) {
        const { type, index } = this.editDialogObj || {}
        switch (type) {
          case 'topEdit':
            this.$set(this.activeData.topEdit.options, index, option)
            break
          case 'rowEdit':
            this.$set(this.activeData.editRow.options, index, option)
            break
          case 'column':
            this.$set(this.activeData.options, index, option)
            break
          default:
        }
      }
    }
  },
  mounted() {
    saveFormConf(this.formConf)

    // 获取流水号下拉数据
    this.$server.executeSqls('1270224820225093633').then(res => {
      this.sequenceNoOptions = res
    })
  },
  methods: {
    /**
      * 更新 activeData 数据
      */
    updateParentData(key, value) {
      this.$set(this.activeData, key, value)
    },

    // 此处记录旧的组件字段名
    setOldComponentName() {
      this.oldComponentName = this.activeData.vModel
    },
    // 组件属性中的字段名修改 则optionParams和联动属性中的字段名
    changeComponentName(val) {
      if (!this.activeData.dataSource) {
        return
      }
      const oldVal = this.oldComponentName
      const targetObj = this.activeData.dataSource.optionParams
      Object.keys(targetObj).forEach(key => {
        if (key.indexOf(oldVal) > -1) {
          targetObj[key.replace(oldVal, val)] = targetObj[key]
          delete targetObj[key]
        }
      })

      // 重置tagComponentList
      // WARN: 不要修改props！！
      const targetDom = {}
      this.tagComponentList.forEach(item => {
        if (item.id === oldVal) { // 作为主动控件 修改所有对应被动控件的记录
          item.label.replace(item.id, val)
          item.id = val
          item.target.relate.passiveOptions.forEach(option => {
            this.tagComponentList.forEach(subItem => {
              if (subItem.id === option.id) {
                subItem.target.relate.activeId = val
              }
            })
          })
        }
        if (this.activeData.relate.activeId === item.id) { // 找到其作为被动控件对应的主动控件 修改记录的字段名
          item.target.relate.passiveOptions.forEach(option => {
            if (oldVal === option.id) {
              option.id = val
            }
          })
        }
      })
    },
    // 请求页面树数据
    getPageTreeData() {
      const sqlId = '1264753294889603073'
      this.$server.executeSqls(sqlId, {}).then(res => {
        this.systemUrlTree = res
      }).catch(err => {
        this.systemUrlTree = []
      })
    },
    // 选择联动主动控件
    relateChange(val) {
      // WARN: tagComponentList 在大多数情况下不会更新，数据不准确

      this.activeData.relate.fieldOptions = []
      this.activeData.relate.activeOptions = []
      const passiveId = this.activeData.vModel || this.activeData.componentName
      const passiveType = this.activeData.tagIcon
      // 查找上次选的主动控件 并从其passiveIdOptions中剔除
      for (let i = 0; i < this.tagComponentList.length; i++) {
        const passiveData = this.tagComponentList[i].target.relate.passiveOptions
        let hasBool = false
        for (let j = 0; j < passiveData.length; j++) {
          if (passiveData[j].id === passiveId) {
            passiveData.splice(j, 1)
            hasBool = true
            break
          }
        }
        if (hasBool) {
          break
        }
      }
      // 关联数据添加
      if (val) {
        const activeCom = this.tagComponentList.find(item => item.id === val)
        const { target } = activeCom
        target.relate.passiveOptions.push({
          id: passiveId, // 被动控件的id
          type: passiveType, // 被动控件的类型
          selfType: target.tagIcon // 主动控件自身的类型
        })
        this.activeData.relate.fieldOptions = [{ mainField: '', subField: '' }]
        if (target.tag === 'el-table') { // 主动控件为表格
          this.activeData.relate.activeOptions = target.options.map(item => item.value)
        } else if (target.tag === 'el-tree') { // 树形选择控件
          const fieldsList = []
          if (target.data.length > 0) {
            Object.keys(target.data[0]).forEach(key => { if (key !== 'children') { fieldsList.push(key) } })
          } else {
            fieldsList.push('id')
          }
          this.activeData.relate.activeOptions = fieldsList
        } else { // 其他主动控件控件 默认为id
          this.activeData.relate.activeOptions = [target.valueKey || 'id']
        }
      }
    },
    addReg() {
      this.activeData.regList.push({
        pattern: '',
        message: ''
      })
    },
    addSelectItem(type) {
      switch (type) {
        case 'column': // 表格列
          this.activeData.options.push({
            ...defaultColOption
          })
          break
        case 'tableTopBtn': // 表格顶部操作按钮
          this.activeData.topEdit.options.push({
            ...defaultTableTopBtn
          })
          break
        case 'tableRowBtn': // 表格行内操作按钮
          this.activeData.editRow.options.push({
            ...defaultTableRowBtn
          })
          break
        case 'relate': // 关联
          this.activeData.relate.fieldOptions.push({ mainField: '', subField: '' })
          break
        case 'tabContainer': // 选项卡
          // eslint-disable-next-line no-case-declarations
          const tabValue = this.activeData.options.length + 1
          this.$emit('addComponent', {
            ...tabContainerRow,
            tabValue
          }, {
            parentId: this.activeData.formId,
            needSetActive: false
          })
          // NOTE: 同 default 方法
          this.activeData.options.push({
            label: `选项${tabValue}`,
            value: tabValue
          })
          break
        default:
          this.activeData.options.push({
            label: '新选项',
            value: ''
          })
          break
      }
    },

    deltSelectItem(type, index) {
      switch (type) {
        case 'tabContainer': // 选项卡
          this.activeData.children.splice(index, 1)
          this.activeData.options.splice(index, 1)
          break
        default:
          this.activeData.options.splice(index, 1)
          break
      }
    },

    // 修改options数组中的value的值
    setOptionValue(item, val, type, layout) {
      const typeKey = type || 'value'
      const oldVal = isNumberStr(item[typeKey]) ? `${item[typeKey]}` : item[typeKey]
      const typeVal = isNumberStr(val) ? `${val}` : val
      // 更新数据
      this.$set(item, typeKey, typeVal)

      // 设置初始请求参数
      const initParams = getInitParams(this.activeData, this.activeData.initDataOptions)
      if (initParams) {
        const {
          initFetchKey,
          initFetchParam
        } = initParams
        this.$set(this.activeData.dataSource.optionParams, initFetchKey, initFetchParam)
      }

      // 处理特殊组件
      if (layout === 'tabContainer') {
        // eslint-disable-next-line eqeqeq
        const children = this.activeData.children.find(cItem => cItem.tabValue == oldVal)
        if (children) {
          this.$set(children, 'tabValue', val)
        }
      }
    },

    // 表格：添加搜索条件
    addTableSearchFormItem() {
      this.activeData.searchData.push({
        isCustom: true, // 是否为用户自定义条件
        label: '', // 标签名
        value: '', // 字段名
        inputVal: '', // 初始值
        widgetCode: '1' // 组件类型。默认使用单行输入
      })
    },

    // 切换隐藏/展示状态：表格列、表格查询条件
    handleToggleOptionValue(item, key, componentType) {
      if (!item || !key) { return }
      this.setOptionValue(item, !item[key], key, componentType)
    },
    // 表格：添加顶部导出按钮
    handleToggleExportExcelBtn(isShow) {
      const { activeData } = this
      const topRow = getChildItem(activeData, 'topRow')
      if (!topRow) {
        console.warn('添加顶部导出按钮失败！缺少顶部行容器', activeData)
        return
      }
      // NOTE: 不能用 setChildByKey 赋值。数据不能双向绑定。
      let btnIndex = getChildIndex(topRow, 'exportExcelBtn')
      if (btnIndex < 0 && !isShow) {
        return
      }
      let btnInfo
      if (btnIndex < 0) {
        btnIndex = topRow.children.length
        const dsInfo = getTableExportBtnDs(activeData, activeData.searchData)
        btnInfo = {
          ...defaultTableExportBtn,
          ...dsInfo,
          dataSource: {
            ...defaultTableExportBtn.dataSource,
            ...dsInfo.dataSource
          }
        }
      } else {
        btnInfo = topRow.children[btnIndex]
      }
      btnInfo._parentFieldId = activeData.vModel
      btnInfo.nonuse = !isShow
      this.$set(topRow.children, btnIndex, btnInfo)
    },
    // 表格：添加顶部设置列按钮
    handleToggleSetColBtn(isShow) {
      // TODO: 设置列
    },
    // 表格：添加合计项
    addSummary() {
      this.activeData.bottomSummary.summaryOptions.push({
        value: '',
        label: ''
      })
    },

    // 显示右侧隐藏栏
    rowPropEdit(type, index) {
      let options = []
      switch (type) {
        case 'topEdit':
          options = this.activeData.topEdit.options
          break
        case 'rowEdit':
          options = this.activeData.editRow.options
          break
        case 'column':
          options = this.activeData.options
          break
        default:
      }
      this.editVisible = true
      this.editDialogObj = {
        type,
        index,
        option: options[index]
      }
      this.columnTitle = `${options[index]?.label}`
    },
    // 显示右侧编辑弹窗
    showEditDialog(type, data, title) {
      this.dialogTitle = title
      this.dialogObj = data
      this.dialogVisible = {
        [type]: true
      }
    },

    setDefaultValue(val) {
      if (Array.isArray(val)) {
        return JSON.stringify(val)
      }
      // if (['string', 'number'].indexOf(val) > -1) {
      //   return val
      // }
      if (typeof val === 'boolean') {
        return `${val}`
      }
      return val
    },
    onDefaultValueInput(str) {
      let val = str
      if (Array.isArray(this.activeData.defaultValue) // 数组
      || ['true', 'false'].indexOf(str) > -1 // 布尔
      ) {
        try {
          val = JSON.parse(str)
        } catch (error) {
          val = str
        }
      } else { // 字符串和数字
        val = isNumberStr(str) ? +str : str
      }
      this.$set(this.activeData, 'defaultValue', val)
    },
    onSwitchValueInput(val, name) {
      if (['true', 'false'].indexOf(val) > -1) {
        this.$set(this.activeData, name, JSON.parse(val))
      } else {
        this.$set(this.activeData, name, isNumberStr(val) ? +val : val)
      }
    },
    setTimeValue(val, type) {
      const valueFormat = type === 'week' ? dateTimeFormat.date : val
      this.$set(this.activeData, 'defaultValue', null)
      this.$set(this.activeData, 'value-format', valueFormat)
      this.$set(this.activeData, 'format', val)
    },
    // spanChange(val) {
    //   this.formConf.span = val
    // },
    multipleChange(val) {
      this.$set(this.activeData, 'defaultValue', val ? [] : '')
    },
    dateTypeChange(val) {
      this.setTimeValue(dateTimeFormat[val], val)
    },
    rangeChange(val) {
      this.$set(
        this.activeData,
        'defaultValue',
        val ? [this.activeData.min, this.activeData.max] : this.activeData.min
      )
    },
    rateTextChange(val) {
      if (val) this.activeData['show-score'] = false
    },
    rateScoreChange(val) {
      if (val) this.activeData['show-text'] = false
    },
    colorFormatChange(val) {
      this.activeData.defaultValue = null
      this.activeData['show-alpha'] = val.indexOf('a') > -1
      this.activeData.renderKey = +new Date() // 更新renderKey,重新渲染该组件
    },
    openIconsDialog(model) {
      this.iconsVisible = true
      this.currentIconModel = model
    },
    setIcon(val) {
      this.activeData[this.currentIconModel] = val
    },
    // 弹窗从图标库中点击选择图标
    selectIcon(iconName) {
      this.activeData[this.currentIconModel] = iconName
      if (this.activeData.tag === 'ui-icon-picker' || this.activeData.tag === 'ui-icon') {
        this.activeData.defaultValue = iconName
      }
      this.iconsVisible = false
    },
    // 切换标签
    tagChange(tagIcon) {
      // WARN: 以标签图标作为唯一识别
      this.$emit('tag-change', tagIcon)
    },
    // 默认值类型切换
    defaultValueTypeChange(val) {
      if (val === 'selectFirst') {
        this.activeData.defaultValue = this.activeData.options.length ? this.activeData.options[0].value : ''
      } else if (val === '') {
        this.activeData.defaultValue = undefined
      }
    }

  }
}
</script>

<style lang="scss">
  // 支持 FlagAttrBlock 样式
  // @import "./EditDialog/style";
</style>
