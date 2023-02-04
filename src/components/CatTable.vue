<template>

  <div class="right_top_blank"
       style="width: 18px;height: 9px;position: absolute;right: -9px;top: 0px;background-color: #EEEEEE;z-index: 9"></div>

  <div class="right_bt_blank"
       style="width: 18px;height: 18px;position: absolute;right: -9px;bottom: -9px;background-color: #EEEEEE;z-index: 9"></div>

  <div class="left_bt_blank"
       style="width: 24px;height: 24px;position: absolute;left: -12px;bottom: -12px;background-color: #EEEEEE;z-index: 9"></div>

  <div class="cat_table_header">
    <span class="tab_chart_title">分类结果</span>
    <div class="tab_btn_wrapper">
      <el-button :color="'#73767a'" @click="pushSelection" v-if="local_page_type==='see'" :disabled="pushBtnDisabled">确定
      </el-button>
    </div>

    <span style="display: inline-block;font-size: 13px;position: absolute;bottom: 10px;right: 30px">时差单位：ns</span>
  </div>
  <!--  350:405-->
  <div class="tbl_wrapper">
    <el-table
        ref="multipleTableRef"
        :data="tableData"
        :header-row-style="headerRowStyle"
        :header-cell-style="headerCellStyle"
        :row-style="rowStyle"
        :cell-style="cellStyle"
        :style="{width:'100%' ,backgroundColor: 'rgba(0, 0, 0, 0)'}"
        :max-height="420"
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
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'
import {ElTable} from 'element-plus'

function headerRowStyle({row, rowIndex}) {
  return {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: 'black',
    borderBottom: '1px solid black',
  }
}

function headerCellStyle({row, column, rowIndex, columnIndex}) {
  return {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    padding: '0px',
    borderBottom: '1px solid black'
  }
}

function rowStyle({row, rowIndex}) {
  return {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: 'black',
    borderBottom: '1px solid black',
    boxSizing: 'content-box',
  }
}

function cellStyle({row, column, rowIndex, columnIndex}) {
  return {
    padding: '1px',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderBottom: '1px solid black',
  }
}

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
  multipleSelection.value = val;
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

.cat_table_header {
  padding-top: 5px;
  padding-bottom: 10px;
  position: relative;
  font-weight: bold;
}

.tab_btn_wrapper {
  display: inline-block;
  margin-left: 30px;
  min-height: 32px;
}

:deep(.el-table__row) {
  border-bottom: 1px solid black !important;
}

.tbl_wrapper {
  width: 96%;
  margin: auto;
}
</style>