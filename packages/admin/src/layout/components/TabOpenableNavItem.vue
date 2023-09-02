<script lang="ts" setup>
import { inject } from 'vue'

import BasicNavItem from './BasicNavItem.vue'
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

const { handleTabOpen } = inject(layoutContextToken)!

const handleNavTabLinkIconClick = (evt: Event) => {
  evt.stopImmediatePropagation()
  handleTabOpen(props.record.id)
}
</script>

<template>
  <BasicNavItem
    class="layout-nav-item-tab-openable"
    :path="record.path"
    :label="record.title ?? ''"
    :searchValue="searchValue"
    :icon="icon"
  >
    <template #suffix>
      <Tooltip title="打开新标签">
        <span v-if="enableOperation" class="layout-nav-item-tab-openable__operation">
          <IxIcon name="custom:nav-tab-link" @click="handleNavTabLinkIconClick" />
        </span>
      </Tooltip>
    </template>
  </BasicNavItem>
</template>
