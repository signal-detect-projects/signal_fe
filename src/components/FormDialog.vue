<template>
  <el-dialog
      v-model="centerDialogVisible"
      width="60%"
      align-center
  >

    <div class="form_left_div">

      <el-form-item label="填写ip">
        <el-col :span="12">
          <el-input v-model="form.ip"/>
        </el-col>
        <el-col :span="1">
        </el-col>
        <el-col :span="4">
          <el-button @click="test_btn">测试</el-button>
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
    </div>

    <div class="form_right_div">
      <el-form :model="form" label-width="120px" :label-position="labelPosition">
        <!--      右侧开始-->
        <h3>填写通道名称和说明</h3>
        <el-form-item label="采集事件名称">
          <el-col :span="12">
            <el-input v-model="form.name"/>
          </el-col>
        </el-form-item>
        <div class="channel_group_div">
          <el-form-item label="通道1">
            <el-input v-model="form.channel1Name"/>
          </el-form-item>
          <el-form-item label="通道2">

            <el-input v-model="form.channel2Name"/>

          </el-form-item>
          <el-form-item label="通道3">

            <el-input v-model="form.channel3Name"/>

          </el-form-item>
          <el-form-item label="通道4">
            <el-input v-model="form.channel4Name"/>
          </el-form-item>
        </div>
        <el-form-item label="说明">
          <el-col :span="12">
            <el-input v-model="form.channel4Name"/>
          </el-col>
        </el-form-item>
        <!--      通道属性设置-->
        <div id="channel_prop">
          <div class="channel_radio_block_list">
            <div class="channel_radio_block" v-for="i in 4" :key="i">
              <el-radio-group v-model="form.channelStateList[i-1]" class="ml-4" @change="channelStatusChange">
                <el-radio label="0" size="small" :disabled="channel_btn_status[i-1]">停止使用</el-radio>
                <el-radio label="1" size="small" :disabled="channel_btn_status[i-1]">投入使用</el-radio>
                <el-radio label="2" size="small" :disabled="channel_btn_status[i-1]">环境采集</el-radio>
              </el-radio-group>
              <div class="down_arrow"></div>
            </div>
          </div>
          <div class="channel_prop_line_block">
            <el-progress :show-text="false" :percentage="progressPerArr[lastValidChannelIdx]" :duration="0">
            </el-progress>

            <div class="icon_list">
              <div class="icon_div" v-for="index in 4" :key="index">
                <img v-if="form.channelStateList[index-1]==='0'" src="../assets/channel_icon_close.png">
                <img v-else-if="form.channelStateList[index-1]==='1'" src="../assets/channel_icon_open.png">
                <img v-else src="../assets/channel_icon_env.png">
              </div>
            </div>

          </div>
          <!--          进度条结束-->
          <div class="dis_div_list">
            <div class="dis_text_item">
              <span>传感器1</span>

              <div class="dis_input_item">
                <el-input-number
                    v-model="form.space12"
                    :min="1"
                    :max="99"
                    :precision="1" :step="0.1"
                    size="small"
                    controls-position="right"
                />
              </div>
            </div>


            <div class="dis_text_item">
              <span>传感器2</span>
              <div class="dis_input_item">
                <el-input-number
                    v-model="form.space23"
                    :min="1"
                    :max="99"
                    :precision="1" :step="0.1"
                    size="small"
                    controls-position="right"
                />
              </div>
            </div>
            <div class="dis_text_item">
              <span>传感器3</span>
              <div class="dis_input_item">
                <el-input-number
                    v-model="form.space34"
                    :min="1"
                    :max="99"
                    :precision="1" :step="0.1"
                    size="small"
                    controls-position="right"
                />
              </div>
            </div>

            <div class="dis_text_item">
              <span>传感器4</span>
            </div>

          </div>
        </div>
      </el-form>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="okFunc">确定</el-button>
        <el-button type="primary" @click="openFunc">图表</el-button>
        <el-button type="primary" @click="refreshFormLineChart">刷新图表</el-button>
        <el-button type="primary" @click="invokeQt">调用C++</el-button>
        <el-button @click=" centerDialogVisible=false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {reactive, ref, watch} from 'vue'

const labelPosition = ref('left')
const form = reactive({
  tableName: '',
  name: '',
  region: '',
  ip: '127.0.0.1',
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
  channelStateList: ["0", "0", "0", "0"],
})
const centerDialogVisible = ref(false)

const connectMessage = ref('连接成功！')

const channel_btn_status = [false, false, false];

let progressPerArr = [14, 39, 63, 100]
const progressPercent = ref(14);

const lastValidChannelIdx = ref(0);

const channelStatusChange = () => {
  console.log("锡膏", form.channelStateList)
  //先更新 status
  let firstStopIdx = -1;
  for (let i = 0; i < 4; i++) {
    if (form.channelStateList[i] == '1') {
      lastValidChannelIdx.value = i;
    } else {
      break;
    }
  }

  // for (let i = 0; i < 3; i++) {
  //   if (form.channelStateList[i] != '1') {
  //     firstStopIdx = i;
  //     break;
  //   }
  // }
  // console.log("firstIdx", firstStopIdx);
  // if (firstStopIdx >= 0) {
  //   for (let i = 0; i <= firstStopIdx; i++) {
  //     channel_btn_status[i] = false;
  //   }
  //   for (let i = firstStopIdx + 1; i < 4; i++) {
  //     form.channelStateList[i] = '0';
  //     channel_btn_status[i] = true
  //   }
  //
  // }
}


const openFunc = () => {
  centerDialogVisible.value = true
  const domObj = document.getElementById('form_line_chart')
  const formLineChart = (window as any).echarts.init(domObj, null, {renderer: 'canvas'});
  (window as any).formLineChart = formLineChart
  const formLineChartOption = {
    grid: {
      // 当图表长度或者宽度被压缩了，设置grid即可
      left: "20%",
      right: "10%",
      bottom: "10%",
      top: "10%",
      containLabel: true,
    },
    tooltip: {
      show: false,
      triggerOn: 'none',
      // position: function (pt) {
      //   return [pt[0], 130];
      // }
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
      type: 'value',
      axisTick: {
        show: false
      },
      axisPointer: {
        triggerTooltip: false,
        value: 2500,
        snap: false,
        lineStyle: {
          color: ' #79bbff',
          width: 2,
          type: 'solid'
        },
        label: {
          show: true,
          backgroundColor: ' #79bbff'
        },
        handle: {
          show: true,
          margin: -260,
          color: ' #79bbff'
        }
      },
    },
    series: [
      {
        data: [1000, 2000, 30000, 40000, 500, 6, 7000],
        type: 'line',
        showSymbol: false,
      }
    ]
  };
  formLineChart.setOption(formLineChartOption);
  formLineChart.on('updateAxisPointer', function (param: any) {
    let y_value = param['axesInfo'][0]['value'];
    console.log("移动", y_value)

  });
  console.log(formLineChart)
}
//这里开始真正的采集
const okFunc = () => {
  console.log("表单确定")
  centerDialogVisible.value = false;
  (window as any).G_sample_status = 'open';
  let qt_jsBridge = (window as any).qt_jsBridge;
  if (qt_jsBridge) {
    console.log("js start_sample_thread")
    qt_jsBridge.start_sample_thread();
  }
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

const invokeQt = () => {
  console.log("invokeQt")
  let qt_main_w = (window as any).qt_main_w
  console.log(qt_main_w)
  if (qt_main_w) {
    qt_main_w.JsToQT("htllp", "C++");
  }
}

const test_btn = () => {
  console.log("test_btn被调用");
  (window as any).qt_javaClient.queryIp('127.0.0.1', function (res: any) {
    console.log("gggggggggggggggg", res)
  })
}

watch(centerDialogVisible, (newValue, oldValue) => {
  if (!newValue) {
    //弹窗消失
    (window as any).fixSampleBtnStatus();
  }

});

// 暴露全局函数
(window as any).openDialogFunc = openFunc;
(window as any).closeDialogFunc = closeFunc;

</script>
<style lang="scss">
@import "../assets/base.css";

.dialog-footer button:first-child {
  margin-right: 10px;
}

.form_left_div {
  width: 49%;
  overflow: hidden;
  float: left;
  height: 600px;
  padding: 10px;
}

.form_right_div {
  width: 49%;
  overflow: hidden;
  float: right;
  height: 600px;


  .channel_group_div {
    //display: flex;

    .el-form-item {
      width: 50%;
      float: left;
    }
  }
}

#channel_prop {
  width: 90%;
  margin: auto;

  .dis_div_list {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;

    .dis_text_item {
      position: relative;
      width: 25%;
      text-align: center;
    }

    .dis_input_item {
      position: absolute;
      top: -2px;
      left: 80%;

      .el-input-number--small {
        width: 60px;
      }
    }
  }
}

.el-input-number .el-input__wrapper {
  padding-right: 20px !important;
  padding-left: 0 !important;
}


#form_line_chart {
  margin-top: 10px;
  width: 75%;
  height: 300px;
  border: 1px solid blue;
}

.channel_radio_block_list {
  display: flex;
  margin: auto;
  width: 100%;
  justify-content: space-around;
}

.channel_radio_block {
  /*width: 100px;*/
  background-color: var(--blue-backgroud);
  display: inline-block;
  position: relative;

  .el-radio-group {
    flex-direction: column;
  }
}

.channel_radio_block .el-radio-group .el-radio {
  margin-left: 10px;
  margin-right: 10px;
}

.down_arrow {
  position: absolute;
  left: 39%;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  /*border-top: 10px solid red;*/
  border-top: 10px solid #d9ecff;
}


.channel_prop_line_block {
  margin-top: 25px;
  margin-bottom: 20px;
  position: relative;

  .icon_list {
    position: absolute;
    top: -5px;

    display: flex;
    width: 100%;
    justify-content: space-around;

    .icon_div {
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      border-radius: 10px;

      img {
        flex-shrink: 0;
        min-width: 100%;
        min-height: 100%
      }
    }
  }
}
</style>
