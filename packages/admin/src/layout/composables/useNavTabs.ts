import { computed, inject, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useModal } from '@idux/components/modal'
import { storeToRefs } from 'pinia'

import type { NavTab, NavTabsContext } from '../types'

import { appContextToken } from '@/context'
import { useNavTabsStore, useNavSettingStore } from '@/store/modules'

const maxTabCnt = 18

export function useNavTabs(): NavTabsContext {
  const { getNavRecordById, isNavRecordActive, activeNavRecords } = inject(appContextToken)!
  const navTabsStore = useNavTabsStore()
  const {
    setNavTabPined: _setNavTabPined,
    setNavTabsRecordIds,
    setPinedNavTabsRecordIds,
  } = navTabsStore
  const { pinedNavTabsRecordIds, pinedNavTabsRecordIdSet, navTabsRecordIds } =
    storeToRefs(navTabsStore)
  const { navTabsEnabled } = storeToRefs(useNavSettingStore())

  const { warning } = useModal()
  const router = useRouter()

  const navTabRecords = computed<NavTab[]>(() =>
    navTabsRecordIds.value.map(id => ({
      ...getNavRecordById(id)!,
      pined: pinedNavTabsRecordIdSet.value.has(id),
      active: isNavRecordActive(id),
    })),
  )

  const setNavTabs = (ids: string[]) => {
    const newTabsIdSet = new Set(ids)

    setNavTabsRecordIds(ids)
    setPinedNavTabsRecordIds(pinedNavTabsRecordIds.value.filter(id => newTabsIdSet.has(id)))
  }

  const hasNavTab = (id: string) => {
    return navTabsRecordIds.value.includes(id)
  }
  const addNavTab = (id: string) => {
    if (hasNavTab(id)) {
      return true
    }

    if (navTabsRecordIds.value.length + 1 > maxTabCnt) {
      return false
    }

    setNavTabs([...navTabsRecordIds.value, id])

    return true
  }
  const isNavPined = (id: string) => {
    return pinedNavTabsRecordIdSet.value.has(id)
  }
  const isNavRemoveDisabled = (id: string, type: 'self' | 'after' | 'before' | 'other' | 'all') => {
    if (type === 'self') {
      return false
    }

    const idx = navTabsRecordIds.value.findIndex(recordId => recordId === id)

    if (type === 'after') {
      return idx >= navTabsRecordIds.value.length - 1
    }

    if (type === 'before') {
      return navTabsRecordIds.value.slice(0, idx).every(tabId => isNavPined(tabId))
    }

    if (type === 'other') {
      return navTabsRecordIds.value.every(tabId => isNavPined(tabId) || tabId === id)
    }

    return navTabsRecordIds.value.every(tabId => isNavPined(tabId))
  }

  const _RemoveNavTabs = (removedIds: string[], newIds?: string[]) => {
    const _newIds = newIds ?? navTabsRecordIds.value.filter(id => !removedIds.includes(id))

    const activeRemovedId = removedIds.find(id => isNavRecordActive(id))
    if (!activeRemovedId) {
      setNavTabs(_newIds)
      return
    }

    const activeRemovedIdIndex = navTabsRecordIds.value.findIndex(id => id === activeRemovedId)

    let nextActiveId: string | undefined
    let nextActiveIdIdx = activeRemovedIdIndex - 1
    while (!nextActiveId && nextActiveIdIdx > -1) {
      if (!removedIds.includes(navTabsRecordIds.value[nextActiveIdIdx])) {
        nextActiveId = navTabsRecordIds.value[nextActiveIdIdx]
      }

      nextActiveIdIdx--
    }

    nextActiveId = nextActiveId ?? _newIds[0]

    if (nextActiveId) {
      const record = getNavRecordById(nextActiveId)!
      router.push(record.path)
    }

    setNavTabs(_newIds)
  }

  const removeNavTab = (id: string) => {
    const idx = navTabsRecordIds.value.findIndex(recordId => recordId === id)

    if (idx < 0) {
      return
    }

    const tempIds = [...navTabsRecordIds.value]
    tempIds.splice(idx, 1)

    _RemoveNavTabs([id], tempIds)
  }

  const setNavTabPined = (id: string, pined: boolean) => {
    if (!hasNavTab(id)) {
      return
    }

    _setNavTabPined(id, pined)

    const tempIds = [...navTabsRecordIds.value]
    const idx = navTabsRecordIds.value.findIndex(recordId => recordId === id)
    tempIds.splice(idx, 1)

    let firstUnpinedTabIdx = navTabRecords.value.findIndex(
      record => !record.pined && record.id !== id,
    )

    if (firstUnpinedTabIdx > idx) {
      firstUnpinedTabIdx--
    }

    if (firstUnpinedTabIdx < 0) {
      tempIds.push(id)
    } else {
      tempIds.splice(firstUnpinedTabIdx, 0, id)
    }

    setNavTabsRecordIds(tempIds)
  }

  const removeNavTabs = (id: string, type: 'after' | 'before' | 'other') => {
    const idx = navTabsRecordIds.value.findIndex(recordId => recordId === id)

    if (idx < 0) {
      return
    }

    const newTabs: string[] = []
    const removedTabs: string[] = []
    const filterFn =
      type === 'other'
        ? (tabId: string) => isNavPined(tabId) || tabId === id
        : type === 'after'
        ? (tabId: string, tabIdx: number) => isNavPined(tabId) || tabIdx <= idx
        : type === 'before'
        ? (tabId: string, tabIdx: number) => isNavPined(tabId) || tabIdx >= idx
        : () => true

    navTabsRecordIds.value.forEach((tabId, tabIdx) => {
      if (filterFn(tabId, tabIdx)) {
        newTabs.push(tabId)
      } else {
        removedTabs.push(tabId)
      }
    })

    _RemoveNavTabs(removedTabs, newTabs)
  }
  const clearNavTabs = () => {
    _RemoveNavTabs(navTabsRecordIds.value.filter(id => !isNavPined(id)))
  }

  const isNavTabMovable = (sourceId: string, targetId: string) => {
    return (
      hasNavTab(sourceId) && hasNavTab(targetId) && isNavPined(sourceId) === isNavPined(targetId)
    )
  }

  const moveNavTab = (sourceIdx: number, targetIdx: number) => {
    const sourceTab = navTabRecords.value[sourceIdx]

    const tempData = [...navTabsRecordIds.value]
    tempData.splice(sourceIdx, 1)
    tempData.splice(targetIdx, 0, sourceTab.id)

    setNavTabs(tempData)
  }

  const handleTabOpen = (id: string) => {
    if (!navTabsEnabled.value) {
      return
    }

    const record = getNavRecordById(id)
    if (!record) {
      return
    }

    const TabsToAdd = [
      !hasNavTab(activeNavRecords.value[0].id) && activeNavRecords.value[0].id,
      id,
    ].filter(Boolean) as string[]

    // 可添加数量
    const availableCnt = maxTabCnt - navTabsRecordIds.value.length

    // 删除超出可添加数量的Tab
    if (availableCnt < TabsToAdd.length) {
      TabsToAdd.splice(0, availableCnt - TabsToAdd.length)
    }

    // 如果所有的tab都不能添加，报错
    if (TabsToAdd.length <= 0) {
      const modal = warning({
        header: '提示',
        title: '标签数量已达上限',
        content: '最多支持同时打开18个标签页，请先关闭已有标签页再进行尝试。',
        destroyOnHide: true,
        footer: [
          {
            text: '我知道了',
            mode: 'default',
            onClick: () => {
              modal.cancel()
            },
          },
        ],
      })
      return
    }

    const cancelListener = router.afterEach(() => {
      TabsToAdd.forEach(TabToAdd => addNavTab(TabToAdd))
      cancelListener()
    })
    router.push(record.path)
  }

  watch(
    () => activeNavRecords.value[0],
    (activeNavRecord, preActiveNavRecord) => {
      if (!navTabsEnabled.value || !activeNavRecord || hasNavTab(activeNavRecord.id)) {
        return
      }

      const preActiveIdx = navTabsRecordIds.value.findIndex(id => id === preActiveNavRecord?.id)

      const tempIds = [...navTabsRecordIds.value]
      if (preActiveIdx > -1) {
        tempIds[preActiveIdx] = activeNavRecord.id
      } else if (tempIds.length > 0) {
        tempIds.push(activeNavRecord.id)
      }

      setNavTabs(tempIds)
    },
    {
      immediate: true,
    },
  )

  return {
    navTabRecords,
    setNavTabs,
    hasNavTab,
    addNavTab,
    isNavPined,
    isNavRemoveDisabled,
    removeNavTab,
    removeNavTabs,
    setNavTabPined,
    clearNavTabs,
    isNavTabMovable,
    moveNavTab,
    handleTabOpen,
  }
}
