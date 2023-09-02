<script lang="ts" setup>
import { inject } from 'vue'

import Group from './Group.vue'
import Item from './Item.vue'
import ItemLabel from '../../components/ItemLabel.vue'
import { layoutContextToken } from '../../context'
import type { OverviewDataBlock } from '../../types'

defineProps<{
  block: OverviewDataBlock
}>()

const { searchValue } = inject(layoutContextToken)
</script>

<template>
  <div class="layout-overview-block">
    <div class="layout-overview-block__title">
      <ItemLabel :label="block.title" :match="searchValue" />
    </div>
    <div class="layout-overview-block__content">
      <template v-for="data in block.data" :key="data.id">
        <Item v-if="data.type === 'item'" :item="data" />
        <Group v-else :group="data" />
      </template>
    </div>
  </div>
</template>
