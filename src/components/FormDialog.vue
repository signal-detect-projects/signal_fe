<template>
  <el-dialog
      v-model="centerDialogVisible"
      width="80%"
      align-center
  >
    <div class="form_left_div">
      <div class="left_top_wave_block">
        <el-form-item label="设备IP">
          <el-col :span="6">
            <el-input v-model="form.ip"/>
          </el-col>
          <el-col :span="1">
          </el-col>
          <el-col :span="4">
            <el-button @click="test_btn" type="primary" color="#3978F8">连接</el-button>
          </el-col>
          <span style="font-size: x-small;color: #3978F8">{{ connectMessage }}</span>
        </el-form-item>
        <el-form-item label="选择触发源">
          <el-radio-group v-model="form.line_channel" :disabled="!query_ip_status">
            <el-radio label="1" name="通道1">通道1</el-radio>
            <el-radio label="2" name="通道2">通道2</el-radio>
            <el-radio label="3" name="通道3">通道3</el-radio>
            <el-radio label="4" :disabled="true" name="通道4">通道4</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div id="form_line_chart"></div>
    </div>

    <div class="form_right_div">
      <el-form :model="form" label-width="120px" :label-position="labelPosition">
        <h3>填写通道名称和说明</h3>
        <el-form-item label="采集事件名称">
          <el-col :span="21">
            <el-input v-model="form.name" :disabled="!query_ip_status"/>
          </el-col>
        </el-form-item>
        <div class="channel_group_div">
          <el-form-item label="通道一" class="channel_text_space">
            <el-input v-model="form.channel1Name" :disabled="!query_ip_status" color="#3978F8"/>
          </el-form-item>
          <el-form-item label="通道二" style="position: relative;left: -20px" class="channel_text_space">
            <el-input v-model="form.channel2Name" :disabled="!query_ip_status"/>
          </el-form-item>
          <el-form-item label="通道三" class="channel_text_space">
            <el-input v-model="form.channel3Name" :disabled="!query_ip_status"/>
          </el-form-item>
          <el-form-item label="通道四" style="position: relative;left: -20px" class="channel_text_space">
            <el-input v-model="form.channel4Name" :disabled="!query_ip_status"/>
          </el-form-item>
        </div>
        <el-form-item label="说明" style="letter-spacing: 17px">
          <el-col :span="21">
            <el-input v-model="form.note" :disabled="!query_ip_status"/>
          </el-col>
        </el-form-item>
        <!--      通道属性设置-->
        <div id="channel_prop">
          <div class="channel_radio_block_list">
            <div class="channel_radio_block" v-for="i in 4" :key="i">
              <el-radio-group v-model="form.channelStateList[i-1]" class="ml-4" @change="channelStatusChange">
                <el-radio label="0" size="small" :disabled="!channel_btn_status[i-1]">停止使用</el-radio>
                <el-radio label="1" size="small" :disabled="!channel_btn_status[i-1]">投入使用</el-radio>
                <el-radio label="2" size="small" :disabled="!channel_btn_status[i-1]">环境采集</el-radio>
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
                    :min="0"
                    :max="99"
                    :precision="1" :step="0.1"
                    :disabled="!space_input_status[0]"
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
                    :min="0"
                    :max="99"
                    :disabled="!space_input_status[1]"
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
                    :min="0"
                    :max="99"
                    :disabled="!space_input_status[2]"
                    model-value="0"
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
        <el-button type="primary" @click="okFunc"
                   style="min-width: 100px;min-height: 40px;font-size: 24px"
                   :disabled="!query_ip_status"
                   color="#2D356C">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {computed, reactive, ref, watch} from 'vue'

const labelPosition = ref('left')

const query_ip_status = ref(false);

const form = reactive({
  name: '',
  ip: '127.0.0.1',
  line_channel: '1',
  threshold: 100,
  channel1Name: '',
  channel2Name: '',
  channel3Name: '',
  channel4Name: '',
  space12: '',
  space23: '',
  space34: '',
  channelStateList: ["0", "0", "0", "0"],
  note: ""
})
const centerDialogVisible = ref(false)

const connectMessage = ref('')

const channel_btn_status = computed(() => {
  if (!query_ip_status.value) {
    return [false, false, false, false];
  }
  return [true, true, true, false];
});

const space_input_status = computed(() => {
  if (!query_ip_status.value) {
    return [false, false, false];
  }
  let res = [false, false, false];
  if (form.channelStateList[0] == "0") {
    return res;
  }
  for (let i = 1; i < 3; i++) {
    if (form.channelStateList[i] != "0") {
      res[i - 1] = true;
    } else {
      break;
    }
  }
  return res;
});

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

}


const createFormLine = () => {
  const domObj = document.getElementById('form_line_chart')
  console.log(domObj)
  const formLineChart = (window as any).echarts.init(domObj, null,
      {renderer: 'canvas'});
  (window as any).formLineChart = formLineChart
  const formLineChartOption = {
    grid: {
      x: 10,
      y: 30,
      x2: 10,
      y2: 10,
      containLabel: true,
    },
    tooltip: {
      show: false,
      triggerOn: 'none',
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
      name: "mV",
      type: 'value',
      min: '-4000',
      max: '4000',
      axisTick: {
        show: true
      },
      axisLine: {
        show: true
      },
      axisPointer: {
        triggerTooltip: false,
        value: 100,
        snap: false,
        lineStyle: {
          color: '#3978F8',
          width: 2,
          type: 'solid'
        },
        label: {
          show: true,
          backgroundColor: '#3978F8'
        },
        handle: {
          show: true,
          margin: -470,
          color: '#3978F8'
        }
      },
    },
    series: [
      {
        data: [],
        type: 'line',
        showSymbol: false,
      }
    ]
  };
  formLineChart.setOption(formLineChartOption);
  formLineChart.on('updateAxisPointer', function (param: any) {
    let y_value = param['axesInfo'][0]['value'];
    form.threshold = y_value
    console.log("阈值调整", y_value)
  });
}

const Go_on_wave = ref(true);

//这里开始真正的采集
const okFunc = () => {
  console.log("表单确定")
  centerDialogVisible.value = false;
  (window as any).G_sample_status = 'open';
  let qt_jsBridge = (window as any).qt_jsBridge;
  if (qt_jsBridge) {
    console.log("js start_sample_thread")
    qt_jsBridge.start_sample_thread(JSON.stringify(form), function (ret: any) {
      console.log("采集接口返回：", ret)
    });
  }
  (window as any).sample_start_date = new Date();
  (window as any).start_sample_interval();
  (window as any).clearDataForNewSample();

  let update_param: any = form;
  let channel_name_list = [form.channel1Name, form.channel2Name, form.channel3Name, form.channel4Name];
  update_param['channelNames'] = channel_name_list;
  (window as any).update_channel_name(channel_name_list);
  update_param['sampleTime'] = new Date().Format('yyyy-MM-dd hh:mm:ss');
  (window as any).update_stat(form);

  // if ((window as any).form_wave_interval !== undefined && (window as any).form_wave_interval !== null) {
  console.log("cancel form_wave_interval")
  clearTimeout((window as any).form_wave_interval);
  Go_on_wave.value = false;
  // }
  return {}
}

const closeFunc = () => {
  centerDialogVisible.value = false
};

const refreshFormLineChart = (list: any) => {
  const formLineChartTemp = (window as any).formLineChart
  var x_arr = []
  for (let i = 0; i < list.length; i++) {
    x_arr.push(i + 1)
  }

  let color = [
    ['rgba(255, 153, 0,1)', 'rgba(255, 153, 0,0.2)'],
    ['rgba(0,0,255,1)', 'rgba(0,0,255,0.2)'],
    ['rgba(255,0,0,1)', 'rgba(255,0,0,0.2)'],
    // ['rgba(0,255,0,1)', 'rgba(0,255,0,0.2)'], 四通道被禁用，只有一个颜色
    ['rgba(0,255,0,1)', 'rgba(0,255,0,0.2)'],
  ]
  let color_idx = Number(form.line_channel) - 1
  formLineChartTemp.setOption({
    xAxis: {
      data: x_arr
    },
    series: [
      {
        data: list,
        lineStyle: {
          color: color[color_idx][0]
        }
      }
    ]
  })
}


function get_and_refresh_chart() {
  console.log("wave 刷新通道", form.line_channel);
  let str_p = {
    "ch": form.line_channel,
    "th": form.threshold
  };

  (window as any).qt_jsBridge.fetch_wave(JSON.stringify(str_p), function (json_str: string) {
    console.log("fetch_wave返回字符串")
    if (json_str !== undefined && json_str !== null && json_str.length > 0) {
      let res_obj = JSON.parse(json_str);
      if (res_obj['ch'] == form.line_channel) {
        refreshFormLineChart(res_obj['list']);
      } else {
        console.log("ch 对不上，", res_obj['ch'], form.line_channel)
      }
    }
    if (Go_on_wave.value) {
      console.log("setTimeout new");
      (window as any).form_wave_interval = setTimeout(function () {
        get_and_refresh_chart();
      }, 100);
    }
  });
}

const test_btn = () => {
  console.log("test_btn被调用");
  (window as any).qt_javaClient.queryIp(form.ip, function (res_str: any) {
    console.log("测试按钮结果", res_str)
    const res = JSON.parse(res_str);
    if (res['status'] !== undefined && res['status'] !== null) {
      connectMessage.value = "连接成功！";
      query_ip_status.value = true
    } else {
      connectMessage.value = "连接失败";
    }
  });
  Go_on_wave.value = true;
  get_and_refresh_chart();
}

watch(centerDialogVisible, (newValue, oldValue) => {
  if (!newValue) {
    //弹窗消失
    query_ip_status.value = false;
    (window as any).fixSampleBtnStatus();
    connectMessage.value = '';
    Go_on_wave.value = false;
    clearTimeout((window as any).form_wave_interval);
  }
});

// 暴露全局函数
(window as any).openDialogFunc = function () {
  centerDialogVisible.value = true;
  setTimeout(createFormLine, 100)
};
(window as any).closeDialogFunc = closeFunc;

</script>
<style lang="scss">
@import "../assets/base.css";

//.el-input{
//  background-color: #67C23A;
//}

.channel_text_space {
  letter-spacing: 16px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

.form_left_div {
  width: 49%;
  overflow: hidden;
  float: left;
  height: 530px;
  padding: 20px;

  .left_top_wave_block {
    margin-left: 80px;
  }
}

#form_line_chart {
  width: 80%;
  height: 400px;
  //border: 1px solid blue;
  margin: auto;
  border: 1px solid #F2F3F5;
  box-shadow: 3px 3px 12px 0px rgba(228, 228, 228, 0.5);
  border-radius: 10px;

  canvas {
    width: 100%;
  }
}


.form_right_div {
  width: 49%;
  overflow: hidden;
  float: right;
  height: 600px;
  padding: 20px;

  .el-button {
    width: 40px !important;
  }

  .el-form-item__label {
    max-width: 104px;
    //text-align: justify;
    //text-align-last: justify;
    //display: flex;
    //display: block;
    //justify-content: space-evenly;
    word-spacing: 30px !important;
  }

  .channel_group_div {
    //display: flex;
    height: 100px;

    .el-form-item {
      width: 50%;
      float: left;

      label {
        width: 104px !important;
        text-align: center !important;
      }

      .el-input {
        width: 191px !important;
      }
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


.channel_radio_block_list {
  display: flex;
  margin: auto;
  width: 100%;
  justify-content: space-around;
}

.channel_radio_block {
  /*width: 100px;*/
  //background-color: var(--blue-backgroud);
  background-color: #F3F3FA;
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
