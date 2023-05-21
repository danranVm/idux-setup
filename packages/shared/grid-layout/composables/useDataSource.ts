import { type ComputedRef, watch } from 'vue'

import { callEmit, useState } from '@idux/cdk'
import { cloneDeep } from 'lodash-es'

import type { CompactType, GridData, GridLayoutInnerProps } from '../types'
import { correctDataWithBounds, correctDataWithCompact } from '../utils'

export interface DataSourceContext {
  mergedDataSource: ComputedRef<GridData[]>
  setDataSource: (dataSource: GridData[], emit?: boolean) => void
}

export function useDataSource(props: GridLayoutInnerProps): DataSourceContext {
  const { dataSource, allowOverlap, compact } = props
  const [mergedDataSource, setMergedDataSource] = useState(
    convertDataSource(dataSource, allowOverlap, compact),
  )

  const setDataSource = (dataSource: GridData[], emit?: boolean) => {
    setMergedDataSource(dataSource)
    if (emit) {
      callEmit(props.onDataChange, dataSource)
    }
  }

  watch(
    [() => props.dataSource, () => props.allowOverlap, () => props.compact],
    ([dataSource, allowOverlap, compact]) => {
      convertDataSource(dataSource, allowOverlap, compact)
    },
  )

  return { mergedDataSource, setDataSource }
}

function convertDataSource(dataSource: GridData[], allowOverlap: boolean, compact: CompactType) {
  const clonedData = cloneDeep(dataSource)
  const correctedData = correctDataWithBounds(clonedData)
  return allowOverlap ? correctedData : correctDataWithCompact(correctedData, compact)
}
