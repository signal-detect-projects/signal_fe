<template>
  <el-button text @click="centerDialogVisible = true"
  >Click to open the Dialog
  </el-button
  >

  <el-dialog
      v-model="centerDialogVisible"
      :label-position="labelPosition"
      width="35%"
      align-center
  >
    <el-form :model="form" label-width="120px">
      <el-form-item label="采集事件名称">
        <el-col :span="12">
          <el-input v-model="form.name"/>
        </el-col>
      </el-form-item>
      <el-form-item label="网络设置">
        <el-col :span="12">
          <el-input v-model="form.ip"/>
        </el-col>
        <el-col :span="1">
        </el-col>
        <el-col :span="4">
          <el-button>测试</el-button>
        </el-col>
        <span style="font-size: x-small">{{ connectMessage }}</span>
      </el-form-item>

      <el-radio-group v-model="form.channel">
        <el-radio label="通道1"/>
        <el-radio label="通道2"/>
        <el-radio label="通道3"/>
        <el-radio label="通道4"/>
      </el-radio-group>

      <div id="form_line_chart"></div>

      <h3>填写通道名称和说明</h3>
      <el-form-item label="通道1">
        <el-col :span="12">
          <el-input v-model="form.channel1Name"/>
        </el-col>
      </el-form-item>
      <el-form-item label="通道2">
        <el-col :span="12">
          <el-input v-model="form.channel2Name"/>
        </el-col>
      </el-form-item>
      <el-form-item label="通道3">
        <el-col :span="12">
          <el-input v-model="form.channel3Name"/>
        </el-col>
      </el-form-item>
      <el-form-item label="通道4">
        <el-col :span="12">
          <el-input v-model="form.channel4Name"/>
        </el-col>
      </el-form-item>
      <!--      通道属性设置-->
      <div id="channel_prop">
        <div class="channel_radio_block_list">
          <div class="channel_radio_block">
            <el-radio-group v-model="form.channel1State" class="ml-4">
              <el-radio label="1" size="small">停止使用</el-radio>
              <el-radio label="2" size="small">投入使用</el-radio>
              <el-radio label="3" size="small">环境采集</el-radio>
            </el-radio-group>
            <div class="down_arrow"></div>
          </div>
          <div class="channel_radio_block">
            <el-radio-group v-model="form.channel2State" class="ml-4">
              <el-radio label="1" size="small">停止使用</el-radio>
              <el-radio label="2" size="small">投入使用</el-radio>
              <el-radio label="3" size="small">环境采集</el-radio>
            </el-radio-group>
            <div class="down_arrow"></div>
          </div>
          <div class="channel_radio_block">
            <el-radio-group v-model="form.channel3State" class="ml-4">
              <el-radio label="1" size="small">停止使用</el-radio>
              <el-radio label="2" size="small">投入使用</el-radio>
              <el-radio label="3" size="small">环境采集</el-radio>
            </el-radio-group>
            <div class="down_arrow"></div>
          </div>
          <div class="channel_radio_block">
            <el-radio-group v-model="form.channel4State" class="ml-4">
              <el-radio label="1" size="small">停止使用</el-radio>
              <el-radio label="2" size="small">投入使用</el-radio>
              <el-radio label="3" size="small">环境采集</el-radio>
            </el-radio-group>
            <div class="down_arrow"></div>
          </div>
        </div>
        <div class="channel_prop_line_block">
          <el-progress :show-text="false" :percentage="50">
          </el-progress>
        </div>

      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="okFunc">确定</el-button>
        <el-button type="primary" @click="openFunc">图表</el-button>
        <el-button type="primary" @click="refreshFormLineChart">刷新图表</el-button>
        <el-button @click=" centerDialogVisible=false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {ref, reactive, onMounted} from 'vue'

const form = reactive({
  tableName: '',
  name: '',
  region: '',
  ip: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  channel: '通道1',
  desc: '',
  channel1Name: '',
  channel2Name: '',
  channel3Name: '',
  channel4Name: '',
  space12: '',
  space23: '',
  space34: '',
  channel1State: '',
  channel2State: '',
  channel3State: '',
  channel4State: '',
})
const labelPosition = ref('right')
const centerDialogVisible = ref(true)

const connectMessage = ref('连接成功！')

const openFunc = () => {
  centerDialogVisible.value = true
  const domObj = document.getElementById('form_line_chart')
  const formLineChart = (window as any).echarts.init(domObj, null, {renderer: 'canvas'});
  (window as any).formLineChart = formLineChart
  const formLineChartOption = {
    grid: {
      // 当图表长度或者宽度被压缩了，设置grid即可
      left: "5%",
      right: "4%",
      bottom: "10%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['1', '2', '3', '4', '5', '6', '7'],
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false, // 不显示坐标轴上的文字
      },
      splitLine: {
        show: false // 不显示网格线
      },
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [1000, 2000, 30000, 40000, 500, 6, 7000],
        type: 'line',
        // smooth: true,
        showSymbol: false,
      }
    ]
  };
  formLineChart.setOption(formLineChartOption);
  console.log(formLineChart)
}

const okFunc = () => {
  console.log("表单确定")
  centerDialogVisible.value = false
  return {}
}

const closeFunc = () => {
  centerDialogVisible.value = false
}

const refreshFormLineChart = () => {
  const formLineChartTemp = (window as any).formLineChart
  var arr = []
  let last_v = 1000
  var x_arr = []
  for (let i = 0; i < 680; i++) {
    last_v = last_v + Math.random() * 100 - 50;
    arr.push(last_v)
    x_arr.push(i + 1)
  }
  formLineChartTemp.setOption({
    xAxis: {
      data: x_arr
    },
    series: [
      {
        data: arr
      }
    ]
  })
}

// 暴露全局函数
(window as any).openDialogFunc = openFunc;
(window as any).closeDialogFunc = closeFunc;

</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}

#form_line_chart {
  margin-top: 10px;
  width: 400px;
  height: 150px;
  border: 1px solid blue;
}

.channel_radio_block_list {
  display: flex;
  margin: auto;
  width: 100%;
  justify-content: space-evenly;
}

.channel_radio_block {
  /*width: 100px;*/
  background-color: #d9ecff;
  display: inline-block;
  position: relative;
}

.channel_radio_block .el-radio-group {
  flex-direction: column;
}

/*.channel_radio_block .el-radio-group .el-radio:last-child {*/
/*  margin-right: 32px;*/
/*}*/
.channel_radio_block .el-radio-group .el-radio {
  margin-left: 10px;
  margin-right: 10px;
}

.down_arrow {
  position: absolute;
  left: 36%;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  /*border-top: 10px solid red;*/
  border-top: 10px solid #d9ecff;
}



.channel_prop_line_block{
  margin-top: 15px;
}
</style>
