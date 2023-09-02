import { shallowRef, watch, isVue2, toRaw, type ShallowRef } from 'vue-demi'

import { callEmit } from '../../utils'
import type { DndSortableChangeOptions, DndSortableInnerProps } from '../types'

export interface DataSourceContext {
  mergedDataSource: ShallowRef<any[]>
  setDataSource: (value: any[], options: DndSortableChangeOptions) => void
}

export function useDataSource(
  props: DndSortableInnerProps,
  emit: (event: 'change', ...args: any[]) => void,
): DataSourceContext {
  const mergedDataSource = shallowRef(props.dataSource)

  watch(
    () => props.dataSource,
    value => (mergedDataSource.value = value),
    { deep: true },
  )

  const setDataSource = (value: any[], options: DndSortableChangeOptions) => {
    if (value !== mergedDataSource.value) {
      const raw = toRaw(value)
      mergedDataSource.value = raw

      callEmit(props.onChange, raw, options)
      isVue2 && emit(`change`, raw, options)
    }
  }

  return { mergedDataSource, setDataSource }
}
