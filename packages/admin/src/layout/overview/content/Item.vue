<script lang="ts" setup>
import { inject } from 'vue'

import NavItem from '../../components/NavItem.vue'
import { layoutContextToken } from '../../context'
import type { OverviewDataItem } from '../../types'

const { searchValue } = inject(layoutContextToken)!

withDefaults(
  defineProps<{
    item: OverviewDataItem
    showIcon?: boolean
  }>(),
  {
    showIcon: true,
  },
)
</script>

<template>
  <NavItem
    class="layout-overview-item"
    :record="item"
    :searchValue="searchValue"
    :icon="showIcon ? item.icon?.[0] : undefined"
  />
</template>
