<template>
  <div class="tab_chart_title">分类结果</div>
  <div class="tab_btn_wrapper">
    <el-button @click="pushSelection" v-if="local_page_type==='see'" :disabled="pushBtnDisabled">确定</el-button>
  </div>
  <!--  350:405-->
  <el-table
      ref="multipleTableRef"
      :data="tableData"
      style="width: 100%"
      :max-height="local_page_type==='see'? 360:360 "
      scrollbar-always-on="true"
      @selection-change="handleSelectionChange"
  >
    <el-table-column v-if="local_page_type==='see'" type="selection" width="55"/>
    <el-table-column property="id" label="序号" width="60"/>
    <el-table-column property="Description" label="说明"/>
    <el-table-column property="Percentage" label="占比(%)"/>
    <el-table-column property="T12" label="时差12"/>
    <el-table-column property="T23" label="时差23"/>
    <el-table-column property="T34" label="时差34"/>
    <el-table-column property="T13" label="时差13"/>
    <el-table-column property="T14" label="时差14"/>
    <el-table-column property="T24" label="时差24"/>
  </el-table>

</template>

<script lang="ts" setup>
import {ref, computed} from 'vue'
import {ElTable} from 'element-plus'

interface User {
  date: string
  name: string
  address: string
}

interface Line {
  id: number
  Description: string
  Percentage: number
  T12: number
  T23: number
  T34: number
  T13: number
  T14: number
  T24: number
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<Line[]>([]);

const pushBtnDisabled = computed(() => {
  return multipleSelection.value.length === 0;
})

let last_selected_ids: Array<number> = []

const pushSelection = (rows?: User[]) => {

  let arr: number[] = []
  multipleSelection.value.forEach((it: any) => {
    arr.push(it['id'])
  })
  if (arr.length === tableData.value?.length) {
    console.log("全部选中，等于不选", arr)
    arr = []
  }
  arr.sort()
  console.log("选中ID", arr);
  if (arr.toString() === (window as any).G_filter_catIds.toString()) {
    console.log("选中categoryIds分类没有改变，不做操作")
    return
  }
  (window as any).G_filter_catIds = arr;

  (window as any).update_G_catfilter_sublist();
  (window as any).clear_time_chart_brush();
  (window as any).refresh_time_chart();
  (window as any).refresh3DBar();
  (window as any).refreshHotChart();
}

const handleSelectionChange = (val: Line[]) => {
  multipleSelection.value = val
}

const local_page_type = ref('see');
(window as any).set_cat_table_page_type = function (str: string) {
  local_page_type.value = str
};

const tableData = ref<Line[]>([]);

(window as any).update_table_data = function (str: string) {
  tableData.value = JSON.parse(str)
  // multipleTableRef.value?.clearSelection()
  multipleTableRef.value?.toggleAllSelection();
  (window as any).G_filter_catIds = []
  // tableData.value.forEach((it: any) => {
  //   (window as any).G_filter_catIds.push(it['id']);
  // });
  // (window as any).G_filter_catIds.sort();
};
</script>

<style lang="scss">
.tab_btn_wrapper {
  margin: 5px 20px 5px 150px;
  min-height: 32px;
}
</style>