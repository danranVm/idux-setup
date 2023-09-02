<script lang="ts" setup>
import { computed, inject } from 'vue'

import type { MenuData, MenuClickOptions } from '@idux/components/menu'

import { layoutContextToken } from '../context'
import type { NavTab } from '../types'

const props = defineProps<{
  record: NavTab
}>()

const { removeNavTab, removeNavTabs, clearNavTabs, setNavTabPined, isNavRemoveDisabled } =
  inject(layoutContextToken)!

const menuData = computed<MenuData[]>(() => {
  const { id, pined } = props.record
  return [
    {
      type: 'item',
      key: 'close-self',
      label: '关闭当前标签页',
      disabled: isNavRemoveDisabled(id, 'self'),
    },
    {
      type: 'item',
      key: 'close-other',
      label: '关闭其他标签页',
      disabled: isNavRemoveDisabled(id, 'other'),
    },
    {
      type: 'item',
      key: 'close-before',
      label: '关闭左侧标签页',
      disabled: isNavRemoveDisabled(id, 'before'),
    },
    {
      type: 'item',
      key: 'close-after',
      label: '关闭右侧标签页',
      disabled: isNavRemoveDisabled(id, 'after'),
    },
    {
      type: 'item',
      key: 'close-all',
      label: '关闭全部标签页',
      disabled: isNavRemoveDisabled(id, 'all'),
    },
    {
      key: 'divider',
      type: 'divider',
    },
    !pined
      ? {
          type: 'item',
          key: 'pin',
          label: '固定',
        }
      : {
          type: 'item',
          key: 'unpin',
          label: '取消固定',
        },
  ]
})

const handleOptionClick = (options: MenuClickOptions) => {
  const { id } = props.record
  const key = options.key as string

  switch (key) {
    case 'close-self':
      removeNavTab(id)
      break
    case 'close-before':
      removeNavTabs(id, 'before')
      break
    case 'close-after':
      removeNavTabs(id, 'after')
      break
    case 'close-other':
      removeNavTabs(id, 'other')
      break
    case 'close-all':
      clearNavTabs()
      break
    case 'pin':
      setNavTabPined(id, true)
      break
    case 'unpin':
      setNavTabPined(id, false)
      break

    default:
      break
  }
}
</script>

<template>
  <IxMenu
    class="layout-nav-tabs-context-menu"
    :dataSource="menuData"
    :onClick="handleOptionClick"
    :selectable="false"
  />
</template>
