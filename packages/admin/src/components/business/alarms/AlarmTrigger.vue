<script lang="ts" setup>
import { computed } from 'vue'

import { storeToRefs } from 'pinia'

import { useAlarmDataStore } from '@/store/modules'

const props = defineProps<{
  badgeType?: 'count' | 'dot'
}>()

const { alarmDataCount } = storeToRefs(useAlarmDataStore())
const count = computed(() =>
  props.badgeType === 'count' && alarmDataCount.value > 0 ? alarmDataCount.value : undefined,
)
const dot = computed(() => props.badgeType === 'dot' && alarmDataCount.value > 0)
</script>

<template>
  <IxBadge class="global-alarms-trigger" :count="count" :dot="dot">
    <IxIcon name="alert" />
  </IxBadge>
</template>
