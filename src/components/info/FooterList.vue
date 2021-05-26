<template>
  <div class="footerlist">
    <div class="top_part">
      <div class="top_scene_d">
        <el-row :gutter="0">
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <div class="top_info">
              <img
                class="top_info_img"
                src="../../assets/img/info/icon_customize.png"
                alt=""
              />
              <div class="top_info_title">
                <div class="top_info_t">按需定制</div>
                <div class="top_info_c">以公司需求定制</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <div class="top_info">
              <img
                class="top_info_img"
                src="../../assets/img/info/icon_setting.png"
                alt=""
              />
              <div class="top_info_title">
                <div class="top_info_t">快速配置</div>
                <div class="top_info_c">快速按需求配置完善</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <div class="top_info">
              <img
                class="top_info_img"
                src="../../assets/img/info/icon_service.png"
                alt=""
              />
              <div class="top_info_title">
                <div class="top_info_t">1V1客户服务</div>
                <div class="top_info_c">每个客户配销售</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <div class="top_info">
              <img
                class="top_info_img"
                src="../../assets/img/info/icon_profession.png"
                alt=""
              />
              <div class="top_info_title">
                <div class="top_info_t">专业服务</div>
                <div class="top_info_c">每个客户配销售</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="bom_scene_d">
        <el-row :gutter="0">
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <div class="bom_info">
              <div class="bom_info_t">售前咨询热线</div>
              <div class="bom_info_title">
                <div class="bom_info_c" style="font-size: 18px">
                  0755-25161222
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <div class="bom_info">
              <div class="bom_info_t">产品分类</div>
              <div class="bom_info_title">
                <div class="bom_info_c">物流仓储</div>
                <div class="bom_info_c">研发设计</div>
                <div class="bom_info_c">生产制造</div>
                <div class="bom_info_c">企业运营</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <div class="bom_info">
              <div class="bom_info_t">产品分类</div>
              <div class="bom_info_title">
                <div class="bom_info_c">新零售解决方案</div>
                <div class="bom_info_c">新制造解决方案</div>
                <div class="bom_info_c">新能源解决方案</div>
                <div class="bom_info_c">智能工厂解决方案</div>
                <div class="bom_info_c">智能医疗行业解决方案</div>
                <div class="bom_info_c">智慧园区解决方案</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <div class="bom_info">
              <div class="bom_info_t">企业中台</div>
              <div class="bom_info_title">
                <div class="bom_info_c">技术中台</div>
                <div class="bom_info_c">业务中台</div>
                <div class="bom_info_c">数据中台</div>
                <div class="bom_info_c">AI中台</div>
                <div class="bom_info_c">IoT中台</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <div class="bom_info">
              <div class="scan_qrCode">
                <img src="../../assets/img/info/wechat_qr.png" alt="" />
                <p class="scan_qrCode_w">微信公众号</p>
              </div>
              <div class="scan_qrCode">
                <img src="../../assets/img/info/dingding_qr.png" alt="" />
                <p class="scan_qrCode_w">钉钉企业主页</p>
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
  name: "Footerlist",
  data() {
    return {
      // msg: 'Welcome to Your Vue.js App'
    };
  },
  mounted() {},
  methods: {},
};
</script>
<style>
/* @import "../../assets/css/info/FooterList.css"; */
</style>
<style scoped>
.top_part {
  background: #0a0d31;
  padding: 38px 0 64px;
}
.top_part .top_scene_d {
  max-width: 1200px;
  margin: auto;
}
.top_part .top_scene_d .top_info {
  width: 200px;
  margin: 0 auto 51px;
  position: relative;
}
.top_part .top_scene_d .top_info .top_info_img {
  height: 48px;
  width: 48px;
  display: inline-block;
  position: absolute;
  top: 0px;
}
.top_part .top_scene_d .top_info .top_info_title {
  text-align: left;
  display: inline-block;
  width: 200px; /* top: 6px; */
  left: 64px;
  position: relative;
}
.top_part .top_scene_d .top_info .top_info_t {
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
}
.top_part .top_scene_d .top_info .top_info_c {
  font-size: 12px;
  font-weight: 400;
  color: #ffffff;
  margin-top: 4px;
}
.top_part .bom_scene_d {
  /* padding: 120px 0 100px; */
  max-width: 1200px;
  margin: auto;
}
.top_part .bom_scene_d .bom_info {
  padding: 0 0px 30px;
  text-align: left;
}
.top_part .bom_scene_d .bom_info_t {
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  margin-bottom: 8px;
}
.top_part .bom_scene_d .bom_info_c {
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  margin-top: 8px;
}
.top_part .bom_scene_d .bom_info .scan_qrCode {
  display: inline-block;
  margin: 0 8px;
}
.top_part .bom_scene_d .bom_info img {
  display: inline-block;
}
.top_part .bom_scene_d .bom_info .scan_qrCode_w {
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  margin-top: 16px;
  width: 100px;
  text-align: center;
}
@media only screen and (min-width: 1200px) {
  .bom_scene_d .el-col-lg-6 {
    width: 20%;
  }
}
@media screen and (max-width: 750px) {
  .top_part .bom_scene_d .bom_info {
    padding: 0 30px 30px;
  }
}
@media screen and (max-width: 750px) {
  .top_part {
    display: none;
  }
}
</style>
