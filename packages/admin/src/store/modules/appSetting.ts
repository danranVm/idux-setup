import { computed, shallowRef, watch } from 'vue'

import type { ProLayoutTheme, ProLayoutType } from '@idux/pro'
import { defineStore } from 'pinia'

export type AppThemeType = 'light' | 'dark'

export const useAppSettingStore = defineStore(
  'appSetting',
  () => {
    const appTheme = shallowRef<AppThemeType>('light')
    const layoutTheme = shallowRef<ProLayoutTheme>({
      header: 'dark',
      sider: 'light',
    })
    const layoutType = shallowRef<ProLayoutType>('both')
    const layoutCollapsed = shallowRef(false)

    const setAppTheme = (val: AppThemeType) => {
      appTheme.value = val
      appTheme.value = val
      if (val === 'light') {
        document.documentElement.classList.remove('dark')
      } else {
        document.documentElement.classList.add('dark')
      }
    }

    const setLayoutTheme = (val: ProLayoutTheme) => {
      layoutTheme.value = val
    }

    const setLayoutType = (val: ProLayoutType) => {
      layoutType.value = val
    }

    const setLayoutCollapsed = (val: boolean) => {
      layoutCollapsed.value = val
    }

    const layoutExtraInHeader = computed(() => ['header', 'both'].includes(layoutType.value))

    watch(appTheme, setLayoutTheme)

    return {
      appTheme,
      setAppTheme,
      layoutTheme,
      setLayoutTheme,
      layoutType,
      setLayoutType,
      layoutCollapsed,
      setLayoutCollapsed,
      layoutExtraInHeader,
    }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          storage: localStorage,
          paths: ['appTheme', 'layoutTheme', 'layoutType', 'layoutCollapsed'],
        },
      ],
    },
  },
)
