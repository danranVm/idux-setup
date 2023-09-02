<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import BasicNavItem from './BasicNavItem.vue'
import PinableNavItem from './PinableNavItem.vue'
import TabOpenableNavItem from './TabOpenableNavItem.vue'

import { useNavSettingStore } from '@/store/modules/navSetting'
import type { NavRecord } from '@/types'

const { navShortcutMode } = storeToRefs(useNavSettingStore())

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
</script>

<template>
  <PinableNavItem v-if="navShortcutMode === 'shortcut'" v-bind="props" :class="$attrs.class" />
  <TabOpenableNavItem v-else-if="navShortcutMode === 'tab'" v-bind="props" :class="$attrs.class" />
  <BasicNavItem
    v-else
    :class="$attrs.class"
    :label="record.title ?? ''"
    :icon="icon"
    :path="record.path"
    :searchValue="searchValue"
  />
</template>
