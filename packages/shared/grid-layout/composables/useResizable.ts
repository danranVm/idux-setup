import { shallowRef } from 'vue'

import { callEmit, type VKey } from '@idux/cdk/utils'

import type { DataSourceContext } from './useDataSource'
import type { GridLayoutInnerProps, GridData } from '../types'
import { getAllCollisions, correctDataWithCompact } from '../utils'

export interface ResizableContext {
  handleResizeStart: (evt: Event, key: VKey) => void
  handleResize: (evt: Event, key: VKey, option: { w: number; h: number }) => void
  handleResizeEnd: (evt: Event, key: VKey) => void
}

export function useResizable(
  props: GridLayoutInnerProps,
  { mergedDataSource, setDataSource }: DataSourceContext,
  setPlaceholder: (value: GridData | undefined) => void,
): ResizableContext {
  const resizing = shallowRef<GridData>()

  const handleResizeStart = (evt: Event, key: VKey) => {
    const dataSource = mergedDataSource.value
    const targetData = dataSource.find(data => data.key === key)
    if (!targetData) {
      return
    }

    resizing.value = targetData

    callEmit(props.onResizeStart, {
      event: evt,
      data: targetData,
      dataSource,
    })
  }

  const handleResize = (evt: Event, key: VKey, option: { w: number; h: number }) => {
    const dataSource = mergedDataSource.value
    const targetData = dataSource.find(data => data.key === key)
    if (!targetData) {
      return
    }

    const newData = { ...targetData, ...option }

    const { allowOverlap, collisible, compact } = props

    if (!allowOverlap && !collisible) {
      const collisions = getAllCollisions(dataSource, newData).filter(
        item => item.key !== newData.key,
      )

      if (collisions.length > 0) {
        let leastX = Infinity
        let leastY = Infinity

        collisions.forEach(item => {
          if (item.x > newData.x) {
            leastX = Math.min(leastX, item.x)
          }
          if (item.y > newData.y) {
            leastY = Math.min(leastY, item.y)
          }
        })

        if (Number.isFinite(leastX)) {
          newData.w = leastX - newData.x
        }
        if (Number.isFinite(leastY)) {
          newData.h = leastY - newData.y
        }
      }
    }

    let newDataSource = modifyDataSource(dataSource, newData)
    newDataSource = allowOverlap ? newDataSource : correctDataWithCompact(newDataSource, compact)

    callEmit(props.onResize, { event: evt, data: targetData, dataSource: newDataSource })

    setDataSource(newDataSource)
    setPlaceholder({ key, x: newData.x, y: newData.y, w: newData.w, h: newData.h })
  }

  const handleResizeEnd = (evt: Event, key: VKey) => {
    if (!resizing.value) {
      return
    }

    const dataSource = mergedDataSource.value
    const targetData = dataSource.find(data => data.key === key)
    if (!targetData) {
      return
    }

    const { allowOverlap, compact } = props
    const newDataSource = allowOverlap ? dataSource : correctDataWithCompact(dataSource, compact)

    callEmit(props.onResizeEnd, { event: evt, data: targetData, dataSource: newDataSource })

    setDataSource(newDataSource, true)
    resizing.value = undefined
    setPlaceholder(undefined)
  }

  return { handleResizeStart, handleResize, handleResizeEnd }
}

function modifyDataSource(dataSource: GridData[], data: GridData): GridData[] {
  const newDataSource = Array(dataSource.length)
  for (let i = 0, len = dataSource.length; i < len; i++) {
    if (data.key === dataSource[i].key) {
      newDataSource[i] = data
    } else {
      newDataSource[i] = dataSource[i]
    }
  }
  return newDataSource
}
