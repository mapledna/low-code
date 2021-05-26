<template>
  <div class="controldesk" :style="conHeight">
    <div class="header">
      <div class="header-item">
        <a class="logo_a" href="/"><img class="logo" src="../../assets/logo1.png"></a>
        <div class="header_right">
          <el-dropdown @command="handleSelectProduct">
            <span class="el-dropdown-link">
              <span class="user" :title="currentType">
                <svg-icon :icon-class="systemType" />
                {{ currentType }}
              </span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in dataList"
                :key="item.key"
                :command="item"
              >
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="header_title right_order mdi mdi-help-circle-outline" @click="showHelp" />

          <div class="header_title right_presonal">
            <span>{{ userName }}</span>
            <ul class="massage_ul personal_show">
              <li>
                <a id="person_info" class="personal_news" @click="personalInfoDialog = true">个人资料</a>
              </li>
              <li>
                <a id="layout_mdf" class="personal_news" @click="passwordDialog = true">修改密码</a>
              </li>
              <li>
                <a class="login_out" @click="logout">注销</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="main_content">
      <div v-if="clickIndex===0" class="container_d con_product">
        <div class="content_c">
          <el-collapse v-model="activeProduct">
            <el-collapse-item title="配置平台" name="0">
              <div class="product_body">
                <div v-for="(item,index) in fixProduct" :key="index" class="work_content">
                  <a @click="clickProduct(item)">
                    <div class="product_content">
                      <div :style="item.productColor?'background:'+item.productColor+';':'background:linear-gradient(180deg,rgba(250,201,0,1) 0%,rgba(243,152,0,1) 100%);'" class="left_icon">
                        <span :class="item.productIcon?item.productIcon:'mdi mdi-weather-cloudy'" />
                      </div>
                    </div>
                    <div class="title_a">
                      <p class="pro_name">{{ item.productName }}</p>
                      <p class="pro_id">{{ item.productCode }}</p>
                    </div>
                  </a>
                </div>
                <div class="work_content">
                  <a href="#" @click="addProductDialog = true">
                    <div class="product_content">
                      <div style="background:#06C1B3;" class="left_icon">
                        <span class="el-icon-plus" />
                      </div>
                    </div>
                    <div class="title_a">
                      <p class="pro_name">添加产品</p>
                      <!-- <p class="pro_id">CRM</p> -->
                    </div>
                  </a>
                </div>
                <div class="work_content">
                  <a href="#" @click="copyProductDialog = true">
                    <div class="product_content">
                      <div style="background:#06C1B3;" class="left_icon">
                        <span class="el-icon-plus" />
                      </div>
                    </div>
                    <div class="title_a">
                      <p class="pro_name">复制产品</p>
                    </div>
                  </a>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item v-for="(items,indexs) in productData" :key="indexs" :title="items.categoryName" :name="indexs+1">
              <div class="product_body">
                <div v-for="(item,index) in items.products" :key="index" class="work_content">
                  <a @click="clickProduct(item)">
                    <el-badge :value="item.isMount===1?'外载':item.releaseStatus===0?'未发布':'已发布'" class="item" :type="item.isMount===1?'primary':item.releaseStatus===0?'warning':'success'">
                      <div class="product_content">
                        <div :style="item.productColor?'background:'+item.productColor+';':'background:linear-gradient(180deg,rgba(250,201,0,1) 0%,rgba(243,152,0,1) 100%);'" class="left_icon">
                          <span :class="item.productIcon?item.productIcon:'mdi mdi-weather-cloudy'" />
                        </div>
                      </div>
                      <div class="title_a">
                        <p class="pro_name">{{ item.productName }}</p>
                        <p class="pro_id">{{ item.productCode }}</p>
                      </div>
                    </el-badge>
                  </a>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
    <!-- <help-center :visible.sync="isShowHelpDialog" /> -->
    <el-dialog
      title="添加产品"
      :visible.sync="addProductDialog"
      width="42%"
      append-to-body
      class="add-product-dialog"
      @close="onClose"
    >
      <el-form ref="ruleForm" :model="ruleForm" :inline="true" :rules="rules" label-width="110px">
        <el-form-item label="产品分类" prop="categoryId">
          <el-select v-model="ruleForm.categoryId" clearable placeholder="请选择产品分类">
            <el-option v-for="(item,index) in formOptions.categoryId" :key="index" :label="item.categoryName" :value="item.categoryId" />
          </el-select>
        </el-form-item>
        <el-form-item label="父级产品" prop="pId">
          <el-select v-model="ruleForm.pId" clearable placeholder="请选择父级产品">
            <el-option v-for="(item,index) in formOptions.pId" :key="index" :label="item.productName" :value="item.productId" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="所属租户" prop="clientId">
          <el-select v-model="ruleForm.clientId" clearable placeholder="请选择所属租户">
            <el-option v-for="(item,index) in formOptions.clientId" :key="index" :label="item.client_name" :value="item.id" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="ruleForm.productName" clearable placeholder="请选择产品名称" />
        </el-form-item>
        <el-form-item label="产品代码" prop="productCode">
          <el-input v-model="ruleForm.productCode" clearable placeholder="请选择产品代码" />
        </el-form-item>
        <el-form-item label="产品图标" prop="productIcon">
          <ui-icon-picker v-model="ruleForm.productIcon" :enable-input="false" />
        </el-form-item>
        <el-form-item label="颜色选择" prop="productColor">
          <el-color-picker v-model="ruleForm.productColor" size="medium" />
        </el-form-item>
        <el-form-item label="是否外部挂载" prop="isMount" class="is-mount">
          <el-switch v-model="ruleForm.isMount" :active-value="1" :inactive-value="0" size="medium" @change="isMountChange" />
        </el-form-item>
        <el-form-item v-show="!ruleForm.isMount" label="是否共享" prop="isShare">
          <el-switch v-model="ruleForm.isShare" :active-value="1" :inactive-value="0" size="medium" />
        </el-form-item>
        <el-form-item v-show="!ruleForm.isMount" label="所属数据库" prop="databaseId">
          <el-select v-model="ruleForm.databaseId" clearable placeholder="请选择所属数据库" @change="databaseChange">
            <el-option v-for="(item,index) in formOptions.databaseId" :key="index" :label="item.dbName" :value="item.dbId" />
          </el-select>
          <i class="el-icon-coin databaseIcon" title="点击跳转到数据库管理" @click="clickProduct({productCode:'ui-database',productLink:'/ui-database/release',releaseStatus:1})" />
        </el-form-item>
        <el-form-item v-show="!ruleForm.isMount" label="数据库实例" prop="caseId">
          <el-select v-model="ruleForm.caseId" clearable placeholder="请选择数据库实例">
            <el-option v-for="(item,index) in formOptions.caseId" :key="index" :label="item.instName" :value="item.instId" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="ruleForm.isMount" label="是否对接本系统" prop="isOauth">
          <el-switch v-model="ruleForm.isOauth" :active-value="1" :inactive-value="0" size="medium" />
        </el-form-item>
        <el-form-item v-show="ruleForm.isMount" label="链接地址" prop="linkUrl">
          <el-input v-model="ruleForm.linkUrl" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="产品描述" prop="description">
          <el-input v-model="ruleForm.description" type="textarea" :rows="5" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addProductDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="复制产品"
      :visible.sync="copyProductDialog"
      width="42%"
      append-to-body
      class="copy-product-dialog"
      @close="onClose"
    >
      <el-form ref="ruleForm" :model="ruleForm" :inline="true" :rules="copyRules" label-width="110px">
        <el-form-item label="产品分类" prop="categoryId">
          <el-select v-model="ruleForm.categoryId" clearable placeholder="请选择产品分类">
            <el-option v-for="(item,index) in formOptions.categoryId" :key="index" :label="item.categoryName" :value="item.categoryId" />
          </el-select>
        </el-form-item>
        <el-form-item label="父级产品" prop="pId">
          <el-select v-model="ruleForm.pId" clearable placeholder="请选择父级产品">
            <el-option v-for="(item,index) in formOptions.pId" :key="index" :label="item.productName" :value="item.productId" />
          </el-select>
        </el-form-item>
        <el-form-item label="复制产品源" prop="sourceProdId">
          <el-select v-model="ruleForm.sourceProdId" clearable placeholder="请选择产品">
            <el-option v-for="(item,index) in formOptions.sourceProdId" :key="index" :label="item.productName" :value="item.productId" />
          </el-select>
        </el-form-item>

        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="ruleForm.productName" clearable placeholder="请选择产品名称" />
        </el-form-item>
        <el-form-item label="产品代码" prop="productCode">
          <el-input v-model="ruleForm.productCode" clearable placeholder="请选择产品代码" />
        </el-form-item>

        <el-form-item label="产品图标" prop="productIcon">
          <ui-icon-picker v-model="ruleForm.productIcon" :enable-input="false" />
        </el-form-item>
        <el-form-item label="颜色选择" prop="productColor">
          <el-color-picker v-model="ruleForm.productColor" size="medium" />
        </el-form-item>
        <el-form-item label="是否外部挂载" prop="isMount" class="is-mount">
          <el-switch v-model="ruleForm.isMount" :active-value="1" :inactive-value="0" size="medium" @change="isMountChange" />
        </el-form-item>
        <el-form-item v-show="!ruleForm.isMount" label="是否共享" prop="isShare">
          <el-switch v-model="ruleForm.isShare" :active-value="1" :inactive-value="0" size="medium" />
        </el-form-item>
        <el-form-item v-show="!ruleForm.isMount" label="所属数据库" prop="databaseId">
          <el-select v-model="ruleForm.databaseId" clearable placeholder="请选择所属数据库" @change="databaseChange">
            <el-option v-for="(item,index) in formOptions.databaseId" :key="index" :label="item.dbName" :value="item.dbId" />
          </el-select>
          <i class="el-icon-coin databaseIcon" title="点击跳转到数据库管理" @click="clickProduct({productCode:'ui-database',productLink:'/ui-database/release',releaseStatus:1})" />
        </el-form-item>
        <el-form-item v-show="!ruleForm.isMount" label="数据库实例" prop="caseId">
          <el-select v-model="ruleForm.caseId" clearable placeholder="请选择数据库实例">
            <el-option v-for="(item,index) in formOptions.caseId" :key="index" :label="item.instName" :value="item.instId" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="ruleForm.isMount" label="是否对接本系统" prop="isOauth">
          <el-switch v-model="ruleForm.isOauth" :active-value="1" :inactive-value="0" size="medium" />
        </el-form-item>
        <el-form-item v-show="ruleForm.isMount" label="链接地址" prop="linkUrl">
          <el-input v-model="ruleForm.linkUrl" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="产品描述" prop="description">
          <el-input v-model="ruleForm.description" type="textarea" :rows="5" />
        </el-form-item>
      </el-form>
      <div style="color:red;">
        <p>注：1、源产品的数据库与目标产品的数据库的厂商要一致</p>
        <p style="padding-left: 28px;">
          2、目标产品的数据库表自行创建
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="copyProductDialog = false">取 消</el-button>
        <el-button type="primary" @click="copyProductSubmitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改密码"
      :visible.sync="passwordDialog"
      width="20%"
      append-to-body
      class="password-dialog"
      @close="onClosePassword"
    >
      <el-form ref="passwordForm" :model="passwordForm" :inline="false" :rules="passwordRules" label-width="100px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" show-password clearable placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" show-password clearable placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" show-password clearable placeholder="请确认新密码" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordDialog = false">取 消</el-button>
        <el-button type="primary" @click="passwordSubmitForm('passwordForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="个人资料"
      :visible.sync="personalInfoDialog"
      width="30%"
      append-to-body
      class="personalinfo-dialog"
    >
      <div class="per-con">
        <p class="per-p">
          <span class="per-title">真实姓名:</span>
          <span v-if="personInfo.realName" class="per-word">{{ personInfo.realName }}</span>
          <span v-else class="non-word">未填写</span>
        </p>
        <p class="per-p">
          <span class="per-title">地址:</span>
          <span v-if="personInfo.address" class="per-word">{{ personInfo.address }}</span>
          <span v-else class="non-word">未填写</span>
        </p>
        <p class="per-p">
          <span class="per-title">手机号:</span>
          <span v-if="personInfo.mobile" class="per-word">{{ personInfo.mobile }}</span>
          <span v-else class="non-word">未填写</span>
        </p>
        <p class="per-p">
          <span class="per-title">职位:</span>
          <span v-if="personInfo.position" class="per-word">{{ personInfo.position }}</span>
          <span v-else class="non-word">未填写</span>
        </p>
        <p class="per-p">
          <span class="per-title">账号:</span>
          <span v-if="personInfo.userName" class="per-word">{{ personInfo.userName }}</span>
          <span v-else class="non-word">未填写</span>
        </p>
        <p class="per-p">
          <span class="per-title">工号:</span>
          <span v-if="personInfo.wokerNum" class="per-word">{{ personInfo.wokerNum }}</span>
          <span v-else class="non-word">未填写</span>
        </p>
        <p class="per-p">
          <span class="per-title">邮箱:</span>
          <span v-if="personInfo.email" class="per-word">{{ personInfo.email }}</span>
          <span v-else class="non-word">未填写</span>
        </p>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="passwordDialog = false">取 消</el-button>
        <el-button type="primary" @click="passwordSubmitForm('passwordForm')">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
// import HelpCenter from '@/components/Helper'
import common from '@/utils/tool'
import { getSpecialPath } from '@router/tool'

export default {
  name: 'ControlDesk',
  components: {
    // HelpCenter
  },
  props: {
  },
  data() {
    return {
      userName: '',
      clickIndex: 0,
      headerArr: [{ value: 0, label: '产品中心' }
      ],
      activeProduct: ['0'],
      activeProject: ['1'],
      productData: [],
      fixProduct: [], // 固定产品
      isShowHelpDialog: false,
      dataList: [], // 产品数据列表
      conHeight: { height: `${document.documentElement.clientHeight}px` },
      currentType: '',
      systemType: 'project',
      addProductDialog: false,
      copyProductDialog: false,
      hasProduct: false, // 判断是否其他产品，没有其他产品就提示添加产品
      clientId: '', // 租户id
      formOptions: {
        categoryId: [],
        pId: [],
        // clientId: [],
        databaseId: [],
        caseId: [],
        sourceProdId: []
      },
      ruleForm: {
        categoryId: '',
        pId: '',
        clientId: '',
        productName: '',
        productCode: '',
        productImage: '',
        productIcon: '',
        databaseId: '',
        caseId: '',
        productColor: '',
        isShare: 0,
        isMount: 0,
        isOauth: 0,
        linkUrl: '',
        description: '',
        sourceProdId: ''
      },
      rules: {
        categoryId: [
          { required: true, message: '请选择产品分类', trigger: 'change' }
        ],
        pId: [
          { required: true, message: '请选择父级产品', trigger: 'change' }
        ],
        // clientId: [
        //   { required: true, message: '请选择所属租户', trigger: 'change' }
        // ],
        productName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        productCode: [
          { required: true, message: '请输入产品代码', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              //  校验英文的正则
              if (!/[a-zA-z]$/.test(value)) {
                callback(new Error('请输入英文'))
              } else {
                // 校验通过
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        databaseId: [
          { required: true, message: '请选择所属数据库', trigger: 'change' }
        ],
        caseId: [
          { required: true, message: '请选择数据库实例', trigger: 'change' }
        ],
        productIcon: [
          { required: true, message: '请选择产品图标', trigger: 'change' }
        ],
        productColor: [
          { required: true, message: '请选择产品颜色', trigger: 'change' }
        ]
      },
      copyRules: {
        categoryId: [
          { required: true, message: '请选择产品分类', trigger: 'change' }
        ],
        pId: [
          { required: true, message: '请选择父级产品', trigger: 'change' }
        ],
        // clientId: [
        //   { required: true, message: '请选择所属租户', trigger: 'change' }
        // ],
        sourceProdId: [
          { required: true, message: '请选择产品名称', trigger: 'change' }
        ],
        productName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        productCode: [
          { required: true, message: '请输入产品代码', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              //  校验英文的正则
              if (!/[a-zA-z]$/.test(value)) {
                callback(new Error('请输入英文'))
              } else {
                // 校验通过
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        databaseId: [
          { required: true, message: '请选择所属数据库', trigger: 'change' }
        ],
        caseId: [
          { required: true, message: '请选择数据库实例', trigger: 'change' }
        ],
        productIcon: [
          { required: true, message: '请选择产品图标', trigger: 'change' }
        ],
        productColor: [
          { required: true, message: '请选择产品颜色', trigger: 'change' }
        ]

      },
      passwordDialog: false,
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordRules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认新密码', trigger: 'blur' }
        ]
      },
      personalInfoDialog: false,
      personInfo: {
        realName: '',
        address: '',
        mobile: '',
        position: '',
        userName: '',
        wokerNum: '',
        email: ''
      }
    }
  },
  computed: {

  },
  async mounted() {
    await this.getDataList()
    this.productFixedData()
    this.getProductData()
    this.getProductCategory()
    this.getDatabaseInst()
    this.getUserDetails()
  },
  methods: {
    onClose() {
      this.$refs.ruleForm.resetFields()
    },
    onClosePassword() {
      this.$refs.passwordForm.resetFields()
    },
    clickLi(val) {
      this.clickIndex = val
    },
    productFixedData() { // 获取prod和ui-system固定产品数据
      this.$server.productFixed().then(res => {
        this.fixProduct = res
      })
    },
    getProductData() { // 获取产品数据
      this.$ntiLoading.show()
      this.$server.getProduct({ clientId: this.clientId }).then(res => {
        this.$ntiLoading.hide()
        this.userName = res.realName
        this.hasProduct = false
        if (res.categorys.length >= 1) {
          this.hasProduct = true
        }
        res.categorys.forEach((item, index) => {
          this.activeProduct.push(index + 1)
        })
        this.productData = res.categorys
      })
    },
    showHelp() { // 点击帮助文档
      this.$router.push({
        path: '/Help', name: 'Help'
        // query:{appCode:appCode,clientId: clientId,corpId:corpId},
      })
    },
    logout() { // 注销
      this.$server.getLogout(getSpecialPath('CLOUD_LOGIN'))
    },
    /**
     * @param {String} code 产品编码
     * @param {String} productLink 产品跳转路径
     * @param {Number} releaseStatus 是否已经发布 1已发布 0未发布
     * @param {Boolean} isAddProduct 当前租户下没有产品时，是否需要提示用户先添加产品 true需要  false不需要
     * @param {Number} isMount 是否外部挂在 1是 0否 外部挂载不需要发布，不用提示'该产品未发布，不能访问!'
     * @param {Number} isOauth 是否对接本系统  1对接 0不对接
     * @param {String} linkUrl 外部挂载的系统链接
     */
    clickProduct(item) {
      let code = item.productCode
      let isAddProduct = true
      const {
        productLink, releaseStatus, isMount, isOauth, linkUrl
      } = item
      if (code === 'prod' || code === 'ui-system') {
        code = ''
      }
      if (code === 'ui-client' || code === 'ui-database') {
        isAddProduct = false
      }
      // if (!this.hasProduct && isAddProduct) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请先添加产品!'
      //   })
      //   return
      // }
      // if (releaseStatus === 0 && isMount === 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: '该产品未发布，不能访问!'
      //   })
      //   return
      // }
      if (isMount === 1) {
        // console.log(11122, isOauth, linkUrl)
        const Authorization = sessionStorage.getItem('Authorization').replace('Bearer ', '')
        let newUrl
        if (isOauth === 0) {
          newUrl = linkUrl
        } else {
          newUrl = `${linkUrl && linkUrl.indexOf('?') < 0 ? `${linkUrl}?` : `${linkUrl}&`}token=${Authorization}`
        }
        // console.log(newUrl)
        window.open(newUrl)
      } else {
        common.getOauthToken({ sessionKey: sessionStorage.getItem('SessionKey') }, code, productLink, this.clientId)
      }
    },
    // 获取租户或者产品列表
    async getDataList() {
      let sqlId = '1278966499505532929'
      if (this.systemType === 'project') {
        sqlId = '1288769746943086593'
      }
      await this.$server.listClientUser().then(res => {
        this.currentType = res[0].label
        this.clientId = res[0].id
        this.ruleForm.clientId = res[0].id
        this.dataList = res
      })
    },
    handleSelectProduct(product) {
      if (product.id === this.clientId) {
        return
      }
      this.currentType = product.label
      this.clientId = product.id
      this.ruleForm.clientId = product.id
      this.getProductData()
      this.getProductCategory()
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$server.createProduct(this.ruleForm).then(res => {
            this.$message({
              type: 'success',
              message: res
            })
            this.addProductDialog = false
            this.getProductData()
          })
          return true
        }
        console.log('error submit!!')
        return false
      })
    },
    copyProductSubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$server.copyProduct(this.ruleForm).then(res => {
            this.$message({
              type: 'success',
              message: res
            })
            this.copyProductDialog = false
            this.getProductData()
          })
          return true
        }
        console.log('error submit!!')
        return false
      })
    },
    passwordSubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$server.modifyPassword(this.passwordForm).then(res => {
            this.$message({
              type: 'success',
              message: res
            })
            this.passwordDialog = false
          })
          return true
        }
        console.log('error submit!!')
        return false
      })
    },
    // 获取下拉数据
    getOptions() {
      const paramsArr = [
        { sqlId: '1264767715292631041', parameters: {} },
        { sqlId: '1264796049439346689', parameters: {} },
        // { sqlId: '1268006416625852418', parameters: {} },
        { sqlId: '1264798319111458817', parameters: {} },
        { sqlId: '1264798695025954818', parameters: { db_id: '' } }
      ]
      this.$server.allExecuteSqls(paramsArr).then(res => {
        console.log(2332, res)
        this.formOptions.categoryId = res.table_0
        this.formOptions.pId = res.table_1
        // this.formOptions.clientId = res.table_2
        this.formOptions.databaseId = res.table_2
        this.formOptions.caseId = res.table_3
      })
    },
    getProductCategory() {
      // 获取产品分类
      this.$server.listProductCategory({ clientId: this.clientId }).then(res => {
        this.formOptions.categoryId = res
      })
      // 获取产品列表
      this.$server.listProduct({ clientId: this.clientId }).then(res => {
        this.formOptions.pId = res
      })
      this.$server.listAllowCopyProduct({ clientId: this.clientId }).then(res => {
        this.formOptions.sourceProdId = res
      })
      // 获取数据库列表
      this.$server.listDatabase({ clientId: this.clientId }).then(res => {
        this.formOptions.databaseId = res
      })
    },
    getDatabaseInst() {
      this.$server.listDatabaseInst({ dbId: this.ruleForm.databaseId }).then(res => {
        this.formOptions.caseId = res
      })
    },
    databaseChange(val) {
      if (this.ruleForm.caseId) this.ruleForm.caseId = ''
      this.getDatabaseInst()
    },
    isMountChange(val) {
      if (val === 1) {
        this.rules.databaseId[0].required = false
        this.rules.caseId[0].required = false
      } else {
        this.rules.databaseId[0].required = true
        this.rules.caseId[0].required = true
      }
    },
    // 获取个人资料数据
    getUserDetails() {
      this.$server.getUserDetails().then(res => {
        this.personInfo = res
      })
    }
  }
}
</script>

<style lang="scss">
.add-product-dialog .el-form.el-form--inline .el-form-item{
    margin-bottom: 16px;
}
.add-product-dialog .is-mount{
  width: 310px;
}
.add-product-dialog .el-textarea{
  width: 550px;
}
.add-product-dialog .databaseIcon{
  font-size: 18px;
  cursor: pointer;
  margin-left: 10px;
}
.copy-product-dialog .el-form.el-form--inline .el-form-item{
    margin-bottom: 16px;
}
.copy-product-dialog .is-mount{
  width: 310px;
}
.copy-product-dialog .el-textarea{
  width: 550px;
}
.copy-product-dialog .databaseIcon{
  font-size: 18px;
  cursor: pointer;
  margin-left: 10px;
}
.controldesk{overflow: auto;}
.controldesk .main_content .el-collapse-item__header{font-size: 18px;font-weight: 500;color: #666;}
/*顶部logo区域*/
.controldesk .header {width: 100%;height: 56px;line-height: 56px;position: fixed;top: 0;left: 0;right: 0;z-index: 9;/*box-shadow: 0px 3px 14px 6px rgba(50, 49, 57, 0.04);*/background: #f7f7fa;}
.controldesk .header .header-item {padding: 0 32px;height: 56px;}
.controldesk .header .header-item .logo {width: 232px;height: 48px;display: inline-block;}
.header_right {display: inline-block;position: absolute;right: 16px;font-size:15px;color:#ffffff;top:0;z-index:9999999;height: 56px;}
.header_title {padding: 0 16px;height: 100%;display: inline-block;position:relative;color:#1D171B;font-size:18px;}
.header_right .header_title:hover {background: rgba(255,255,255,1);cursor: pointer;color:#4a90e2;box-shadow:0px 0px 20px 0px rgba(45,45,59,0.08)}
.header_right .header_title:hover .massage_ul {display: block;}
.header_right .el-dropdown{line-height: normal;vertical-align: baseline;cursor: pointer;}
.massage_ul {background: #fff;z-index: 1111;position: absolute;width: 200px;padding: 0 16px;top: 48px;right:0;display: none;box-shadow:0px 0px 20px 0px rgba(45,45,59,0.08)}
.massage_ul li a {width: 100%;display: inline-block;text-align: center;height: 15px;font-size: 16px;color: rgba(102,102,102,1);line-height: 17px;cursor: pointer;}
.massage_ul .login_out:hover {color:rgba(181,39,45,1);}
.massage_ul li a:hover {color:rgba(74,144,226,1);}
.massage_ul li:not(:last-child) {border-bottom: 1px solid #e2e2e2;padding: 16px 0;}
.personal_show {width: 152px;padding: 0;}
.personal_show li {border-bottom: none !important;padding: 0 16px !important;}
.personal_show li a{color:#111;font-size:16px;}
/*内容区域*/
.main_content{position: relative;top: 50px;}
.container_d{padding: 48px 0 0;}
.content_c{padding: 0 64px;}
.product_body{overflow:hidden;margin: 58px 0px 0px;}
.work_content{float: left;width: 160px;margin: 10px 16px 68px 14px;position:relative; cursor: pointer;text-align: center;}
.work_content a{text-decoration: none;color:#ffffff;}
.product_content .left_icon{width:60px;height:60px;border-radius:8px;margin: auto;text-align: center;line-height: 60px;font-size: 28px;color: #ffffff;}
.title_a{text-align: center;}
.title_a .pro_name{font-size:18px;font-weight:500;color:#333;line-height:32px;margin: 16px 0 0;}
.title_a .pro_id{font-size:15px;font-weight:500;color:#999999;line-height:20px;margin: 2px 0 0;}

.personalinfo-dialog{
  .per-con{
    .per-p{
      line-height: 36px;
      font-size: 14px;
      .per-title{
        font-weight: 400;
        color: #C1B5B8;
        width: 70px;
        display: inline-block;
      }
      .per-word{
        font-weight: 400;
        color: #171D1B;
        margin-left: 20px;
      }
      .non-word{
        font-weight: 400;
        color: #C1B5B8;
        margin-left: 20px;
      }
    }
  }
}
</style>
