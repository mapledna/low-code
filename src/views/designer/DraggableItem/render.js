import { makeMap, titleCase } from '@/utils/index'
import UiMenu from '@/components/UiMenu/Index.vue'
import ComboTree from '@/components/ComboTree'
import CodeEditor from '@/components/CodeEditor'
import UiIcon from '@/components/UiIcon'
import UiIconPicker from '@/components/UiIconPicker'
// import FormItemText from '@components/UiForm/FormItemText'


// 参考https://github.com/vuejs/vue/blob/v2.6.10/src/platforms/web/server/util.js
// 绑定到一级标签上的属性
const isAttr = makeMap(
  'accept,accept-charset,accesskey,action,align,alt,async,autocomplete,'
  + 'autofocus,autoplay,autosave,bgcolor,border,buffered,challenge,charset,'
  + 'checked,cite,class,code,codebase,color,cols,colspan,content,http-equiv,'
  + 'name,contenteditable,contextmenu,controls,coords,data,datetime,default,'
  + 'defer,dir,dirname,disabled,download,draggable,dropzone,enctype,method,for,'
  + 'form,formaction,headers,height,hidden,high,href,hreflang,http-equiv,'
  + 'icon,id,ismap,itemprop,keytype,kind,label,lang,language,list,loop,low,'
  + 'manifest,max,maxlength,media,method,GET,POST,min,multiple,email,file,'
  + 'muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,'
  + 'preload,radiogroup,readonly,rel,required,reversed,rows,rowspan,sandbox,'
  + 'scope,scoped,seamless,selected,shape,size,type,text,password,sizes,span,'
  + 'spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,'
  + 'target,title,type,usemap,value,width,wrap,model'
  + 'frameborder'
)

// 数据双向绑定  默认为字符串类型
function vModel(self, dataObject, defaultValue) {
  dataObject.props.value = defaultValue?.toString()
  dataObject.on.input = val => self.$emit('input', val.toString())
}

// 为modelvalue赋值  或者将组建内的modelvalue改为value 使用上面的vModel 在配置页面进行默认值的赋值
function modelValue(dataObject, defaultValue) {
  dataObject.props.modelValue = defaultValue?.toString()
}


// 子组件、内容部分
const componentChild = {
  'el-input': {
    prepend(h, conf, key) {
      return <template slot="prepend">{conf[key]}</template>
    },
    append(h, conf, key) {
      return <template slot="append">{conf[key]}</template>
    }
  },
  'el-button': {
    defaultValue(h, conf, key) {
      const list = []
      if (conf['prefix-icon']) {
        list.push(<i class={conf['prefix-icon']}></i>)
      }
      list.push(<i style={conf['prefix-icon'] && conf.defaultValue ? { marginLeft: '5px', fontStyle: 'normal' } : { fontStyle: 'normal' }}>{conf.defaultValue}</i>)
      if (conf['suffix-icon']) {
        list.push(<i class={`${conf['suffix-icon']} el-icon--right`} ></i>)
      }
      return list
    },
    'prefix-icon': (h, conf, key) => {
      if (conf.defaultValue) return null
      return <i class={conf['prefix-icon']}></i>
    }

  },
  p: {
    content(h, conf, key) {
      return <span >{conf.content}</span>
    }
  },
  'el-divider': {
    content(h, conf, key) {
      return conf.content
    }
  },
  'el-link': {
    content(h, conf, key) {
      return conf.content
    }
  },
  'el-breadcrumb': {
    options(h, conf, key) {
      const list = []
      conf.options.forEach(item => {
        list.push(<el-breadcrumb-item to={{ path: item.value }}>{item.label}</el-breadcrumb-item>)
      })
      return list
    }
  },
  'el-collapse': {
    options(h, conf, key) {
      const list = []
      conf.options.forEach(item => {
        list.push(<el-collapse-item title={item.label} name={item.value}>{item.label}</el-collapse-item>)
      })
      return list
    }
  },
  'el-carousel': {
    options(h, conf, key) {
      const list = []
      conf.options.forEach(item => {
        list.push(<el-carousel-item><el-image src={item.value}></el-image></el-carousel-item>)
      })
      return list
    }
  },
  'el-select': {
    options(h, conf, key) {
      const list = []
      conf.options.forEach(item => {
        list.push(<el-option label={item.label} value={item.value} disabled={item.disabled}></el-option>)
      })
      return list
    }
  },
  'el-radio-group': {
    options(h, conf, key) {
      const list = []
      conf.options.forEach(item => {
        if (conf.optionType === 'button') list.push(<el-radio-button label={item.value}>{item.label}</el-radio-button>)
        else list.push(<el-radio label={item.value} border={conf.border}>{item.label}</el-radio>)
      })
      return list
    }
  },
  'el-checkbox-group': {
    options(h, conf, key) {
      const list = []
      conf.options.forEach(item => {
        if (conf.optionType === 'button') {
          list.push(<el-checkbox-button label={item.value}>{item.label}</el-checkbox-button>)
        } else {
          list.push(<el-checkbox label={item.value} border={conf.border}>{item.label}</el-checkbox>)
        }
      })
      return list
    }
  },
  'el-upload': {
    'list-type': (h, conf, key) => {
      const list = []
      if (conf['list-type'] === 'picture-card') {
        list.push(<i class="el-icon-plus"></i>)
      } else {
        list.push(<el-button size="small" type="primary" icon="el-icon-upload">{conf.buttonText}</el-button>)
      }
      if (conf.showTip) {
        list.push(<span slot="tip" class="el-upload__tip">只能上传不超过 {conf.fileSize}{conf.sizeUnit} 的 {conf.accept} 文件</span>)
      }
      return list
    }
  }
}

export default {
  render(h) {
    const confClone = JSON.parse(JSON.stringify(this.conf))
    if (confClone.nonuse) {
      return null
    }

    const dataObject = {
      attrs: {},
      props: {},
      on: {},
      style: {}
    }
    const children = [...Object.values(this.$slots)]
    // 通过配置生成 $slots。例如，select 的 option
    const childObjs = componentChild[confClone.tag]
    if (childObjs) {
      Object.keys(childObjs).forEach(key => {
        const childRender = childObjs[key]
        if (confClone[key]) {
          children.push(childRender(h, confClone, key))
        }
      })
    }
    Object.keys(confClone).forEach(key => {
      const val = confClone[key]
      if (dataObject[key]) {
        dataObject[key] = val
      } else if (key === 'vModel') { // v-model
        vModel(this, dataObject, confClone.defaultValue)
      } else if (key === 'modelValue') { // modelValue在配置界面使用默认值
        modelValue(dataObject, confClone.defaultValue)
      } else if (isAttr(key)) { // 普通的 HTML attribute
        dataObject.attrs[key] = val
      } else {
        dataObject.props[key] = val
      }
    })

    // tag 标签映射
    let { tag } = confClone
    if (['formItemText', 'listPicker'].indexOf(tag) >= 0) {
      tag = `Ui${titleCase(tag)}`
    }

    return h(tag, dataObject, children)
  },
  props: ['conf'],
  components: {
    UiMenu,
    ComboTree,
    CodeEditor,
    UiIcon,
    UiIconPicker
    // FormItemText
  }
}
