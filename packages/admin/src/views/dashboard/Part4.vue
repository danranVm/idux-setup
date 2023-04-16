<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

import { storeToRefs } from 'pinia'

import { type ECOption, useEcharts } from '@/plugins/echarts'
import { useAppSettingStore } from '@/store/modules/appSetting'

const { appTheme } = storeToRefs(useAppSettingStore())

const chartPieDom = ref()
const chartLineDom = ref()

interface Data {
  name: string
  value: number
}
let data: Data[] = []

const chartOptions: ECOption = reactive({
  legend: {
    top: 'bottom',
    left: 'center',
    orient: 'vertical',
    formatter: (name: string) => {
      const value = data.find(item => item.name === name)?.value
      return `{name|${name}}{val|${value}}`
    },
    textStyle: {
      rich: {
        name: {
          fontSize: 12,
          color: '#6F7785',
          padding: [4, 32, 0, 0],
        },
        val: {
          fontSize: 12,
          color: '#6F7785',
          padding: [4, 0, 0, 0],
        },
      },
    },
  },
  color: ['#F5654F', '#FFC145'],
  title: {
    left: 'center',
    top: '30%',
    textStyle: {
      rich: {
        val: {
          fontSize: 24,
          fontWeight: 'bold',
          color: appTheme.value === 'dark' ? '#fff' : '#2F3540',
        },
        name: {
          fontSize: 12,
          fontWeight: 'normal',
          color: '#6F7785',
          padding: [10, 0],
        },
      },
    },
  },
  series: [
    {
      type: 'pie',
      top: '-20%',
      radius: ['50%', '60%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
      data: [],
    },
  ],
})

const setData = () => {
  data = [
    { value: Math.round(Math.random() * 20), name: '已经被感染' },
    { value: Math.round(Math.random() * 30), name: '可能被感染' },
  ]
  setChartPieOptions({
    title: {
      text:
        '{val|' +
        data
          .reduce((a, b) => {
            return a + b.value * 1
          }, 0)
          .toLocaleString() +
        '}\n{name|风险用户}',
    },
    series: [
      {
        data,
      },
    ],
  })
}

const { setOptions: setChartPieOptions } = useEcharts(chartPieDom, chartOptions, () => {
  setData()
})

watch(appTheme, theme => {
  setChartPieOptions({
    title: {
      textStyle: {
        rich: {
          val: {
            color: theme === 'dark' ? '#fff' : '#2F3540',
          },
        },
      },
    },
  })
})

useEcharts(chartLineDom, {
  xAxis: {
    type: 'category',
    data: ['SAVE杀毒', '恶意链接', '防DoS攻击', '僵尸网络'],
    axisTick: {
      alignWithLabel: true,
    },
  },
  grid: {
    top: '5%',
    bottom: '20%',
  },
  yAxis: {
    type: 'value',
    name: '次',
  },
  series: [
    {
      data: [287, 200, 150, 80],
      type: 'bar',
      barWidth: '10px',
      label: {
        show: true,
        position: 'top',
      },
      itemStyle: {
        color: '#458FFF',
      },
    },
  ],
})
</script>
<template>
  <IxCard header="上网安全" size="sm" class="h-full">
    <IxRow>
      <IxCol :span="8">
        <div ref="chartPieDom" style="width: 100%; height: 250px"></div>
      </IxCol>
      <IxCol :span="16">
        <div ref="chartLineDom" style="width: 100%; height: 250px"></div>
      </IxCol>
    </IxRow>
  </IxCard>
</template>
