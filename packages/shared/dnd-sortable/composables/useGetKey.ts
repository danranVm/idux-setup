import { computed, type ComputedRef } from 'vue-demi'

import { isString } from 'lodash-es'

import type { DndSortableInnerProps } from '../types'

export function useGetKey(props: DndSortableInnerProps): ComputedRef<(data: any) => any> {
  return computed(() => {
    const { getKey } = props
    if (isString(getKey)) {
      return (data: unknown) => {
        const key = (data as any)[getKey]
        if (key === undefined) {
          new Error('Each item in dataSource should have a unique `key` prop.')
        }
        return key
      }
    }
    return getKey
  })
}
