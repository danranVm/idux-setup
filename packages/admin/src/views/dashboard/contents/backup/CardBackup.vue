<script setup lang="ts">
import { computed, shallowRef } from 'vue'

import { useKey } from '@idux/cdk'
import type { MenuClickOptions, MenuData } from '@idux/components'
import { useFullscreen } from '@vueuse/core'
import { graphic, type EChartsType } from 'echarts/core'

import { useI18n } from '@/plugins/i18n'

const cardKey = useKey() as string
const { $i } = useI18n()

const containerRef = shallowRef<HTMLElement | null>(null)

const { isFullscreen, toggle } = useFullscreen(containerRef)

const onReload = () => {
  chartRef.value?.setOption({})
}

const props = defineProps<{
  type: string
  title: string
  dataSet: string
  legend: string[]
  dateRange: string
  userRange: string
  inModal: boolean
}>()

const emits = defineEmits<{
  (e: 'edit', key: string): void
  (e: 'delete', key: string): void
}>()

// eslint-disable-next-line vue/no-dupe-keys
const dataSets = [
  { name: '图例A', value: 200 },
  { name: '图例B', value: 180 },
  { name: '图例C', value: 165 },
  { name: '图例D', value: 148 },
  { name: '图例E', value: 120 },
  { name: '图例F', value: 108 },
]

const chartRef = shallowRef<EChartsType>()

const chartOptions = computed(() => {
  const { type, legend } = props
  if (type === 'pie') {
    return {
      style: 'width:100%;height:100%',
      data: dataSets.filter(item => legend.includes(item.name)),
      series: [{ center: ['50%', '50%'] }],
      title: {
        top: 'center',
        left: 'center',
      },
      legend: {
        top: null,
        left: null,
        right: '0',
        bottom: '8%',
      },
      onReady: (chart: EChartsType) => (chartRef.value = chart),
    }
  }

  const data = dataSets.filter(item => legend.includes(item.name)).map(item => item.value)
  const result = {
    style: 'width:100%;height:100%',
    data,
    xAxis: {
      data: legend,
    },
    yAxis: {
      name: '次',
    },
  }

  if (type === 'bar') {
    return result
  }

  return {
    ...result,
    areaStyle: {
      color: new graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: '#458FFF',
        },
        {
          offset: 1,
          color: 'rgba(69,143,255,0.00)',
        },
      ]),
    },
    stack: 'Total',
    xAxis: {
      boundaryGap: false,
      data: legend,
    },
  }
})

const menus = computed<MenuData[]>(() => {
  return [
    { key: 'edit', label: $i('编辑') },
    // 仅剩 1 个 panel 的时候，不允许删除
    { key: 'delete', label: $i('删除') },
  ]
})

const onMenuClick = async ({ key }: MenuClickOptions<'edit' | 'delete'>) => {
  emits(key, cardKey)
}
</script>

<template>
  <IxCard
    ref="containerRef"
    :class="['dashboard-card', isFullscreen ? 'dashboard-card-fullscreen' : undefined]"
  >
    <IxBarChart v-if="type === 'bar'" v-bind="chartOptions"></IxBarChart>
    <IxLineChart v-else-if="type === 'line'" v-bind="chartOptions"></IxLineChart>
    <IxPieChart v-else v-bind="chartOptions"></IxPieChart>

    <template #header="{ size }">
      <IxHeader :title="title" :size="size">
        <template #suffix>
          <IxButtonGroup v-if="!inModal" :gap="16" mode="text">
            <IxButton icon="filter"></IxButton>
            <IxButton icon="reload" @click="onReload"></IxButton>
            <IxButton :icon="isFullscreen ? 'fullscreen-exit' : 'fullscreen'" @click="toggle">
            </IxButton>
            <IxDropdown trigger="click">
              <IxButton v-show="!isFullscreen" icon="ellipsis-vertical"></IxButton>
              <template #overlay>
                <IxMenu :dataSource="menus" @click="onMenuClick"></IxMenu>
              </template>
            </IxDropdown>
          </IxButtonGroup>
        </template>
      </IxHeader>
    </template>
  </IxCard>
</template>

<style scoped lang="less">
.dashboard-card {
  height: 100%;

  :deep(.ix-card-body) {
    height: calc(100% - 48px);
  }

  &-fullscreen {
    padding: 64px;
  }
}
</style>
