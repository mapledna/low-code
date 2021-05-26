<template>
  <div id="node_form">
    <el-dialog id="node_form_dialog" :close-on-click-modal="false" :visible.sync="visible" append-to-body :before-close="resetFormStep" @open="onOpen">
      <div id="node_form_title">
        <el-link :type="formStep==1?'primary':''" @click="formStep=1">
          基本配置
        </el-link>
      </div>
      <div v-if="node!=undefined" class="node_form_body">
        <el-form label-width="85px" size="small">
          <el-form-item v-show="false" label="节点ID" class="inline_item">
            <el-input v-model="node.id" disabled />
          </el-form-item>
          <el-form-item label="节点名称" class="inline_item">
            <el-input v-model="node.name" />
          </el-form-item>
          <el-form-item v-if="node.type === 'task'" label="执行类型" class="inline_item">
            <el-select v-model="node.actionType" placeholder="请选择执行类型" @change="typeChange($event,true)">
              <el-option label="执行SQL" value="sqlId" />
              <el-option label="执行事务流" value="transflowId" />
              <el-option label="执行接口" value="interfaceId" />
              <el-option label="执行微服务" value="microId" />
              <el-option label="Java类" value="jarId" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="node.type === 'task'" :label="node.actionType!=='jarId'?'执行动作':'执行Java类'" class="inline_item">
            <combo-tree
              v-if="node.actionType === 'sqlId'||node.actionType === 'transflowId'"
              v-model="node.actionId"
              value-key="id_code"
              :data="treeOptions"
              :width="'252px'"
              @node-click="handleNodeClick"
            />
            <el-select v-else-if="node.actionType === 'interfaceId'" v-model="node.actionId" placeholder="请选执行接口" @change="actionIdChange">
              <el-option v-for="(item, index) in interfaceOptions" :key="index" :label="item.interface_name" :value="item.id_code" />
            </el-select>
            <el-select v-else-if="node.actionType === 'microId'" v-model="node.actionId" placeholder="请选微服务" @change="actionIdChange">
              <el-option v-for="(item, index) in microIdOptions" :key="index" :label="item.micro_service_name" :value="item.id" />
            </el-select>
            <el-select v-else v-model="node.actionId" placeholder="请选类方法" @change="listJarChange($event,true)">
              <el-option v-for="(item, index) in jarOptions" :key="index" :label="item.note" :value="item.name" />
            </el-select>
            <!-- <el-input v-else width="252px" /> -->
          </el-form-item>
          <el-form-item v-if="node.type === 'task'&&node.actionType==='jarId'" label="执行类方法" class="inline_item">
            <el-select v-model="node.methodPath" placeholder="请选类方法集合" @change="listMethodChange">
              <el-option v-for="(item, index) in listMethodOptions" :key="index" :label="item.note" :value="item.name" />
            </el-select>
          </el-form-item>
          <el-tabs type="border-card">
            <el-tab-pane label="输入参数">
              <draggable
                :list="node.input"
                :animation="340"
                group="selectItem"
                handle=".option-drag"
              >
                <div v-for="(item, index) in node.input" :key="index" class="select-item">
                  <div v-if="!isStartNode" class="select-line-icon option-drag">
                    <i class="el-icon-s-operation" />
                  </div>
                  <el-input v-model="item.fldkey" :disabled="isStartNode" placeholder="输入参数" clearable size="small" />
                  <el-input v-model="item.fldname" :disabled="isStartNode" placeholder="参数名称" clearable size="small" />
                  <el-input v-if="isStartNode" v-model="item.fldvalue" :disabled="isStartNode" placeholder="默认值" clearable size="small" />
                  <el-select v-if="!isStartNode" v-model="item.fldnode" :disabled="isStartNode" size="small" clearable filterable placeholder="对应节点" @change="fldmappingChange(...arguments, index)">
                    <el-option v-for="step in stepList" :key="step.value" :label="step.label" :value="step.value" />
                  </el-select>
                  <el-select v-if="!isStartNode" v-model="item.fldnodetype" :disabled="isStartNode" size="small" clearable filterable placeholder="参数类型" @change="paramTypeChange(...arguments, index)">
                    <el-option label="输入参数" value="1" />
                    <el-option label="输出参数" value="2" />
                  </el-select>
                  <el-select v-if="!isStartNode" v-model="item.fldmapping" :disabled="isStartNode" clearable filterable allow-create size="small" placeholder="对应参数">
                    <el-option v-for="step in fldmappingOptions[item.fldnode+'_'+item.fldnodetype]" :key="step.fldkey" :label="step.fldname" :value="step.fldkey" />
                  </el-select>
                  <div v-if="!isStartNode" class="close-btn select-line-icon" title="删除" @click="node.input.splice(index, 1)">
                    <i class="el-icon-remove-outline" />
                  </div>
                </div>
              </draggable>
              <div v-if="!isStartNode" style="margin-left: 20px;">
                <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text" @click="addSelectItem">
                  添加
                </el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="输出参数">
              <draggable
                :list="node.output"
                :animation="340"
                group="selectItem"
                handle=".option-drag"
              >
                <div v-for="(item, index) in node.output" :key="index" class="select-item">
                  <div v-if="!isStartNode" class="select-line-icon option-drag">
                    <i class="el-icon-s-operation" />
                  </div>
                  <el-input v-model="item.fldkey" :disabled="isStartNode" placeholder="输出参数" size="small" />
                  <el-input v-model="item.fldname" :disabled="isStartNode" placeholder="参数名称" size="small" />
                  <el-input v-if="node.type !== 'task'&&item.fldkey!=='resType'" v-model="item.fldvalue" :disabled="isStartNode" placeholder="默认值" size="small" />
                  <el-select v-if="!isStartNode&&node.type !== 'task'&&item.fldkey==='resType'" v-model="item.fldvalue" :disabled="isStartNode" clearable filterable size="small" placeholder="默认值">
                    <el-option label="警告提示" value="warn" />
                    <el-option label="成功提示" value="success" />
                    <el-option label="错误提示" value="error" />
                  </el-select>
                  <div v-if="!isStartNode&&(node.type !== 'task'&&item.fldkey!=='resMsg'&&item.fldkey!=='resType')||node.type === 'task'" class="close-btn select-line-icon" title="删除" @click="node.output.splice(index, 1)">
                    <i class="el-icon-remove-outline" />
                  </div>
                </div>
              </draggable>
              <div v-if="!isStartNode" style="margin-left: 20px;">
                <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text" @click="addOutSelectItem">
                  添加
                </el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>

      <div class="form_footer">
        <el-button type="primary" @click="saveFormData">
          保存
        </el-button>
        <el-button @click="resetFormStep">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import common from '@/utils/tool'
import ComboTree from '@/components/ComboTree/index'

export default {
  components: {
    ComboTree
  },
  props: {
    node: {
      type: Object,
      default: () => {}
    },
    stepList: {
      type: Array,
      default: () => []
    },
    preNodeOutput: {
      type: Array,
      default: () => []
    },
    allNodes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      isStartNode: false, // 是否是开始节点
      treeOptions: [], // sqlId和transflowId的树形数据
      interfaceOptions: [], // interfaceId数据
      microIdOptions: [], // microId数据
      jarOptions: [], // java类数据
      listMethodOptions: [], // java类方法集合
      fldmappingOptions: {}, // 对应参数输入参数数据
      paramType: '', // 对应参数输出参数类型
      isFirstTime: true, // 是否第一次
      inputFirstTime: true, // 是否第一次监听node.input
      formStep: 1,
      defaultOutput: []// 将默认输出参数存起来
    }
  },
  watch: {
    node: {
      handler(val) {
        if (val.type === 'start round mix') {
          this.isStartNode = true
        } else {
          this.isStartNode = false
        }
      },
      deep: false
    },
    'node.input': {
      handler(val) {
        val.forEach((item, i) => {
          // eslint-disable-next-line no-prototype-builtins
          if (!item.hasOwnProperty('fldnodetype'))item.fldnodetype = '1'
          if (item.fldnode && this.inputFirstTime) {
            this.fldmappingChange(item.fldnode, i, item.fldnodetype)
          }
        })
        this.inputFirstTime = false
      },
      deep: true
    }
  },
  mounted() {
  },
  methods: {
    onOpen() {
      this.defaultOutput = this.node.output
      this.typeChange(this.node.actionType)
    },
    typeChange(val, isSelect) { // 执行类型选择事件
      if (isSelect) {
        this.node.actionId = ''
        this.node.methodPath = ''
        this.node.input = []
      }
      if (val === 'sqlId' || val === 'transflowId') {
        const id = val === 'sqlId' ? '1265130884821331976' : '1265130884821331975'
        this.$server.executeSqls(id, {}).then(res => {
          this.treeOptions = res
        })
      } else if (val === 'interfaceId') {
        this.$server.executeSqls('1258688116855865345', {}).then(res => {
          this.interfaceOptions = res
        })
      } else if (val === 'microId') {
        this.$server.executeSqls('1331059006770704385', {}).then(res => {
          this.microIdOptions = res
        })
      } else if (val === 'jarId') {
        this.$server.listClass().then(res => {
          this.jarOptions = res
        })
      }
    },
    fldmappingChange(val, index, type) { // 对应节点选择事件
      this.paramTypeChange(this.node.input[index].fldnodetype, index)
    },
    paramTypeChange(val, index) {
      if (!val) this.node.input[index].fldmapping = ''
      this.allNodes.forEach(item => {
        if (item.id === this.node.input[index].fldnode) {
          if (val === '1') {
            this.$set(this.fldmappingOptions, `${item.id}_${val}`, item.input)
          } else if (val === '2') {
            this.$set(this.fldmappingOptions, `${item.id}_${val}`, item.output)
          }
        }
      })
    },
    // 树形控件的点击选择事件
    handleNodeClick(data, id) {
      this.node.actionId = id
      this.getInputParams(id)
    },
    actionIdChange(val) { // 执行动作选择事件
      this.getInputParams(val)
    },
    // 根据执行动作获取输入参数
    getInputParams(val) {
      if (!val) return
      const { actionType } = this.node
      let id = ''; const params = {}
      if (actionType === 'sqlId') {
        id = '6'
        this.$set(params, 'sqlId', val)

        this.$server.executeSqls('7', params).then(res => {
          const outputItem = []
          if (res.length > 0) {
            res.forEach((param, n) => {
              outputItem.push({
                fldkey: param.value,
                fldname: param.label,
                fldvalue: ''
              })
            })
            this.node.output = outputItem
          }
        })
      } else if (actionType === 'transflowId') {
        id = '1269170765151240193'
        this.$set(params, 'transflow_id', val)
      } else if (actionType === 'interfaceId') {
        id = '1291217437983830017'
        this.$set(params, 'interface_id', val)
      } else if (actionType === 'microId') {
        id = '1331113284617039873'
        this.$set(params, 'micro_id', val)
      }
      this.node.output = this.defaultOutput
      this.$server.executeSqls(id, params).then(res => {
        const inputItem = []
        res.forEach((param, n) => {
          inputItem.push({
            fldkey: param.value,
            fldname: param.label,
            fldvalue: '',
            fldnode: '',
            fldmapping: '',
            fldnodetype: '1'
            // ,
            // flddefault: ''
          })
        })
        this.node.input = inputItem
      })
    },
    listJarChange(classPath, isSelect) {
      if (isSelect) {
        this.node.methodPath = ''
      }
      // const obj = this.jarOptions.find(item => item.path === path)
      this.$server.listMethod({ className: classPath }).then(res => {
        // console.log('listMethod', res)
        this.listMethodOptions = res
      })
    },
    listMethodChange(classMethodPath) {
      // const obj = this.listMethodOptions.find(item => item.path === path)
      this.$server.listParam({ className: this.node.actionId, methodName: classMethodPath }).then(res => {
        console.log('listParam', res)
        const inputItem = []
        res.forEach((param, n) => {
          inputItem.push({
            fldkey: param.name,
            fldname: param.note,
            fldvalue: '',
            fldnode: '',
            fldmapping: '',
            fldnodetype: '1'
          })
        })
        this.node.input = inputItem
      })
    },
    deleteRow(index, rows) {
      // rows.splice(index, 1);
    },
    resetFormStep() {
      this.formStep = 1
      this.visible = false
    },
    saveFormData() { // 保存当前节点
      this.$emit('saveNode', this.node)
      this.visible = false
    },
    addSelectItem() { // 增加输入参数
      this.node.input.push({
        fldkey: '',
        fldname: '',
        fldvalue: '',
        fldnode: '',
        fldmapping: '',
        fldnodetype: '1'
      })
    },
    addOutSelectItem() { // 增加输出参数
      this.node.output.push({
        fldkey: '',
        fldname: '',
        fldvalue: ''
      })
    }
  }
}
</script>
<style>
#node_form_dialog .el-dialog{width:750px;height:470px;}
#node_form_dialog .el-dialog__body{padding-top:20px;}
#node_form_dialog .node_form_body{height:350px;overflow-y: auto;}
#node_form_dialog #node_form_title{position:absolute;top:15px;left:30px;}
#node_form_dialog .form_footer{position: absolute;bottom:15px;left:50%;transform: translateX(-50%);}
.form_footer .el-button+.el-button{margin-left:30px;}
#node_form_dialog .el-form-item{display:block;}
#node_form_dialog .inline_item{display: inline-block;width:49%;}
#node_form_dialog .inline_item .el-input__inner{width:250px;}
#node_form_dialog .el-textarea{width:600px;}
#node_form_dialog .el-radio{margin-bottom:10px;}
/* tabs和里面内容样式 */
.select-item {display: flex;
box-sizing: border-box;}
.select-item .close-btn {cursor: pointer;color: #f56c6c;}
.select-item .el-input ,.select-item .el-select {margin-left: 4px;}
.select-item .el-select {width: 100%;}
.select-item + .select-item {margin-top: 4px;}
.select-item.sortable-chosen {border: 1px dashed #409eff;}
.select-line-icon {line-height: 32px;font-size: 22px;padding: 0 4px;color: #777;}
.option-drag {cursor: move;}
#node_form_dialog .el-tabs__content{height: 170px;overflow-y: auto;}
</style>
