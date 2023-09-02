<script lang="ts" setup>
import type { TourStep } from '@idux/components/tour'
import { type MaybeArray, useControlledProp } from '@idux/cdk/utils'

import { type PropType, inject } from 'vue'
import { useRouter } from 'vue-router'

import { appContextToken } from '../../context'

const emit = defineEmits<{
  (e: 'finish'): void
}>()
const props = defineProps({
  visible: {
    type: Boolean,
    default: undefined,
  },

  'onUpdate:visible': [Function, Array] as PropType<MaybeArray<(visible: boolean) => void>>,
})

const { activeNavRecords } = inject(appContextToken)!

const router = useRouter()
const [tourVisible, setTourVisible] = useControlledProp(props, 'visible')

const waitForItemRender = (query: string) => {
  let _resolve: (() => void) | null
  const _promise = new Promise<void>(resolve => {
    _resolve = resolve
  })

  let tick = () => {
    if (document.querySelector(query)) {
      _resolve?.()
      _resolve = null
      return
    }

    window.requestIdleCallback(tick)
  }

  tick()

  return _promise
}

const steps: TourStep[] = [
  {
    title: '自定义Dashboard',
    description: '点击进入总览页查看默认Dashboard，也可根据需求创建自定义的看板页面',
    target: '.ix-menu-item.dashboard-overview-menu-item',
    placement: 'rightStart',
  },
  {
    title: '自定义Dashboard',
    description: '点击切换Tab标题来查看不同的看板，也支持长按标题来拖拽排序',
    target: '.dashboard-tabs .ix-tabs-nav',
    beforeEnter: async () => {
      if (activeNavRecords.value.findIndex(rec => rec.path === '/dashboard') > -1) {
        return
      }

      await router.push('/dashboard')
      await waitForItemRender('.dashboard-tabs .ix-tabs-nav')
    },
  },
  {
    title: '自定义Dashboard',
    description: '点击触发“管理看板”，支持添加默认看板和自定义看板。',
    target: '.dashboard-tabs .ix-tabs-nav-tab-add .panel-trigger',
    beforeEnter: async () => {
      if (activeNavRecords.value.findIndex(rec => rec.path === '/dashboard') > -1) {
        return
      }

      await router.push('/dashboard')
      await waitForItemRender('.dashboard-tabs .ix-tabs-nav-tab-add .panel-trigger')
    },
  },
]

const handleFinish = () => {
  emit('finish')
}
</script>
<template>
  <IxTour
    :visible="tourVisible"
    :steps="steps"
    :gap="{ offset: 0, radius: 0 }"
    class="idux-setup-mask-guide"
    @update:visible="setTourVisible"
    @finish="handleFinish"
  />
</template>
