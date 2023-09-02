<script setup lang="ts">
import { onBeforeMount, provide, shallowRef } from 'vue'
import { RouterView } from 'vue-router'

import { useState } from '@idux/cdk/utils'
import { useSharedBreakpoints } from '@idux/cdk/breakpoint'
import { storeToRefs } from 'pinia'

import { type BubbleItem, Bubble } from './components/bubble'
import { appContextToken } from './context'
import { ModalGuide } from './guide/modalGuide'
import { MaskGuide } from './guide/maskGuide'
import { PopperGuide } from './guide/popperGuide'
import { navRecords } from './router/routes'

import { useNavRecords } from '@/composables/useNavRecords'
import { GlobalLayout } from '@/layout'
import { IduxProviders, Message } from '@/plugins/idux'
import { useAppSettingStore, useAlarmDataStore, useNavSettingStore } from '@/store/modules'

const appSettingStore = useAppSettingStore()
const { loadAlarmData } = useAlarmDataStore()
const { appTheme } = storeToRefs(appSettingStore)
const { setAppTheme } = appSettingStore
const { navOverviewEnabled } = storeToRefs(useNavSettingStore())

const navRecordsContext = useNavRecords(navRecords)
const breakpoints = useSharedBreakpoints()

const modalGuideVisible = shallowRef(false)
const maskGuideVisible = shallowRef(false)
const popperGuideVisible = shallowRef(false)
const handleModalGuideFinish = () => {
  modalGuideVisible.value = false
}

const bubbleItems: BubbleItem[] = [{
  text: '评价',
  icon: 'edit',
}, {
  text: '引导',
  icon: 'transmit',
  sub: [{
    text: '速览引导',
    onClick() {
      modalGuideVisible.value = true
    }
  }, {
    text: '气泡介绍引导',
    onClick() {
      if (!navOverviewEnabled.value) {
        Message?.warning('请开启功能全览')
        return
      }

      popperGuideVisible.value = true
    }
  }, {
    text: '蒙层引导',
    onClick() {
      maskGuideVisible.value = true
    }
  }, {
    text: '任务型引导',
    onClick() {}
  }]
}]

const { activeLayoutType } = navRecordsContext

provide(appContextToken, {
  breakpoints,
  ...navRecordsContext,
})

onBeforeMount(() => {
  loadAlarmData()
  setAppTheme(appTheme.value)
})
</script>

<template>
  <IduxProviders>
    <router-view v-if="activeLayoutType === 'standalone'" />
    <GlobalLayout v-if="activeLayoutType === 'composed'" />
    <Bubble :items="bubbleItems" />
    <ModalGuide v-model:visible="modalGuideVisible" @finish="handleModalGuideFinish" />
    <MaskGuide v-model:visible="maskGuideVisible" />
    <PopperGuide v-model:visible="popperGuideVisible" />
  </IduxProviders>
</template>
