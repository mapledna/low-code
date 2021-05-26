<template>
  <div v-show="drawer" class="menu-drawer" @click="drawer = false">
    <div class="menu-view">
      <div
        v-for="(menu, index) in menuData"
        :key="menu.id + index"
        class="menu-item-view"
      >
        <div class="menu-title" @click.stop="showView(index)">
          <img class="left-icon" :src="menu.img" alt="" />
          <div class="title-text">
            {{ menu.name }}
          </div>
          <img
            v-show="menu.children ? menu.children.length > 0 : false"
            class="arrow"
            src="../../assets/img/info/cloud-warehouse-ph/menu_two.png"
            alt=""
            :class="{ 'change-direction': menu.showChild }"
          />
        </div>
        <div class="line" />
        <div v-show="menu.showChild" class="children-view" @click.stop="">
          <div
            v-for="(child, i) in menu.children"
            :key="child.id + i"
            class="child-item"
            :class="{ 'select-item': child.selected }"
            @click.stop="selectItem(index, i, child.url)"
          >
            {{ child.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "DrawerMenu",
  props: {},
  data() {
    return {
      menuData: [
        {
          id: 1,
          name: "产品中心",
          // eslint-disable-next-line global-require
          img: require("../../assets/img/info/cloud-warehouse-ph/menu_one.png"),
          children: [
            {
              id: 11,
              name: "可配置化软件开发平台",
              url: "/Info/configPh",
            },
            {
              id: 12,
              name: "物流管控平台",
              url: "/Info/clmisPh",
            },
            {
              id: 13,
              name: "XXXXX",
              url: "/Info/CloudWarehousePh",
            },
            // {
            //   id: 14,
            //   name: '仓储管理系统'
            // },
            {
              id: 15,
              name: "运输管理系统",
              url: "/Info/ctmsPh",
            },
            {
              id: 16,
              name: "大数据开发平台",
              url: "/Info/Datasmart",
            },
            {
              id: 17,
              name: "数据分析",
              url: "/Info/DataAnalysis",
            },
            {
              id: 18,
              name: "数据大屏",
              url: "/Info/DataScreen",
            },
            {
              id: 25,
              name: "报表助手",
              url: "/Info/ReportAssistant",
            },
            {
              id: 19,
              name: "供应链管理系统",
              url: "/Info/SupplyChainPh",
            },
            {
              id: 20,
              name: "报价专家",
              url: "/Info/QuotationExpertPh",
            },
            // {
            //   id: 21,
            //   name: '数字孪生系统',
            //   url: '/Info/DigitalTwins'
            // },
            {
              id: 22,
              name: "云仓储管理系统",
              url: "/Info/cloudwmsPh",
            },
            // {
            //   id: 23,
            //   name: 'IWCS系统',
            //   url: '/Info/iwcsPh'
            // },
            {
              id: 24,
              name: "客户关系管理系统",
              url: "/Info/crmPh",
            },
          ],
        },
        {
          id: 2,
          name: "解决方案",
          // eslint-disable-next-line global-require
          img: require("../../assets/img/info/cloud-warehouse-ph/menu_three.png"),
          children: [
            {
              id: 21,
              name: "智慧医疗",
            },
            {
              id: 22,
              name: "智慧物流管理系统",
            },
          ],
        },
        {
          id: 3,
          name: "企业中台",
          // eslint-disable-next-line global-require
          img: require("../../assets/img/info/cloud-warehouse-ph/menu_four.png"),

          children: [
            {
              id: 31,
              name: "技术中台",
            },
            {
              id: 32,
              name: "数据中台",
            },
            {
              id: 33,
              name: "业务中台",
            },
          ],
        },
        {
          id: 4,
          name: "合作伙伴",
          // eslint-disable-next-line global-require
          img: require("../../assets/img/info/cloud-warehouse-ph/menu_five.png"),
        },
        {
          id: 4,
          name: "关于XXXXX",
          // eslint-disable-next-line global-require
          img: require("../../assets/img/info/cloud-warehouse-ph/menu_six.png"),
        },
      ],
      drawer: false,
    };
  },
  mounted() {
    this.setCurrentItem();
  },
  methods: {
    setCurrentItem() {
      const that = this;
      console.log("routernxmc", this.$route.path);
      this.$data.menuData.forEach((element, index) => {
        if (element.children) {
          element.children.forEach((child) => {
            if (child.url === that.$route.path) {
              child.selected = true;
            }
          });
        }
      });
      this.$data.menuData = JSON.parse(JSON.stringify(this.$data.menuData));
    },
    openMenu() {
      this.$data.drawer = true;
    },
    showView(index) {
      console.log("child", this.$data.menuData[index].showChild);
      if (this.$data.menuData[index].children) {
        if (this.$data.menuData[index].children.length > 0) {
          if (this.$data.menuData[index].showChild) {
            this.$data.menuData[index].showChild = false;
          } else {
            this.$data.menuData[index].showChild = true;
          }
          console.log("cascac", this.$data.menuData);
          this.$data.menuData = JSON.parse(JSON.stringify(this.$data.menuData));
        }
      }
    },
    selectItem(parentIndex, childIndex, url) {
      const that = this;
      this.$data.menuData.forEach((element, index) => {
        if (element.children) {
          element.children.forEach((child) => {
            child.selected = false;
          });
        }
      });

      this.$data.menuData.forEach((element, index) => {
        if (parentIndex === index) {
          element.children[childIndex].selected = true;
          if (url !== that.$route.path) {
            if (url) {
              if (url !== "") {
                that.$router.push(url);
              }
            } else {
              console.log("url不存在");
            }
          }
        }
      });
      this.$data.menuData = JSON.parse(JSON.stringify(this.$data.menuData));
    },
  },
};
</script>
<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 0px;
}
.menu-drawer {
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;
  background-color: rgba($color: #000000, $alpha: 0.4);
  height: 100%;
  width: 100%;
  .menu-view {
    width: 82%;
    height: 100%;
    background-color: #2f2f2f;
    color: white;
    padding: 20px 0px;
    overflow: scroll;
    .menu-title {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #ffffff;
      height: 40px;
      .left-icon {
        width: 15px;
        height: 16px;
        margin-right: 16px;
        margin-left: 25px;
      }
      .title-text {
        flex: 1;
      }
      .arrow {
        width: 14px;
        height: 8px;
        margin-right: 32px;
      }
      .change-direction {
        transform: rotate(180deg);
      }
    }
    .line {
      background-color: #505050;
      height: 1px;
    }
    .children-view {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      background-color: #3d3d3d;
      padding: 13px 6px 20px 6px;
      .child-item {
        border-radius: 4px;
        border: solid 1px #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 45%;
        height: 29px;
        color: white;
        font-size: 11px;
        margin: 6px 4px;
      }
      .select-item {
        background-color: #5e8bef;
      }
    }
  }
}
</style>
