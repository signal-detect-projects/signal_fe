<template>
  <div class="top_header">
    <div class="top_time">
      <span>采集名称：</span>
      <span class="header_text">{{ sample_name }}</span>
    </div>
    <div class="top_time">
      <span>采集时长：</span>
      <span class="header_text">{{ sample_duration }}</span>
    </div>
    <div class="top_num">
      <span>信号总数量：</span>
      <span class="header_text">{{ signal_num }}</span>
    </div>
    <div class="top_menu" v-if="local_page_type==='sample'">
      <span>采集状态：</span>
      <span :class="sampleSwitch? 'top_menu_switchText_class_open' : 'top_menu_switchText_class_close'   ">{{
          switchText
        }}</span>
      <el-switch
          v-model="sampleSwitch"
          size="small"
          @change="changeSampleStatus"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'

const sample_start_time = ref(new Date())

const sampleSwitch = ref(false)
const switchText = computed(() => {
  if (sampleSwitch.value) {
    return "采集中";
  }
  return "未采集"
});

(window as any).fixSampleBtnStatus = () => {
  if ((window as any).G_sample_status === 'close') {
    sampleSwitch.value = false
  } else if ((window as any).G_sample_status === 'open') {
    sampleSwitch.value = true
  }
}

const sample_name = ref("--");
const sample_duration = ref('00:00:00');
const signal_num = ref(0);

(window as any).update_header_data = function (p: any) {
  if (p.sample_name) {
    sample_name.value = p.sample_name;
  }
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

.el-switch {
  //--el-switch-on-color: #3978F8 !important;
  --el-switch-on-color: #67C23A !important;
  //--el-switch-off-color: #3978F8 !important;
}

.el-switch.is-checked .el-switch__core {
  border-color: #3978F8 !important;
  background-color: #3978F8 !important;
}

.top_header {
  background: #FFFFFF;
  box-shadow: 0px 0px 9px 1px rgba(200, 202, 222, 0.2);
  border-radius: 10px;
  //opacity: 0.6;
  height: 50px;
  width: 98%;
  margin: auto;
  position: relative;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.header_text {
  font-size: 24px;
  font-family: DIN;
  font-weight: bold;
  color: #0A48C6;

  position: relative;
  top: 2px;
}

.top_menu_switchText_class_close {
  font-size: 20px;
  color: #FF5151;
  margin-right: 10px;
  position: relative;
  top: 2px;
}

.top_menu_switchText_class_open {
  font-size: 20px;
  color: #67C23A;
  margin-right: 10px;
  position: relative;
  top: 2px;
}
</style>