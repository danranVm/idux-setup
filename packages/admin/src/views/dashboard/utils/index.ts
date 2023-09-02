import { isNil } from 'lodash-es'

import type { DashboardCard, DashboardPanel } from '../types'

export function panelSortFn(a: DashboardPanel, b: DashboardPanel) {
  return (a.order || 0) - (b.order || 0)
}

export const addCardKeyPrefix = '__Dashboard__Card__Prefix'

export function getNewCard(cards: DashboardCard[], addCard: DashboardCard): DashboardCard {
  const [nextX, nextY] = genNextXY(cards)
  return {
    ...addCard,
    i: addCard.key, // grid-layout 组件需要，后期替换成重构后的 grid-layout 可以删掉。
    x: nextX,
    y: nextY,
    w: defaultWidth,
    h: defaultHeight,
  }
}

const defaultWidth = 1 // 3 栅格，默认一排 3个，所以就是 3/3
const defaultHeight = 5 //  每行的高度是 48，默认5行，可以自行根据需求调整
// 这里的计算并不完善，根据实际业务场景完善
const genNextXY = (cards: DashboardCard[]) => {
  let nextX = 0
  let nextY = 0

  for (let i = cards.length - 1; i >= 0; i--) {
    const { x, y, w } = cards[i]
    const isNext = x + w + defaultWidth > 3
    if (y > nextY || (y === nextY && x >= nextX)) {
      nextY = isNext ? y + defaultHeight : y
      nextX = isNext ? 0 : x + w
    }
  }
  return [nextX, nextY] as const
}

export function groupCards(cards: DashboardCard[]): Record<string, DashboardCard[]> {
  const grouped: Record<string, DashboardCard[]> = {}
  cards.forEach(card => {
    const { group } = card
    if (!grouped[group]) {
      grouped[group] = []
    }
    grouped[group].push(card)
  })
  return grouped
}

export function getNextSelectedKey(
  panels: DashboardPanel[],
  currSelectedKey?: string,
): string | undefined {
  const isValidNext = (data: DashboardPanel) => !data.isShow

  const currSelectedIndex = isNil(currSelectedKey)
    ? -1
    : panels.findIndex(item => item.key === currSelectedKey)

  if (currSelectedIndex === -1) {
    return panels.find(isValidNext)?.key
  }

  for (let index = currSelectedIndex + 1; index < panels.length; index++) {
    const data = panels[index]
    if (isValidNext(data)) {
      return data.key
    }
  }

  for (let index = currSelectedIndex - 1; index > 0; index--) {
    const data = panels[index]
    if (isValidNext(data)) {
      return data.key
    }
  }

  return
}
