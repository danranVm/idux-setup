import type { InjectionKey } from 'vue'

import type { NavRecordsContext } from '@/types'

export interface AppContext extends NavRecordsContext {
  breakpoints: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', boolean>
}

export const appContextToken: InjectionKey<AppContext> = Symbol('appContextToken')
