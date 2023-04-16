<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { RouterView } from 'vue-router'

import { storeToRefs } from 'pinia'

import { IduxProviders } from '@/plugins/idux'
import { useAppSettingStore } from '@/store/modules'

const appSettingStore = useAppSettingStore()
const { appTheme } = storeToRefs(appSettingStore)
const { setAppTheme } = appSettingStore

onBeforeMount(() => {
  setAppTheme(appTheme.value)
})
</script>

<template>
  <IduxProviders>
    <router-view />
  </IduxProviders>
</template>
