<template>
  <el-table
      ref="multipleTableRef"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55"/>
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
  <div style="margin-top: 20px">
    <el-button @click="pushSelection">确定</el-button>
  </div>
</template>

<script lang="ts" setup>
import {Ref, ref} from 'vue'
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

const str = '[{"id": 1, "Description": "所有通道均为噪声信号", "Percentage": 69.53}, {"id": 2, "Description": "仅4通道检测到非噪声信号", "Percentage": 0.03}, {"id": 3, "T14": 4.5, "Percentage": 1.04}, {"id": 4, "T12": 24.24, "Percentage": 0.85}, {"id": 5, "T12": -2.71, "T24": 7.01, "Percentage": 28.56}]'

const tableData = ref<Line[]>([]);

(window as any).update_table_data = function (str: string) {
  tableData.value = JSON.parse(str)
}
</script>
