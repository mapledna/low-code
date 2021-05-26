<template>
  <!-- <el-dialog
    v-bind="$attrs"
    width="80%"
    :modal-append-to-body="false"
    v-on="$listeners"
    @open="onOpen"
    @close="onClose"
  > -->
  <div class="helpCenter">
    <i class="el-icon-close close-page" @click="$router.go(-1)" />
    <div class="searchText" :class="buttonClick===1?'showInput':''">
      <button id="textBtn" @click="searchClick">
        <i class="btnIcon" />
      </button>
      <p v-if="buttonClick===1" class="input_wrapper">
        <input id="inputCon" v-model="keyword" type="text" placeholder="搜索" @keyup.enter="helpQuerySearch">
        <span id="searchBtn" class="searchIcon" @click="helpQuerySearch"><i /></span>
      </p>
    </div>
    <ui-menu
      slot="menu"
      :default-value="menuId"
      :model="'vertical'"
      :variables="variables"
      :is-collapse="isCollapse"
      :data="menuData"
      @handle-menu-select="clickMenu"
    />
    <div class="content">
      <p v-if="doc_content.length===0&&isSearch" style="padding-top:100px;text-align:center;color:#aaa;">
        未搜索到匹配内容！
      </p>
      <div v-for="(item,index) in doc_content" :key="index">
        <p v-if="isSearch" class="title">
          <a target="_blank" @click="clickMenu({id:item.id})" v-html="item.doc_title" />
        </p>
        <p v-else class="title" v-html="item.doc_title" />
        <p class="word" v-html="item.doc_content" />
      </div>
    </div>
  </div>
  <!-- </el-dialog> -->
</template>
<script>
import UiMenu from '@/components/UiMenu/Index.vue'

export default {
  name: 'HelpCenter',
  components: {
    UiMenu
  },
  props: [],
  data() {
    return {
      helpTreeData: [],
      menuData: [],
      menuId: '1',
      variables: { // 样式
        menuBg: '#4A90E2',
        menuText: '#fff',
        menuActiveText: '#ffd04b'
      },
      isCollapse: false,
      buttonClick: 0,
      doc_content: [],
      keyword: '',
      isSearch: false
    }
  },
  watch: {

  },
  mounted() {
    this.getHelpTree()
  },
  methods: {
    onOpen() {
    },
    onClose() {},
    // 获取左侧树形菜单数据
    getHelpTree() {
      this.$server.executeSqls('1286139415565332482').then(res => {
        this.menuData = res
        this.clickMenu({ id: res[0].id })
      })
    },
    // 菜单点击事件
    clickMenu(menu, isPassive) {
      this.$server.executeSqls('1286109430892924931', { id: menu.id }).then(res => {
        this.doc_content = res
        this.isSearch = false
      })
    },
    searchClick() {
      if (this.buttonClick === 0) {
        this.buttonClick = 1
      } else {
        this.buttonClick = 0
      }
    },
    // 帮助文档搜索
    helpQuerySearch() {
      if (!this.keyword) return
      this.$server.querySearch({ sqlId: '1286174470174027777', queryKey: this.keyword, count: 200 }).then(res => {
        this.doc_content = res
        this.isSearch = true
      })
    }
  }

}
</script>
<style lang="scss">
.helpCenter{
  height:100vh;
  display: flex;
  flex-direction: row;
  .close-page{position: absolute;
    right: 24px;
    top: 12px;
    font-size: 22px;
    cursor: pointer;
  }
  .menu-container{
    width: 240px;
    height: 100vh;
    float: left;
    overflow:auto;
    ul{
      height: 100%;
      background-color: rgb(74, 144, 226) !important;
    }
  }
  .content{
    padding: 30px;
    flex: 1;
    overflow: auto;
    p{
      margin-bottom: 10px;
    }
    .title{
      font-size: 24px;
      font-weight: 500;
      line-height: 24px;
    }
    .word{
      font-size: 18px;
      line-height: 22px;
    }
    em{
      font-style:normal;
      color:#f00;
    }
  }
  .searchText{
    position:absolute;
    top:80px;
    right:20px;
    z-index:999;
    font-size:14px;
    button{
      width:40px;
      height:40px;
      border:none;
      outline:none;
      background-color:#1890ff;
      border-radius:5px;
      box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.2);
      cursor: pointer;
    }
    .btnIcon{
      transition:all 0.4s;
      position:absolute;
      left:10px;
      top:10px;
      width:20px;
      height:20px;
      display:inline-block;
      background:url('../../assets/member/text_search.png') no-repeat center;
      background-size:cover;
    }
    &.showInput {
      .btnIcon{
        background:url('../../assets/member/search_close.png') no-repeat center;
        background-size:cover;
      }
      input{
        display:block;
        padding:4px 32px 4px 12px;
        transition:all 0.4s;
        width:100%;
        box-sizing:border-box;
        height:40px;
        border:1px solid #bbb;
        border-radius:5px;
        font-size:14px;color:#666;
        &:hover,
        &:focus{
          outline: none;
          border:1px solid #1890ff;
        }
        &:focus{
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
      }
    }
    .input_wrapper{
      position:absolute;
      right:55px;
      top:0px;
      transition:all 0.4s;
      width:260px;height:40px;
    }
    .searchIcon{
      position:absolute;
      right:0px;
      top:0px;
      width:32px;
      height:40px;
      display:inline-block;
      cursor: pointer;
      i{
        width:20px;
        height:20px;
        display:inline-block;
        position:absolute;
        right:6px;
        top:10px;
        background:url('../../assets/member/to_search.png') no-repeat center;
        background-size:cover;
      }
    }
  }
}
</style>
