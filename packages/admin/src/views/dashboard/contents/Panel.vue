<script setup lang="ts">
import { shallowRef } from 'vue'

import { useModal } from '@idux/components'

import Card from './Card.vue'
import CardModal from './CardModal.vue'
import { useCards } from '../composables/useCards'
import type { DashboardCard } from '../types'

import { useI18n } from '@/plugins/i18n'

const { $i } = useI18n()
const { confirm } = useModal()

const { cards, handleAdd, handleEdit, handleDelete, saveCards } = useCards()

const modalVisible = shallowRef(false)
const editCard = shallowRef<DashboardCard>()

const onModalOpen = () => {
  modalVisible.value = true
  editCard.value = undefined
}

const onCardEdit = (key: string) => {
  modalVisible.value = true
  editCard.value = cards.value.find(card => card.key === key)
}

const onModalSave = (card: DashboardCard) => {
  editCard.value ? handleEdit(card) : handleAdd(card)
}

const onCardDelete = (key: string) => {
  const currCard = cards.value.find(card => card.key === key)
  if (!currCard) {
    return
  }
  confirm({
    title: $i(`确定要删除 【${currCard.title}】 吗?`),
    content: $i('删除后, 将无法恢复'),
    onOk: () => handleDelete(key),
  })
}
</script>
<template>
  <IxEmpty v-if="cards.length === 0" style="height: 100%" :description="$i('暂无图表')">
    <IxButton mode="primary" @click="onModalOpen()">{{ $i('新增图表') }}</IxButton>
  </IxEmpty>
  <template v-else>
    <div class="panel-search-wrapper mb-4">
      <IxButton @click="onModalOpen()">{{ $i('新增图表') }}</IxButton>
      <IxButton>{{ $i('导出报表') }}</IxButton>
      <IxProSearch
        style="flex: 1"
        :placeholder="$i('可进行多条件的筛选；多个条件用“,”分隔，多个筛选条件用回车键分隔')"
      >
      </IxProSearch>
      <IxButton icon="reload"></IxButton>
    </div>
    <grid-layout
      :layout="cards"
      :col-num="24"
      :margin="[16, 16]"
      :row-height="32"
      @update:layout="saveCards"
    >
      <template #gridItemContent="{ item }">
        <Card v-bind:="item" @edit="onCardEdit" @delete="onCardDelete"></Card>
      </template>
    </grid-layout>
  </template>
  <CardModal v-model:visible="modalVisible" :value="editCard" @ok="onModalSave" />
</template>

<style scoped lang="less">
.panel-search-wrapper {
  display: flex;
  gap: 16px;
}

:deep(.vue-grid-item.vue-grid-placeholder) {
  background: var(--ix-background-color-deep);
  opacity: 1;
}
</style>
