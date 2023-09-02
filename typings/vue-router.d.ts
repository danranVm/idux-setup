import type { RouteComponent, RouteRecordRaw } from 'vue-router'
declare module 'vue-router' {
  export interface RouteMeta {
    title?: string

    icon?: string | [string, string]

    layoutType?: 'composed' | 'standalone'

    dragDisabled?: boolean

    menuItemCls?: string


    keepAlive?: boolean
  }
}
