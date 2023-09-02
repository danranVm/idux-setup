import { computed, shallowRef, ref } from 'vue'

import { defineStore } from 'pinia'

import type { NavOverviewMode, NavShortcutMode } from '@/types'

export const useNavSettingStore = defineStore(
  'navigationSettings',
  () => {
    const shortcutIds = shallowRef<string[]>([])
    const recentRecordIds = shallowRef<string[]>([])
    const disabledRecordIds = shallowRef<string[]>([])
    const recordOrders = ref<Record<string, number>>({})
    const disabledRecordIdSet = computed(() => new Set(disabledRecordIds.value))

    const setShortcutIds = (ids: string[]) => {
      shortcutIds.value = ids
    }
    const setRecentRecordIds = (ids: string[]) => {
      recentRecordIds.value = ids
    }
    const setDisabledRecordIds = (ids: string[]) => {
      disabledRecordIds.value = ids
    }
    const setRecordDisabled = (id: string, disabled: boolean) => {
      const tempSet = new Set(disabledRecordIdSet.value)

      if (disabled) {
        tempSet.add(id)
      } else {
        tempSet.delete(id)
      }

      setDisabledRecordIds(Array.from(tempSet))
    }
    const setOrders = (orders: Record<string, number>) => {
      recordOrders.value = orders
    }
    const setRecordOrder = (id: string, number) => {
      recordOrders[id] = number
    }

    const navOverviewMode = shallowRef<NavOverviewMode[] | undefined>(['overview'])
    const navShortcutMode = shallowRef<NavShortcutMode | undefined>('tab')

    const navOverviewEnabled = computed(() => navOverviewMode.value.includes('overview'))
    const navSearchEnabled = computed(() => navOverviewMode.value.includes('search'))

    const navShortcutEnabled = computed(() => navShortcutMode.value === 'shortcut')
    const navTabsEnabled = computed(() => navShortcutMode.value === 'tab')

    const setNavOverviewMode = (mode: NavOverviewMode[] | undefined) => {
      navOverviewMode.value = mode
    }
    const setNavShortcutMode = (mode: NavShortcutMode | undefined) => {
      navShortcutMode.value = mode
    }

    return {
      shortcutIds,
      recentRecordIds,
      disabledRecordIds,
      disabledRecordIdSet,
      recordOrders,
      navOverviewMode,
      navShortcutMode,
      navOverviewEnabled,
      navSearchEnabled,
      navShortcutEnabled,
      navTabsEnabled,

      setShortcutIds,
      setRecentRecordIds,
      setDisabledRecordIds,
      setRecordDisabled,
      setOrders,
      setRecordOrder,
      setNavOverviewMode,
      setNavShortcutMode,
    }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          storage: localStorage,
          paths: [
            'shortcutIds',
            'recentRecordIds',
            'disabledRecordIds',
            'recordOrders',
            'navOverviewMode',
            'navShortcutMode',
          ],
        },
      ],
    },
  },
)
