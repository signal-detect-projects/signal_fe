<template>
  <div class="topBbb"></div>
  <div>
    采集事件名称：{{ data.name }}
  </div>
  <div>
    采集时间：{{ data.sampleTime }}
  </div>
  <div>
    起点时间：{{ data.startTime }}
  </div>
  <div>
    终点时间：{{ data.endTime }}
  </div>
  <div>
    放电时长：{{ data.duration }}
  </div>
  <div>
    区段内信号数量：{{ data.num }}
  </div>
  <div>
    信号最大值：{{ data.sigmalMax }}
  </div>
  <div>
    通道1名称：{{ data.channelNames[0] }}
  </div>
  <div>
    通道2名称：{{ data.channelNames[1] }}
  </div>
  <div>
    通道3名称：{{ data.channelNames[2] }}
  </div>
  <div>
    通道4名称：{{ data.channelNames[3] }}
  </div>
  <div>
    传感器12间距：{{ data.space12 }}
  </div>
  <div>
    传感器23间距：{{ data.space23 }}
  </div>
  <div>
    传感器34间距：{{ data.space34 }}
  </div>
  <div>
    说明：{{ data.note }}
  </div>
  <div>
    切换Y单位
    <el-radio-group v-model="unit" @change="changeUnit()" class="ml-4">
      <el-radio label="mV" size="default">mV</el-radio>
      <el-radio label="dB" size="default">dB</el-radio>
    </el-radio-group>
  </div>
</template>

<script lang="ts" setup>

import {ref} from "vue";

const data = ref({
  name: '第八次采集',
  sampleTime: '2022-01-01 00:03:34',
  startTime: '2022-01-01 00:03:34',
  endTime: '2022-01-01 00:03:34',
  duration: '2天一分34秒',
  num: 233,
  sigmalMax: 2344,
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
<style>
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
  height: 10%;
}
</style>