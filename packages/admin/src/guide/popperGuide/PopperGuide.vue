<script lang="ts" setup>
import type { TourStep } from '@idux/components/tour'
import { type MaybeArray, useControlledProp } from '@idux/cdk/utils'
import { type PropType, inject } from 'vue'

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

const [tourVisible, setTourVisible] = useControlledProp(props, 'visible')

const videoSrc = new URL('/nav-overview-guide.mp4', import.meta.url).href
const steps: TourStep[] = [
  {
    description:
      '点击【功能全览】后展开全览面板查看所有导航标题，并支持搜索、添加快捷入口、查阅最近访问记录。',
    prevButton: false,
    nextButtonText: '我知道了',
    target: '.layout-overview-trigger',
    mask: false,
    placement: 'rightStart',
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
    :closeOnEsc="false"
    :closable="false"
    class="idux-setup-popper-guide"
    @update:visible="setTourVisible"
    @finish="handleFinish"
  >
    <template #indicators></template>
    <template #description="{ description }">
      <video
        class="idux-setup-popper-guide__video"
        :src="tourVisible ? videoSrc : ''"
        autoplay
        muted
      ></video>
      <div class="idux-setup-popper-guide__description">
        {{ description }}
      </div>
    </template>
  </IxTour>
</template>
