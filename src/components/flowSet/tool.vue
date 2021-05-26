<template>
  <div ref="tool" class="left-node-list" style="background-color: #66a6e0;">
    <!-- <el-menu :default-openeds='defaultOpeneds'>
      <el-submenu
        :index='menu.type+index'
        v-for='(menu,index)  in  menuList'
        :key='menu.type+index'
      >
        <template slot='title'>
          <i :class='menu.ico'></i>
          <span>{{menu.name}}</span>
        </template>

        <el-menu-item-group>
          <draggable @end='addNode' v-for='(son,i) in menu.children' :key='son.type+i'>
            <el-menu-item :index='son.type+i' :type='son.type'>
              <i :class='son.ico'></i>
              {{son.name}}
            </el-menu-item>
          </draggable>
        </el-menu-item-group>
      </el-submenu>
    </el-menu> -->
    <el-menu :default-openeds="defaultOpeneds">
      <draggable v-for="(son,i) in menuList" :key="son.type+i" @end="addNode">
        <el-menu-item :index="son.type+i" :type="son.type">
          <i :class="son.ico" />
          {{ son.name }}
        </el-menu-item>
      </draggable>
    </el-menu>
  </div>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  data() {
    return {
      defaultOpeneds: ['group0', 'group1'],
      menuList: [
        {
          type: 'start round mix',
          name: '开始节点',
          ico: 'el-icon-video-play'
        },
        {
          type: 'task',
          name: '任务节点',
          ico: 'el-icon-caret-right'
        },
        {
          type: 'end round mix',
          name: '结束节点',
          ico: 'el-icon-video-pause'
        },
        {
          type: 'state round mix',
          name: '回滚节点',
          ico: 'el-icon-refresh-right'
        },
        {
          type: 'part round mix',
          name: '部分回滚',
          ico: 'el-icon-refresh-left'
        }
      ]
    }
  },
  methods: {
    // 根据类型获取菜单
    // eslint-disable-next-line consistent-return
    // getMenu(type) {
    //   for (let i = 0; i < this.menuList.length; i++) {
    //     if (this.menuList[i].type === type) {
    //       return this.menuList[i]
    //     }
    //   }
    // },
    // 添加节点
    addNode(evt, e) {
      // const nodeMenu = this.getMenu(evt.originalEvent.srcElement.type)
      // 根据类型获取菜单
      const nodeMenu = this.menuList.find(menu => menu.type === evt.originalEvent.srcElement.type)
      this.$emit('addNode', evt, nodeMenu)
    }
  }
}
</script>
<style lang="scss" scope>
.left-node-list{
  .el-menu-item:hover,
  .el-menu-item:focus {
    color: #B2B2B2;
    i{
    color: #B2B2B2;
    }
  }
  .el-menu-item{
    color: #ffffff;
    i{
      color: #ffffff;
    }
  }
}
</style>
