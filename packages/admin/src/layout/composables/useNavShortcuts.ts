import { computed, inject } from 'vue'

import { storeToRefs } from 'pinia'

import type { NavShortcutsContext } from '../types'

import { appContextToken } from '@/context'
import { useNavSettingStore } from '@/store/modules'

export function useNavShortcuts(): NavShortcutsContext {
  const { getNavRecordById } = inject(appContextToken)!
  const navSettingStore = useNavSettingStore()
  const { setShortcutIds } = navSettingStore
  const { shortcutIds } = storeToRefs(navSettingStore)

  const shortcutRecords = computed(() =>
    shortcutIds.value.map(id => getNavRecordById(id)).filter(Boolean),
  )

  const setShortcuts = (ids: string[]) => {
    setShortcutIds(ids)
  }

  const hasShortcut = (id: string) => {
    return shortcutIds.value.includes(id)
  }
  const addShortcut = (id: string) => {
    if (hasShortcut(id)) {
      return
    }

    setShortcutIds([...shortcutIds.value, id])
  }
  const removeShortcut = (id: string) => {
    const idx = shortcutIds.value.findIndex(recordId => recordId === id)

    if (idx > -1) {
      const tempIds = [...shortcutIds.value]
      tempIds.splice(idx, 1)
      setShortcutIds(tempIds)
    }
  }
  const clearShortcuts = () => {
    setShortcutIds([])
  }

  return {
    shortcutRecords,
    setShortcuts,
    hasShortcut,
    addShortcut,
    removeShortcut,
    clearShortcuts,
  }
}
