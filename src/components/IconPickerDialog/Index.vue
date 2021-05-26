<template>
  <el-dialog
    v-bind="$attrs"
    width="80%"
    append-to-body
    title="图标选择"
    v-on="$listeners"
    @open="onOpen"
    @close="onClose"
  >
    <div style="height:65vh;overflow:auto;">
      <el-form :inline="true" label-width="100px">
        <el-form-item label="图标类型">
          <el-select
            v-model="iconType"
            placeholder="请选择图标类型"
            @change="iconTypeChange"
          >
            <el-option label="mdi-icon" value="mdi-icon" />
            <el-option label="iconfont" value="iconfont" />
            <el-option label="el-icon" value="el-icon" />
          </el-select>
        </el-form-item>
        <el-form-item label="查找图标">
          <el-input
            v-model="key"
            :style="{ width: '260px' }"
            placeholder="请输入图标名称"
            prefix-icon="el-icon-search"
            clearable
          />
        </el-form-item>
      </el-form>
      <!-- <h2>Usage</h2>
      <pre><code>&lt;span class=&quot;mdi mdi-<span id="name">name</span>&quot;&gt;&lt;/span&gt;</code></pre>
      <h2>Icons</h2>-->
      <div v-if="iconType==='mdi-icon'" id="icons" class="icons">
        <div
          v-for="v in iconsArr"
          :key="v.id"
          :class="active === 'mdi mdi-' + v.name ? 'active-item' : ''"
          @click="chooseIcon(v.name)"
        >
          <i :class="'mdi mdi-' + v.name" />
          <code>{{ v.hex }}</code>
          <span>{{ "mdi-" + v.name }}</span>
        </div>
      </div>
      <div v-else-if="iconType==='iconfont'" id="iconfonts" class="icons">
        <div
          v-for="v in iconsArr"
          :key="v.unicode"
          :class="active === 'iconfont icon-' + v.font_class ? 'active-item' : ''"
          @click="chooseIcon(v.font_class)"
        >
          <i :class="'iconfont icon-' + v.font_class" />
          <code>{{ v.unicode }}</code>
          <span>{{ "icon-" + v.font_class }}</span>
        </div>
      </div>
      <div v-else-if="iconType==='el-icon'" id="el-icon" class="icons">
        <div
          v-for="v in iconsArr"
          :key="v"
          :class="active === 'el-icon-' + v ? 'active-item' : ''"
          @click="chooseIcon(v)"
        >
          <i :class="'el-icon-' + v" />
          <!-- <code>{{ v }}</code> -->
          <span>{{ "el-icon-" + v }}</span>
        </div>
      </div>
      <!--  <h2>Extras</h2>
      <p>The helper CSS classes are listed below.</p>
      <h3>Size</h3>
      <p>
        <code>mdi-18px</code> <i class="mdi mdi-18px mdi-account" />
        <code>mdi-24px</code> <i class="mdi mdi-24px mdi-account" />
        <code>mdi-36px</code> <i class="mdi mdi-36px mdi-account" />
        <code>mdi-48px</code> <i class="mdi mdi-48px mdi-account" />
      </p>
      <h3>Rotate</h3>
      <p>
        <i class="mdi mdi-48px mdi-account" />
        <code>mdi-rotate-45</code>
        <i class="mdi mdi-48px mdi-rotate-45 mdi-account" />
        <code>mdi-rotate-90</code>
        <i class="mdi mdi-48px mdi-rotate-90 mdi-account" />
        <code>mdi-rotate-135</code>
        <i class="mdi mdi-48px mdi-rotate-135 mdi-account" />
        <code>mdi-rotate-180</code>
        <i class="mdi mdi-48px mdi-rotate-180 mdi-account" />
        <code>mdi-rotate-225</code>
        <i class="mdi mdi-48px mdi-rotate-225 mdi-account" />
        <code>mdi-rotate-270</code>
        <i class="mdi mdi-48px mdi-rotate-270 mdi-account" />
        <code>mdi-rotate-315</code>
        <i class="mdi mdi-48px mdi-rotate-315 mdi-account" />
      </p>
      <h3>Flip</h3>
      <p>
        <i class="mdi mdi-48px mdi-account-alert" />
        <code>mdi-flip-h</code>
        <i class="mdi mdi-48px mdi-flip-h mdi-account-alert" />
        <code>mdi-flip-v</code>
        <i class="mdi mdi-48px mdi-flip-v mdi-account-alert" />
      </p>
      <p class="note">
        <strong>Note:</strong> We do not include the ability to use
        <code>mdi-flip-*</code> and <code>mdi-rotate-*</code> at the same time.
      </p>
      <h3>Spin</h3>
      <p>
        <code>mdi-spin</code> <i class="mdi mdi-48px mdi-spin mdi-loading" />
        <code>mdi-spin</code> <i class="mdi mdi-48px mdi-spin mdi-star" />
      </p>
      <h3>Color</h3>
      <p style="padding-bottom:20px;">
        <code>mdi-light</code>
        <i class="mdi mdi-48px mdi-light mdi-account dark-demo" />
        <code>mdi-light mdi-inactive</code>
        <i class="mdi mdi-48px mdi-light mdi-inactive mdi-account dark-demo" />
        <code>mdi-dark</code> <i class="mdi mdi-48px mdi-dark mdi-account" />
        <code>mdi-dark mdi-inactive</code>
        <i class="mdi mdi-48px mdi-dark mdi-inactive mdi-account" />
      </p> -->
    </div>
  </el-dialog>
</template>

<script>
import '@/assets/lib/MaterialDesign-Webfont-master/css/materialdesignicons.min.css'
import '@/assets/lib/iconfont/iconfont.css'
import mdiIconList from './mdi-icon.json'
import elIconList from './el-icon.json'
import iconfontList from '@/assets/lib/iconfont/iconfont.json'

export default {
  name: 'IconPickerDialog',
  inheritAttrs: false,
  props: ['chooseMdiIcon', 'current'],
  data() {
    return {
      iconsArr: [],
      active: null,
      key: '',
      iconType: 'mdi-icon'
    }
  },
  watch: {
    key: {
      handler(val) {
        if (val) {
          this.iconsArr = this.getAllIcons().filter(
            item => `${item.name ? item.name : item}`.indexOf(val) > -1
          )
        } else {
          this.iconsArr = this.getAllIcons()
        }
      },
      immediate: true
    }
  },
  mounted() {
    // console.log('iconsArr', this.iconsArr, iconfontList)
  },
  methods: {
    onOpen() {
      this.active = this.current
      this.key = ''
    },
    onClose() {},
    // 获取所有图标信息
    getAllIcons() {
      if (this.iconType === 'iconfont') {
        return iconfontList.glyphs
      }
      if (this.iconType === 'el-icon') {
        return elIconList
      }
      return mdiIconList
    },
    // 点击选择图标
    chooseIcon(iconName) {
      if (this.iconType === 'iconfont') {
        this.$emit('chooseMdiIcon', `iconfont icon-${iconName}`)
      } else if (this.iconType === 'mdi-icon') {
        this.$emit('chooseMdiIcon', `mdi mdi-${iconName}`)
      } else if (this.iconType === 'el-icon') {
        this.$emit('chooseMdiIcon', `el-icon-${iconName}`)
      }
    },
    iconTypeChange(val) {
      // this.getAllIcons()
      if (this.iconType === 'iconfont') {
        this.iconsArr = iconfontList.glyphs
      } else if (this.iconType === 'mdi-icon') {
        this.iconsArr = mdiIconList
      } else if (this.iconType === 'el-icon') {
        this.iconsArr = elIconList
      }
    }
  }
}
</script>
<style lang="scss">
@import "./style";
</style>
