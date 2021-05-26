<template>
  <div v-if="easyFlowVisible" id="flow_panel">
    <el-row id="flow_tool_wrapper">
      <el-col id="flow_tool" ref="flowTool">
        <flowTool @addNode="addNode" />
      </el-col>
      <el-col id="flow_container_wrapper" :span="24">
        <!--画布-->
        <div id="flowContainer" class="container">
          <template v-for="node in data.nodes">
            <flow-node
              v-show="node.show"
              :id="node.id"
              :key="node.id"
              :node="node"
              @deleteNode="deleteNode"
              @changeNodeSite="changeNodeSite"
              @nodeRightMenu="nodeRightMenu"
              @editNode="editNode"
            />
          </template>
        </div>
      </el-col>
    <!-- </el-row> -->
      <!-- </el-col> -->
    </el-row>

    <!-- <flow-info v-if="flowInfoVisible" ref="flowInfo" :data="data"></flow-info> -->
    <flow-node-form ref="nodeForm" :node="nodeData" :all-nodes="allNodes" :pre-node-output="preNodeOutput" :step-list="stepOptions" @saveNode="saveNode" />
    <!-- <flow-node-form v-if="nodeFormVisible" ref="nodeForm" :data="flowNodes"></flow-node-form> -->
    <el-dialog id="line_dialog" title="编辑连线" :visible.sync="lineFormVisible" :close-on-click-modal="true" append-to-body>
      <el-form label-width="80px" inline>
        <el-form-item label="连线名称:">
          <el-input v-model="curLineData.name" placeholder="请输入连线名称" />
        </el-form-item>
      </el-form>
      <el-tabs type="border-card">
        <el-tab-pane label="事务流条件设置">
          <draggable
            :list="curLineData.condition"
            :animation="340"
            group="selectItem"
            handle=".option-drag"
          >
            <div v-for="(item, indexs) in curLineData.condition" :key="indexs" class="select-item">
              <div class="select-line-icon option-drag">
                <i class="el-icon-s-operation" />
              </div>
              <el-select v-model="item.property" size="small" clearable placeholder="属性">
                <el-option v-for="step in preNodeOutput" :key="step.fldkey" :label="step.fldname" :value="step.fldkey" />
              </el-select>
              <el-select v-model="item.term" size="small" clearable placeholder="条件">
                <el-option v-for="step in conditionOptions" :key="step.value" :label="step.term" :value="step.value" />
              </el-select>
              <!-- <el-select v-model="item.variable" size="small" clearable placeholder="变量">
                <el-option v-for="step in preNodeOutput" :key="step.fldkey" :label="step.fldname" :value="step.fldkey" />
              </el-select> -->
              <el-input v-model="item.compare" placeholder="值" clearable size="small" />
              <div class="close-btn select-line-icon" title="删除" @click="curLineData.condition.splice(indexs, 1)">
                <i class="el-icon-remove-outline" />
              </div>
            </div>
          </draggable>
          <div style="margin-left: 20px;">
            <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text" @click="addSelectItem">
              添加
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="form_footer">
        <el-button type="primary" @click="saveLineData">
          保存
        </el-button>
        <el-button @click="lineFormVisible=false">
          取消
        </el-button>
        <el-button @click="deleteLineAction">
          删除
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { jsPlumb } from 'jsplumb'
import flowNode from './node'
import flowTool from './tool'
// import FlowInfo from "./info"
import FlowNodeForm from './node_form'
import common from '@/utils/tool'
// import lodash from "lodash";
// import { getData } from './data_A'

export default {
  name: 'EasyFlow',
  components: {
    draggable,
    flowNode,
    flowTool,
    // FlowInfo,
    FlowNodeForm
  },
  props: {
    flowNodes: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      jsPlumb: null, // jsPlumb 实例
      easyFlowVisible: true,
      flowInfoVisible: false,
      nodeFormVisible: true,
      lineFormVisible: false,
      index: 1,
      // 默认设置参数
      jsplumbSetting: {
        // 动态锚点、位置自适应
        Anchors: [
          'Top',
          'TopCenter',
          'TopRight',
          'TopLeft',
          'Right',
          'RightMiddle',
          'Bottom',
          'BottomCenter',
          'BottomRight',
          'BottomLeft',
          'Left',
          'LeftMiddle'
        ],
        Container: 'flowContainer',
        // 连线的样式 StateMachine、Flowchart
        Connector: 'Flowchart',
        // 鼠标不能拖动删除线
        ConnectionsDetachable: false,
        // 删除线的时候节点不删除
        DeleteEndpointsOnDetach: false,
        // 连线的端点
        // Endpoint: ['Dot', {radius: 5}],
        Endpoint: ['Rectangle', { height: 10, width: 10 }],
        // 线端点的样式
        EndpointStyle: { fill: 'rgba(255,255,255,0)', outlineWidth: 1 },
        LogEnabled: true, // 是否打开jsPlumb的内部日志记录
        // 绘制线
        PaintStyle: { stroke: '#1565C0', strokeWidth: 3 },
        // 连线hover时的样式
        HoverPaintStyle: { stroke: '#1565C0', strokeWidth: 5 },
        ReattachConnections: true, // 是否重新连接使用鼠标分离的线?
        // 绘制箭头
        Overlays: [['Arrow', { width: 12, length: 12, location: 1 }]],
        RenderMode: 'svg'
      },
      // jsplumb连接参数
      jsplumbConnectOptions: {
        isSource: true,
        isTarget: true,
        // 动态锚点、提供了4个方向 Continuous、AutoDefault
        anchor: 'Continuous'
      },
      jsplumbSourceOptions: {
        filter:
          '.flow-node-drag' /* 'span'表示标签，'.className'表示类，'#id'表示元素id */,
        filterExclude: false,
        anchor: 'Continuous',
        allowLoopback: false
      },
      jsplumbTargetOptions: {
        filter: '.flow-node-drag' /* 'span'表示标签，'.className'表示类，'#id'表示元素id */,
        filterExclude: false,
        anchor: 'Continuous',
        allowLoopback: false
      },
      // 是否加载完毕
      loadEasyFlowFinish: false,
      // 数据
      data: {},
      // 编辑节点
      nodeData: {},
      // 所有节点数据
      stepOptions: [],
      curLineData: {}, // 双击选中的当前连线的数据
      lineIndex: 0, // 双击选中的当前连线的index
      curLineConn: {}, // 双击选中的当前连线
      conditionOptions: [
        { value: '=', term: '等于' },
        { value: '>', term: '大于' },
        { value: '>=', term: '大于等于' },
        { value: '<', term: '小于' },
        { value: '<=', term: '小于等于' },
        { value: '<>', term: '不等于' },
        { value: 'is null', term: '为空' },
        { value: 'is not null', term: '不为空' },
        { value: 'like', term: '属于' },
        { value: 'not like', term: '不属于' }
      ],
      paramsOptions: [], // 开始节点的参数
      preNodeOutput: [], // 前一个节点的输出参数
      allNodes: [], // 所有节点数据,
      lastNode: null// 最后一个节点的id，新增的节点id不能等于已经删除的节点id，否则连线会出现错乱
    }
  },
  mounted() {
    console.log(this.flowNodes)
    this.getStartNodeParam()
  },
  methods: {
    addSelectItem() { // 增加连线条件
      this.curLineData.condition.push({
        property: '',
        term: '',
        // variable: '',
        compare: ''
      })
    },
    // 渲染流程图
    initFlowPanel() {
      this.jsPlumb = jsPlumb.getInstance()
      this.$nextTick(() => {
        this.dataReload()
      })
    },
    jsPlumbInit() {
      const thisCase = this
      this.jsPlumb.ready(() => {
        // 导入默认配置
        thisCase.jsPlumb.importDefaults(thisCase.jsplumbSetting)
        // 会使整个jsPlumb立即重绘。
        thisCase.jsPlumb.setSuspendDrawing(false, true)
        // 初始化节点
        thisCase.loadEasyFlow()

        // 单点击了连接线,
        // thisCase.jsPlumb.bind("click", function(conn, originalEvent) {
        //   thisCase.$confirm("确定删除所点击的线吗?", "提示", {
        //       confirmButtonText: "确定",
        //       cancelButtonText: "取消",
        //       type: "warning",
        //     })
        //     .then(() => {
        //       thisCase.jsPlumb.deleteConnection(conn)
        //     })
        //     .catch(() => {})
        // });
        thisCase.jsPlumb.bind('dblclick', (conn, originalEvent) => {
          // alert(thisCase.lineFormVisible)
          thisCase.curLineConn = conn
          thisCase.lineFormVisible = true
          console.log(`${conn.sourceId}||${conn.targetId}`)
          for (let i = 0; i < thisCase.data.lines.length; i++) {
            if (thisCase.data.lines[i].from === conn.sourceId && thisCase.data.lines[i].to === conn.targetId) {
              thisCase.curLineData = JSON.parse(JSON.stringify(thisCase.data.lines[i]))
              thisCase.lineIndex = i
              console.log(thisCase.curLineData)
              // break
              // return false
            }
            // console.log(thisCase.data)
            // 先点击连线，后点击节点，也要将连线的开始节点的输出参数赋值给连线中的属性和变量
            for (let j = 0; j < thisCase.data.nodes.length; j++) {
              if (thisCase.data.lines[i].from === thisCase.data.nodes[j].id && thisCase.data.lines[i].from === conn.sourceId) {
                // console.log(`from--${thisCase.data.lines[i].from}`, `to--${thisCase.data.lines[i].to}`, `nodes[j].id--${thisCase.data.nodes[j].id}`)
                // console.log(thisCase.data.nodes[j].output)
                thisCase.preNodeOutput = thisCase.data.nodes[j].output
                // console.log(thisCase.preNodeOutput)
                break
              }
            }
          }
          // alert(thisCase.lineFormVisible)
        })
        // 连线
        thisCase.jsPlumb.bind('connection', evt => {
          console.log('connection', evt)
          const from = evt.source.id
          const to = evt.target.id
          let id = this.data.lines.length <= 0 ? this.data.lines.length : this.data.lines[this.data.lines.length - 1].id.slice(4)
          const lineId = ++id
          if (thisCase.loadEasyFlowFinish) {
            console.log('lineId', lineId)
            thisCase.data.lines.push({
              id: `line${lineId}`,
              type: '',
              from,
              to,
              name: '',
              dash: false,
              condition: [{
                property: '',
                term: '',
                // variable: '',
                compare: ''
              }]
            })
            // thisCase.data.lineData.push({
            //   title: "",
            //   propData: ""
            // })
          }
        })
        thisCase.jsPlumb.bind('contextmenu', evt => {
          console.log('contextmenu', evt)
          // thisCase.deleteLine(evt.sourceId, evt.targetId)
        })
        // 删除连线
        thisCase.jsPlumb.bind('connectionDetached', evt => {
          console.log('connectionDetached', evt)
          thisCase.deleteLine(evt.sourceId, evt.targetId)
        })

        // 改变线的连接节点
        thisCase.jsPlumb.bind('connectionMoved', evt => {
          console.log('connectionMoved', evt)
          thisCase.changeLine(evt.originalSourceId, evt.originalTargetId)
        })

        // 单击endpoint
        // jsPlumb.bind('endpointClick', function (evt) {
        //   console.log('endpointClick', evt)
        // })
        //
        // // 双击endpoint
        // jsPlumb.bind('endpointDblClick', function (evt) {
        //   console.log('endpointDblClick', evt)
        // })

        // contextmenu
        thisCase.jsPlumb.bind('contextmenu', evt => {
          console.log('contextmenu', evt)
        })

        // beforeDrop
        thisCase.jsPlumb.bind('beforeDrop', evt => {
          console.log('beforeDrop', evt)
          const from = evt.sourceId
          const to = evt.targetId
          if (from === to) {
            thisCase.$message.error('不能连接自己')
            return false
          }
          if (thisCase.hasLine(from, to)) {
            thisCase.$message.error('不能重复连线')
            return false
          }
          if (thisCase.hashOppositeLine(from, to)) {
            thisCase.$message.error('不能回环哦')
            return false
          }
          return true
        })

        // beforeDetach
        thisCase.jsPlumb.bind('beforeDetach', evt => {
          console.log('beforeDetach', evt)
        })
      })
    },
    // 加载流程图
    loadEasyFlow() {
      // 初始化节点
      console.log('aaa', this.data)
      for (let i = 0; i < this.data.nodes.length; i++) {
        const node = this.data.nodes[i]
        // 设置源点，可以拖出线连接其他节点
        this.jsPlumb.makeSource(node.id, this.jsplumbSourceOptions)
        // // 设置目标点，其他源点拖出的线可以连接该节点
        this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
        // jsPlumb.addEndpoint(node.id)
        // 设置可拖拽
        // jsPlumb.draggable(node.id, {
        //     containment: 'parent',
        //     grid: [10, 10]
        // })

        this.jsPlumb.draggable(node.id, {
          containment: 'parent'
        })

        // jsPlumb.draggable(node.id)
      }

      // 初始化连线
      for (let a = 0; a < this.data.lines.length; a++) {
        const line = this.data.lines[a]
        this.jsPlumb.connect(
          {
            source: line.from,
            target: line.to,
            // endpointStyle: { fill: '#f35958' },
            overlays: [
              'Label',
              ['Label', {
                label: line.name,
                location: 0.4,
                id: line.id,
                labelStyle: { color: '#fff', fill: '#00688B' },
                events: {
                  click: (labelOverlay, originalEvent) => {
                    console.log(labelOverlay, originalEvent)
                    // alert("labelclick")
                  },
                  dblclick: () => {
                    // alert("labeldblclick")
                  },
                  tap: () => { // 目前这里tap和上面的thisCase.jsPlumb.bind('dblclick'方法都能实现点击连线编辑，目前采用后者，后面可以考虑tap编辑连线，dblclick删除连线
                    // this.lineFormVisible = true
                    // this.curLineData = line
                  }
                }
              }]
            ]
          },
          this.jsplumbConnectOptions
        )
      }
      this.$nextTick(() => {
        this.loadEasyFlowFinish = true
      })
    },
    getNodes() {
      console.log(jsPlumb)
      console.log(jsPlumb.Defaults)
    },
    getLines() {
      console.log('线', jsPlumb.getConnections())
    },
    // 删除线
    deleteLine(from, to) {
      this.data.lines = this.data.lines.filter(line => line.from !== from || line.to !== to)
    },
    // 点击连线编辑的删除按钮删除连线
    deleteLineAction() {
      this.$confirm('确定要删除该连线吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        closeOnHashChange: false
      }).then(() => {
        console.log(this.curLineData)
        this.deleteLine(this.curLineData.from, this.curLineData.to)
        // console.log(this.data.lines)
        this.$nextTick(() => {
          // console.log(`删除${this.curLineData.to}`)
          this.jsPlumb.deleteConnection(this.curLineConn)
        })
        this.lineFormVisible = false
      }).catch(() => {})
      return true
    },
    // 改变连线
    changeLine(oldFrom, oldTo) {
      this.deleteLine(oldFrom, oldTo)
    },
    // 改变节点的位置
    changeNodeSite(data) {
      for (let i = 0; i < this.data.nodes.length; i++) {
        const node = this.data.nodes[i]
        if (node.id === data.nodeId) {
          node.left = data.left
          node.top = data.top
        }
      }
    },
    // 添加新的节点
    addNode(evt, nodeMenu) {
      // console.log('添加节点', evt, nodeMenu)
      if (this.data.nodes.length > 0 && nodeMenu.type === 'start round mix') {
        for (let i = 0; i < this.data.nodes.length; i++) {
          if (nodeMenu.type === this.data.nodes[i].type) {
            this.$message({
              showClose: true,
              type: 'error',
              message: '开始节点只能有一个！'
            })
            return
          }
        }
      }
      const width = this.$refs.flowTool.$el.clientWidth + 30
      const height = window.innerHeight * 0.05 + 54 + 10 + 5
      this.index = this.data.nodes.length <= 0 ? this.data.nodes.length : this.data.nodes[this.data.nodes.length - 1].id.slice(4)
      if (this.lastNode !== null) {
        this.index = this.lastNode
        this.lastNode = null
      }
      const index = ++this.index
      const nodeId = `node${index}`
      console.log('添加节点类型：', nodeMenu.type)
      // const inputItem = []
      let outputArr = []
      const outputArrTask = [{ fldkey: 'resMsg', fldname: '消息提示', fldvalue: '' }, { fldkey: 'resCount', fldname: '记录行数', fldvalue: '' }]
      const outputArrEndOrState = [{ fldkey: 'resMsg', fldname: '消息提示', fldvalue: '' }, { fldkey: 'resType', fldname: '提示类型', fldvalue: '' }, { fldkey: 'resCount', fldname: '记录行数', fldvalue: '' }]
      // this.paramsOptions.forEach((param, n) => {
      //   inputItem.push({
      //     fldkey: param.param_code,
      //     fldname: param.param_name,
      //     fldvalue: param.param_default,
      //     fldnode: '',
      //     fldmapping: ''
      //     // ,
      //     // flddefault: param.param_default
      //   })
      // })
      // if (nodeMenu.type === 'start round mix') {
      //   outputArr = inputItem
      // } else
      if (nodeMenu.type === 'task') {
        outputArr = outputArrTask
      } else if (nodeMenu.type === 'end round mix' || nodeMenu.type === 'state round mix' || nodeMenu.type === 'part round mix') {
        outputArr = outputArrEndOrState
      }
      // console.log('inputItem', inputItem)
      this.data.nodes.push({
        type: nodeMenu.type,
        id: `node${index}`,
        name: `节点${index}`,
        left: `${(evt.originalEvent.layerX - width).toFixed(2)}px`,
        top: `${(evt.originalEvent.clientY - height).toFixed(2)}px`,
        img: nodeMenu.ico,
        show: true,
        // input: nodeMenu.type === 'start round mix' ? inputItem : [],
        // output: outputArr,
        input: [],
        output: outputArr,
        actionType: '',
        actionId: '',
        methodPath: ''
      })
      // console.log(this.paramsOptions)
      // this.data.nodes.forEach((item, i) => {
      //   if (item.type === 'start round mix') {
      //     this.paramsOptions.forEach((param, n) => {
      //       const inputItem = {
      //         fldkey: param.param_code,
      //         fldname: param.param_name,
      //         fldvalue: '',
      //         flddefault: param.param_default
      //       }
      //       this.$set(this.data.nodes[i].input, n, inputItem)
      //       this.$set(this.data.nodes[i].output, n, inputItem)
      //     })
      //   }
      // })
      // console.log(this.data.nodes)
      console.log('nodes', this.data)
      // eslint-disable-next-line func-names
      this.$nextTick(function () {
        this.jsPlumb.makeSource(nodeId, this.jsplumbSourceOptions)

        this.jsPlumb.makeTarget(nodeId, this.jsplumbTargetOptions)

        this.jsPlumb.draggable(nodeId, {
          containment: 'parent'
        })
      })
    },
    // 是否具有该线
    hasLine(from, to) {
      for (let i = 0; i < this.data.lines.length; i++) {
        const line = this.data.lines[i]
        if (line.from === from && line.to === to) {
          return true
        }
      }
      return false
    },
    // 是否含有相反的线
    hashOppositeLine(from, to) {
      return this.hasLine(to, from)
    },
    nodeRightMenu(nodeId, evt) {
      this.menu.show = true
      this.menu.curNodeId = nodeId
      this.menu.left = `${evt.x}px`
      this.menu.top = `${evt.y}px`
    },
    deleteNode(nodeId) {
      this.$confirm(`确定要删除节点${nodeId}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        closeOnHashChange: false
      }).then(() => {
        // this.data.nodes = this.data.nodes.filter(function(node) {
        //   // return node.id !== nodeId
        //   if (node.id === nodeId) {
        //     node.show = false
        //   }
        //   return true
        // })

        for (let i = 0; i < this.data.nodes.length; i++) {
          if (this.data.nodes[i].id === nodeId) {
            if (i === this.data.nodes.length - 1) {
              this.lastNode = nodeId.slice(4)
            }
            this.data.nodes.splice(i, 1)
            console.log(this.data.nodes)
            break
          }
        }

        this.$nextTick(() => {
          console.log(`删除${nodeId}`)
          this.jsPlumb.removeAllEndpoints(nodeId)
        })
      }).catch(() => {})
      return true
    },
    editNode(nodeId) {
      console.log('编辑节点', nodeId, this.data.nodes)
      // this.nodeFormVisible = true
      // eslint-disable-next-line func-names
      this.$nextTick(function () {
        this.$refs.nodeForm.visible = true
        this.stepOptions = []
        const inputItem = []
        // const outputArr = []
        // const outputArrTask = [{ fldkey: 'resMsg', fldname: '消息提示', fldvalue: '' }, { fldkey: 'resCount', fldname: '记录行数', fldvalue: '' }]
        // const outputArrEndOrState = [{ fldkey: 'resMsg', fldname: '消息提示', fldvalue: '' }, { fldkey: 'resType', fldname: '提示类型', fldvalue: '' }, { fldkey: 'resCount', fldname: '记录行数', fldvalue: '' }]
        this.paramsOptions.forEach((param, n) => {
          inputItem.push({
            fldkey: param.param_code,
            fldname: param.param_name,
            fldvalue: param.param_default,
            fldnode: '',
            fldmapping: '',
            fldnodetype: '1'
          // ,
          // flddefault: param.param_default
          })
        })
        // eslint-disable-next-line array-callback-return
        this.data.nodes.filter((node, i) => {
          if (node.id !== nodeId) {
            this.stepOptions.push({
              value: node.id,
              label: node.name
            })
          }
          if (node.id === nodeId) {
            // console.log(i, this.data.nodes[i - 1])
            if (i > 0) {
              this.preNodeOutput = this.data.nodes[i - 1].output
              // node.output = this.preNodeOutput
              // console.log(this.preNodeOutput)
              // console.log(node.output)
            }
            if (node.type === 'start round mix') {
              node.input = inputItem
              node.output = inputItem
            }
            // else if (node.type === 'task') {
            //   // node.input = []
            //   node.output = outputArrTask
            // } else if (node.type === 'end round mix' || node.type === 'state round mix') {
            //   // node.input = []
            //   node.output = outputArrEndOrState
            // }
            // console.log('inputItem', inputItem)
            this.nodeData = JSON.parse(JSON.stringify(node)) // 深拷贝该对象，避免子组件修改对父组件对象造成影响
          }
        })
        this.allNodes = this.data.nodes
        console.log('NodeRejectStepOptions', this.stepOptions)
        console.log(this.nodeData)
      })
    },
    saveNode(nodeInfo) {
      console.log('保存节点', nodeInfo, this.data.nodes)
      for (let i = 0; i < this.data.nodes.length; i++) {
        if (this.data.nodes[i].id === nodeInfo.id) {
          this.data.nodes[i].name = nodeInfo.name
          this.data.nodes[i] = JSON.parse(JSON.stringify(nodeInfo))
          this.$refs.nodeForm.visible = false
          // this.nodeFormVisible = false
          console.log(this.data.nodes)
          break
          // return false
        }
      }
    },
    // 保存连线数据
    saveLineData() {
      // alert(this.lineIndex)
      this.data.lines[this.lineIndex] = this.curLineData
      this.lineFormVisible = false
      console.log(this.jsPlumb)
      console.log(this.jsPlumb.connect)
    },
    // 流程数据信息
    dataInfo() {
      this.flowInfoVisible = true
      this.$nextTick(() => {
        // this.$refs.flowInfo.init()
      })
    },
    dataReload() {
      this.easyFlowVisible = false
      this.data.nodes = []
      this.data.lines = []
      this.$nextTick(() => {
        // 这里模拟后台获取数据、然后加载
        // data = lodash.cloneDeep(data)
        this.easyFlowVisible = true
        // this.data = getData();
        this.data = this.flowNodes
        // console.log(this.data)
        this.$nextTick(() => {
          this.jsPlumb = jsPlumb.getInstance()
          this.$nextTick(() => {
            this.jsPlumbInit()
          })
        })
      })
    },
    getStartNodeParam() { // 获取开始节点的参数
      const paramsObj = {
        transflow_id: common.getUrlParam('transflowId')
      }
      this.$server.executeSqls('1264834759778258946', paramsObj).then(res => {
        console.log(res)
        this.paramsOptions = res
      })
    }
    // ,
    // 设置线
    // changeLabel() {
    //   var lines = this.jsPlumb.getConnections({
    //     source: "nodeA",
    //     target: "nodeB"
    //   });
    //   console.log(lines);
    //   lines[0].setLabel({
    //     label: "    ",
    //     cssClass: "labelClass"
    //   });
    // }
  }
}
</script>

<style>
#flowContainer {
  background-image: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.15) 10%,
      rgba(0, 0, 0, 0) 10%
    ),
    linear-gradient(rgba(0, 0, 0, 0.15) 10%, rgba(0, 0, 0, 0) 10%);
  background-size: 10px 10px;
  height: 900px;
  background-color: rgb(251, 251, 251);
  /*background-color: #42b983*/
  position: relative;
}

.labelClass {
  background-color: white;
  padding: 5px;
  opacity: 0.7;
  border: 1px solid #346789;
  /*border-radius: 10px*/
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

#flow_tool_wrapper{position:relative;display:flex;flex-direction:row;}
#flow_tool{width:100px;}
#flow_container_wrapper{
  flex:1;
  position: fixed;
  top: 42px;
  bottom: 0;
  right: 0;
  left: 99px;
  overflow: auto;
}
#flow_panel .el-menu-item{padding:0px!important;}
#line_dialog .form_footer{text-align: center;}
#line_dialog .el-tabs__content{height: 170px;overflow-y: auto;}
</style>
