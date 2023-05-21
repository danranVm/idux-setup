import type { CompactType, GridData } from './types'

const defaultCols = 24

export function correctDataWithBounds(dataSource: GridData[]): GridData[] {
  const collidesWith = getStatics(dataSource)
  for (let i = 0, len = dataSource.length; i < len; i++) {
    const l = dataSource[i]
    // Overflows right
    if (l.x + l.w > defaultCols) l.x = defaultCols - l.w
    // Overflows left
    if (l.x < 0) {
      l.x = 0
      l.w = defaultCols
    }
    if (!l.static) collidesWith.push(l)
    else {
      // If this is static and collides with other statics, we must move it down.
      // We have to do something nicer than just letting them overlap.
      while (getFirstCollision(collidesWith, l)) {
        l.y++
      }
    }
  }
  return dataSource
}

export function correctDataWithCompact(dataSource: GridData[], compact: CompactType): GridData[] {
  const compareWith = getStatics(dataSource)
  const sortedData = sortDataSourceWithCompact(dataSource, compact)

  const out = Array(dataSource.length)

  for (let i = 0, len = sortedData.length; i < len; i++) {
    let l = sortedData[i]

    // Don't move static elements
    if (!l.static) {
      l = compactData(compareWith, l, compact, sortedData)

      // Add to comparison array. We only collide with items before this one.
      // Statics are already in this array.
      compareWith.push(l)
    }

    // Add to output array to make sure they still come out in the right order.
    out[sortedData.indexOf(l)] = l
  }

  return out
}

export function sortDataSourceWithCompact(
  dataSource: GridData[],
  compact: CompactType,
): GridData[] {
  if (!compact) {
    return dataSource
  }
  if (compact === 'horizontal') {
    return [...dataSource].sort(function (a, b) {
      if (a.x > b.x || (a.x === b.x && a.y > b.y)) {
        return 1
      }
      return -1
    })
  }
  return [...dataSource].sort(function (a, b) {
    if (a.y > b.y || (a.y === b.y && a.x > b.x)) {
      return 1
    } else if (a.y === b.y && a.x === b.x) {
      return 0
    }
    return -1
  })
}

export function getAllCollisions(dataSource: GridData[], data: GridData): GridData[] {
  return dataSource.filter(item => collides(item, data))
}

export function getFirstCollision(dataSource: GridData[], item: GridData): GridData | undefined {
  for (let i = 0, len = dataSource.length; i < len; i++) {
    if (collides(dataSource[i], item)) {
      return dataSource[i]
    }
  }
  return undefined
}

export function bottom(dataSource: GridData[]): number {
  let max = 0
  let bottomY = 0
  dataSource.forEach(data => {
    bottomY = data.y + data.h
    if (bottomY > max) {
      max = bottomY
    }
  })
  return max
}

function compactData(
  compareWith: GridData[],
  data: GridData,
  compact: CompactType,
  fullData: GridData[],
): GridData {
  const compactV = compact === 'vertical'
  const compactH = compact === 'horizontal'
  if (compactV) {
    // Bottom 'y' possible is the bottom of the layout.
    // This allows you to do nice stuff like specify {y: Infinity}
    // This is here because the layout must be sorted in order to get the correct bottom `y`.
    data.y = Math.min(bottom(compareWith), data.y)
    // Move the element up as far as it can go without colliding.
    while (data.y > 0 && !getFirstCollision(compareWith, data)) {
      data.y--
    }
  } else if (compactH) {
    // Move the element left as far as it can go without colliding.
    while (data.x > 0 && !getFirstCollision(compareWith, data)) {
      data.x--
    }
  }

  // Move it down, and keep moving it down if it's colliding.
  let collides
  // Checking the compactType null value to avoid breaking the layout when overlapping is allowed.
  while ((collides = getFirstCollision(compareWith, data))) {
    if (compactH) {
      resolveCompactionCollision(fullData, data, collides.x + collides.w, 'x')
    } else {
      resolveCompactionCollision(fullData, data, collides.y + collides.h, 'y')
    }
    // Since we can't grow without bounds horizontally, if we've overflown, let's move it down and try again.
    if (compactH && data.x + data.w > defaultCols) {
      data.x = defaultCols - data.w
      data.y++
      // ALso move element as left as we can
      while (data.x > 0 && !getFirstCollision(compareWith, data)) {
        data.x--
      }
    }
  }

  // Ensure that there are no negative positions
  data.y = Math.max(data.y, 0)
  data.x = Math.max(data.x, 0)

  return data
}

function getStatics(dataSource: GridData[]): GridData[] {
  return dataSource.filter(data => data.static)
}

function collides(l1: GridData, l2: GridData): boolean {
  if (l1.key === l2.key) return false // same element
  if (l1.x + l1.w <= l2.x) return false // l1 is left of l2
  if (l1.x >= l2.x + l2.w) return false // l1 is right of l2
  if (l1.y + l1.h <= l2.y) return false // l1 is above l2
  if (l1.y >= l2.y + l2.h) return false // l1 is below l2
  return true // boxes overlap
}

const heightWidth = { x: 'w', y: 'h' } as const

function resolveCompactionCollision(
  dataSource: GridData[],
  item: GridData,
  moveToCoord: number,
  axis: 'x' | 'y',
) {
  const sizeProp = heightWidth[axis]
  item[axis] += 1
  const itemIndex = dataSource.map(data => data.key).indexOf(item.key)

  // Go through each item we collide with.
  for (let i = itemIndex + 1; i < dataSource.length; i++) {
    const otherItem = dataSource[i]
    // Ignore static items
    if (otherItem.static) continue

    // Optimization: we can break early if we know we're past this el
    // We can do this b/c it's a sorted layout
    if (otherItem.y > item.y + item.h) break

    if (collides(item, otherItem)) {
      resolveCompactionCollision(dataSource, otherItem, moveToCoord + item[sizeProp], axis)
    }
  }

  item[axis] = moveToCoord
}
