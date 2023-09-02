import { computed, shallowRef } from 'vue'

import type { ProLayoutTheme, ProLayoutType } from '@idux/pro'
import { defineStore } from 'pinia'

export type AppThemeType = 'light' | 'dark'
export type MenuGroupMode = 'basic' | 'root-grouped' | 'children-groupped'
export type MenuExpandMode = 'accordion' | 'separate'

export const useAppSettingStore = defineStore(
  'appSetting',
  () => {
    const version = shallowRef('v2.0')
    const appTheme = shallowRef<AppThemeType>('light')
    const layoutType = shallowRef<ProLayoutType>('sider')
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

    const setLayoutType = (val: ProLayoutType) => {
      layoutType.value = val
    }

    const setLayoutCollapsed = (val: boolean) => {
      layoutCollapsed.value = val
    }

    const menuGroupMode = shallowRef<MenuGroupMode>('root-grouped')
    const menuExpandMode = shallowRef<MenuExpandMode>('accordion')

    const setMenuGroupMode = (val: MenuGroupMode) => {
      menuGroupMode.value = val
    }
    const setMenuExpandMode = (val: MenuExpandMode) => {
      menuExpandMode.value = val
    }

    const layoutExtraInHeader = computed(() => ['header', 'both'].includes(layoutType.value))
    const layoutTheme = computed<ProLayoutTheme>(() => {
      return {
        header: 'dark',
        sider: 'dark',
      }
    })

    return {
      version,
      appTheme,
      setAppTheme,
      layoutTheme,
      layoutType,
      setLayoutType,
      layoutCollapsed,
      setLayoutCollapsed,
      menuGroupMode,
      setMenuGroupMode,
      menuExpandMode,
      setMenuExpandMode,
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
