import { shallowRef } from 'vue'

import { type VKey, callEmit } from '@idux/cdk'

import type { DataSourceContext } from './useDataSource'
import type { CompactType, GridData, GridLayoutInnerProps } from '../types'
import {
  correctDataWithCompact,
  getAllCollisions,
  getFirstCollision,
  sortDataSourceWithCompact,
} from '../utils'

export interface DraggableContext {
  handleDragStart: (evt: Event, key: VKey) => void
  handleDrag: (evt: Event, key: VKey, option: { x: number; y: number }) => void
  handleDragEnd: (evt: Event, key: VKey) => void
}

export function useDraggable(
  props: GridLayoutInnerProps,
  { mergedDataSource, setDataSource }: DataSourceContext,
  setPlaceholder: (data: GridData | undefined) => void,
): DraggableContext {
  const dragging = shallowRef<GridData>()
  const movedKeySet = new Set<VKey>()

  const handleDragStart = (evt: Event, key: VKey) => {
    const dataSource = mergedDataSource.value
    const targetData = dataSource.find(data => data.key === key)
    if (!targetData) {
      return
    }

    dragging.value = targetData

    callEmit(props.onDragStart, {
      event: evt,
      data: targetData,
      dataSource,
    })
  }

  const handleDrag = (evt: Event, key: VKey, option: { x: number; y: number }) => {
    const dataSource = mergedDataSource.value
    const targetData = dataSource.find(data => data.key === key)
    if (!targetData) {
      return
    }

    const placeholder = { key, x: targetData.x, y: targetData.y, w: targetData.w, h: targetData.h }

    const [newDataSource, newData] = correctData(props, dataSource, targetData, option, movedKeySet)

    callEmit(props.onDrag, { event: evt, data: newData, dataSource: newDataSource })

    setDataSource(newDataSource)
    setPlaceholder(placeholder)
  }

  const handleDragEnd = (evt: Event, key: VKey) => {
    if (!dragging.value) {
      return
    }

    const dataSource = mergedDataSource.value
    const targetData = dataSource.find(data => data.key === key)
    if (!targetData) {
      return
    }

    const { allowOverlap, compact } = props
    const newDataSource = allowOverlap ? dataSource : correctDataWithCompact(dataSource, compact)

    callEmit(props.onDragEnd, { event: evt, data: targetData, dataSource: newDataSource })

    setDataSource(dataSource, true)
    dragging.value = undefined
    setPlaceholder(undefined)
  }

  return { handleDragStart, handleDrag, handleDragEnd }
}

function correctData(
  props: GridLayoutInnerProps,
  dataSource: GridData[],
  targetData: GridData,
  option: { x: number; y: number },
  movedKeySet: Set<VKey>,
): [GridData[], GridData] {
  const { allowOverlap, collisible, compact } = props
  // eslint-disable-next-line prefer-const
  let [newDataSource, newData] = moveDataSource(
    dataSource,
    targetData,
    {
      ...option,
      allowOverlap,
      collisible,
      compact,
      isEvent: true,
    },
    movedKeySet,
  )

  newDataSource = allowOverlap ? newDataSource : correctDataWithCompact(newDataSource, compact)

  return [newDataSource, newData]
}

function moveDataSource(
  dataSource: GridData[],
  data: GridData,
  {
    x,
    y,
    allowOverlap,
    collisible,
    compact,
    isEvent,
  }: {
    x?: number
    y?: number
    allowOverlap: boolean
    collisible: boolean
    compact: CompactType
    isEvent: boolean
  },
  movedKeySet: Set<VKey>,
): [GridData[], GridData] {
  // If this is static and not explicitly enabled as draggable,
  // no move is possible, so we can short-circuit this immediately.
  if (data.static && data.draggable !== true) return [dataSource, data]

  // Short-circuit if nothing to do.
  if (data.y === y && data.x === x) return [dataSource, data]

  // (`Moving element ${l.i} to [${String(x)},${String(y)}] from [${l.x},${l.y}]`)
  const { x: oldX, y: oldY } = data

  // This is quite a bit faster than extending the object
  if (typeof x === 'number') data.x = x
  if (typeof y === 'number') data.y = y

  movedKeySet.add(data.key)

  // If this collides with anything, move it.
  // When doing this comparison, we have to sort the items we compare with
  // to ensure, in the case of multiple collisions, that we're getting the
  // nearest collision.
  let sortedDataSource = sortDataSourceWithCompact(dataSource, compact)
  const movingUp =
    compact === 'vertical' && typeof y === 'number'
      ? oldY >= y
      : compact === 'horizontal' && typeof x === 'number'
      ? oldX >= x
      : false
  // $FlowIgnore acceptable modification of read-only array as it was recently cloned
  if (movingUp) {
    sortedDataSource = sortedDataSource.reverse()
  }
  const collisions = getAllCollisions(sortedDataSource, data)
  const hasCollisions = collisions.length > 0

  // We may have collisions. We can short-circuit if we've turned off collisions or
  // allowed overlap.
  if (hasCollisions && allowOverlap) {
    // Easy, we don't need to resolve collisions. But we *did* change the layout,
    // so clone it on the way out.
    return [dataSource, data]
  } else if (hasCollisions && !collisible) {
    // If we are preventing collision but not allowing overlap, we need to
    // revert the position of this element so it goes to where it came from, rather
    // than the user's desired location.
    // (`Collision prevented on ${l.i}, reverting.`)
    data.x = oldX
    data.y = oldY
    movedKeySet.delete(data.key)
    return [dataSource, data] // did not change so don't clone
  }

  let newDataSource = dataSource
  let newData = data
  // Move each item that collides away from this element.
  for (let i = 0, len = collisions.length; i < len; i++) {
    const collision = collisions[i]
    // (
    //   `Resolving collision between ${l.i} at [${l.x},${l.y}] and ${collision.i} at [${collision.x},${collision.y}]`,
    // )

    // Short circuit so we can't infinite loop
    if (movedKeySet.has(collision.key)) continue

    // Don't move static items - we have to move *this* element away
    const movedResult = moveElementAwayFromCollision(
      newDataSource,
      collision.static ? collision : newData,
      collision.static ? newData : collision,
      compact,
      isEvent,
      movedKeySet,
    )
    newDataSource = movedResult[0]
    newData = movedResult[1]
  }

  return [newDataSource, newData]
}

function moveElementAwayFromCollision(
  dataSource: GridData[],
  collidesWith: GridData,
  itemToMove: GridData,
  compact: CompactType,
  isEvent: boolean,
  movedKeySet: Set<VKey>,
) {
  const isCompactHorizontal = compact === 'horizontal'
  const collisible = !collidesWith.static // we're already colliding (not for static items)

  // If there is enough space above the collision to put this element, move it there.
  // We only do this on the main collision as this can get funky in cascades and cause
  // unwanted swapping behavior.
  if (isEvent) {
    // Make a mock item so we don't modify the item here, only modify in moveElement.
    const fakeData: GridData = {
      key: Symbol('fakeData'),
      x: isCompactHorizontal ? Math.max(collidesWith.x - itemToMove.w, 0) : itemToMove.x,
      y: !isCompactHorizontal ? Math.max(collidesWith.y - itemToMove.h, 0) : itemToMove.y,
      w: itemToMove.w,
      h: itemToMove.h,
    }

    // No collision? If so, we can go up there; otherwise, we'll end up moving down as normal
    if (!getFirstCollision(dataSource, fakeData)) {
      // log(`Doing reverse collision on ${itemToMove.i} up to [${fakeItem.x},${fakeItem.y}].`)
      return moveDataSource(
        dataSource,
        itemToMove,
        {
          x: isCompactHorizontal ? fakeData.x : undefined,
          y: !isCompactHorizontal ? fakeData.y : undefined,
          allowOverlap: false,
          collisible,
          compact,
          isEvent: false, //Reset isUserAction flag because we're not in the main collision anymore.
        },
        movedKeySet,
      )
    }
  }

  return moveDataSource(
    dataSource,
    itemToMove,
    {
      x: isCompactHorizontal ? itemToMove.x + 1 : undefined,
      y: !isCompactHorizontal ? itemToMove.y + 1 : undefined,
      allowOverlap: false,
      collisible,
      compact,
      isEvent: false, //Reset isUserAction flag because we're not in the main collision anymore.
    },
    movedKeySet,
  )
}
