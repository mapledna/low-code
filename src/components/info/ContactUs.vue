<template>
  <div class="contactus">
    <div class="contactus_part">
      <div class="contactus_scene_d">
        <el-row :gutter="0">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="contactus_info">
              <div class="contactus_info_t">
                立即咨询
              </div>
              <div class="contactus_info_c" style="margin: 8px 0 16px;">
                更多解决方案和技术架构的问题，可以联系我们的销售和技术团队
              </div>
              <div class="contactus_info_p">
                0755-25161222
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="contactus_info">
              <div class="contactus_info_t">
                联系我们
              </div>
              <div class="contactus_info_c">
                为了更好地给您提供个性化的服务，您可以联系我们：
              </div>
              <div class="contactus_info_p info_p" style="font-size:13px;font-weight:400;">
                ntirj@nti56.com
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Contactus',
  data() {
    return {
      // msg: 'Welcome to Your Vue.js App'

    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>
<style>
  /* @import "../../assets/css/info/ContactUs.css"; */
</style>
<style scoped>
.contactus_part{background:#409EFF;padding: 80px 0 88px;}
.contactus_part .contactus_scene_d {max-width: 1100px;margin: auto;}
.contactus_part .contactus_scene_d .contactus_info {
    /* width: 397px; */
    padding: 20px;
    text-align: left;
}
/* .contactus_part .contactus_scene_d .contactus_info .contactus_info_title {display: inline-block;left: 64px;} */
.contactus_part .contactus_scene_d .contactus_info .contactus_info_t {font-size: 18px;font-weight: 400;color: #FFFFFF;}
.contactus_part .contactus_scene_d .contactus_info .contactus_info_c {font-size: 13px;font-weight: 400;color: #FFFFFF;margin: 8px 0 4px;}
.contactus_part .contactus_scene_d .contactus_info .contactus_info_p{font-size:24px;font-weight:500;color:#FFFFFF;letter-spacing:1px;}
.info_p{font-size:13px;font-weight:400;color:rgba(255,255,255,1);}
@media only screen and (min-width: 1200px){

}
@media screen and (max-width: 750px){

}

</style>
