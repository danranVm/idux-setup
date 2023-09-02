import type { ComputedRef } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export type NavOverviewMode = 'overview' | 'search'
export type NavShortcutMode = 'shortcut' | 'tab'

export type NavRecord = Omit<RouteRecordRaw, 'component' | 'children' | 'meta'> & {
  id: string
  layoutType: 'composed' | 'standalone'
  level: number
  children?: NavRecord[]
  title?: string
  icon?: [string, string]
  menuItemCls?: string
  settings?: {
    dragDisabled?: boolean
  }
}

export interface NavRecordsContext {
  navRecords: ComputedRef<NavRecord[]>
  sortedNavRecords: ComputedRef<NavRecord[]>
  filteredNavRecords: ComputedRef<NavRecord[]>
  activeNavRecords: ComputedRef<NavRecord[]>
  activeLayoutType: ComputedRef<'composed' | 'standalone'>
  getNavRecordById: (id: string) => NavRecord | undefined
  getNavRecordByPath: (path: string) => NavRecord | undefined
  isNavRecordActive: (id: string) => boolean
  isNavRecordDisabled: (id: string, disabledSet?: Set<string>) => boolean
}
