/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/archive/blob/main/LICENSE
 */

import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import { filterTree, traverseTree } from '@idux/cdk/utils'
import { storeToRefs } from 'pinia'

import type { NavRecordsContext, NavRecord } from '../types'

import { useNavSettingStore } from '@/store/modules'

export function useNavRecords(navRecords: NavRecord[]): NavRecordsContext {
  const route = useRoute()
  const { recordOrders, disabledRecordIdSet } = storeToRefs(useNavSettingStore())

  const recordMap = ref(new Map<string, NavRecord>())
  const pathRecordMap = ref(new Map<string, NavRecord>())
  const parentRecordMap = ref(new Map<string, NavRecord>())

  const traverseParents = (record: NavRecord, fn: (parent: NavRecord) => void) => {
    const parent = parentRecordMap.value.get(record.id)
    if (!parent) {
      return
    }

    fn(parent)
    traverseParents(parent, fn)
  }

  const filteredRecords = computed(() =>
    filterTree(navRecords, 'children', item => !disabledRecordIdSet.value.has(item.id), 'and'),
  )
  const sortedRecords = computed(() =>
    [...filteredRecords.value].sort((record1, record2) => {
      return (recordOrders.value[record1.id] ?? 0) - (recordOrders.value[record2.id] ?? 0)
    }),
  )

  const initRecords = () => {
    const _recordMap = new Map<string, NavRecord>()
    const _pathRecordMap = new Map<string, NavRecord>()
    const _parentRecordMap = new Map<string, NavRecord>()

    // 遍历导航树，建立父子节点map，id和节点的map以及路径与节点的map
    traverseTree(navRecords, 'children', (record, parents) => {
      _recordMap.set(record.id, record)

      if (!record.children?.length) {
        _pathRecordMap.set(record.path, record)
      }

      if (parents[0]) {
        _parentRecordMap.set(record.id, parents[0])
      }
    })

    recordMap.value = _recordMap
    pathRecordMap.value = _pathRecordMap
    parentRecordMap.value = _parentRecordMap
  }

  const getNavRecordById = (id: string) => recordMap.value.get(id)
  const getNavRecordByPath = (path: string) => pathRecordMap.value.get(path)
  const isNavRecordDisabled = (id: string, disabledSet?: Set<string>) => {
    const _disabledSet = disabledSet ?? disabledRecordIdSet.value
    if (_disabledSet.has(id)) {
      return true
    }

    const record = getNavRecordById(id)

    if (!record) {
      return false
    }

    // 父节点禁用则子节点同步禁用
    let disable = false
    traverseParents(record, parent => {
      if (_disabledSet.has(parent.id)) {
        disable = true
      }
    })

    return disable
  }
  const isNavRecordActive = (id: string) => {
    return activeNavRecords.value.findIndex(record => record.id === id) > -1
  }

  // 当前处于激活状态的全部节点
  const activeNavRecords = computed(() => {
    const _activeRecords: NavRecord[] = []
    const currentActiveRecord = getNavRecordByPath(route.path)

    if (currentActiveRecord) {
      _activeRecords.push(currentActiveRecord)
      traverseParents(currentActiveRecord, parent => _activeRecords.push(parent))
    }

    return _activeRecords
  })

  // 当前处于激活状态的布局类型
  const activeLayoutType = computed(() => {
    return activeNavRecords.value[activeNavRecords.value.length - 1]?.layoutType ?? 'standalone'
  })

  initRecords()

  return {
    navRecords: computed(() => navRecords),
    sortedNavRecords: sortedRecords,
    filteredNavRecords: filteredRecords,
    activeNavRecords,
    activeLayoutType,
    getNavRecordById,
    getNavRecordByPath,
    isNavRecordDisabled,
    isNavRecordActive,
  }
}
