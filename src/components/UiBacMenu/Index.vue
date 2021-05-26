<template>
  <sidebar
    :default-value="defaultValue"
    :variables="variables"
    :is-collapse="isCollapse"
    :menu-data="menuData"
    :model="model"
    class="menu-container"
    @doSelect="doSelect"
  />
</template>

<script>

import Sidebar from './sidebar'

export default {
  name: 'UiBacMenu',
  components: { Sidebar },
  props: {
    defaultValue: {
      type: String,
      default: ''
    },
    variables: {
      type: Object,
      default: () => ({})
    },
    isCollapse: {
      type: Boolean,
      default: false
    },
    isTransfer: { // 是否需要将数据转为树状结构数据 默认需要
      type: Boolean,
      default: true
    },
    model: {
      type: String,
      default: 'vertical'
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    menuData() {
      if (this.isTransfer) {
        // console.log('data', this.data, this.arrayToTreeMenu(JSON.parse(JSON.stringify(this.data)), 'pid', 'id'))
        // return this.arrayToTreeMenu(JSON.parse(JSON.stringify(this.data)), 'pid', 'id')
        const allData = this.arrayToTreeMenu(JSON.parse(JSON.stringify(this.data)), 'pid', 'id')
        this.treeDataLevel(allData)
        return allData
      }
      return JSON.parse(JSON.stringify(this.data))
    }
  },
  methods: {
    // 数据向上传递
    doSelect(index) {
      const target = this.data.find(item => `${item.id}` === index) // 转为字符串再匹配
      // console.log('data', this.data, index, target)
      this.$emit('handle-menu-select', target)
    },
    // 将一维数组转换为菜单需要的树状菜单数据格式
    arrayToTreeMenu(array, pid, id, childrensKey) {
      if (typeof childrensKey === 'undefined') {
        childrensKey = 'children'
      }
      array.splice(0, array.length, ...array.filter((item, i) => {
        item.meta = { title: item.label, icon: item.menu_icon || '' }
        item.path = '/'
        delete item.label
        const parent = array.find(compare => item[pid] === compare[id])
        if (parent) {
          if (!Array.isArray(parent[childrensKey])) {
            parent[childrensKey] = []
          }
          parent[childrensKey].push(item)
          return false
        }
        return true
      }))
      return array
    },
    treeDataLevel(data, index = 0) {
      index++
      // console.log(999, index)
      data.forEach((item, i) => {
        // if (item.pid === 0) {
        item.level = index
        item.index = `${index}_${i}`
        // }
        if (item.children) {
          item.isShow = false
          this.treeDataLevel(item.children, index)
        }
      })
      // console.log(555, levelData)
      // return levelData
    }

  }
}
</script>
<style>
a{
  text-decoration:none;
}

</style>
