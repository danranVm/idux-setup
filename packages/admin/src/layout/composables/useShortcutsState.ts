import { inject, ref, watch } from 'vue'

import { type MaybeArray, useState, useControlledProp } from '@idux/cdk/utils'

import { layoutContextToken } from '../context'
import type { ShortcutsMode } from '../types'

import type { NavRecord } from '@/types'

export function useShortcutsState(props: {
  mode?: ShortcutsMode
  expanded?: boolean
  'onUpdate:expanded'?: MaybeArray<(expanded: boolean) => void>
}) {
  const { shortcutRecords, setShortcuts, removeShortcut } = inject(layoutContextToken)!

  const dataSource = ref<NavRecord[]>([])
  const [editEnabled, _setEditEnabled] = useState<boolean>(false)
  const [expanded, _setExpanded] = useControlledProp(props, 'expanded')

  watch(
    () => props.mode,
    currentMode => {
      _setEditEnabled(currentMode === 'flattened' ? true : false)
      _setExpanded(true)
    },
    {
      immediate: true,
    },
  )

  const setEditEnabled = (enabled: boolean) => {
    if (props.mode === 'flattened') {
      return
    }

    _setEditEnabled(enabled)
  }
  const setExpanded = (expanded: boolean) => {
    if (props.mode === 'flattened') {
      return
    }

    _setExpanded(expanded)
  }

  watch(
    shortcutRecords,
    records => {
      dataSource.value = [...records]
    },
    {
      immediate: true,
    },
  )

  const handleConfirm = () => {
    setShortcuts(dataSource.value.map(record => record.id))
  }
  const handleCancel = () => {
    dataSource.value = [...shortcutRecords.value]
  }
  const handleDelete = (id: string) => {
    if (props.mode === 'flattened') {
      removeShortcut(id)
      return
    }

    const idx = dataSource.value.findIndex(record => record.id === id)

    if (idx > -1) {
      dataSource.value.splice(idx, 1)
    }
  }
  const handleChange = (records: NavRecord[]) => {
    if (props.mode === 'flattened') {
      setShortcuts(records.map(rec => rec.id))
      return
    }

    dataSource.value = records
  }

  return {
    editEnabled,
    expanded,
    dataSource,
    handleConfirm,
    handleCancel,
    handleDelete,
    handleChange,
    setEditEnabled,
    setExpanded,
  }
}
