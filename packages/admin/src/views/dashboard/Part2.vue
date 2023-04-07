<script setup lang="ts">
import { ref, reactive, onBeforeUnmount } from 'vue'

import { MenuData } from '@idux/components'
import { useTimeoutPoll } from '@vueuse/core'
import { format } from 'date-fns'
import { storeToRefs } from 'pinia'

import { type ECOption, useEcharts } from '@/plugins/echarts'
import { useAppSettingStore } from '@/store/stores/appSetting'

const { appTheme } = storeToRefs(useAppSettingStore())

const chartDom = ref()
const dataSource: MenuData[] = [
  { key: 'item1', label: '全部WAN口' },
  { key: 'item2', label: 'eth0(LAN1)' },
  { key: 'item3', label: 'eth1(LAN2)' },
  { key: 'item4', label: 'eth2(LAN3)' },
]

const selectedKeys = ref(['item2'])

let sendData: number[] = []
let acceptData: number[] = []

const chartOptions: ECOption = reactive({
  tooltip: {
    trigger: 'axis',
  },
  color: ['#1C6EFF', '#20CC94'],
  legend: {
    x: 'right',
    formatter: (name: string) => {
      const value = name === '实时发送数据' ? sendData[0] : acceptData[0]
      return `{name|${name}：}{value|${value}Mb/s}`
    },
    data: [
      { name: '实时发送数据', icon: 'rect' },
      { name: '实时接收数据', icon: 'rect' },
    ],
    itemWidth: 8,
    itemHeight: 8,
    textStyle: {
      fontSize: 12,
      rich: {
        name: {
          color: '#6F7785',
          padding: [3, 0, 0, 0],
        },
        value: {
          color: '#6F7785',
          padding: [3, 0, 0, 0],
        },
      },
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
  },
  yAxis: {
    name: 'bps',
    type: 'value',
  },
  series: [
    {
      name: '实时发送数据',
      type: 'line',
    },
    {
      name: '实时接收数据',
      type: 'line',
    },
  ],
})

const { setOptions } = useEcharts(chartDom, chartOptions, () => {
  resume()
})

const setData = () => {
  sendData = new Array(7).fill(undefined).map(() => {
    return parseFloat((Math.random() * 30 + 20).toFixed(1))
  })

  acceptData = new Array(7).fill(undefined).map(() => {
    return parseFloat((Math.random() * 30 + 10).toFixed(1))
  })

  setOptions({
    xAxis: {
      data: new Array(7).fill(undefined).map((_, index) => {
        return format(new Date().getTime() - index * 5 * 60 * 1000, 'HH:mm')
      }),
    },
    series: [
      {
        data: sendData,
      },
      {
        data: acceptData,
      },
    ],
  })
}

const { pause, resume } = useTimeoutPoll(setData, 5 * 60 * 1000)

const onChange = () => {
  pause()
  resume()
}

onBeforeUnmount(() => {
  pause()
})
</script>
<template>
  <IxRow>
    <IxCol :span="24">
      <IxCard header="接口吞吐率趋势-全部WAN口" size="sm">
        <IxRow>
          <IxCol :span="3">
            <IxMenu
              class="custom-menu"
              v-model:selectedKeys="selectedKeys"
              :theme="appTheme"
              :dataSource="dataSource"
              :onUpdate:selectedKeys="onChange"
            ></IxMenu>
          </IxCol>
          <IxCol :span="21">
            <div ref="chartDom" style="width: 100%; height: 250px"></div>
          </IxCol>
        </IxRow>
      </IxCard>
    </IxCol>
  </IxRow>
</template>
