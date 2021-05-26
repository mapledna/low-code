<template>
  <div>
    <el-row :gutter="15">
      <el-form
        ref="elForm"
        :model="formData"
        :rules="rules"
        size="medium"
        label-width="100px"
        @submit.native.prevent
      >
        <el-col :span="24">
          <el-row :gutter="15">
            <el-col :span="3">
              <el-form-item label-width="0" prop="field101">
                <el-button
                  type="primary"
                  size="medium"
                  :style="{ width: '100px' }"
                  native-type="button"
                  @click="handleSave"
                >
                  <i style="fontStyle:normal">保存</i>
                </el-button>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label-width="0" prop="field102">
                <el-button
                  type="primary"
                  size="medium"
                  :style="{ width: '100px' }"
                  native-type="button"
                  @click="handleClose"
                >
                  <i style="fontStyle:normal">取消</i>
                </el-button>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="3">
              <el-form-item label-width="0" prop="field103">
                <el-button
                  type="primary"
                  size="medium"
                  :style="{ width: '100px' }"
                  native-type="button"
                >
                  <i style="fontStyle:normal">预览</i>
                </el-button>
              </el-form-item>
            </el-col> -->
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-row :gutter="15">
            <el-col :span="12">
              <el-form-item label="排序" prop="sort_no">
                <el-input-number
                  :value="
                    formData.sort_no === '' || formData.sort_no === null
                      ? undefined
                      : formData.sort_no
                  "
                  placeholder="排序"
                  @input="
                    $event => {
                      formData.sort_no = $event;
                    }
                  "
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="父级菜单" prop="p_id">
                <combo-tree
                  v-model="formData.p_id"
                  :data="field108Options"
                  size="small"
                  label-key="label"
                  :show-checkbox="false"
                  :default-expand-all="false"
                  :highlight-current="false"
                  :accordion="true"
                  :draggable="false"
                  placeholder="请选择父级菜单"
                  display-type="input"
                  trigger-type="click"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单名称" prop="menu_name">
                <el-input
                  v-model="formData.menu_name"
                  placeholder="请输入菜单名称"
                  clearable
                  :style="{ width: '100%' }"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单编码" prop="menu_code">
                <el-input
                  v-model="formData.menu_code"
                  placeholder="请输入菜单编码"
                  clearable
                  :style="{ width: '100%' }"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单图标" prop="menu_icon">
                <ui-icon-picker
                  v-model="formData.menu_icon"
                  :enable-input="false"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="图标颜色" prop="icon_color">
                <el-input
                  v-model="formData.icon_color"
                  placeholder="请输入图标颜色"
                  clearable
                  :style="{ width: '100%' }"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否导航" prop="is_navigation">
                <el-radio-group v-model="formData.is_navigation" size="medium">
                  <el-radio
                    v-for="(item, index) in field114Options"
                    :key="index"
                    :label="item.value"
                    :disabled="item.disabled"
                  >
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="外部链接" prop="menu_href">
                <el-input
                  v-model="formData.menu_href"
                  placeholder="请输入外部链接"
                  clearable
                  :style="{ width: '100%' }"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="对应页面" prop="part_id">
                <combo-tree
                  v-model="formData.part_id"
                  :data="formData.field119Table.filterOptions.buttonPage"
                  placeholder="请选择对应页面"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <template v-if="!formData.part_id">
          <el-col :span="24">
            <el-form-item label-width="0" prop="field117">
              <p
                style="width:100%;margin:0;display:block;color:;fontSize:16px;textAlign:left;background:rgba(222, 222, 222, 1);"
              >
                <span>初始化配置<span /></span>
              </p>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="列表SQL" prop="field118">
              <combo-tree
                v-model="formData.field118"
                :data="field118Options"
                size="small"
                placeholder="请选择列表SQL"
              />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button
              type="primary"
              size="medium"
              native-type="button"
              @click="handleGenerateTable"
            >
              <i style="fontStyle:normal">生成页面</i>
            </el-button>
          </el-col>
          <el-col :span="3">
            <el-button
              type="primary"
              size="medium"
              native-type="button"
              @click="handleGenerateTableAndFormPart"
            >
              <i style="fontStyle:normal">生成SQL和页面</i>
            </el-button>
          </el-col>
          <el-col :span="24">
            <el-form-item label-width="0" prop="field119">
              <el-table
                ref="field119Table"
                v-loading="formData.field119Table.loading"
                row-key="id"
                :data="formData.field119"
                :border="false"
                :stripe="false"
                :height="300"
                size="mini"
                :fit="true"
                highlight-current-row
                @selection-change="handleSelectionChange($event, 'field119')"
              >
                <el-table-column
                  prop="buttonName"
                  label="按钮名称"
                  min-width="120px"
                  align="left"
                  :formatter="
                    row => formatterFn(row, 'buttonName', 'field119')
                  "
                  :fixed="false"
                  :sortable="false"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <el-select
                      v-model="formData.field119[scope.$index].buttonName"
                      clearable
                      filterable
                      size="mini"
                      placeholder="请选择按钮名称"
                      @blur="
                        e => {
                          formData.field119[scope.$index].buttonName =
                            e.target.value;
                        }
                      "
                    >
                      <el-option
                        v-for="(option, index) in formData.field119Table
                          .filterOptions.buttonName"
                        :key="index"
                        :label="option.label"
                        :value="option.id"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="buttonCode"
                  label="按钮编码"
                  min-width="120px"
                  align="left"
                  :fixed="false"
                  :sortable="false"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="formData.field119[scope.$index].buttonCode"
                      type="text"
                      size="mini"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="buttonPosition"
                  label="按钮位置"
                  min-width="120px"
                  align="left"
                  :formatter="
                    row => formatterFn(row, 'buttonPosition', 'field119')
                  "
                  :fixed="false"
                  :sortable="false"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <el-select
                      v-model="formData.field119[scope.$index].buttonPosition"
                      clearable
                      filterable
                      size="mini"
                      placeholder="请选择按钮位置"
                    >
                      <el-option
                        v-for="(option, index) in formData.field119Table
                          .filterOptions.buttonPosition"
                        :key="index"
                        :label="option.label"
                        :value="option.id"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="actionType"
                  label="事件类型"
                  min-width="120px"
                  align="left"
                  :formatter="
                    row => formatterFn(row, 'actionType', 'field119')
                  "
                  :fixed="false"
                  :sortable="false"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <el-select
                      v-model="formData.field119[scope.$index].actionType"
                      clearable
                      filterable
                      size="mini"
                      placeholder="请选择事件类型"
                    >
                      <el-option
                        v-for="(option, index) in formData.field119Table
                          .filterOptions.actionType"
                        :key="index"
                        :label="option.label"
                        :value="option.id"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="buttonAction"
                  label="按钮事件"
                  min-width="120px"
                  align="left"
                  :formatter="
                    row => formatterFn(row, 'buttonAction', 'field119')
                  "
                  :fixed="false"
                  :sortable="false"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <!-- <el-select v-model="formData.field119[scope.$index].buttonAction" clearable filterable size="mini"
                             placeholder="请选择按钮事件"
                  >
                    <el-option v-for="(option,index) in formData.field119Table.filterOptions.buttonAction"
                               :key="index" :label="option.label" :value="option.id"
                    />
                  </el-select> -->
                    <combo-tree
                      v-if="formData.field119[scope.$index].actionType === 2"
                      v-model="formData.field119[scope.$index].buttonAction"
                      :data="
                        formData.field119Table.filterOptions.flowButtonAction
                      "
                      size="mini"
                      placeholder="请选择按钮事件"
                    />
                    <combo-tree
                      v-else
                      v-model="formData.field119[scope.$index].buttonAction"
                      :data="
                        formData.field119Table.filterOptions.sqlButtonAction
                      "
                      size="mini"
                      placeholder="请选择按钮事件"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="buttonPage"
                  label="对应页面"
                  min-width="120px"
                  align="left"
                  :formatter="
                    row => formatterFn(row, 'buttonPage', 'field119')
                  "
                  :fixed="false"
                  :sortable="false"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <!-- <el-select v-model="formData.field119[scope.$index].buttonPage" clearable filterable size="mini"
                             placeholder="请选择对应页面"
                  >
                    <el-option v-for="(option,index) in formData.field119Table.filterOptions.buttonPage"
                               :key="index" :label="option.label" :value="option.id"
                    />
                  </el-select> -->

                    <combo-tree
                      v-model="formData.field119[scope.$index].buttonPage"
                      :data="formData.field119Table.filterOptions.buttonPage"
                      size="mini"
                      placeholder="请选择对应页面"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="initData"
                  label="初始数据源"
                  min-width="120px"
                  align="left"
                  :formatter="row => formatterFn(row, 'initData', 'field119')"
                  :fixed="false"
                  :sortable="false"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <combo-tree
                      v-model="formData.field119[scope.$index].initData"
                      :data="formData.field119Table.filterOptions.initData"
                      size="mini"
                      placeholder="请选择初始数据源"
                    />
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="150px">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="small"
                      row-btn="rowbtn_add"
                      @click="addRowBtn('field119', scope)"
                    >
                      <i style="fontStyle:normal">增加</i>
                    </el-button>
                    <el-button
                      type="text"
                      size="small"
                      row-btn="rowbtn_del"
                      @click="deleteRowBtn('field119', scope)"
                    >
                      <i style="fontStyle:normal">删除</i>
                    </el-button>
                    <el-button
                      type="text"
                      size="small"
                      row-btn="rowbtn_run"
                      @click="handleGenerateForm('field119', scope)"
                    >
                      <i style="fontStyle:normal">生成</i>
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
    </el-row>
  </div>
</template>
<script>
import {
  addFormPart,
  addTablePart,
  addTableAndFormPart
} from '@/components/generator/autoGenerate/index.js'

export default {
  components: {

  },
  props: {
    pageParams: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      formData: {
        sort_no: null,
        p_id: null,
        menu_name: null,
        menu_code: null,
        menu_icon: null,
        icon_color: null,
        is_navigation: null,
        menu_href: null,
        part_id: null,
        field117: null,
        field118: null,
        field119: [
          {
            buttonName: 'create',
            buttonCode: 'topbtn_create',
            buttonPosition: 'topBtn',
            actionType: 1,
            buttonAction: '',
            buttonPage: '',
            initData: ''
          },
          {
            buttonName: 'update',
            buttonCode: 'rowbtn_update',
            buttonPosition: 'rowBtn',
            actionType: 1,
            buttonAction: '',
            buttonPage: '',
            initData: ''
          },
          {
            buttonName: 'delete',
            buttonCode: 'rowbtn_delete',
            buttonPosition: 'rowBtn',
            actionType: 1,
            buttonAction: '',
            buttonPage: '',
            initData: ''
          }
        ],
        field119Table: {
          noPaging: true,
          search: {},
          filterOptions: {
            buttonName: [],
            buttonPosition: [],
            actionType: [
              { label: 'SQL服务', id: 1 },
              { label: '事务流服务', id: 2 }
            ],
            sqlButtonAction: [],
            flowButtonAction: [],
            buttonPage: [],
            initData: []
          },
          loading: false
        }
      },
      rules: {
        sort_no: [
          {
            required: true,
            message: '排序',
            trigger: 'blur'
          }
        ],
        p_id: [{
          required: true,
          message: '请选择父级菜单',
          trigger: 'change'
        }],
        menu_name: [
          {
            required: true,
            message: '请输入菜单名称',
            trigger: 'blur'
          }
        ],
        menu_code: [
          {
            required: true,
            message: '请输入菜单编码',
            trigger: 'blur'
          }
        ],
        icon_color: [
          {
            // required: true,
            message: '请输入图标颜色',
            trigger: 'blur'
          }
        ],
        is_navigation: [
          {
            required: true,
            message: '是否导航不能为空',
            trigger: 'change'
          }
        ],
        menu_href: [
          {
            // required: true,
            message: '请输入外部链接',
            trigger: 'blur'
          }
        ],
        part_id: [
          {
            required: true,
            message: '请选择对应页面',
            trigger: 'change'
          }
        ],
        field118: [
          {
            // required: true,
            message: '请选择列表SQL',
            trigger: 'change'
          }
        ]
      },
      field108Options: [],
      field114Options: [
        { label: '是', value: '1' },
        { label: '否', value: '0' }
      ],
      field116Options: [],
      field118Options: [],
      page: {
        // ...this.getUrlParam(),
        // ...(this.pageParams ? {
        //   ...this.pageParams,
        //   ...this.pageParams.params
        // } : {})
      },
      field119Options: []
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getParentMenu()
    this.getTableOptions()
  },
  methods: {
    // 获取父级菜单树形下拉数据
    getParentMenu() {
      this.$server
        .executeSqls('1274992298620776450')
        .then(res => {
          // console.log(res)
          this.field108Options = res
        })
    },
    // 获取表格中的下拉数据
    getTableOptions() {
      const paramsArr = [
        {
          sqlId: '1257968258652504065',
          parameters: { p_id: '1286220614187085825' }
        }, // 按钮名称 GetDictionary('1286220614187085825')
        {
          sqlId: '1257968258652504065',
          parameters: { p_id: '1286221367035293698' }
        }, // 按钮位置 GetDictionary('1286221367035293698')
        { sqlId: '1265130884821331976', parameters: {} }, // 事件类型为SQL服务时的按钮事件 GetData('1265130884821331976','label','id')
        { sqlId: '1265130884821331975', parameters: {} }, // 事件类型为事务流服务时的按钮事件 GetData('1265130884821331975','label','id')
        { sqlId: '1264753294889603073', parameters: {} } // 对应页面 GetData('1264753294889603073','label','id')
      ]
      this.$server.allExecuteSqls(paramsArr).then(res => {
        this.formData.field119Table.filterOptions.buttonName = res.table_0 // 按钮名称
        this.formData.field119Table.filterOptions.buttonPosition = res.table_1 // 按钮位置
        this.formData.field119Table.filterOptions.sqlButtonAction = res.table_2 // 事件类型为SQL服务时的按钮事件
        this.field118Options = res.table_2 // 列表SQL下拉数据
        this.formData.field119Table.filterOptions.flowButtonAction = res.table_3 // 事件类型为事务流服务时的按钮事件
        this.formData.field119Table.filterOptions.buttonPage = res.table_4 // 对应页面
        this.formData.field119Table.filterOptions.initData = res.table_2 // 初始数据源
      })
    },

    // 刷新对应页面树形选择控件数据
    async refreshPageTree() {
      const res = await this.$server.executeSqls('1264753294889603073')
      this.formData.field119Table.filterOptions.buttonPage = res
    },

    // 可以编辑的表格的添加行数据和删除行数据
    addRowBtn(tableId, scope) {
      console.log(tableId, scope)
      const newObj = {}
      Object.keys(this.formData[tableId][0]).forEach(key => {
        this.$set(newObj, key, '')
      })
      if (scope) {
        const tableArr = this.formData.field119
        let isFalse = false
        tableArr.forEach((item, index) => {
          if (
            !item.buttonName
            || !item.buttonCode
            || !item.buttonPosition
          ) {
            this.$message({
              message: `请先将${index + 1}行填写完整`,
              type: 'error'
            })
            isFalse = true
          } else if (item.buttonName !== 'delete' && !item.buttonPage) {
            this.$message({
              message: '按钮为创建或者编辑时，对应页面不能为空！',
              type: 'error'
            })
            isFalse = true
          } else if (item.buttonName === 'update' && !item.initData) {
            this.$message({
              message: '按钮为编辑时，初始数据源不能为空！',
              type: 'error'
            })
            isFalse = true
          } else if (
            item.buttonName === 'delete'
            && (!item.actionType || !item.buttonAction)
          ) {
            if (!item.actionType) {
              this.$message({
                message: '按钮为删除时，事件类型不能为空！',
                type: 'error'
              })
            } else if (!item.buttonAction) {
              this.$message({
                message: '按钮为删除时，按钮事件不能为空！',
                type: 'error'
              })
            }
            isFalse = true
          }
        })
        if (isFalse) {
          return
        }
        this.formData[tableId].splice(scope.$index + 1, 0, newObj)
      } else {
        this.formData[tableId].push(newObj)
      }
    },
    deleteRowBtn(tableId, scope) {
      if (this.formData.field119.length > 1) {
        this.formData[tableId].splice(scope.$index, 1)
      } else {
        this.$set(this.formData[tableId], scope.$index, {
          buttonName: '',
          buttonCode: '',
          buttonPosition: '',
          actionType: '',
          buttonAction: '',
          buttonPage: '',
          initData: ''
        })
      }
    },

    /**
     * 生成表单
     */
    async handleGenerateForm(tableId, { row, $index }) {
      const {
        buttonAction,
        actionType,
        buttonName,
        initData,
        buttonPage
      } = row
      console.log('handleGenerateForm', row)

      if (buttonPage) {
        this.$message({
          message: '页面已存在！',
          type: 'warning'
        })
        return null
      }
      if (!actionType) {
        this.$message({
          message: '请选择按钮事件！',
          type: 'warning'
        })
        return null
      }
      if (row.buttonName === 'update' && !row.initData) {
        this.$message({
          message: '请选择编辑页面的初始数据源！',
          type: 'error'
        })
        return null
      }
      console.log({
        sqlId: buttonAction,
        actionType,
        operateType: buttonName === 'update' ? 'edit' : buttonName,
        initDataId: initData,
        sourceType: actionType === 1 ? 'data' : 'flow'
      })
      return null
      // const {partId} = await addFormPart({
      //   sqlId: buttonAction,
      //   operateType: buttonName === 'update' ? 'edit' : buttonName,
      //   initDataId: initData,
      //   sourceType: actionType === 1 ? 'data' : 'flow'
      // })

      // await this.refreshPageTree()
      // row.buttonPage = partId

      // return partId
    },

    /**
     * 生成表格
     */
    async handleGenerateTable() {
      const { formData } = this
      const sqlId = formData.field118
      if (!sqlId) {
        this.$message({
          message: '请先选择列表SQL！',
          type: 'warning'
        })
        return null
      }
      const tableData = formData.field119
      const btnfilterOptions = formData.field119Table.filterOptions.buttonName

      const topBtn = []
      const rowBtn = []
      tableData.forEach(row => {
        const { label } = btnfilterOptions.find(item => item.id === row.buttonName) || {}
        const { buttonPosition } = row
        if (buttonPosition === 'topBtn') {
          topBtn.push({
            ...row,
            btnLabel: label
          })
        } else if (buttonPosition === 'rowBtn') {
          rowBtn.push({
            ...row,
            btnLabel: label
          })
        }
      })

      console.log(sqlId,
        topBtn,
        rowBtn)
      return null


      // const partId = await addTablePart({
      //   sqlId,
      //   topBtn,
      //   rowBtn,
      //   sourceType: 'data'
      // })

      // await this.refreshPageTree()
      // this.formData.part_id = partId

      // return partId
    },
    async handleGenerateTableAndFormPart() {
      const { formData } = this
      const sqlId = formData.field118
      if (!sqlId) {
        this.$message({
          message: '请先选择列表SQL！',
          type: 'warning'
        })
        return
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await addTableAndFormPart(sqlId)
        console.log('======4', res)
      } finally {
        loading.close()
      }
    },
    /**
     * 保存
     */
    async handleSave() {
      const resData = await this.$server.runTransflow(
        '1253515097057411073',
        this.formData
      )
      this.$message({
        type: 'success',
        message: '保存成功!'
      })
    },

    /**
     * 取消
     */
    handleClose() {
      this.$emit('closeIframeDialog')
      this.$emit('closeComponentDialog')
    }
  }
}
</script>
<style>
/* 限制树形下拉组件弹出层的高度 */
.el-popper .el-tree {
  max-height: 300px;
  overflow-y: auto;
}
</style>
