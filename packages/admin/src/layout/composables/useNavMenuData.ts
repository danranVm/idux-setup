import { type ComputedRef, computed, inject, h } from 'vue'

import { mapTree } from '@idux/cdk/utils'
import { IxIcon } from '@idux/components/icon'
import type { MenuData } from '@idux/components/menu'
import { storeToRefs } from 'pinia'

import { appContextToken } from '@/context'
import { useAppSettingStore } from '@/store/modules'
import type { NavRecord } from '@/types'

export const fakeIdSuffix = '--fake'

export function useNavMenuData(): ComputedRef<MenuData[]> {
  const { sortedNavRecords } = inject(appContextToken)!
  const { menuGroupMode, layoutType, layoutCollapsed } = storeToRefs(useAppSettingStore())

  const headerExists = computed(() => ['header', 'both'].includes(layoutType.value))

  const getMenuDataType = (record: NavRecord, parents: NavRecord[]): MenuData['type'] => {
    if (!record.children?.length) {
      return 'item'
    }

    if (menuGroupMode.value === 'root-grouped') {
      return parents.length ? 'sub' : 'itemGroup'
    }

    if (menuGroupMode.value === 'children-groupped') {
      return parents.length ? 'itemGroup' : 'sub'
    }

    return 'sub'
  }

  const customIcon = ({ selected, icons }: { selected: boolean; icons: [string, string] }) => {
    return h(IxIcon, { name: selected ? icons[1] : icons[0] })
  }
  const getMenuCustomIcon = (parents: NavRecord[], recordType: MenuData['type']) => {
    if ((headerExists.value && !parents.length) || recordType === 'itemGroup') {
      return
    }

    if (menuGroupMode.value === 'root-grouped') {
      return parents.length <= (headerExists.value ? 2 : 1) ? customIcon : null
    }

    if (menuGroupMode.value === 'children-groupped') {
      return parents.length <= (headerExists.value ? 1 : 0) ? customIcon : null
    }
  }

  return computed(() => {
    const _menuData = mapTree(sortedNavRecords.value, 'children', (record, parents) => {
      const recordType = getMenuDataType(record, parents)
      const menu = {
        ...record,
        key: record.id,
        type: recordType,
        label: record.title ?? '',
        icon: undefined,
        icons: record.icon,
        offset: recordType === 'sub' ? [0, 0] : undefined,
        customIcon: getMenuCustomIcon(parents, recordType),
      }

      if (!menu.children) {
        delete menu.children
      }

      return menu as MenuData
    })

    if (!layoutCollapsed.value || layoutType.value !== 'sider') {
      return _menuData
    }

    // 收起状态下的sider类型导航，需要补充group以及sub节点，使浮层中的列表符合要求
    const ungroupedData: MenuData[] = []
    _menuData.forEach(data => {
      const items = (data.type === 'itemGroup' ? data.children ?? [] : [data]) as (NavRecord & MenuData & { type: 'item' | 'sub' })[]
      ungroupedData.push(
        ...items.map((item) => {
          const fakeItemId = `${item.id}${fakeIdSuffix}`
          const childItem = {
            type: item.type === 'sub' ? 'itemGroup' : 'item',
            key: item.id,
            id: item.id,
            title: item.title,
            label: item.label,
            path: item.path,
          } as MenuData & { type: 'itemGroup' | 'sub' }

          if (item.type === 'sub') {
            childItem.children = item.children
          }

          return {
            ...item,
            key: fakeItemId,
            type: 'sub',
            children: [childItem],
            offset: [0, 0],
          } as MenuData & { type: 'sub' }
        }),
      )
    })

    return ungroupedData
  })
}
