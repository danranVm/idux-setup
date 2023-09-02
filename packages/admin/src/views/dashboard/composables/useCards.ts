import { shallowRef, onMounted } from 'vue'

import { useKey } from '@idux/cdk'

import type { DashboardCard } from '../types'

let defaultCards: DashboardCard[] = [
  {
    key: 'basic-bar',
    i: 'basic-bar',
    title: '基础柱状图',
    group: '柱状图',
    x: 0,
    y: 0,
    w: 1,
    h: 5,
  },
  {
    key: 'basic-line',
    i: 'basic-line',
    title: '基础折线图',
    group: '折线图',
    x: 1,
    y: 0,
    w: 1,
    h: 5,
  },
  {
    key: 'basic-pie',
    i: 'basic-pie',
    title: '基础饼图',
    group: '饼图',
    x: 2,
    y: 0,
    w: 1,
    h: 5,
  },
]

export function useCards() {
  const key = useKey() as string
  const cards = shallowRef<DashboardCard[]>([])
  const loading = shallowRef(false)

  // 初始化数据。
  const loadCards = () => {
    loading.value = true
    // eslint-disable-next-line no-console
    console.log('load cards by panel key:', key)
    setTimeout(() => {
      cards.value = [...defaultCards]
      loading.value = false
    }, 300)
  }

  // 保存数据。
  const saveCards = (cards: DashboardCard[]) => {
    // 直接批量保存，否则对比太麻烦了，因为有坐标信息
    defaultCards = cards

    loadCards()
  }

  onMounted(() => loadCards())

  return { cards, loading, saveCards }
}
