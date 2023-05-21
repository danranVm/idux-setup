import { type InjectionKey } from 'vue'

export type AppContext = {
  breakpoints: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', boolean>
}

export const appContextToken: InjectionKey<AppContext> = Symbol('appContextToken')
