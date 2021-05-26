<template>
  <div class="bacco-menu">
    <ul v-if="level<=3" class="bacco-menu-ul" :class="'level_'+level">
      <!-- <div class="bacco-wrapper"> -->
      <span v-if="level>3" class="arrow" />
      <li v-for="(item,index) in menuArr" :key="item.index" class="bacco-submenu" :menu-id="item.id" :menu-pid="item.pid" :menu-level="item.index">
        <div class="bacco-submenu-title" @click="showChildMenu($event,index,item.index)">
          <!-- <img src="" alt=""> -->
          <i v-if="level<3" class="icon-left el-icon-s-management" />
          <span class="">{{ item.meta.title }}</span>
          <i v-if="item.children" class="icon-arrow" :class="item.isShow?level<3?'el-icon-arrow-down':'el-icon-caret-right':level<3?'el-icon-arrow-right':'el-icon-caret-right'" />
        </div>
        <item-list v-show="item.children&&item.isShow" :menu-data="item.children" :all-data="allData" :level="item.level+1" />
      </li>
    <!-- </div> -->
    </ul>
    <ul v-if="level===1" class="bacco-menu-ul level_4 moreMenu">
      <!-- <li>11</li> -->
    </ul>
    <ul v-if="level===1" class="bacco-menu-ul level_5 moreMenu" style="dispaly:none;">
      <!-- <li>22</li> -->
    </ul>
  </div>
</template>

<script>

// import Sidebar from './sidebar'

export default {
  name: 'ItemList',
  components: { },
  props: {
    menuData: {
      type: Array,
      default: () => []
    },
    allData: {
      type: Array,
      default: () => []
    },
    level: {
      type: Number,
      default: () => 1
    }
  },
  data() {
    return {
      menuArr: this.menuData
    }
  },
  computed: {

  },
  watch: {
    menuData: {
      handler(menuData) {
        this.menuArr = menuData
      },
      deep: true
    }
  },
  mounted() {
    // console.log(121233, this.allData)
    // console.log(12, this.menuData)
    this.testMouseEnter()
  },
  methods: {
    showChildMenu(event, index, level) {
      console.log(333, event, index, level)
      const levelArr = level.split('_')
      console.log(12, levelArr)
      if (Number(levelArr[0]) >= 3) return
      // this.menuData[index].isShow = true
      const item = this.menuArr[index]
      this.$set(this.menuArr, index, { ...item, isShow: !item.isShow })
      // const temp = this.menuData[index]
      // temp.isShow = !temp.isShow
      // this.menuData.splice(index, 1, temp)
      console.log(this.menuArr)
    },
    selectHover(arg, index, level) {
      // const levelArr = level.split('_')
      // if (Number(levelArr[0]) < 3) return
      // console.log(111, arg.target.getAttribute('class').split(' ')[1].split('_')[1], arg, arg.target.getAttribute('menu-id'), arg.target.getAttribute('menu-pid'), index, level)
      const classNameLi = arg.target.getAttribute('class').split(' ')[1]
      // console.log('kkk', document.getElementsByClassName(classNameLi)[0].parentNode.parentNode.parentNode.getAttribute('class').split(' ')[1].split('_')[2])
      // const secondIndex = document.getElementsByClassName(classNameLi)[0].parentNode.parentNode.parentNode.getAttribute('menu-pid').split(' ')[1].split('_')[2]
      let levelLi = classNameLi.split('_')[1]
      const indexLi = classNameLi.split('_')[2]
      const pid = arg.target.getAttribute('menu-pid')
      // const mmenuObj = document.getElementsByClassName('bacco-menu')[0]
      // const className = `level_${++levelArr[0]}`
      const ulObj = document.getElementsByClassName(`level_${++levelLi}`)[0]
      ulObj.innerHTML = ''
      // const ulObj = document.createElement('ul')
      const liObj = document.createElement('li')
      // ulObj.className = `bacco-menu-ul ${className} moreMenu`
      ulObj.style.top = `${arg.y}px`
      // if (reUl) return
      console.log(9009, this.menuArr)
      this.allData.forEach((item, i) => {
        if (pid === item.id) {
          liObj.className = `bacco-submenu level_${++levelLi}_${i}`
          liObj.setAttribute('menu-id', item.id)
          liObj.setAttribute('menu-pid', item.pid)
          // liObj.setAttribute('onMouseEnter', `selectHover($event,index,${item.index})`)
          // liObj.setAttribute('onMouseLeave', `selectHover($event,index,${item.index})`)
          // liObj.onMouseEnter = `"selectHover($event,index,${item.index})"`
          // liObj.onMouseLeave = `"selectLeave($event,index,${item.index})"`
          liObj.innerHTML = `<div class="bacco-submenu-title">
            <span class="">${item.label}</span>
            <i class="icon-arrow el-icon-caret-right" />
          </div>`
          ulObj.appendChild(liObj)
        }
      })
      ulObj.style.display = 'block'
    },
    selectLeave(arg, index, level) {
      const classNameLi = arg.target.getAttribute('class').split(' ')[1]
      let levelLi = classNameLi.split('_')[1]
      const ulObj = document.getElementsByClassName(`level_${++levelLi}`)[0]
      ulObj.style.display = 'none'
    },
    testMouseEnter() {
      const level3 = document.getElementsByClassName('level_3')[0].childNodes
      level3.forEach(item => {
        item.addEventListener('mouseenter', this.selectHover)
        item.addEventListener('mouseleave', this.selectLeave)
      })
    }

  }
}
</script>
<style scoped>
.arrow{
    position:absolute;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-right-color: #2A2C36 ;
    left: -20px;
    top: 12px;
}
.bacco-submenu{
  position: relative;
}
.bacco-submenu-title{
  cursor: pointer;
  position: relative;
}
/* .bacco-submenu-title:hover{
  background: #161A22;
} */
.level_1>.bacco-submenu>.bacco-submenu-title{
  font-weight: 500;
  font-size: 19px;
  color: #FFFFFF;
  /* padding-left: 80px; */
  line-height: 60px;
}

.level_1>.bacco-submenu>.bacco-submenu-title>.icon-left{
  /* position: absolute;
  left: 28px;
  top: 20px; */
  padding: 0 20px 0 28px;;
}
.level_1>.bacco-submenu:hover{
  background: #161A22;
}
.icon-arrow{font-size: 19px;position: absolute;}
.level_1>.bacco-submenu>.bacco-submenu-title .icon-arrow{
  right: 32px;
  top: 20px;
}
.level_2>.bacco-submenu>.bacco-submenu-title{
  font-weight: 500;
  font-size: 17px;
  color: #FFFFFF;
  /* padding-left: 71px; */
  line-height: 42px;
}
.level_2>.bacco-submenu>.bacco-submenu-title>.icon-left{
  /* position: absolute;
  left: 28px;
  top: 20px; */
  padding: 0 20px 0 28px;;
}
.level_2>.bacco-submenu>.bacco-submenu-title:hover,.level_4>.bacco-submenu>.bacco-submenu-title:hover{
  color: #32E19C;
}
.level_2>.bacco-submenu>.bacco-submenu-title>.icon-arrow{
  right: 71px;
  top: 11px;
}
.level_3>.bacco-submenu>.bacco-submenu-title{
  font-weight: 500;
  font-size: 16px;
  color: #CACACA;
  padding-left: 88px;
  line-height: 27px;
}
.level_3>.bacco-submenu>.bacco-submenu-title:hover{
  color: #0ADF88;
}
.level_3>.bacco-submenu>.bacco-submenu-title .icon-arrow{
  right: 60px;
  top: 3px;
}
/* .level_3>.bacco-submenu>.bacco-submenu-title:hover .level_4{
  display: block;
} */
/* .level_4{
  position: absolute;
  right: -100px;
  top: 0;
  background: #2A2C36;
  box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.5);
  opacity: 0.85;
  padding: 20px 30px 21px 24px;
  z-index: 99;
}
.level_4 .bacco-submenu-title{
  font-weight: 500;
  font-size: 15px;
  color: #CACACA;
  line-height: 27px;
} */
/* .bacco-menu-ul li:hover{
background: #161A22;
} */

</style>
<style>
.moreMenu{
  position: absolute;
  right: -100px;
  top: 0;
  background: #2A2C36;
  box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.5);
  opacity: 0.85;
  padding: 20px 30px 21px 24px;
  z-index: 99;
  display: none;
}
.moreMenu .bacco-submenu-title{
  font-weight: 500;
  font-size: 15px;
  color: #CACACA;
  line-height: 27px;
}
.moreMenu::after{
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  top: 12px;
  left: -20px;
  border: 10px solid transparent;
  border-right-color: #292C35 ;
}
.main_container .el-aside{
  overflow: visible !important;
}
.main_container .page_aside{
  overflow: visible !important;
}
.main_container #menu_container{
  overflow: visible !important;
}
</style>
