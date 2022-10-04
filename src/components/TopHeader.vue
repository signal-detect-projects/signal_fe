<template>
  <div class="top_header">
    <div class="top_time">
      <span>采集时长：</span>
      <span>{{ sample_duration }}</span>
    </div>
    <div class="top_num">
      <span>信号总数量：</span>
      <span>{{ signal_num }}</span>
    </div>
    <div class="top_menu" v-if="local_page_type==='sample'">
      <span>采集状态：</span>
      <span>{{ switchText }}</span>
      <el-switch
          v-model="sampleSwitch"
          size="small"
          @change="changeSampleStatus"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'

const sample_start_time = ref(new Date())

const sampleSwitch = ref(false)
const switchText = computed(() => {
  if (sampleSwitch.value) {
    return "开启";
  }
  return "停止"
});

(window as any).fixSampleBtnStatus = () => {
  if ((window as any).G_sample_status === 'close') {
    sampleSwitch.value = false
  } else if ((window as any).G_sample_status === 'open') {
    sampleSwitch.value = true
  }
}
const sample_duration = ref('00:00:00');
const signal_num = ref(0);

(window as any).update_header_data = function (p: any) {
  if (p.duration) {
    sample_duration.value = p.duration;
  }
  if (p.num) {
    signal_num.value = p.num;
  }

}


const changeSampleStatus = () => {
  if (sampleSwitch.value) {
    //点击开始采集
    (window as any).openDialogFunc();
    sample_start_time.value = new Date();
  } else {
    //点击关闭采集
    let qt_jsBridge = (window as any).qt_jsBridge;
    if (qt_jsBridge) {
      console.log("js stop_sample_thread")
      qt_jsBridge.stop_sample_thread(function (ret: any) {
        console.log("停止采集接口返回：", ret)
      });
    }
    (window as any).clear_sample_interval()
  }
}

const local_page_type = ref('sample');
(window as any).update_header_page_type = function (str: string) {
  local_page_type.value = str;
};

</script>

<style lang="scss" scoped>
.top_header {
  background: #FFFFFF;
  box-shadow: 0px 0px 9px 1px rgba(200, 202, 222, 0.2);
  border-radius: 10px;
  //opacity: 0.6;
  height: 50px;
  width: 98%;
  margin: auto;
  position: relative;
  top: 10px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>