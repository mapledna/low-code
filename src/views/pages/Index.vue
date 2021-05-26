<template>
  <ui-main-v1
    :aside-title="projectName"
    :project-name="projectName"
    :header-title="projectName"
    :logo-icon="logoIcon"
    :variables="variables"
    :is-collapse="isCollapse"
    :menu-id="menuId"
    :menu-data="menuData"
  />
</template>

<script>
const menuTest = [
  {
    group_idx: 111,
    icon_color: null,
    id: '111',
    label: '菜单样式测试',
    menu_code: '111',
    menu_href: null,
    menu_icon: null,
    part_id: '111',
    pid: '0'
  }
]
export default {
  name: 'MainView',
  components: {},
  data() {
    return {
      projectName: 'XXXXX',
      logoIcon: '/img/nti/logo-icon.png',
      variables: {
        // 样式
        menuBg: '#4A90E2',
        menuText: '#fff',
        menuActiveText: '#ffd04b'
      },
      isCollapse: false, // 是否水平折叠收起菜单
      menuId: '1',
      menuData: [], // 全部菜单数据
      initData: {
        // sqlId: '1281801095288909826',
        sqlId: '1282980172343468034',
        parameters: {}
      }
    }
  },
  mounted() {
    this.getMenuData()
  },
  methods: {
    // 获取菜单数据
    getMenuData() {
      this.$server
        .executeSqls(this.initData.sqlId, this.initData.parameters)
        .then(res => {
          this.menuData = [...menuTest, ...res]
        })
    }
  }
}
</script>
