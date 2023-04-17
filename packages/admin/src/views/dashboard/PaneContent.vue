<script setup lang="ts">
import { ref } from 'vue'

import CardModal from './CardModal.vue'
import type { DashboardCard } from './types'

import { useI18n } from '@/plugins/i18n'

const { $i } = useI18n()

const modalVisible = ref(false)

const props = defineProps<{ type: string }>()

const cards = ref<DashboardCard[]>([])

const onModalSave = (card: DashboardCard) => {
  console.log(card)
  cards.value = [...cards.value, card]
}
</script>
<template>
  <IxEmpty v-if="cards.length === 0" style="margin-top: 64px" :description="$i('暂无图表')">
    <IxButton mode="primary">{{ $i('新增图表') }}</IxButton>
  </IxEmpty>
  <template v-else v-for="card in cards">
    <IxCard header="接口状态" size="sm" class="h-full"></IxCard>
  </template>
  <CardModal v-model:visible="modalVisible" @ok="onModalSave" />
</template>
