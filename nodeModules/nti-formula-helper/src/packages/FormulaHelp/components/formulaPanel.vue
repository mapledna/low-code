<template>
  <div class="full-panel">
    <div class="full-panel_head">公式</div>
    <topTool @filter="handleInputFilter" />
    <el-collapse accordion class="with-padding full-panel_body" style="padding: 0;">
      <el-collapse-item
        v-for="item in list"
        :key="item.name"
        :name="item.name"
      >
        <span slot="title">
          <el-tooltip :open-delay="500" content="插入公式">
            <el-button
              type="text"
              size="mini"
              @click.stop="handleInsert(item)"
              style="margin-right: 5px;">
              <i class="el-icon el-icon-plus" />
            </el-button>
          </el-tooltip>
          {{item.expression}}
        </span>
        <el-row :gutter="20">
          <el-col :span="8">
            <h4>{{ item.name }}</h4>
          </el-col>
          <el-col :span="16">
            <b v-if="item.title">{{item.title}}。</b>
            {{ item.desc }}
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="item.paramList">
          <el-col :span="24">
            <h4 style="padding-top: 5px">参数</h4>
          </el-col>
          <div v-for="p in item.paramList" :key="p.name">
            <el-col :span="8">[{{ p.type }}]&nbsp;{{ p.name }}</el-col>
            <el-col :span="16">{{ p.desc }}</el-col>
          </div>
        </el-row>
        <el-row :gutter="20" v-if="item.return">
          <el-col :span="24">
            <h4 style="padding-top: 5px">返回结果</h4>
          </el-col>
          <el-col :span="8">{{ item.return.type }}</el-col>
          <el-col :span="16">{{ item.return.desc }}</el-col>
        </el-row>
        <el-row :gutter="20" v-if="item.demo">
          <el-col :span="24">
            <h4 style="padding-top: 5px">示例</h4>
          </el-col>
          <el-col :span="24">{{ item.demo }}</el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import topTool from './topTool.vue'

export default {
  components: {
    topTool,
  },

  props: {
    data: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      list: '',
    }
  },

  watch: {
    data: {
      immediate: true,
      handler(data) {
        this.list = data
      }
    },
  },

  methods: {

    handleInputFilter(text) {
      this.list = this.filterList(text)
    },

    filterList(value, key) {
      const {
        data,
      } = this
      console.log(value)
      if (!value) return data
      const upperValue = value.toUpperCase()
      return data.filter(item => {
        return (`${item.name || ''}##${item.title || ''}`)
          .toUpperCase()
          .indexOf(upperValue) !== -1
      })
    },

    handleInsert(item) {
      this.$emit('insert', `${item.name}()`)
    },
  },
}
</script>
