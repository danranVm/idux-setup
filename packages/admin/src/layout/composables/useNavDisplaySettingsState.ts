import { computed, inject, watch } from 'vue'

import { flattenTree, useState } from '@idux/cdk/utils'
import { storeToRefs } from 'pinia'

import type { NavDisplaySettingsStateContext } from '../types'
import { calculateNavRecordOrder } from '../utils'

import { appContextToken } from '@/context'
import { useNavSettingStore } from '@/store/modules'
import type { NavRecord } from '@/types'

let context: NavDisplaySettingsStateContext | undefined

export function useNavDisplaySettingsState(): NavDisplaySettingsStateContext {
  if (context) {
    return context
  }

  const navSettingsStore = useNavSettingStore()

  const { setDisabledRecordIds, setOrders } = navSettingsStore
  const { recordOrders: navRecordOrders, disabledRecordIdSet } = storeToRefs(navSettingsStore)

  const { navRecords, isNavRecordDisabled: _isNavRecordDisabled } = inject(appContextToken)!

  const [disabledIdSet, setDisabledIdSet] = useState<Set<string>>(disabledRecordIdSet.value)
  const [recordOrders, setRecordOrders] = useState<Record<string, number>>(navRecordOrders.value)
  const [expandedRootKeys, setExpandedRootKeys] = useState<string[]>(
    navRecords.value.filter(record => !!record.children?.length).map(record => record.id),
  )

  const dataSource = computed(() =>
    [...navRecords.value]
      .sort(
        (record1, record2) =>
          (recordOrders.value[record1.id] ?? 0) - (recordOrders.value[record2.id] ?? 0),
      )
      .map(record => ({ record, children: flattenTree(record.children ?? [], 'children') })),
  )

  const _initRecordOrders = () => {
    setRecordOrders(navRecordOrders.value)
  }
  const _initDisabledIdSet = () => {
    setDisabledIdSet(disabledRecordIdSet.value)
  }
  const _resetDisabledRecords = () => {
    setDisabledIdSet(new Set())
  }
  const _resetRecordOrders = () => {
    setRecordOrders(
      navRecords.value.reduce((res, record, index) => {
        res[record.id] === index
        return res
      }, {} as Record<string, number>),
    )
  }
  const init = () => {
    _initRecordOrders()
    _initDisabledIdSet()
  }
  const reset = () => {
    _resetDisabledRecords()
    _resetRecordOrders()
  }

  const isNavRecordDisabled = (id: string) => {
    return _isNavRecordDisabled(id, disabledIdSet.value)
  }

  const setRootRecordExpanded = (id: string, expanded: boolean) => {
    const tempSet = new Set(expandedRootKeys.value)
    if (expanded) {
      tempSet.add(id)
    } else {
      tempSet.delete(id)
    }

    setExpandedRootKeys(Array.from(tempSet))
  }

  const isExpanded = (id: string) => {
    return expandedRootKeys.value.indexOf(id) > -1
  }

  const handleEnableStatusChange = (value: boolean, record: NavRecord) => {
    const tempSet = new Set(disabledIdSet.value)
    value ? tempSet.delete(record.id) : tempSet.add(record.id)

    setDisabledIdSet(tempSet)
  }
  const handleExpanded = (expanded: boolean, record: NavRecord) => {
    if (navRecords.value.findIndex(rootRecord => rootRecord.id === record.id) > -1) {
      setRootRecordExpanded(record.id, expanded)
    }
  }

  let cachedOrder: Record<string, number> | undefined
  let expandedKeysCache: string[] = []
  const handleMove = (evt: {
    dragged: HTMLElement
    related: HTMLElement
    willInsertAfter: boolean
  }) => {
    const { dragged, related, willInsertAfter } = evt
    if (related.dataset.dragdisabled === 'true') {
      return false
    }

    const sourceId = dragged.dataset.id!
    const targetId = related.dataset.id!

    cachedOrder = calculateNavRecordOrder(
      navRecords.value,
      recordOrders.value,
      sourceId,
      targetId,
      willInsertAfter ? 'after' : 'before',
    )

    return willInsertAfter ? 1 : -1
  }
  const handleStart = () => {
    expandedKeysCache = expandedRootKeys.value
    setExpandedRootKeys([])
  }
  const handleEnd = () => {
    if (cachedOrder) {
      setRecordOrders(cachedOrder)
    }

    setExpandedRootKeys(expandedKeysCache)
    expandedKeysCache = []
  }

  const confirm = () => {
    setDisabledRecordIds(Array.from(disabledIdSet.value))
    setOrders(recordOrders.value)
  }
  const cancel = () => {
    init()
  }

  watch(navRecordOrders, _initRecordOrders)
  watch(disabledRecordIdSet, _initDisabledIdSet)

  init()

  return (context = {
    dataSource,
    expandedKeys: expandedRootKeys,
    setExpandedKeys: setExpandedRootKeys,
    isExpanded,
    isNavRecordDisabled,
    handleEnableStatusChange,
    handleExpanded,
    handleMove,
    handleStart,
    handleEnd,
    confirm,
    cancel,
    init,
    reset,
  })
}
