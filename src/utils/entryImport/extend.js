import Vue from 'vue'

// 通用组件
import UiForm from '@/components/UiForm/install'
import UiListPicker from '@/components/UiListPicker/install'
import UiMenu from '@/components/UiMenu/install'
import ComboTree from '@/components/ComboTree/install'
import CodeEditor from '@/components/CodeEditor/install'
import RichtextEditor from '@/components/RichtextEditor/install'
import UiIcon from '@/components/UiIcon/install'
import UiIconPicker from '@/components/UiIconPicker/install'
import Progress from '@/components/progress/install'
import UiLoading from '@/components/loading/install'

// 重构组件
import attrComponents from '@/components/UiLibs'

// 登录页、首页、主页
// import UiLoginPage from '@/components/UiLoginPage/install'
// import UiLoginPageV2 from '@/components/loginTemplate/chinaTobacco/install'
// import UiMainV1 from '@/components/UiMainV1/install'
// import UiMainV2 from '@/components/UiMainV2/install'
// import UiMobileMain from '@/components/UiMobileMain/install'

Vue.use(UiForm)
Vue.use(UiListPicker)
Vue.use(UiMenu)
Vue.use(ComboTree)
Vue.use(CodeEditor)
Vue.use(RichtextEditor)
Vue.use(UiIcon)
Vue.use(UiIconPicker)
Vue.use(Progress)
Vue.use(UiLoading)

Vue.use(attrComponents)

// Vue.use(UiLoginPage)
// Vue.use(UiLoginPageV2)
// Vue.use(UiMainV1)
// Vue.use(UiMainV2)
// Vue.use(UiMobileMain)
