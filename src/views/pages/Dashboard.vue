<template>
  <div class="dashborad">
    <el-row :gutter="10" :style="{height: '260px'}">
      <el-col :span="12" class="total_height">
        <div class="dashborad-num total_height">
          <el-card class="box-card part_height">
            <div class="box-mini">
              <el-row :gutter="0">
                <el-col :span="12">
                  <div class="title">
                    未配载订单
                  </div>
                  <div class="num">
                    1,210单
                  </div>
                  <div class="compare">
                    <span><i class="el-icon-top" />5.84%</span>
                    同比
                  </div>
                </el-col>
                <el-col :span="12">
                  <div style="line-height: 80px; font-size: 50px;color:#4087D9;">
                    <i class="el-icon-coin" />
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
          <el-card class="box-card part_height">
            <div class="box-mini">
              <el-row :gutter="0">
                <el-col :span="12">
                  <div class="title">
                    未执行订单
                  </div>
                  <div class="num">
                    329
                  </div>
                  <div class="compare">
                    客户数：25
                  </div>
                </el-col>
                <el-col :span="12">
                  <div style="line-height: 80px; font-size: 50px;color:#FF9F68;">
                    <i class="el-icon-truck" />
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
          <el-card class="box-card part_height">
            <div class="box-mini">
              <el-row :gutter="0">
                <el-col :span="24">
                  <div id="totalChart" class="echartBox" :style="{width: '300px', height: '70px'}" />
                </el-col>
              </el-row>
            </div>
          </el-card>
          <el-card class="box-card part_height">
            <div class="box-mini">
              <el-row :gutter="0">
                <el-col :span="12">
                  <div class="title">
                    今日天气
                  </div>
                  <div class="num">
                    26℃
                  </div>
                  <div class="compare">
                    {{ today }}
                  </div>
                </el-col>
                <el-col :span="12">
                  <div style="line-height: 80px; font-size: 50px;color:#769FCD;">
                    <i class="el-icon-sunrise-1" />
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12" class="total_height">
        <el-card style="height:90%;">
          <div id="myChart" class="echartBox" :style="{width: '460px', height: '400px'}" />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" :style="{height: '300px'}">
      <el-col :span="12" class="total_height">
        <el-card style="height:90%;">
          <div class="box-mini">
            <el-row :gutter="0">
              <el-col :span="24">
                <el-table
                  :data="taskData"
                  stripe
                  style="width: 100%"
                >
                  <el-table-column
                    prop="date"
                    label="日期"
                    width="100"
                  />
                  <el-table-column
                    prop="name"
                    label="提交人"
                    width="100"
                  />
                  <el-table-column
                    prop="status"
                    label="状态"
                    width="100"
                  />
                  <el-table-column
                    prop="vehicleNo"
                    label="车牌号"
                  />
                </el-table>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" class="total_height">
        <el-card style="height:90%;">
          <el-table
            :data="tableData"
            stripe
            style="width: 100%"
          >
            <el-table-column
              prop="date"
              label="日期"
              width="100"
            />
            <el-table-column
              prop="name"
              label="姓名"
              width="150"
            />
            <el-table-column
              prop="address"
              label="收货地址"
            />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

const optionCost = {
  color: ['#4A90E2'],
  title: {
    text: '本月运力成本统计'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  grid: {
    top: '10%',
    left: '3%',
    right: '-1%',
    bottom: '50%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: ['新疆', '河南', '江西', '广东', '上海', '山东', '成都'],
      axisTick: {
        alignWithLabel: true
      }
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '直接访问',
      type: 'bar',
      barWidth: '60%',
      data: [10, 52, 200, 334, 390, 330, 220]
    }
  ]
}
const optionTotal = {
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical', // horizontal
    left: 0,
    top: 0,
    data: ['已完成', '未配载', '未执行']
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      top: 0,
      radius: ['70%', '90%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '10',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 335, name: '已完成' },
        { value: 310, name: '在途' },
        { value: 234, name: '未配载' }
      ]
    }
  ],
  color: ['#2F9296', '#46B7B9', '#87DFD6']
}

export default {
  name: 'Dashboard',
  components: {
  },
  props: {
  },
  data() {
    return {
      labelPosition: 'right',
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      },
      today: '',
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '许小鹿',
        address: '广东省广州市白云区岭南路125号'
      }, {
        date: '2016-05-01',
        name: '王强',
        address: '上海市普陀区金沙江路1296弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      taskData: [{
        date: '2016-05-02',
        name: '王小虎',
        status: '待审核',
        vehicleNo: '粤AU388X'
      }, {
        date: '2016-05-04',
        name: '许小鹿',
        status: '待审核',
        vehicleNo: '沪AY3E8D'
      }, {
        date: '2016-05-01',
        name: '王强',
        status: '待审核',
        vehicleNo: '粤A23E97'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        status: '待审核',
        vehicleNo: '粤AU388X'
      }],
      search: ''
    }
  },
  computed: {
    theme: {
      get() {
        return this.$store.state.theme
      }
    }
  },
  mounted() {
    const myChart = echarts.init(document.getElementById('myChart'))
    myChart.setOption(optionCost, window.onresize = myChart.resize)
    const totalChart = echarts.init(document.getElementById('totalChart'))
    totalChart.setOption(optionTotal, window.onresize = totalChart.resize)

    const date = new Date()
    this.today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    }
  }
}
</script>

<style>
    .box-mini .title{
        color: #999999;
        font-size: 12px;
        text-align: left;
    }
    .box-mini .num{
        font-size: 20px;
        line-height: 36px;
        font-weight: bold;
        text-align: left;
    }
    .box-mini .compare{
        text-align: left;
        font-size: 14px;
        color: #999999;
    }
    .box-mini .compare span{
        color: #7aee7a;
        font-size: 12px;
        padding-top: 10px;
        padding-right: 15px;
    }
    .dashborad-num{
        display: flex; /*对于一行会自动弹性布局*/
        flex-wrap: wrap; /*对于6个模块需要换行*/
        justify-content: space-between; /*表示水平两端对齐，justify-content：水平对齐的方式*/
    }
    .dashborad-num .el-card {
        width: 49%;
    }
    .dashborad .el-card {
        margin-bottom: 5px; /*模块之前有间隔*/
    }
    .half_height{
        height:50%;
    }
    .total_height{
        height:100%;
    }
    .part_height{
        height:40%;
    }

</style>
