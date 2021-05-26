<template>
  <div>
    <el-form-item label="链接地址">
      <el-radio-group
        v-model="_actionType"
        size="medium"
        class="form-item-btm"
      >
        <el-radio-button label="pageId">
          选择页面
        </el-radio-button>
        <el-radio-button label="customUrl">
          自定义链接
        </el-radio-button>
      </el-radio-group>
      <combo-tree
        v-show="_actionType === 'pageId'"
        v-model="_pageId"
        value-key="id_code"
        :data="systemPageList"
        :width="'245px'"
      />
      <el-input
        v-show="_actionType === 'customUrl'"
        v-model="_customUrl"
        placeholder="如:https://cloud.nti56.com"
        size="small"
      />
    </el-form-item>
    <el-form-item label="打开方式">
      <el-radio-group
        v-model="_openPageType"
        size="medium"
      >
        <el-radio-button label="dialog">
          弹窗
        </el-radio-button>
        <el-radio-button label="new">
          新页面
        </el-radio-button>
        <el-radio-button label="self">
          当前
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      v-show="_openPageType === 'dialog'"
      label="弹窗宽度"
    >
      <el-radio-group
        v-model="_dialogWidth"
        size="medium"
      >
        <el-radio-button label="100%">
          100%
        </el-radio-button>
        <el-radio-button label="80%">
          80%
        </el-radio-button>
        <el-radio-button label="50%">
          50%
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
  </div>
</template>

<script>
import {
  getFromStore
} from '@/utils/db'

const propsMap = {
  openPageType: { // 页面打开方式。'dialog'弹窗|'new'新页面|'self'当前页面
    type: String,
    default: 'dialog',
    autoUpdate: true
  },
  actionType: { // 页面地址输入方式。'customUrl'用户输入|'pageId'选择页面id_code
    type: String,
    default: 'pageId',
    autoUpdate: true
  },
  pageId: { // (打开页面-选择页面id_code)内部链接页面id_code
    type: String,
    default: '',
    autoUpdate: true
  },
  customUrl: { // (打开页面-用户输入)用户输入的跳转地址
    type: String,
    default: '',
    autoUpdate: true
  },
  dialogWidth: { // 弹框宽度
    type: String,
    default: '100%',
    autoUpdate: true
  }
}
const computedMap = {}
Object.keys(propsMap)
  .forEach(key => {
    if (propsMap[key].autoUpdate) {
      computedMap[`_${key}`] = {
        get() {
          return this[key]
        },
        set(val) {
          this.$emit(`update:${key}`, val)
          this.$emit('updateParentData', key, val)
        }
      }
    }
  })

export default {
  name: 'OpenPageEventPanel',
  components: {},
  inheritAttrs: false,
  props: propsMap,
  data() {
    return {
      systemPageList: getFromStore('pageList') // 内部页面列表
    }
  },
  computed: computedMap,
  methods: {}
}
</script>
