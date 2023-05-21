import { type ComputedRef, type ShallowRef, shallowRef, watch, onMounted } from 'vue'

import { useState, useResizeObserver } from '@idux/cdk'

import type { GridData, GridLayoutInnerProps } from '../types'
import { bottom } from '../utils'

export function useContainerSize(
  props: GridLayoutInnerProps,
  mergedDataSource: ComputedRef<GridData[]>,
): {
  containerRef: ShallowRef<HTMLDivElement | undefined>
  mergedContainerWidth: ComputedRef<number>
  mergedContainerHeight: ComputedRef<number>
} {
  const containerRef = shallowRef<HTMLDivElement>()
  const [mergedContainerWidth, setMergedWidth] = useState(0)
  const [mergedContainerHeight, setMergedHeight] = useState(0)

  useResizeObserver(containerRef, entry => {
    const { width } = entry.contentRect
    setMergedWidth(width)
  })

  const updateHeight = () => {
    let height = 0
    if (props.autoSize) {
      const { margin, padding, rowHeight } = props
      const [, verticalMargin] = margin
      const [, verticalPadding] = padding
      const currBottom = bottom(mergedDataSource.value)
      height = currBottom * rowHeight + (currBottom - 1) * verticalMargin + verticalPadding * 2
    }
    setMergedHeight(height)
  }

  watch(
    [
      mergedDataSource,
      () => props.autoSize,
      () => props.margin,
      () => props.padding,
      () => props.rowHeight,
    ],
    () => updateHeight(),
  )

  onMounted(() => {
    setMergedWidth(containerRef.value!.offsetWidth)
    updateHeight()
  })

  return { containerRef, mergedContainerWidth, mergedContainerHeight }
}
