<script lang="ts" setup>
import { inject } from 'vue'

import Item from './Item.vue'
import BasicNavItem from '../../components/BasicNavItem.vue'
import { layoutContextToken } from '../../context'
import type { OverviewDataGroup } from '../../types'

defineProps<{
  group: OverviewDataGroup
}>()

const { searchValue } = inject(layoutContextToken)!
</script>

<template>
  <div class="layout-overview-group">
    <BasicNavItem
      class="layout-overview-group__header"
      :label="group.title"
      :icon="group.icon[0]"
      :searchValue="searchValue"
    />
    <div class="layout-overview-group__items">
      <Item v-for="item in group.children" :key="item.id" :item="item" :showIcon="false" />
    </div>
  </div>
</template>
