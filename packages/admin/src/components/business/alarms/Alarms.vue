<script lang="ts" setup>
import { IxSpin } from '@idux/components/spin'
import { storeToRefs } from 'pinia'

import AlarmItem from './AlarmItem.vue'

import { useAlarmDataStore } from '@/store/modules'

const alarmDataStore = useAlarmDataStore()
const { setAllAlarmRead } = alarmDataStore
const { alarmData, loading } = storeToRefs(alarmDataStore)
</script>

<template>
  <IxSpin :spinning="loading">
    <div class="global-alarms">
      <div class="global-alarms__header">
        <span class="global-alarms__header__label">消息通知</span>
        <span class="global-alarms__header__opers">
          <IxSwitch />
          <span>有消息时弹出气泡</span>
        </span>
      </div>
      <div class="global-alarms__content">
        <AlarmItem
          v-for="item in alarmData"
          :key="item.key"
          :contents="item.contents"
          :time="item.time"
        />
      </div>
      <div class="global-alarms__footer">
        <IxButton mode="primary" @click="setAllAlarmRead">全部已读</IxButton>
      </div>
    </div>
  </IxSpin>
</template>
