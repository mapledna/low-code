<template>
  <div class="caselist">
    <div class="sixth_part">
      <div class="sixth_scene_d">
        <p class="part_title" style="color:#fff">
          {{ caseTitle }}
        </p>
        <el-row :gutter="0">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="sixth_info">
              <div class="sixth_info_t">
                <img src="../../assets/img/info/logo_technology_guangyao.png" alt="">
              </div>
              <div class="sixth_info_q">
                实现药品、耗材的自动化仓储管理及物资在全院各个业务科室之间安全、高校、快捷传输。
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="sixth_info">
              <div class="sixth_info_t">
                <img src="../../assets/img/info/logo_technology_guangyao.png" alt="">
              </div>
              <div class="sixth_info_q">
                实现药品、耗材的自动化仓储管理及物资在全院各个业务科室之间安全、高校、快捷传输。
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
  name: 'Caselist',
  props: ['caseTitle'],
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
<style scoped>
  /* @import "../../assets/css/info/CaseList.css"; */
</style>
<style scoped>
.sixth_part{background:linear-gradient(180deg,rgba(24,30,87,1) 0%,rgba(17,21,56,1) 100%);}
.sixth_part .sixth_scene_d{padding: 120px 0 100px;max-width: 1000px;margin: auto;}
.sixth_part .sixth_scene_d .sixth_info{
    /* width:420px; */
    padding: 80px 40px;
    /* height:152px; */
    background:#FFFFFF;margin:0 auto 20px;}
.sixth_part .sixth_scene_d .sixth_info .sixth_info_t{text-align: center;}
.sixth_part .sixth_scene_d .sixth_info .sixth_info_t img{width:179px;height:62px;display: inline-block;}
.sixth_part .sixth_scene_d .sixth_info .sixth_info_q{text-align: left;font-size:14px;font-weight:400;color:rgba(51,51,51,1);margin-top: 40px;}
.part_title{
    font-size: 28px;
    font-weight: 400;
    color: rgba(51,51,51,1);
    letter-spacing: 1px;
    text-align: center;
    padding: 0px 0 40px 0;
}
@media only screen and (min-width: 1200px){

}
@media screen and (max-width: 750px){

}

</style>
