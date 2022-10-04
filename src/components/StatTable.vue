<template>
  <div class="topBbb">
    <div class="stat_one_line">
      <div class="text_icon">
        <img src="../assets/CJ.png">
      </div>
      <div class="stat_text">采集名称：</div>
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
    <div class="stat_one_line" v-if="local2_pagetype==='see'">
      <div class="text_icon">
        <img src="../assets/SJ.png">
      </div>
      <div class="stat_text">起点时间：</div>
      <div class="text_value">
        {{ data.startTime }}
      </div>
    </div>
    <div class="stat_one_line" v-if="local2_pagetype==='see'">
      <div class="text_icon">
        <img src="../assets/SJ.png">
      </div>
      <div class="stat_text">终点时间：</div>
      <div class="text_value">
        {{ data.endTime }}
      </div>
    </div>

    <!--    <div class="two_col_lin" v-if="local2_pagetype==='see'">-->
    <!--      <div class="col_1">-->
    <!--        <div class="text_icon">-->
    <!--          <img src="../assets/SJ.png">-->
    <!--        </div>-->
    <!--        <div class="stat_text_2">起点时间：</div>-->
    <!--        <div class="text_value">-->
    <!--          {{ data.startTime }}-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="col_1">-->
    <!--        <div class="text_icon">-->
    <!--          <img src="../assets/SJ.png">-->
    <!--        </div>-->
    <!--        <div class="stat_text_2">终点时间：</div>-->
    <!--        <div class="text_value">-->
    <!--          {{ data.endTime }}-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->

    <div class="two_col_lin" v-if="local2_pagetype==='see'">
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
          {{ data.signalMax }}
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
        <el-radio-group v-model="unit" @change="changeUnit()" :disabled="local2_pagetype==='sample'" class="ml-4">
          <el-radio label="mV" size="default">mV</el-radio>
          <el-radio label="dB" size="default">dB</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="stat_one_line">
      <div class="text_icon">
        <img src="../assets/qh.png">
      </div>
      <div class="stat_text">相位偏移：</div>
      <el-input-number v-model="phaseOffset" :min="-360" :max="360" :precision="1" @change="phaseChange" size="small"/>
    </div>
  </div>
</template>

<script lang="ts" setup>

import {reactive, ref} from "vue";

const data = reactive<any>({
  name: '--',
  sampleTime: '--',
  startTime: '--',
  endTime: '--',
  duration: '--',
  signalNum: '--',
  signalMax: '--mV',
  channelNames: ['--', '--', '--', '--'],
  space12: '--',
  space23: '--',
  space34: '--',
  note: '--',

})
const unit = ref('mV');
const phaseOffset = ref(0);

const local2_pagetype = ref('see');

const phaseChange = () => {
  console.log("相位改变", phaseOffset.value);
  (window as any).G_phase_offset = phaseOffset.value;
  (window as any).refreshHotChart();
}

(window as any).set_stat_table_page_type = function (str: string) {
  local2_pagetype.value = str
};

const changeUnit = () => {
  console.log('切换按钮', unit.value);
  if (unit.value.toLowerCase() === 'db') {
    (window as any).G_unit = 1;
  } else {
    (window as any).G_unit = 0;
  }
  (window as any).refresh_time_chart();
  (window as any).refreshHotChart();
};

(window as any).update_stat = function (obj: any) {
  console.log("update_stat", obj)
  for (let key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      data[key] = obj[key];
    }
  }
};

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
  padding: 2% 5%;
  //font-size: 16px;
  font-family: Microsoft YaHei, serif;
  font-weight: 400;
}

.stat_one_line {
  width: 100%;
  height: 27px;
  overflow: hidden;

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
  height: 27px;

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