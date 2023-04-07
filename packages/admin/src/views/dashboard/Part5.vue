<script setup lang="ts">
import { ref } from 'vue'

import { SelectData } from '@idux/components'
import { format } from 'date-fns'


import { echarts, useEcharts } from '@/plugins/echarts'

const chartDom = ref()

const selectDataSource: SelectData[] = [
  { key: '7days', label: '最近7天' },
  { key: '30days', label: '最近一个月' },
]

const value = ref('7days')

const { setOptions } = useEcharts(
  chartDom,
  {
    xAxis: {
      type: 'category',
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      name: '个',
    },
    series: [
      {
        type: 'line',
        itemStyle: {
          color: '#1C6EFF',
        },
        label: {
          show: true,
          position: 'top',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(28,110,255,0.2)',
            },
            {
              offset: 1,
              color: 'rgba(28,110,255,0.02)',
            },
          ]),
        },
      },
    ],
  },
  () => {
    setData()
  },
)

const setData = () => {
  setOptions({
    xAxis: {
      data: new Array(7).fill(undefined).map((_, index) => {
        return format(new Date().getTime() - index * 24 * 60 * 60 * 1000, 'MM-dd')
      }),
    },
    series: {
      data: new Array(7).fill(undefined).map(() => {
        return Math.round(Math.random() * 50)
      }),
    },
  })
}
const onChange = () => {
  setData()
}
</script>
<template>
  <IxCard class="h-full">
    <template #header>
      <IxHeader size="sm">
        新设备发现趋势
        <template #suffix>
          <IxSelect
            v-model:value="value"
            :dataSource="selectDataSource"
            size="sm"
            style="width: 100px"
            :onChange="onChange"
          >
          </IxSelect>
        </template>
      </IxHeader>
    </template>
    <div ref="chartDom" style="width: 100%; height: 250px"></div>
  </IxCard>
</template>
