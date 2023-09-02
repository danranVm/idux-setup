import type { ComputedRef, Ref } from 'vue'

import type { NavRecord, NavOverviewMode, NavShortcutMode } from '@/types'

export type ShortcutsMode = 'embeded' | 'flattened'

export type OverviewDataItem = Omit<NavRecord, 'children'> & { type: 'item' }
export type OverviewDataGroup = NavRecord & { children: OverviewDataItem[]; type: 'group' }
export type OverviewData = OverviewDataGroup | OverviewDataItem

export interface NavShortcutsContext {
  shortcutRecords: ComputedRef<NavRecord[]>
  setShortcuts: (ids: string[]) => void
  hasShortcut: (id: string) => boolean
  addShortcut: (id: string) => void
  removeShortcut: (id: string) => void
  clearShortcuts: () => void
}

export interface NavTab extends NavRecord {
  active: boolean
  pined: boolean
}

export interface NavTabsContext {
  navTabRecords: ComputedRef<NavTab[]>
  setNavTabs: (ids: string[]) => void
  hasNavTab: (id: string) => boolean
  addNavTab: (id: string) => boolean
  isNavPined: (id: string) => void
  isNavRemoveDisabled: (id: string, type: 'self' | 'after' | 'before' | 'other' | 'all') => boolean
  setNavTabPined: (id: string, pined: boolean) => void
  removeNavTab: (id: string) => void
  removeNavTabs: (id: string, type: 'after' | 'before' | 'other') => void
  clearNavTabs: () => void
  isNavTabMovable: (sourceId: string, targetId: string) => boolean
  moveNavTab: (sourceIdx: number, targetIdx: number) => void
  handleTabOpen: (id: string) => void
}

export interface OverviewDataBlock {
  title: string
  itemCount: number
  data: OverviewData[]
}

export interface OverviewDataContext {
  overviewColumns: ComputedRef<OverviewDataBlock[][]>
  overviewContentRef: Ref<HTMLElement | undefined>
  searchValue: ComputedRef<string | undefined>
  setSearchValue: (value: string | undefined) => void
}

export interface OverviewVisibleContext {
  overviewVisible: ComputedRef<boolean>
  setOverviewVisible: (visible: boolean) => void
}

export interface NavDisplaySettingsStateContext {
  dataSource: ComputedRef<{ record: NavRecord; children: NavRecord[] }[]>
  expandedKeys: ComputedRef<string[]>
  setExpandedKeys: (keys: string[]) => void
  isExpanded: (id: string) => boolean
  isNavRecordDisabled: (id: string) => boolean
  handleEnableStatusChange: (value: boolean, record: NavRecord) => void
  handleExpanded: (expanded: boolean, record: NavRecord) => void
  handleMove: (evt: {
    dragged: HTMLElement
    related: HTMLElement
    willInsertAfter: boolean
  }) => void
  handleStart: () => void
  handleEnd: () => void
  confirm: () => void
  cancel: () => void
  init: () => void
  reset: () => void
}

export interface NavModeSettingsStateContext {
  navOverviewMode: ComputedRef<NavOverviewMode[] | undefined>
  navShortcutMode: ComputedRef<NavShortcutMode | undefined>

  handeOverviewModeChange: (mode: (NavOverviewMode | undefined)[] | undefined) => void
  handeShourtcutModeChange: (mode: NavShortcutMode | undefined) => void

  confirm: () => void
  cancel: () => void
  init: () => void
}
