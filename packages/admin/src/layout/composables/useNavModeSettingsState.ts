import { watch } from 'vue'

import { useState } from '@idux/cdk/utils'
import { storeToRefs } from 'pinia'

import type { NavModeSettingsStateContext } from '../types'

import { useNavSettingStore } from '@/store/modules'
import type { NavOverviewMode, NavShortcutMode } from '@/types'

let context: NavModeSettingsStateContext | undefined

export function useNavModeSettingsState(): NavModeSettingsStateContext {
  if (context) {
    return context
  }

  const navSettingsStore = useNavSettingStore()
  const {
    setNavOverviewMode: setStoreNavOverviewMode,
    setNavShortcutMode: setStoreNavShortcutMode,
  } = navSettingsStore
  const { navOverviewMode: storeNavOverviewMode, navShortcutMode: storeNavShortcutMode } =
    storeToRefs(navSettingsStore)

  const [navOverviewMode, setNavOverviewMode] = useState<NavOverviewMode[] | undefined>(
    storeNavOverviewMode.value,
  )
  const [navShortcutMode, setNavShortcutMode] = useState<NavShortcutMode | undefined>(
    storeNavShortcutMode.value,
  )

  const handeOverviewModeChange = (mode: (NavOverviewMode | undefined)[] | undefined) => {
    setNavOverviewMode(mode)
  }
  const handeShourtcutModeChange = (mode: NavShortcutMode | undefined) => {
    setNavShortcutMode(mode)
  }

  const confirm = () => {
    setStoreNavOverviewMode(navOverviewMode.value)
    setStoreNavShortcutMode(navShortcutMode.value)
  }

  const _initNavOverviewMode = () => {
    setNavOverviewMode(storeNavOverviewMode.value)
  }
  const _initNavShortcutMode = () => {
    setNavShortcutMode(storeNavShortcutMode.value)
  }
  const init = () => {
    _initNavOverviewMode()
    _initNavShortcutMode()
  }
  const cancel = () => {
    init()
  }

  watch(storeNavOverviewMode, _initNavOverviewMode)
  watch(storeNavShortcutMode, _initNavShortcutMode)

  init()

  return (context = {
    navOverviewMode,
    navShortcutMode,

    handeOverviewModeChange,
    handeShourtcutModeChange,

    confirm,
    cancel,
    init,
  })
}
