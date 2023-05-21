import { shallowRef } from 'vue'

import { useKey } from '@idux/components/utils'

import type { DashboardCard } from '../types'

export function useCards() {
  const key = useKey() as string
  // 初始化数据。
  const initCards = (): DashboardCard[] => {
    const local = localStorage.getItem('dashboard-cards-' + key)
    return local ? JSON.parse(local) : []
  }

  // 保存数据。
  const saveCards = (newPanels: DashboardCard[]) => {
    cards.value = newPanels
    localStorage.setItem('dashboard-cards-' + key, JSON.stringify(newPanels))
  }

  const cards = shallowRef(initCards())

  const bottom = (cards: DashboardCard[]) => {
    let max = 0
    let bottomY = 0
    let isNext = false
    for (let i = cards.length - 1; i >= 0; i--) {
      bottomY = cards[i].y! + cards[i].h!
      if (bottomY > max) {
        max = bottomY
        isNext = cards[i].x! > 0
      }
    }
    return [max, isNext] as const
  }

  const defaultWidth = 8
  const defaultHeight = 8
  const handleAdd = (card: DashboardCard) => {
    if (cards.value.length > 0) {
      const [bottomY, isNext] = bottom(cards.value)
      saveCards([
        ...cards.value,
        {
          ...card,
          // @ts-ignore
          i: card.key, // grid-layout 组件需要，后期替换成重构后的 grid-layout 可以删掉。
          x: isNext ? 0 : defaultWidth,
          y: isNext ? bottomY + defaultHeight : bottomY,
          w: defaultWidth,
          h: defaultHeight,
        },
      ])
    } else {
      // @ts-ignore
      saveCards([{ ...card, i: card.key, x: 0, y: 0, w: defaultWidth, h: defaultHeight }])
    }
  }

  const handleEdit = (card: DashboardCard) => {
    const newCards: DashboardCard[] = []
    cards.value.forEach(item => {
      if (card.key === item.key) {
        newCards.push({ ...item, ...cards })
      } else {
        newCards.push(item)
      }
    })
    saveCards(newCards)
  }

  const handleDelete = (key: string) => {
    saveCards(cards.value.filter(card => card.key !== key))
  }

  return { cards, handleAdd, handleEdit, handleDelete, saveCards }
}
