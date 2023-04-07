<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { RouterView } from 'vue-router'

import { storeToRefs } from 'pinia'

import { IduxProviders } from '@/plugins/idux'
import { useAppSettingStore } from '@/store/stores/appSetting'

const { setAppTheme } = useAppSettingStore()
const { appTheme } = storeToRefs(useAppSettingStore())

onBeforeMount(() => {
  setAppTheme(appTheme.value)
})
</script>

<template>
  <IduxProviders>
    <router-view />
  </IduxProviders>
</template>
