import { type ComputedRef, computed } from 'vue'

import { useState } from '@idux/cdk'

import type { CardCheckableGroupOption } from '../components/cardCheckableGroup'

const popoverOpenDelay = 500
const popoverCloseDelay = 3000

interface GuideItem {
  title: string
  description: string
  video: string
}

interface NavModeGuidePopoverContext {
  activeItem: ComputedRef<GuideItem | undefined>
  popoverVisible: ComputedRef<boolean>
  handleItemHover: (item: CardCheckableGroupOption | undefined) => void
  handlePopoverMouseenter: () => void
  handlePopoverMouseleave: () => void
}

const descriptionMap = {
  overview:
    '启用后会在导航栏顶部出现入口，点击后展开全览面板查看所有导航标题，并支持搜索、添加快捷入口、查阅最近访问记录。',
  search: '在导航栏辅助工具栏开启搜索功能，通过关键字搜索查询导航标题并跳转',
  tab: '可在控制台内建立多个标签页，以便进行需要跨页面做对比分析、递进操作等类型的业务。支持固定常用页面，提升访问效率。',
  shortcut: '将经常使用的页面一键加入快捷入口，之后可从快捷入口模块快速访问页面',
}
const videoMap = {
  overview: new URL('/nav-overview-guide.mp4', import.meta.url).href,
  tab: new URL('/nav-tab-guide.mp4', import.meta.url).href,
  shortcut: new URL('/nav-shortcut-guide.mp4', import.meta.url).href,
}

export function useNavModeGuidePopover(): NavModeGuidePopoverContext {
  const [_activeItem, setActiveItem] = useState<CardCheckableGroupOption | undefined>(undefined)
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false)

  const activeItem = computed<GuideItem | undefined>(() =>
    _activeItem.value
      ? {
          title: _activeItem.value.label,
          description: descriptionMap[_activeItem.value.value as keyof typeof descriptionMap],
          video: videoMap[_activeItem.value.value as keyof typeof videoMap],
        }
      : undefined,
  )

  let tmr: number
  let hiding = false

  const showPopover = (delay: boolean = true) => {
    tmr && clearTimeout(tmr)
    hiding = false
    if (delay) {
      tmr = setTimeout(() => {
        setPopoverVisible(true)
      }, popoverOpenDelay)
    } else {
      setPopoverVisible(true)
    }
  }
  const hidePopover = () => {
    if (hiding) {
      return
    }

    tmr && clearTimeout(tmr)
    hiding = true
    tmr = setTimeout(() => {
      setPopoverVisible(false)
      hiding = false
    }, popoverCloseDelay)
  }

  const handleItemHover = (item: CardCheckableGroupOption | undefined) => {
    if (item?.value && !item.disabled) {
      setActiveItem(item)
      showPopover()
    } else {
      hidePopover()
    }
  }

  const handlePopoverMouseenter = () => {
    showPopover(false)
  }
  const handlePopoverMouseleave = () => {
    hidePopover()
  }

  return {
    activeItem,
    popoverVisible,
    handleItemHover,
    handlePopoverMouseenter,
    handlePopoverMouseleave,
  }
}
