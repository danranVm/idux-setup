import { type RouteRecordRaw } from 'vue-router'

import { sortRoutes } from '@/router/utils'

const allModules = import.meta.glob('./*.ts', { eager: true })
const moduleRoutes: RouteRecordRaw[] = []

Object.keys(allModules).forEach(key => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mod = (allModules[key] as any).default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  moduleRoutes.push(...modList)
})

export default sortRoutes(moduleRoutes)
