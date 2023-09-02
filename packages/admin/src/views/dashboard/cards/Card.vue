<script setup lang="ts">
import { computed, shallowRef } from 'vue'

import { useKey } from '@idux/cdk'
import { useLinearGradient } from '@idux/charts'
import { useFullscreen } from '@vueuse/core'
import type { EChartsType } from 'echarts/core'

defineProps<{ title: string }>()

const key = useKey() as string
const chartRef = shallowRef<EChartsType>()
const containerRef = shallowRef<HTMLElement | null>(null)
const { isFullscreen, toggle } = useFullscreen(containerRef)

const dataSet = [
  { name: '图例A', value: 200 },
  { name: '图例B', value: 180 },
  { name: '图例C', value: 165 },
  { name: '图例D', value: 148 },
  { name: '图例E', value: 120 },
  { name: '图例F', value: 108 },
]

const onReady = (chart: EChartsType) => (chartRef.value = chart)

const chartOptions = computed(() => {
  if (key === 'basic-pie') {
    return {
      data: dataSet,
      legend: {
        top: '30%',
        left: '80%',
      },
    }
  }

  if (key === 'rose-pie') {
    return {
      data: dataSet,
      radius: '80%',
      roseType: 'area',
      title: null,
    }
  }

  if (key === 'basic-bar') {
    return {
      data: dataSet.map(item => item.value),
      xAxis: {
        data: dataSet.map(item => item.name),
      },
      yAxis: {
        name: '次',
      },
    }
  }

  if (key === 'category-bar') {
    return {
      data: dataSet.map(item => item.value),
      xAxis: {
        name: '次',
      },
      yAxis: {
        data: dataSet.map(item => item.name),
      },
    }
  }

  return {
    smooth: key === 'smooth-line',
    data: dataSet.map(item => item.value),
    xAxis: {
      data: dataSet.map(item => item.name),
    },
    yAxis: {
      name: '次',
    },
    areaStyle:
      key === 'smooth-line'
        ? undefined
        : {
            color: useLinearGradient(),
            stack: 'Total',
            xAxis: {
              boundaryGap: false,
              data: dataSet.map(item => item.name),
            },
          },
  }
})
</script>

<template>
  <IxCard
    ref="containerRef"
    :class="['dashboard-card', isFullscreen ? 'dashboard-card-fullscreen' : undefined]"
    :size="'sm'"
  >
    <IxBarChart v-if="key.includes('bar')" v-bind="chartOptions" @ready="onReady"></IxBarChart>
    <IxLineChart v-else-if="key.includes('line')" v-bind="chartOptions" @ready="onReady">
    </IxLineChart>
    <IxPieChart v-else v-bind="chartOptions" @ready="onReady"></IxPieChart>

    <template #header="{ size }">
      <IxHeader :title="title" :size="size">
        <template #suffix>
          <IxButtonGroup v-if="!inModal" :gap="16" mode="text">
            <IxButton :icon="isFullscreen ? 'fullscreen-exit' : 'fullscreen'" @click="toggle">
            </IxButton>
          </IxButtonGroup>
        </template>
      </IxHeader>
    </template>
  </IxCard>
</template>

<style scoped lang="less">
.dashboard-card {
  height: 100%;
  border: 1px solid transparent;

  &:hover {
    border-color: var(--ix-color-primary-l10);
  }

  :deep(.ix-card-body) {
    height: calc(100% - 48px);
  }

  &-fullscreen {
    padding: 64px;
  }
}
</style>
