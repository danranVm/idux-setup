<script lang="ts" setup>
import { computed, inject } from 'vue'

import BasicNavItem from './BasicNavItem.vue'
import NavPin from './NavPin.vue'
import { Tooltip } from './tooltip'
import { layoutContextToken } from '../context'

import type { NavRecord } from '@/types'

const props = withDefaults(
  defineProps<{
    record: NavRecord
    icon?: string
    searchValue?: string
    enableOperation?: boolean
  }>(),
  {
    enableOperation: true,
  },
)

const { hasShortcut, addShortcut, removeShortcut } = inject(layoutContextToken)!
const shortcutAdded = computed(() => hasShortcut(props.record.id))
const pinIconClasses = computed(() => {
  const iconCls = 'layout-nav-item-pinable__operation'

  return {
    [iconCls]: true,
    [`${iconCls}--pined`]: !!shortcutAdded.value,
    [`${iconCls}--unpined`]: !shortcutAdded.value,
  }
})
const tooltipTitle = computed(() => (shortcutAdded.value ? '已加入快捷入口' : '添加快捷入口'))

const handleShortcutPinIconClick = (evt: Event) => {
  evt.stopImmediatePropagation()
  if (shortcutAdded.value) {
    removeShortcut(props.record.id)
  } else {
    addShortcut(props.record.id)
  }
}
</script>

<template>
  <BasicNavItem
    class="layout-nav-item-pinable"
    :path="record.path"
    :label="record.title ?? ''"
    :searchValue="searchValue"
    :icon="icon"
  >
    <template #suffix>
      <Tooltip :title="tooltipTitle">
        <NavPin
          v-if="enableOperation"
          :class="pinIconClasses"
          :pined="shortcutAdded"
          @click="handleShortcutPinIconClick"
        />
      </Tooltip>
    </template>
  </BasicNavItem>
</template>
