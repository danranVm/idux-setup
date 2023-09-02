import type { ComputedRef, InjectionKey } from 'vue'

import type {
  NavShortcutsContext,
  NavTabsContext,
  OverviewDataContext,
  OverviewVisibleContext,
} from './types'

import type { NavRecord } from '@/types'

export interface LayoutContext
  extends NavShortcutsContext,
    NavTabsContext,
    OverviewDataContext,
    OverviewVisibleContext {
  recentRecords: ComputedRef<NavRecord[]>
}

export const layoutContextToken: InjectionKey<LayoutContext> = Symbol('layoutContextToken')
