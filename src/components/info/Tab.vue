<template>
  <div class="tabList">
    <ul class="tab_ul" :class="tabBarFixed?'tabFixed':''">
      <li v-for="(item,index) in tabData" :key="index" :class="tab_active===item.value?'tab_ul_li tab_ul_active':''" @click="tabClick(item.value)">
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TabList',
  props: ['tabData', 'scrollName'],
  data() {
    return {
      tab_active: 'part_2',
      tab_ul: [
        { label: '总览实例', value: 'second_part' },
        { label: 'WMS特性 ', value: 'third_part' },
        { label: '客户案例 ', value: 'fourth_part' },
        { label: '应用案例 ', value: 'fifth_part' },
        { label: '常见问题 ', value: 'sixth_part' }
      ],
      tabBarFixed: false
    }
  },
  computed: {

  },
  mounted() {
    this.$nextTick(() => {
      // 滚动监听事件
      document.getElementsByClassName(this.scrollName)[0].addEventListener('scroll', this.tabScroll)
    })
  },
  methods: {
    tabClick(value) {
      // console.log(value)
      this.tab_active = value
      const { offsetTop } = document.getElementsByClassName(value)[0]
      // document.getElementsByClassName(this.scrollName)[0].scrollTop = offsetTop - 60 - 51
      document.getElementsByClassName(this.scrollName)[0].scrollTop = offsetTop - 51
    },
    tabScroll() {
      // const tabScrollTop = document.getElementsByClassName(this.scrollName)[0].scrollTop + 60
      // const secondPart = document.querySelector('.part_2').offsetTop - 60
      // const thirdPart = document.querySelector('.part_3').offsetTop - 60
      // const fourthPart = document.querySelector('.part_4').offsetTop - 60
      // const fifthPart = document.querySelector('.part_5') ? document.querySelector('.part_5').offsetTop - 60 : 100060
      // const sixthPart = document.querySelector('.part_6') ? document.querySelector('.part_6').offsetTop - 60 : 100060
      const tabScrollTop = document.getElementsByClassName(this.scrollName)[0].scrollTop
      const secondPart = document.querySelector('.part_2').offsetTop - 51
      const thirdPart = document.querySelector('.part_3').offsetTop - 51
      const fourthPart = document.querySelector('.part_4').offsetTop - 51
      const fifthPart = document.querySelector('.part_5') ? document.querySelector('.part_5').offsetTop - 51 : 100060
      const sixthPart = document.querySelector('.part_6') ? document.querySelector('.part_6').offsetTop - 51 : 100060

      // console.log(tabScrollTop, secondPart)
      if (tabScrollTop >= secondPart) {
        this.tabBarFixed = true // 滑动到指定位置菜单吸顶
        this.tab_active = 'part_2'
      } else {
        this.tabBarFixed = false
      }
      if (tabScrollTop >= thirdPart) {
        this.tab_active = 'part_3'
      }
      if (tabScrollTop >= fourthPart) {
        this.tab_active = 'part_4'
      }
      if (tabScrollTop >= fifthPart) {
        this.tab_active = 'part_5'
      }
      if (tabScrollTop >= sixthPart) {
        this.tab_active = 'part_6'
      }
      // console.log(this.tab_active)
    }
  }
}
</script>
<style>

</style>
<style scoped>
.tab_ul {background: #0A0D31;width: 100%;}
.tab_ul li{display: inline-block;font-size:13px;font-weight:400;color:rgba(255,255,255,1);line-height:18px;margin-right: 56px;cursor: pointer;line-height: 48px;}
.tab_ul li:first-child{margin-left: 120px;}
.tab_ul_active{border-bottom: 3px solid #409EFF;}
.tabFixed{position: fixed;top: 0px;z-index: 999;}
</style>
