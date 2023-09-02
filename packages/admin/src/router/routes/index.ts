import type { RouteRecordRaw } from 'vue-router'

import { isNil, isString, isArray, omit } from 'lodash-es'

import appCenterRoutes from './appCenter'
import assetCenterRoutes from './assetCenter'
import auditLogRoutes from './auditLog'
import commonRoutes from './common'
import dashboardRoutes from './dashboard'
import exceptionRoutes from './exception'
import policyRoutes from './policy'
import securityInspectRoutes from './securityInspect'
import systemManagementRoutes from './systemManagement'

import type { NavRecord } from '@/types'
import { normalizePath } from '@/utils'

function processRoutes(routes: RouteRecordRaw[]): {
  routes: RouteRecordRaw[]
  navRecords: NavRecord[]
} {
  const flattenedRoutes: RouteRecordRaw[] = []

  const mapFn = (route: RouteRecordRaw, parents: RouteRecordRaw[]): NavRecord => {
    const fullPath = route.path.startsWith('/')
      ? route.path
      : normalizePath(
          [...[...parents].reverse(), route]
            .map(r => r.path)
            .filter(Boolean)
            .join('/'),
        )
    const icon = route.meta?.icon

    return {
      ...omit(route, ['component', 'meta']),
      id: fullPath,
      path: fullPath,
      layoutType: route.meta?.layoutType ?? 'composed',
      level: parents.length + 1,
      menuItemCls: route.meta?.menuItemCls,
      title: route.meta?.title ?? '',
      icon: isArray(icon) ? icon : [icon, icon],
      settings: {
        dragDisabled: !!route.meta?.dragDisabled,
      },
    } as NavRecord
  }

  const map = (_data: RouteRecordRaw[], parents: RouteRecordRaw[]) => {
    const res: NavRecord[] = []
    for (let idx = 0; idx < _data.length; idx++) {
      const item = _data[idx]
      const mappedItem = mapFn(item, parents)
      let redirect: string | undefined

      if (!mappedItem) {
        continue
      }

      if (item.children) {
        const mappedChildren = map(item.children!, [item, ...parents])
        mappedItem.children = mappedChildren
      }

      if (isString(item.redirect) && !item.redirect.startsWith('/')) {
        const redirectedRouteIdx = item.children?.findIndex(
          child => child.path === mappedItem.redirect,
        )
        const processedRedirectedRoute = !isNil(redirectedRouteIdx)
          ? mappedItem.children?.[redirectedRouteIdx]
          : undefined

        redirect = processedRedirectedRoute?.path
      }

      res.push(mappedItem)
      flattenedRoutes.push({
        ...item,
        path: mappedItem.path,
        redirect: redirect ?? item.redirect,
      } as RouteRecordRaw)
    }

    return res
  }

  const navRecords = map(routes, [])

  return { routes: flattenedRoutes, navRecords }
}

const { routes: mainRoutes, navRecords } = processRoutes([
  ...dashboardRoutes,
  ...securityInspectRoutes,
  ...assetCenterRoutes,
  ...policyRoutes,
  ...auditLogRoutes,
  ...appCenterRoutes,
  ...systemManagementRoutes,
])

const routes = [
  ...mainRoutes,
  ...processRoutes(commonRoutes).routes,
  ...processRoutes(exceptionRoutes).routes,
] as RouteRecordRaw[]

export { routes, navRecords }
