<template>
  <div class="topBbb">
    <div class="stat_one_line">
      <div class="text_icon">
        <img src="../assets/CJ.png">
      </div>
      <div class="stat_text">采集事件名称：</div>
      <div class="text_value">
        {{ data.name }}
      </div>
    </div>
    <div class="stat_one_line">
      <div class="text_icon">
        <img src="../assets/SJ.png">
      </div>
      <div class="stat_text">采集时间：</div>
      <div class="text_value">
        {{ data.sampleTime }}
      </div>
    </div>
    <div class="stat_one_line">
      <div class="text_icon">
        <img src="../assets/SJ.png">
      </div>
      <div class="stat_text">起点时间：</div>
      <div class="text_value">
        {{ data.startTime }}
      </div>
    </div>
    <div class="stat_one_line">
      <div class="text_icon">
        <img src="../assets/SJ.png">
      </div>
      <div class="stat_text">终点时间：</div>
      <div class="text_value">
        {{ data.endTime }}
      </div>
    </div>

    <div class="two_col_lin">
      <div class="col_1">
        <div class="text_icon">
          <img src="../assets/SJ.png">
        </div>
        <div class="stat_text_2">放电时长：</div>
        <div class="text_value">
          {{ data.duration }}
        </div>
      </div>
      <div class="col_1">
        <div class="text_icon">
          <img src="../assets/xhs.png">
        </div>
        <div class="stat_text_2">区段信号数量：</div>
        <div class="text_value">
          {{ data.signalNum }}
        </div>
      </div>
    </div>

    <div class="two_col_lin">
      <div class="col_1">
        <div class="text_icon">
          <img src="../assets/cgq.png">
        </div>
        <div class="stat_text_2">传感器12间距：</div>
        <div class="text_value">
          {{ data.space12 }}
        </div>
      </div>
      <div class="col_1">
        <div class="text_icon">
          <img src="../assets/cgq.png">
        </div>
        <div class="stat_text_2">传感器23间距：</div>
        <div class="text_value">
          {{ data.space23 }}
        </div>
      </div>
    </div>
    <div class="two_col_lin">
      <div class="col_1">
        <div class="text_icon">
          <img src="../assets/cgq.png">
        </div>
        <div class="stat_text_2">传感器34间距：</div>
        <div class="text_value">
          {{ data.space34 }}
        </div>
      </div>
      <div class="col_1">
        <div class="text_icon">
          <img src="../assets/xh.png">
        </div>
        <div class="stat_text_2">信号最大值：</div>
        <div class="text_value">
          {{ data.signalMax }}mV
        </div>
      </div>
    </div>

    <div class="stat_one_line">
      <div class="text_icon">
        <img src="../assets/TD1.png">
      </div>
      <div class="stat_text">通道1名称：</div>
      <div class="text_value">
        {{ data.channelNames[0] }}
      </div>
    </div>
    <div class="stat_one_line">
      <div class="text_icon">
        <img src="../assets/TD1.png">
      </div>
      <div class="stat_text">通道2名称：</div>
      <div class="text_value">
        {{ data.channelNames[1] }}
      </div>
    </div>
    <div class="stat_one_line">
      <div class="text_icon">
        <img src="../assets/TD1.png">
      </div>
      <div class="stat_text">通道3名称：</div>
      <div class="text_value">
        {{ data.channelNames[2] }}
      </div>
    </div>
    <div class="stat_one_line">
      <div class="text_icon">
        <img src="../assets/TD1.png">
      </div>
      <div class="stat_text">通道4名称：</div>
      <div class="text_value">
        {{ data.channelNames[3] }}
      </div>
    </div>
    <div class="stat_one_line">
      <div class="text_icon">
        <img src="../assets/sm.png">
      </div>
      <div class="stat_text">说明：</div>
      <div class="text_value">
        {{ data.note }}
      </div>
    </div>
    <div class="stat_one_line">
      <div class="text_icon">
        <img src="../assets/qh.png">
      </div>
      <div class="stat_text">切换Y单位：</div>
      <div class="unit_radio">
        <el-radio-group v-model="unit" @change="changeUnit()" disabled=" " class="ml-4">
          <el-radio label="mV" size="default">mV</el-radio>
          <el-radio label="dB" size="default">dB</el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import {ref} from "vue";

const data = ref({
  name: '第八次采集',
  sampleTime: '2022-01-01 00:03:34',
  startTime: '2022-01-01 00:03:34',
  endTime: '2022-01-01 00:03:34',
  duration: '08:23:45',
  signalNum: 234,
  num: 233,
  signalMax: 2344,
  channelNames: ['通道1', '通道2', '通道3', '通道4'],
  space12: 12.23,
  space23: 123.4353,
  space34: 11.444,
  note: '这里时候世破魔',

})
const unit = ref('mV')

const changeUnit = () => {
  console.log('切换按钮', unit.value)
}

</script>
<style lang="scss">
.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.topBbb {
  width: 100%;
  height: 100%;
  padding: 4% 5%;
}

.stat_one_line {
  width: 100%;
  height: 8%;

  div {
    float: left;
  }

  .stat_text {
    width: 131px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    opacity: 0.6;
    padding-left: 10px;
    text-align: justify;
    text-align-last: justify;
  }

}


.text_icon {
  width: 17px;
  height: 17px;
  overflow: hidden;
  position: relative;
  top: 3px;

  img {
    width: 100%;
    height: 100%;
  }
}


.two_col_lin {
  width: 100%;
  height: 8%;

  div {
    float: left;
  }

  .col_1 {
    width: 50%;

    div {
      float: left;

    }
  }

  .stat_text_2 {
    width: 130px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    opacity: 0.6;
    padding-left: 10px;
    text-align: justify;
    text-align-last: justify;
  }

}

.unit_radio {
  position: relative;
  top: -5px;
}

</style>