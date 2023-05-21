<script setup lang="ts">
import { onBeforeMount, provide  } from 'vue'
import { RouterView } from 'vue-router'

import { useSharedBreakpoints  } from '@idux/cdk/breakpoint'
import { storeToRefs } from 'pinia'

import { appContextToken } from './context'

import { IduxProviders } from '@/plugins/idux'
import { useAppSettingStore } from '@/store/modules'

const appSettingStore = useAppSettingStore()
const { appTheme } = storeToRefs(appSettingStore)
const { setAppTheme } = appSettingStore

const breakpoints = useSharedBreakpoints()

provide(appContextToken,
  {
    breakpoints,
  }
)

onBeforeMount(() => {
  setAppTheme(appTheme.value)
})
</script>

<template>
  <IduxProviders>
    <router-view />
  </IduxProviders>
</template>
