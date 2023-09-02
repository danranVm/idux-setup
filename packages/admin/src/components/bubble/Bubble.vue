<script lang="ts" setup>
import { computed } from 'vue'

import { useState } from '@idux/cdk/utils'

import BubbleItemComp from './BubbleItem.vue'
import type { BubbleItem } from './types'

defineProps<{
  items: BubbleItem[]
}>()

const [collapsed, setCollapsed] = useState<boolean>(false)

const classes = computed(() => {
  const prefixCls = 'idux-setup-global-bubble'

  return {
    [prefixCls]: true,
    [`${prefixCls}--collapsed`]: !!collapsed.value,
  }
})
const triggerIcon = computed(() => (collapsed.value ? 'left' : 'right'))
const triggerTooltip = computed(() => (collapsed.value ? '展开浮层' : '收起浮层'))

const handleTriggerClick = () => {
  setCollapsed(!collapsed.value)
}
</script>

<template>
  <div :class="classes">
    <div class="idux-setup-global-bubble__items" v-show="!collapsed">
      <BubbleItemComp v-for="item in items" :key="item.text" :item="item" />
    </div>
    <IxTooltip :title="triggerTooltip" placement="left" :offset="[0, 16]">
      <div class="idux-setup-global-bubble__trigger" @click="handleTriggerClick">
        <IxIcon :name="triggerIcon" />
      </div>
    </IxTooltip>
  </div>
</template>
