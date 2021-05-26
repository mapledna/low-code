<template>
  <div class="backtop">
    <el-backtop :target="scrollTarget" :bottom="100" :visibility-height="200" :right="30" @click="backTopClick">
      <div class="backtop_con">
        <div class="top" @click.stop="contactClick">
          <img class="top_img" src="../../assets/img/info/content.png" alt="">
          <p class="top_p">
            联<br>系<br>我<br>们
          </p>
        </div>
        <img src="../../assets/img/info/back top.png" alt="">
      </div>
    </el-backtop>
  </div>
</template>

<script>
export default {
  name: 'Backtop',
  props: ['scrollTarget'],
  data() {
    return {
      // msg: 'Welcome to Your Vue.js App'
      // isBackTop:false
    }
  },
  mounted() {
    // alert(this.scrollData)
  },
  methods: {
    backTopClick() {

    },
    contactClick() {
      console.log('contactClick')
    }
  }
}
</script>
<style>
  /* @import "../../assets/css/info/BackTop.css"; */
</style>
<style scoped>
.backtop .backtop_con{height: 100%;width: 48px;text-align: center;}
.backtop .top{position: fixed;right: 26px;bottom: 172px;cursor: pointer;}
.backtop .top_img{width:48px;height:48px;background:rgba(64,158,255,1);}
.backtop .top_p{font-size:16px;font-weight:400;color:#409EFF;background: #fff;/*width: 48px;*/text-align: center;padding: 16px;}
.backtop_con img{width:48px;height:48px;background:rgba(255,255,255,1);box-shadow:0px 5px 10px 0px rgba(0,0,0,0.1);}
@media only screen and (min-width: 1200px){

}
@media screen and (max-width: 750px){

}

</style>
