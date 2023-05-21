import { type ComputedRef, type ShallowRef, shallowRef, ref } from 'vue'

import { isFirefox, callEmit } from '@idux/cdk'

import type { GridData, GridLayoutInnerProps, Position } from '../types'

export const layoutClassName = 'x-grid-layout'

export interface DroppableContext {
  dropping: ShallowRef<GridData | undefined>
  handleDragEnter: (evt: Event) => void
  handleDragOver: (evt: Event) => false | undefined
  handleDragLeave: (evt: Event) => void
  handleDrop: (evt: Event) => void
}

export function useDroppable(
  props: GridLayoutInnerProps,
  mergedDataSource: ComputedRef<GridData[]>,
  setPlaceholder: (data: GridData | undefined) => void,
): DroppableContext {
  const dropping = shallowRef<GridData>()

  const dragEnterCounter = ref(0)
  const droppingPosition = shallowRef<Position>()

  const removeDroppingPlaceholder = () => {
    setPlaceholder(undefined)
    dropping.value = undefined
    droppingPosition.value = undefined
  }

  const handleDragEnter = (evt: Event) => {
    evt.preventDefault()
    evt.stopPropagation()

    dragEnterCounter.value++
  }

  const handleDragOver = (evt: Event) => {
    evt.preventDefault()
    evt.stopPropagation()

    // we should ignore events from layout's children in Firefox
    // to avoid unpredictable jumping of a dropping placeholder
    // FIXME remove this hack
    if (
      isFirefox &&
      // $FlowIgnore can't figure this out
      !evt.target?.classList.contains(layoutClassName)
    ) {
      return false
    }

    const { onDragOver, margin, rowHeight, maxRows, transformScale } = props
    // Allow user to customize the dropping item or short-circuit the drop based on the results
    // of the `onDragOver(e: Event)` callback.
    const emitResult = callEmit(onDragOver, { event: evt })
    // todo
  }

  const handleDragLeave = (evt: Event) => {
    evt.preventDefault()
    evt.stopPropagation()

    dragEnterCounter.value--

    if (dragEnterCounter.value === 0) {
      removeDroppingPlaceholder()
    }
  }

  const handleDrop = (evt: Event) => {
    const targetItem = dropping.value

    if (!targetItem) {
      return
    }

    evt.preventDefault()
    evt.stopPropagation()

    const dataSource = mergedDataSource.value
    const data = dataSource.find(data => data.key === targetItem.key)

    // reset dragEnter counter on drop
    dragEnterCounter.value = 0

    removeDroppingPlaceholder()

    callEmit(props.onDrop, { event: evt, data })
  }

  return { dropping, handleDragEnter, handleDragOver, handleDragLeave, handleDrop }
}
