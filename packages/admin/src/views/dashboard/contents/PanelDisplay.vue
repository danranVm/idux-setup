<script setup lang="ts">
import Card from '../cards/Card.vue'
import { useCards } from '../composables/useCards'

const { cards } = useCards()
</script>
<template>
  <IxEmpty v-if="cards.length === 0" style="height: 100%" description="暂无图表"> </IxEmpty>
  <template v-else>
    <grid-layout
      :layout="cards"
      :colNum="3"
      :margin="[12, 12]"
      :rowHeight="48"
      :isDraggable="false"
      :isResizable="false"
    >
      <template #gridItemContent="{ item }">
        <Card :key="item.key" :title="item.title" />
      </template>
    </grid-layout>
  </template>
</template>

<style scoped lang="less">
:deep(.vue-grid-item.vue-grid-placeholder) {
  background: var(--ix-background-color-deep);
  opacity: 1;
}
</style>
